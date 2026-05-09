const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../database.sqlite'));

// Create tables
db.exec(`
    CREATE TABLE IF NOT EXISTS guilds (
        guild_id TEXT PRIMARY KEY,
        setup_channel_id TEXT,
        setup_message_id TEXT,
        volume INTEGER DEFAULT 100,
        autoplay INTEGER DEFAULT 0,
        stay_24_7 INTEGER DEFAULT 0,
        filters TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS playlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        name TEXT,
        tracks TEXT
    );
`);

module.exports = {
    getGuild: (guildId) => {
        const stmt = db.prepare('SELECT * FROM guilds WHERE guild_id = ?');
        let guild = stmt.get(guildId);
        if (!guild) {
            db.prepare('INSERT INTO guilds (guild_id) VALUES (?)').run(guildId);
            guild = stmt.get(guildId);
        }
        return guild;
    },
    updateGuild: (guildId, data) => {
        const keys = Object.keys(data);
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values = Object.values(data);
        db.prepare(`UPDATE guilds SET ${setClause} WHERE guild_id = ?`).run(...values, guildId);
    },
    getPlaylists: (userId) => {
        return db.prepare('SELECT * FROM playlists WHERE user_id = ?').all(userId);
    },
    createPlaylist: (userId, name, tracks) => {
        db.prepare('INSERT INTO playlists (user_id, name, tracks) VALUES (?, ?, ?)').run(userId, name, JSON.stringify(tracks));
    }
};
