const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isButton()) {
            const { useQueue } = require('discord-player');
            const queue = useQueue(interaction.guildId);
            if (!queue) return interaction.reply({ content: 'No music playing!', ephemeral: true });

            switch (interaction.customId) {
                case 'play_pause_button':
                    queue.node.setPaused(!queue.node.isPaused());
                    await interaction.reply({ content: queue.node.isPaused() ? 'Paused!' : 'Resumed!', ephemeral: true });
                    break;
                case 'skip_button':
                    queue.node.skip();
                    await interaction.reply({ content: 'Skipped!', ephemeral: true });
                    break;
                case 'stop_button':
                    queue.delete();
                    await interaction.reply({ content: 'Stopped!', ephemeral: true });
                    const { updateController } = require('../utils/controller');
                    updateController(interaction.client, interaction.guildId);
                    break;
                case 'queue_button':
                    const tracks = queue.tracks.toArray();
                    const currentTrack = queue.currentTrack;
                    let queueString = `**Now Playing:** ${currentTrack.title}\n\n**Queue:**\n`;
                    if (tracks.length === 0) queueString += 'No more tracks in queue.';
                    else queueString += tracks.map((track, i) => `${i + 1}. ${track.title}`).slice(0, 10).join('\n');
                    await interaction.reply({ content: queueString, ephemeral: true });
                    break;
                case 'shuffle_button':
                    queue.tracks.shuffle();
                    await interaction.reply({ content: 'Queue shuffled!', ephemeral: true });
                    break;
                case 'repeat_button':
                    const nextMode = (queue.repeatMode + 1) % 4; // 0: off, 1: track, 2: queue, 3: autoplay
                    queue.setRepeatMode(nextMode);
                    const modes = ['Off', 'Track', 'Queue', 'Autoplay'];
                    await interaction.reply({ content: `Repeat mode set to: **${modes[nextMode]}**`, ephemeral: true });
                    break;
                case 'back_button':
                    if (!queue.history.tracks.size) return interaction.reply({ content: 'No previous tracks!', ephemeral: true });
                    await queue.history.back();
                    await interaction.reply({ content: 'Playing previous track!', ephemeral: true });
                    break;
            }
            return;
        }

        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    },
};
