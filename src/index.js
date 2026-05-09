require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
});

player.extractors.loadMulti(DefaultExtractors);

client.commands = new Collection();
client.player = player;

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

const { updateController } = require('./utils/controller');

player.events.on('playerStart', (queue, track) => {
    updateController(client, queue.guild.id);
    console.log(`Started playing: ${track.title}`);
});

player.events.on('emptyQueue', (queue) => {
    updateController(client, queue.guild.id);
});

player.events.on('error', (queue, error) => {
    console.log(`[Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`[Player Error] ${error.message}`);
});

client.login(process.env.DISCORD_TOKEN).catch(() => console.log('Bot token not set or invalid. Skipping login...'));

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/status', (req, res) => {
    const guild = client.guilds.cache.first();
    if (!guild) return res.json({ playing: false });

    const queue = player.nodes.get(guild.id);
    if (!queue || !queue.isPlaying()) {
        return res.json({ playing: false });
    }

    res.json({
        playing: true,
        track: queue.currentTrack.title
    });
});

app.get('/api/control', (req, res) => {
    const action = req.query.action;
    const guild = client.guilds.cache.first();
    if (!guild) return res.status(404).send('No guild found');

    const queue = player.nodes.get(guild.id);
    if (!queue) return res.status(404).send('No queue found');

    switch (action) {
        case 'play_pause':
            queue.node.setPaused(!queue.node.isPaused());
            break;
        case 'skip':
            queue.node.skip();
            break;
        case 'stop':
            queue.delete();
            updateController(client, guild.id);
            break;
    }
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Dashboard listening at http://localhost:${port}`);
});
