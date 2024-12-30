import { Events, Guild } from 'discord.js'
import Event from '../templates/event.ts'
import { deployCommands } from '../deploy-commands.ts'

export default new Event({
    name: Events.GuildCreate,
    once: false,
    execute: async (guild: Guild) => {
        console.log(`Bot added to a new guild: ${guild.id}`)
        await deployCommands({ guildId: guild.id })
    }
})

