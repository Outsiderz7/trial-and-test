const { SlashCommandBuilder } = require('discord.js');
const { updateGuild, getGuild } = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('247')
        .setDescription('Toggle 24/7 mode'),
    async execute(interaction) {
        const guildData = getGuild(interaction.guildId);
        const newState = guildData.stay_24_7 ? 0 : 1;

        updateGuild(interaction.guildId, { stay_24_7: newState });

        return interaction.reply(`24/7 mode is now **${newState ? 'Enabled' : 'Disabled'}**.`);
    },
};
