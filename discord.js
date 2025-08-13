require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const net = require('net');

// Configuration from environment variables
const config = {
    token: process.env.DISCORD_BOT_TOKEN,
    channelId: process.env.DISCORD_CHANNEL_ID,
    serverHost: process.env.SERVER_HOST || '127.0.0.1',
    serverPort: parseInt(process.env.SERVER_PORT) || 26900,
    displayHost: process.env.DISPLAY_SERVER_HOST || process.env.SERVER_HOST || '127.0.0.1',
    checkInterval: parseInt(process.env.CHECK_INTERVAL) || 60000,
    timeout: parseInt(process.env.TIMEOUT) || 5000
};

// Validate required configuration
if (!config.token) {
    console.error('Error: DISCORD_BOT_TOKEN is required in .env file');
    process.exit(1);
}

if (!config.channelId) {
    console.error('Error: DISCORD_CHANNEL_ID is required in .env file');
    process.exit(1);
}

class ServerMonitor {
    constructor() {
        this.client = new Client({ 
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
        });
        this.isServerOnline = false;
        this.lastNotificationTime = 0;
        this.cooldownPeriod = 300000; // 5 minutes cooldown between notifications
    }

    async initialize() {
        this.client.once('ready', () => {
            console.log(`Bot logged in as ${this.client.user.tag}`);
            this.startMonitoring();
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            
            // Command to manually check server status
            if (message.content === '!serverstatus') {
                const status = await this.checkServerStatus();
                const embed = this.createStatusEmbed(status);
                message.reply({ embeds: [embed] });
            }
        });

        await this.client.login(config.token);
    }

    async checkServerStatus() {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            let isOnline = false;

            socket.setTimeout(config.timeout);

            socket.on('connect', () => {
                isOnline = true;
                socket.destroy();
                resolve(true);
            });

            socket.on('timeout', () => {
                socket.destroy();
                resolve(false);
            });

            socket.on('error', () => {
                resolve(false);
            });

            socket.connect(config.serverPort, config.serverHost);
        });
    }

    createStatusEmbed(isOnline) {
        const embed = new EmbedBuilder()
            .setTitle('🎮 7 Days to Die Server Status')
            .setColor(isOnline ? 0x00ff00 : 0xff0000)
            .addFields([
                { name: 'Server', value: `${config.displayHost}:${config.serverPort}`, inline: true },
                { name: 'Status', value: isOnline ? '🟢 Online' : '🔴 Offline', inline: true },
                { name: 'Last Check', value: new Date().toLocaleString(), inline: true }
            ])
            .setTimestamp();

        if (isOnline) {
            embed.setDescription('The server is online and ready for survivors!');
        } else {
            embed.setDescription('The server appears to be offline.');
        }

        return embed;
    }

    async sendNotification(isOnline) {
        try {
            const channel = await this.client.channels.fetch(config.channelId);
            const embed = this.createStatusEmbed(isOnline);
            
            if (isOnline) {
                embed.setTitle('🚨 Server is Now LIVE! 🚨');
                embed.setDescription('🎮 The 7 Days to Die server is now online! Time to survive the apocalypse!');
                await channel.send({ 
                    content: '@everyone Server is live!', 
                    embeds: [embed] 
                });
            } else {
                embed.setTitle('⚠️ Server Went Offline');
                embed.setDescription('The 7 Days to Die server has gone offline.');
                await channel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    }

    async startMonitoring() {
        console.log('Starting server monitoring...');
        
        setInterval(async () => {
            const currentStatus = await this.checkServerStatus();
            const now = Date.now();
            
            // Check if status changed
            if (currentStatus !== this.isServerOnline) {
                // Cooldown check to prevent spam
                if (now - this.lastNotificationTime > this.cooldownPeriod) {
                    console.log(`Server status changed: ${currentStatus ? 'ONLINE' : 'OFFLINE'}`);
                    await this.sendNotification(currentStatus);
                    this.lastNotificationTime = now;
                }
                this.isServerOnline = currentStatus;
            }
            
            console.log(`Server check: ${currentStatus ? 'Online' : 'Offline'} at ${new Date().toLocaleString()}`);
        }, config.checkInterval);
    }
}

// Initialize and start the bot
const monitor = new ServerMonitor();
monitor.initialize().catch(console.error);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down bot...');
    monitor.client.destroy();
    process.exit(0);
});