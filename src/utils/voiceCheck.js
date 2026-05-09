module.exports = async (interaction) => {
    const memberVoiceChannel = interaction.member.voice.channel;
    const botVoiceChannel = interaction.guild.members.me.voice.channel;

    if (!memberVoiceChannel) {
        await interaction.reply({ content: 'You must be in a voice channel!', ephemeral: true });
        return false;
    }

    if (botVoiceChannel && memberVoiceChannel.id !== botVoiceChannel.id) {
        await interaction.reply({ content: 'You must be in the same voice channel as me!', ephemeral: true });
        return false;
    }

    return true;
};
