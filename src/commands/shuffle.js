const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const voiceCheck = require('../utils/voiceCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current queue'),
    async execute(interaction) {
        if (!await voiceCheck(interaction)) return;

        const queue = useQueue(interaction.guildId);
        if (!queue) return interaction.reply({ content: 'No music is playing!', ephemeral: true });

        queue.tracks.shuffle();
        return interaction.reply('Queue shuffled!');
    },
};
