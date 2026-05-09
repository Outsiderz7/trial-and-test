const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const voiceCheck = require('../utils/voiceCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Apply an audio filter')
        .addStringOption(option =>
            option.setName('filter')
                .setDescription('The filter to apply')
                .setRequired(true)
                .addChoices(
                    { name: 'Bassboost', value: 'bassboost' },
                    { name: 'Nightcore', value: 'nightcore' },
                    { name: 'Lo-fi', value: 'lofi' },
                    { name: 'Vibrato', value: 'vibrato' },
                    { name: 'Clear', value: 'off' }
                )),
    async execute(interaction) {
        if (!await voiceCheck(interaction)) return;

        const queue = useQueue(interaction.guildId);
        if (!queue) return interaction.reply({ content: 'No music is playing!', ephemeral: true });

        const filter = interaction.options.getString('filter');

        if (filter === 'off') {
            await queue.filters.ffmpeg.setFilters(false);
            return interaction.reply('Filters cleared.');
        }

        await queue.filters.ffmpeg.toggle([filter]);
        return interaction.reply(`Filter **${filter}** toggled.`);
    },
};
