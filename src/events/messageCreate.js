const { Events } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { getGuild } = require('../utils/database');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guildId) return;
        const guildData = getGuild(message.guildId);

        if (guildData && message.channel.id === guildData.setup_channel_id) {
            if (message.deletable) {
                setTimeout(() => message.delete().catch(() => {}), 1000);
            }
            const player = useMainPlayer();
            const channel = message.member.voice.channel;
            if (!channel) return message.channel.send(`${message.author}, you must be in a voice channel!`).then(m => setTimeout(() => m.delete(), 5000));
            try {
                await player.play(channel, message.content, { nodeOptions: { metadata: message } });
            } catch (e) {
                console.error(e);
            }
        }
    },
};
