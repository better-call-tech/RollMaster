import { 
    ButtonInteraction, 
    ButtonStyle,
    ThreadAutoArchiveDuration,
    TextChannel
} from 'discord.js'
import Button from '../templates/button.js'
import { createEmbed } from '../utils/embedBuilder.js'
import { createButton } from '../utils/buttonBuilder.js'
import { createActionRows } from '../utils/actionRowBuilder.js'
import { prisma } from '../prisma/prismaClient.js'
import { getConfig } from '../services/configService.js'

export default new Button({
    customId: 'create-ticket',
    async execute(interaction: ButtonInteraction) {
        try {
            const { guild, user } = interaction
            if (!guild) return

            await interaction.deferReply({ ephemeral: true })

            const boosterRoleId = process.env.BOOSTER_ROLE_ID!
            const adminRoleId = process.env.ADMIN_ROLE_ID!

            const ordersChannelId = await getConfig('ORDERS_CHANNEL')
            if (!ordersChannelId) {
                throw new Error('Orders channel not configured!')
            }

            const ordersChannel = await guild.channels.fetch(ordersChannelId) as TextChannel
            if (!ordersChannel) {
                throw new Error('Orders channel not found!')
            }

            const thread = await ordersChannel.threads.create({
                name: `order-${user.username}-${Date.now()}`,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                reason: 'New WoW service order'
            })

            const order = await prisma.order.create({
                data: {
                    title: thread.name,
                    description: 'WoW Service Order',
                    price: 0,
                    creator: {
                        connect: {
                            discordId: user.id
                        }
                    },
                    channelId: thread.id
                }
            })

            const orderEmbed = createEmbed({
                title: '🎫 New WoW Service Order',
                description: 'Boosters, click the button below to roll for this order!\nHighest roll after 2 minutes wins.',
                fields: [
                    {
                        name: '👤 Created by',
                        value: `<@${user.id}>`,
                        inline: true
                    },
                    {
                        name: '📝 Status',
                        value: 'Waiting for boosters',
                        inline: true
                    }
                ],
                color: '#FFA500',
                timestamp: true
            })

            const rollButton = createButton({
                customId: `roll-order_${order.id}`,
                label: 'Roll for Order (1-100)',
                style: ButtonStyle.Primary,
                emoji: '🎲'
            })

            const row = createActionRows([rollButton])

            const message = await thread.send({
                content: `<@&${boosterRoleId}> <@&${adminRoleId}> <@${user.id}>\nNew order available!`,
                embeds: [orderEmbed],
                components: [row]
            })

            await prisma.order.update({
                where: { id: order.id },
                data: { messageId: message.id }
            })

            await interaction.editReply({
                content: `Order created! Please check ${thread}`,
            })

        } catch (error) {
            console.error('Error creating order:', error)
            await interaction.editReply({
                content: 'There was an error creating your order. Please try again.',
            })
        }
    }
}) 