# 7 Days to Die Discord Bot

A Discord bot that monitors the status of your 7 Days to Die server and sends notifications when the server goes online or offline.

## Features

- 🎮 Real-time server status monitoring
- 🔔 Discord notifications for server status changes
- ⏰ Configurable check intervals
- 🚫 Cooldown system to prevent spam
- 📊 Rich embed messages with server information
- 💬 Manual status check command (`!serverstatus`)

## Prerequisites

- Node.js 16.0.0 or higher
- A Discord bot token
- Access to a Discord server where you want to send notifications

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/tribui1912/7D2D-Discord-Bot.git
cd 7d2d-discord-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the bot

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Edit the `.env` file with your actual values:

```env
# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_actual_bot_token_here
DISCORD_CHANNEL_ID=your_actual_channel_id_here

# 7 Days to Die server configuration
SERVER_HOST=127.0.0.1
SERVER_PORT=26900

# Bot settings
CHECK_INTERVAL=60000
TIMEOUT=5000
```

**Important:** Never commit your `.env` file to version control. It contains sensitive information and is already included in `.gitignore`.

### 4. Create a Discord bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section
4. Create a bot and copy the token
5. Enable the required intents:
   - Server Members Intent
   - Message Content Intent
6. Invite the bot to your server with appropriate permissions

### 5. Get the channel ID

1. Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
2. Right-click on the target channel and select "Copy ID"

### 6. Run the bot

```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Configuration Options

| Environment Variable | Description | Default | Required |
|---------------------|-------------|---------|----------|
| `DISCORD_BOT_TOKEN` | Discord bot token | - | ✅ Yes |
| `DISCORD_CHANNEL_ID` | Target Discord channel ID | - | ✅ Yes |
| `SERVER_HOST` | 7DTD server IP address | 127.0.0.1 | ✅ Yes |
| `SERVER_PORT` | 7DTD server port | 26900 | ✅ Yes |
| `CHECK_INTERVAL` | How often to check server status (ms) | 60000 | ✅ Yes |
| `TIMEOUT` | Connection timeout (ms) | 5000 | ✅ Yes |

## Commands

- `!serverstatus` - Manually check the current server status

## How It Works

The bot continuously monitors your 7 Days to Die server by attempting to establish a TCP connection to the specified host and port. When the connection status changes (online/offline), it sends a notification to the specified Discord channel.

## Features

- **Automatic Monitoring**: Checks server status every minute by default
- **Smart Notifications**: Only sends notifications when status changes
- **Cooldown System**: Prevents spam by implementing a 5-minute cooldown between notifications
- **Rich Embeds**: Beautiful Discord embeds with server information
- **Manual Commands**: Users can check server status on demand

## Troubleshooting

### Bot not responding
- Check if the bot token is correct in your `.env` file
- Ensure the bot has the required permissions
- Verify the bot is online in your server

### No notifications
- Check if the channel ID is correct in your `.env` file
- Ensure the bot has permission to send messages in the target channel
- Verify the server IP and port are correct

### Connection timeouts
- Increase the `TIMEOUT` value in your `.env` file
- Check if your firewall is blocking the connection
- Verify the server is accessible from the bot's network

### Configuration errors
- Make sure your `.env` file exists and contains the required variables
- Verify that `DISCORD_BOT_TOKEN` and `DISCORD_CHANNEL_ID` are set
- Check that the values are correct (no extra spaces or quotes)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 