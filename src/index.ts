import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { config } from './config.js'
import { readdirSync } from 'fs'
import { dirname, join } from 'path'
import type Event from './templates/event.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ],
    partials: [
        Partials.GuildMember,
        Partials.User
    ]
})

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Performing graceful shutdown...');
    client.destroy();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Performing cleanup...');
    process.exit(0);
});

// Discord client error handlers
client.on('error', (error) => {
    console.error('Discord client error:', error);
    process.exit(1);
});

// Connection check interval
setInterval(() => {
    if (!client.isReady()) {
        console.error('Client disconnected, restarting...');
        process.exit(1);
    }
}, 60000);

async function loadEvents() {
    const eventsPath = join(__dirname, './events')

    console.log(`Looking for event files in: ${eventsPath}`)

    const eventFiles: string[] = readdirSync(eventsPath).filter(
        (file) => file.endsWith('.js') || file.endsWith('.ts')
    )

    for (const file of eventFiles) {
        const event: Event = (await import(`./events/${file}`)).default as Event
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args))
        } else {
            client.on(event.name, (...args) => event.execute(...args))
        }
    }
}

const startBot = async () => {
    await loadEvents()

    try {
        await client.login(config.DISCORD_TOKEN)
        console.log('Bot has logged in successfully.')
    } catch (err) {
        console.error('Login failed:', err)
    }
}

startBot()
