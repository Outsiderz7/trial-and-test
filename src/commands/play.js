const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube or Spotify')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song you want to play')
                .setRequired(true)),
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        await interaction.deferReply();
        const query = interaction.options.getString('query');
        try {
            const { track } = await player.play(channel, query, { nodeOptions: { metadata: interaction } });
            return interaction.followUp(`**${track.title}** enqueued!`);
        } catch (e) {
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    },
};
