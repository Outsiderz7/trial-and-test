const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const voiceCheck = require('../utils/voiceCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set the playback volume')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Volume amount (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),
    async execute(interaction) {
        if (!await voiceCheck(interaction)) return;

        const queue = useQueue(interaction.guildId);
        if (!queue) return interaction.reply({ content: 'No music is playing!', ephemeral: true });

        const volume = interaction.options.getInteger('amount');
        queue.node.setVolume(volume);

        return interaction.reply(`Volume set to **${volume}%**.`);
    },
};
