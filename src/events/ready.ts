import { Client, Events } from 'discord.js'
import Event from '../templates/event.js'
import { createUser, findUserByDiscordId } from '../services/userService.js'
import { deployCommands } from '../deploy-commands.js'

export default new Event({
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        console.log('Discord bot is ready! 🤖')

        const guilds = client.guilds.cache

        for (const [guildId, guild] of guilds) {
            console.log(`Processing members of guild: ${guild.name}`)

            try {
                const members = await guild.members.fetch()

                for (const [,member] of members) {
                    const discordId = member.id
                    if (!discordId) {
                        console.error(
                            `Discord ID is undefined for member: ${member.user.username}`
                        )
                        continue
                    }
                    const username = member.user.username

                    const existingUser = await findUserByDiscordId(discordId)

                    if (!existingUser) {
                        await createUser(discordId, username)
                        console.log(
                            `Created account for existing user: ${username}`
                        )
                    } else {
                        console.log(`User ${username} already exists.`)
                    }
                }

                console.log(`Deploying commands for guild: ${guild.name}`)
                await deployCommands({ guildId })
            } catch (error) {
                console.error(
                    `Error fetching members or deploying commands for guild ${guild.name}:`,
                    error
                )
            }
        }

        setInterval(() => {
            client.guilds.cache.forEach(guild => {
                guild.members.fetch()
                    .catch(err => console.error(`Error refreshing member cache for ${guild.name}:`, err))
            })
        }, 3600000)
    }
})


