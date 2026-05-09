require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const fs = require('fs');
const path = require('path');
const { getGuild } = require('./utils/database');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
});

player.extractors.loadMulti(DefaultExtractors);

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) client.once(event.name, (...args) => event.execute(...args));
    else client.on(event.name, (...args) => event.execute(...args));
}

// Player Events
const { updateController } = require('./utils/controller');

player.events.on('playerStart', (queue, track) => {
    updateController(client, queue.guild.id);
});

player.events.on('emptyQueue', (queue) => {
    const guildData = getGuild(queue.guild.id);
    if (guildData.autoplay) {
        // Autoplay logic usually handled by discord-player internally if configured,
        // but we can trigger related search here if needed.
    }
    updateController(client, queue.guild.id);
});

player.events.on('emptyChannel', (queue) => {
    const guildData = getGuild(queue.guild.id);
    if (!guildData.stay_24_7) {
        queue.delete();
    }
});

client.login(process.env.DISCORD_TOKEN);

// Web Server
require('./server')(client);
