import { 
    ButtonInteraction,
    Collection
} from 'discord.js'
import Button from '../templates/button.js'
import { createEmbed } from '../utils/embedBuilder.js'
import { prisma } from '../prisma/prismaClient.js'

const orderRolls = new Collection<string, Map<string, number>>()

export default new Button({
    customId: 'roll-order',
    async execute(interaction: ButtonInteraction) {
        const orderId = interaction.customId.split('_')[1]
        
        try {
            const member = await interaction.guild?.members.fetch(interaction.user.id)
            const hasBoosterRole = member?.roles.cache.has(process.env.BOOSTER_ROLE_ID!)

            if (!hasBoosterRole) {
                await interaction.reply({
                    content: 'Only boosters can roll for orders!',
                    ephemeral: true
                })
                return
            }

            if (!orderRolls.has(orderId)) {
                orderRolls.set(orderId, new Map())
            }

            const rolls = orderRolls.get(orderId)!

            if (rolls.has(interaction.user.id)) {
                await interaction.reply({
                    content: 'You have already rolled for this order!',
                    ephemeral: true
                })
                return
            }

            const roll = Math.floor(Math.random() * 100) + 1
            rolls.set(interaction.user.id, roll)

            const rollEmbed = createEmbed({
                title: '🎲 Roll Result',
                description: `<@${interaction.user.id}> rolled **${roll}**!`,
                color: '#5865F2'
            })

            await interaction.reply({
                embeds: [rollEmbed]
            })

            if (rolls.size === 1) {
                setTimeout(async () => {
                    let highestRoll = 0
                    let winner = ''

                    rolls.forEach((userRoll, userId) => {
                        if (userRoll > highestRoll) {
                            highestRoll = userRoll
                            winner = userId
                        }
                    })

                    const resultEmbed = createEmbed({
                        title: '🎯 Roll Winner',
                        description: `<@${winner}> won with a roll of **${highestRoll}**!`,
                        fields: [
                            {
                                name: 'All Rolls',
                                value: Array.from(rolls.entries())
                                    .map(([userId, userRoll]) => `<@${userId}>: ${userRoll}`)
                                    .join('\n'),
                                inline: false
                            }
                        ],
                        color: '#00ff00'
                    })

                    let boosterDb = await prisma.user.findUnique({
                        where: { discordId: winner }
                    })

                    if (!boosterDb) {
                        boosterDb = await prisma.user.create({
                            data: {
                                discordId: winner,
                                username: `<@${winner}>`
                            }
                        })
                    }

                    await prisma.order.update({
                        where: { id: parseInt(orderId) },
                        data: { 
                            boosterId: boosterDb.id,
                            status: 'IN_PROGRESS'
                        }
                    })

                    if (interaction.channel && 'send' in interaction.channel) {
                        await interaction.channel.send({
                            embeds: [resultEmbed]
                        })
                    }

                    orderRolls.delete(orderId)

                }, 120000)
            }

        } catch (error) {
            console.error('Error processing roll:', error)
            await interaction.reply({
                content: 'There was an error processing your roll. Please try again.',
                ephemeral: true
            })
        }
    }
}) 