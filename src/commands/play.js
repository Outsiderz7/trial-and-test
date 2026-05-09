const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const voiceCheck = require('../utils/voiceCheck');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube, Spotify, or SoundCloud')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song or link you want to play')
                .setRequired(true)),
    async execute(interaction) {
        if (!await voiceCheck(interaction)) return;

        const player = useMainPlayer();
        const query = interaction.options.getString('query');
        await interaction.deferReply();

        try {
            const { track } = await player.play(interaction.member.voice.channel, query, {
                nodeOptions: {
                    metadata: interaction,
                    leaveOnEmpty: true,
                    leaveOnEnd: false,
                    selfDeaf: true,
                }
            });

            return interaction.followUp(`**${track.title}** added to queue!`);
        } catch (e) {
            console.error(e);
            return interaction.followUp(`Error playing track: ${e.message}`);
        }
    },
};
