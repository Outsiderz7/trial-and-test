const express = require('express');
const axios = require('axios');
const path = require('path');
const session = require('express-session');
const { useQueue } = require('discord-player');

module.exports = (client) => {
    const app = express();
    const port = process.env.PORT || 3000;

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    app.use(session({
        secret: 'vocard-secret',
        resave: false,
        saveUninitialized: false
    }));

    app.get('/', (req, res) => {
        if (!req.session.user) {
            const authorizeUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
            return res.render('login', { authorizeUrl });
        }
        res.render('dashboard', { user: req.session.user });
    });

    app.get('/callback', async (req, res) => {
        const code = req.query.code;
        if (!code) return res.redirect('/');

        try {
            const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.REDIRECT_URI,
                scope: 'identify guilds',
            }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const userResponse = await axios.get('https://discord.com/api/users/@me', {
                headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
            });

            req.session.user = {
                id: userResponse.data.id,
                username: userResponse.data.username,
                avatarUrl: `https://cdn.discordapp.com/avatars/${userResponse.data.id}/${userResponse.data.avatar}.png`
            };

            res.redirect('/');
        } catch (error) {
            console.error('OAuth2 Error:', error.response?.data || error.message);
            res.send('Authentication failed');
        }
    });

    app.get('/api/status', (req, res) => {
        const guildId = req.query.guildId || client.guilds.cache.first()?.id;
        if (!guildId) return res.json({ playing: false });

        const queue = useQueue(guildId);
        if (!queue) return res.json({ playing: false });

        res.json({
            playing: true,
            paused: queue.node.isPaused(),
            volume: queue.node.volume,
            repeatMode: queue.repeatMode,
            shuffle: queue.isShuffling,
            track: {
                title: queue.currentTrack.title,
                author: queue.currentTrack.author,
                thumbnail: queue.currentTrack.thumbnail,
                duration: queue.currentTrack.duration,
                durationMS: queue.currentTrack.durationMS,
                progressMS: queue.node.streamTime,
                progressStr: queue.node.createProgressBar({ timecodes: true }).split(' ')[0]
            },
            queue: queue.tracks.toArray().slice(0, 10).map(t => ({
                title: t.title,
                duration: t.duration
            }))
        });
    });

    app.get('/api/control', async (req, res) => {
        const { action, value, guildId: queryGuildId } = req.query;
        const guildId = queryGuildId || client.guilds.cache.first()?.id;
        if (!guildId) return res.sendStatus(404);

        const queue = useQueue(guildId);
        if (!queue) return res.sendStatus(404);

        switch (action) {
            case 'play_pause':
                queue.node.setPaused(!queue.node.isPaused());
                break;
            case 'skip':
                queue.node.skip();
                break;
            case 'stop':
                queue.delete();
                break;
            case 'volume':
                queue.node.setVolume(parseInt(value));
                break;
            case 'filter':
                if (value === 'off') await queue.filters.ffmpeg.setFilters(false);
                else await queue.filters.ffmpeg.toggle([value]);
                break;
            case 'seek':
                await queue.node.seek(parseInt(value));
                break;
            case 'skipTo':
                queue.node.skipTo(parseInt(value));
                break;
            case 'shuffle':
                queue.tracks.shuffle();
                break;
            case 'repeat':
                const modes = [0, 1, 2, 3]; // Off, Track, Queue, Autoplay
                const nextMode = modes[(queue.repeatMode + 1) % modes.length];
                queue.setRepeatMode(nextMode);
                break;
        }
        res.sendStatus(200);
    });

    app.listen(port, () => {
        console.log(`Vocard Dashboard listening at http://localhost:${port}`);
    });
};
