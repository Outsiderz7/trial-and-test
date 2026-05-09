const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const voiceCheck = require('../utils/voiceCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific time in the current track')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time to seek to (e.g. 1:30 or seconds)')
                .setRequired(true)),
    async execute(interaction) {
        if (!await voiceCheck(interaction)) return;

        const queue = useQueue(interaction.guildId);
        if (!queue) return interaction.reply({ content: 'No music is playing!', ephemeral: true });

        const time = interaction.options.getString('time');
        // Simple conversion for MM:SS to seconds
        let seconds = 0;
        if (time.includes(':')) {
            const parts = time.split(':');
            seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else {
            seconds = parseInt(time);
        }

        await queue.node.seek(seconds * 1000);
        return interaction.reply(`Seeked to **${time}**.`);
    },
};
