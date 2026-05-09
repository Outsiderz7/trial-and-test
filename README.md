# Vocard-Refactored Discord Music Bot

A professional Discord music bot with a high-performance music engine and a feature-rich web dashboard.

## Features

- **High-Quality Playback**: Supports YouTube, Spotify, and SoundCloud.
- **Vocard Dashboard**: Advanced web interface with:
  - **Seek Bar**: Real-time progress tracking and seeking.
  - **Queue Management**: Click tracks in the queue to "Skip To" them.
  - **Interactive Controls**: Play/Pause, Skip, Stop, Shuffle, and Repeat modes.
  - **Real-time Updates**: Syncs status across all connected users.
  - **Audio Filters**: Bassboost, Nightcore, Lo-fi, and more.
- **Persistence**: SQLite3 database stores all settings (Volume, 24/7, Autoplay) and Playlists.
- **Slash Commands**: Full set of modern commands.

## Setup Instructions

### 1. Requirements
- Node.js v18 or higher.
- FFmpeg installed on the system (or using the included `ffmpeg-static`).

### 2. Configuration
Create a `.env` file in the root directory:
```env
DISCORD_TOKEN=your_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:3000/callback
PORT=3000
```

### 3. Installation
```bash
npm install
npm run deploy # Register slash commands
```

### 4. Running
**Local Development:**
```bash
npm start
```
**Production (PM2):**
```bash
npm run pm2
```

## Cloud Deployment
While designed for local hosting, this bot can be deployed to platforms like **Railway**, **Render**, or **Fly.io**.
*Note: Netlify is not supported as it does not allow long-running processes required for Discord bots.*

## Usage
1. Invite the bot using the URL from the Discord Developer Portal.
2. Join a voice channel.
3. Use `/play` to start music.
4. Access the dashboard at `http://localhost:3000`.
