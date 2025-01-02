import { ButtonInteraction } from 'discord.js'
import Button from '../templates/button.js'
import { createEmbed } from '../utils/embedBuilder.js'
import { prisma } from '../prisma/prismaClient.js'

export default new Button({
    customId: 'confirm-complete',
    async execute(interaction: ButtonInteraction) {
        try {
            await interaction.deferReply({ ephemeral: true })
            
            const member = await interaction.guild?.members.fetch(interaction.user.id)
            const isAdmin = member?.roles.cache.has(process.env.ADMIN_ROLE_ID!)

            const [, orderId, priceStr] = interaction.customId.split('_')
            const order = await prisma.order.findUnique({
                where: { id: parseInt(orderId) },
                include: {
                    creator: true,
                    booster: true
                }
            })

            if (!order) {
                await interaction.editReply({
                    content: 'Could not find the order!',
                })
                return
            }

            const isCreator = order.creator.discordId === interaction.user.id

            if (!isAdmin && !isCreator) {
                await interaction.editReply({
                    content: 'Only admins or the order creator can confirm completion!',
                })
                return
            }

            const price = parseFloat(priceStr)
            
            if (!interaction.channel?.isThread()) return

            if (!order.booster) {
                await interaction.editReply({
                    content: 'Error: No booster assigned to this order!',
                })
                return
            }

            const boosterShare = price * 0.7
            const creatorShare = price * 0.25
            const adminShare = price * 0.05

            let booster = await prisma.user.findUnique({
                where: { discordId: order.booster.discordId }
            })

            if (!booster) {
                booster = await prisma.user.create({
                    data: {
                        discordId: order.booster.discordId,
                        username: order.booster.username,
                        balance: 0
                    }
                })
            }

            await prisma.user.update({
                where: { id: booster.id },
                data: { balance: { increment: boosterShare } }
            })

            let creator = await prisma.user.findUnique({
                where: { discordId: order.creator.discordId }
            })

            if (!creator) {
                creator = await prisma.user.create({
                    data: {
                        discordId: order.creator.discordId,
                        username: order.creator.username,
                        balance: 0
                    }
                })
            }

            await prisma.user.update({
                where: { id: creator.id },
                data: { balance: { increment: creatorShare } }
            })

            // And admin
            let admin = await prisma.user.findUnique({
                where: { discordId: '200605550432616449' }
            })

            if (!admin) {
                admin = await prisma.user.create({
                    data: {
                        discordId: '200605550432616449',
                        username: 'Admin',
                        balance: 0
                    }
                })
            }

            await prisma.user.update({
                where: { id: admin.id },
                data: { balance: { increment: adminShare } }
            })

            try {
                const boosterUser = await interaction.client.users.fetch(order.booster.discordId)
                await boosterUser.send({
                    embeds: [createEmbed({
                        title: '💰 Payment Received - Booster Share',
                        description: `You've received payment for boosting order #${order.id}!\n\n` +
                            `💎 **Total Order Value:** ${price} coins\n` +
                            `💰 **Your Share (70%):** ${boosterShare} coins\n\n` +
                            `Thank you for your service! Keep up the great work! 🌟\n\n` +
                            `💡 Use \`/balance\` to check your updated balance!`,
                        color: '#00ff00',
                        footer: 'WoW Services Management'
                    })]
                })

                const creatorUser = await interaction.client.users.fetch(order.creator.discordId)
                await creatorUser.send({
                    embeds: [createEmbed({
                        title: '💰 Payment Received - Creator Share',
                        description: `Your order #${order.id} has been completed!\n\n` +
                            `💎 **Total Order Value:** ${price} coins\n` +
                            `💰 **Your Share (25%):** ${creatorShare} coins\n\n` +
                            `Thanks for using our services! 🌟\n\n` +
                            `💡 Use \`/balance\` to check your updated balance!`,
                        color: '#00ff00',
                        footer: 'WoW Services Management'
                    })]
                })

                const adminUser = await interaction.client.users.fetch('200605550432616449')
                await adminUser.send({
                    embeds: [createEmbed({
                        title: '💰 Payment Received - Admin Share',
                        description: `Order #${order.id} has been completed!\n\n` +
                            `💎 **Total Order Value:** ${price} coins\n` +
                            `💰 **Admin Share (5%):** ${adminShare} coins\n\n` +
                            `Distribution complete! ✨\n\n` +
                            `💡 Use \`/balance\` to check your updated balance!`,
                        color: '#00ff00',
                        footer: 'WoW Services Management'
                    })]
                })
            } catch (error) {
                console.error('Error sending DMs:', error)
            }

            await interaction.channel.setLocked(true)
            await interaction.channel.setArchived(true)

            await interaction.editReply({
                embeds: [createEmbed({
                    title: '✅ Order Completed',
                    description: 'Payments have been distributed and thread will be closed.',
                    color: '#00ff00'
                })]
            })

        } catch (error) {
            console.error('Error completing order:', error)
            await interaction.editReply({
                content: 'There was an error completing the order.',
            })
        }
    }
}) 