const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        const commands = Array.from(client.commands.values()).map(c => c.data.toJSON());
        client.application.commands.set(commands);
    },
};
