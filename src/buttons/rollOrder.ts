import { 
    ButtonInteraction,
    Collection,
    ThreadAutoArchiveDuration,
    TextChannel,
    ChannelType
} from 'discord.js'
import Button from '../templates/button.js'
import { createEmbed } from '../utils/embedBuilder.js'
import { prisma } from '../prisma/prismaClient.js'
import { getConfig } from '../services/configService.js'

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

            await interaction.deferReply()

            const roll = Math.floor(Math.random() * 100) + 1
            rolls.set(interaction.user.id, roll)

            const rollEmbed = createEmbed({
                title: '🎲 Roll Result',
                description: `<@${interaction.user.id}> rolled **${roll}**!`,
                color: '#5865F2'
            })

            await interaction.editReply({
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

                    const order = await prisma.order.findUnique({
                        where: { id: parseInt(orderId) },
                        include: { creator: true }
                    })

                    if (!order) return

                    const ordersChannelId = await getConfig('ORDERS_CHANNEL')
                    if (!ordersChannelId) return

                    const ordersChannel = await interaction.guild?.channels.fetch(ordersChannelId) as TextChannel
                    if (!ordersChannel) return

                    const privateThread = await ordersChannel.threads.create({
                        name: `🔒 order-${orderId}-execution`,
                        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                        type: ChannelType.PrivateThread,
                        reason: `Private thread for order #${orderId}`
                    })

                    let booster = await prisma.user.findUnique({
                        where: { discordId: winner }
                    })

                    if (!booster) {
                        booster = await prisma.user.create({
                            data: {
                                discordId: winner,
                                username: `<@${winner}>`,
                                balance: 0
                            }
                        })
                    }

                    await prisma.order.update({
                        where: { id: parseInt(orderId) },
                        data: { 
                            boosterId: booster.id,
                            channelId: privateThread.id,
                            status: 'IN_PROGRESS'
                        }
                    })

                    await privateThread.members.add(winner)
                    await privateThread.members.add(order.creator.discordId)
                    
                    const adminRoleId = process.env.ADMIN_ROLE_ID!
                    const admins = await interaction.guild?.members.fetch()
                        .then(members => members.filter(member => 
                            member.roles.cache.has(adminRoleId)
                        ))
                    
                    for (const [, admin] of admins ?? []) {
                        await privateThread.members.add(admin.id)
                    }

                    const privateEmbed = createEmbed({
                        title: '🎯 Order Execution Thread',
                        description: 'This is a private thread for executing the order.\n\n' +
                            `🏆 **Selected Booster:** <@${winner}>\n` +
                            `👤 **Order Creator:** <@${order.creator.discordId}>\n\n` +
                            '**Please discuss order details and execution here.**',
                        fields: [
                            {
                                name: '📋 Order Details',
                                value: order.description,
                                inline: false
                            }
                        ],
                        color: '#00ff00',
                        timestamp: true
                    })

                    await privateThread.send({
                        content: `<@${winner}> <@${order.creator.discordId}>`,
                        embeds: [privateEmbed]
                    })

                    const resultEmbed = createEmbed({
                        title: '🎯 Roll Winner Selected',
                        description: `<@${winner}> won with a roll of **${highestRoll}**!\n\n` +
                            '**A private thread has been created for order execution.**',
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

                    if (interaction.channel && 'send' in interaction.channel) {
                        await interaction.channel.send({
                            embeds: [resultEmbed]
                        })
                    }

                    if (interaction.channel?.isThread()) {
                        await interaction.channel.setLocked(true)
                        await interaction.channel.setArchived(true)
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