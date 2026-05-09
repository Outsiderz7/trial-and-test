const { SlashCommandBuilder } = require('discord.js');
const { updateGuild, getGuild } = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggle autoplay mode'),
    async execute(interaction) {
        const guildData = getGuild(interaction.guildId);
        const newState = guildData.autoplay ? 0 : 1;

        updateGuild(interaction.guildId, { autoplay: newState });

        return interaction.reply(`Autoplay is now **${newState ? 'Enabled' : 'Disabled'}**.`);
    },
};
