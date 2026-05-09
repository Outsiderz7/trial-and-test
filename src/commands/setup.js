const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { updateGuild } = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the dedicated music controller channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const channel = interaction.channel;
        const embed = new EmbedBuilder()
            .setTitle('No music currently playing')
            .setDescription('Send a song link or name here to play music!')
            .setColor('#0099ff')
            .setImage('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3');

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('back_button').setEmoji('⏮️').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('play_pause_button').setEmoji('⏯️').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('skip_button').setEmoji('⏭️').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('stop_button').setEmoji('⏹️').setStyle(ButtonStyle.Danger),
        );
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('shuffle_button').setEmoji('🔀').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('repeat_button').setEmoji('🔁').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('queue_button').setEmoji('📜').setStyle(ButtonStyle.Secondary),
        );

        const message = await channel.send({ embeds: [embed], components: [row1, row2] });
        updateGuild(interaction.guildId, { setup_channel_id: channel.id, setup_message_id: message.id });
        return interaction.editReply(`Successfully setup the music controller in ${channel}!`);
    },
};
