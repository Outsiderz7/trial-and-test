const { EmbedBuilder } = require('discord.js');
const { getConfig } = require('./configManager');

async function updateController(client, guildId) {
    const config = getConfig();
    const guildConfig = config[guildId];
    if (!guildConfig) return;

    try {
        const channel = await client.channels.fetch(guildConfig.setupChannelId);
        const message = await channel.messages.fetch(guildConfig.setupMessageId);
        const queue = client.player.nodes.get(guildId);

        const embed = new EmbedBuilder().setColor('#0099ff');
        if (!queue || !queue.isPlaying()) {
            embed.setTitle('No music currently playing')
                 .setDescription('Send a song link or name here to play music!')
                 .setImage('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3');
        } else {
            const track = queue.currentTrack;
            embed.setTitle(`Now Playing: ${track.title}`)
                 .setDescription(`Author: ${track.author}\nDuration: ${track.duration}\nRequested by: ${track.requestedBy}`)
                 .setThumbnail(track.thumbnail)
                 .setFooter({ text: `Queue: ${queue.tracks.size} tracks left` });
        }
        await message.edit({ embeds: [embed] });
    } catch (error) {
        console.error('Error updating controller:', error);
    }
}

module.exports = { updateController };
