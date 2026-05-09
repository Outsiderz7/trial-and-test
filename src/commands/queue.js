const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the current queue'),
    async execute(interaction) {
        const queue = useQueue(interaction.guildId);
        if (!queue) return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;
        let queueString = `**Now Playing:** ${currentTrack.title}\n\n**Queue:**\n`;
        if (tracks.length === 0) queueString += 'No more tracks in queue.';
        else queueString += tracks.map((track, i) => `${i + 1}. ${track.title}`).join('\n');
        return interaction.reply(queueString);
    },
};
