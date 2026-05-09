const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const voiceCheck = require('../utils/voiceCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Set repeat mode')
        .addIntegerOption(option =>
            option.setName('mode')
                .setDescription('Repeat mode')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 0 },
                    { name: 'Track', value: 1 },
                    { name: 'Queue', value: 2 },
                    { name: 'Autoplay', value: 3 }
                )),
    async execute(interaction) {
        if (!await voiceCheck(interaction)) return;

        const queue = useQueue(interaction.guildId);
        if (!queue) return interaction.reply({ content: 'No music is playing!', ephemeral: true });

        const mode = interaction.options.getInteger('mode');
        queue.setRepeatMode(mode);

        const modeName = ['Off', 'Track', 'Queue', 'Autoplay'][mode];
        return interaction.reply(`Repeat mode set to **${modeName}**.`);
    },
};
