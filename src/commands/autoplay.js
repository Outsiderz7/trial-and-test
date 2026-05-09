const { SlashCommandBuilder } = require('discord.js');
const { useQueue, QueueRepeatMode } = require('discord-player');
const { updateGuild, getGuild } = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggle autoplay mode'),
    async execute(interaction) {
        const queue = useQueue(interaction.guildId);
        const guildData = getGuild(interaction.guildId);
        const newState = guildData.autoplay ? 0 : 1;

        updateGuild(interaction.guildId, { autoplay: newState });

        if (queue) {
            queue.setRepeatMode(newState ? QueueRepeatMode.AUTOPLAY : QueueRepeatMode.OFF);
        }

        return interaction.reply(`Autoplay is now **${newState ? 'Enabled' : 'Disabled'}**.`);
    },
};
