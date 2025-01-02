import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    TextInputStyle
} from 'discord.js'
import Command from '../templates/command.js'
import { createCustomModal, createTextInput } from '../utils/modalBuilder.js'
import { prisma } from '../prisma/prismaClient.js'

export default new Command({
    data: new SlashCommandBuilder()
        .setName('payclose')
        .setDescription('Mark order as complete and distribute payment')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.channel?.isThread()) {
                await interaction.reply({
                    content: 'This command can only be used in order threads!',
                    ephemeral: true
                })
                return
            }

            const threadName = interaction.channel.name
            const orderIdMatch = threadName.match(/🔒 .+-(\d+)/)
            
            if (!orderIdMatch) {
                await interaction.reply({
                    content: 'This command can only be used in order execution threads!',
                    ephemeral: true
                })
                return
            }

            const orderId = parseInt(orderIdMatch[1])
            
            const member = await interaction.guild?.members.fetch(interaction.user.id)
            const isAdmin = member?.roles.cache.has(process.env.ADMIN_ROLE_ID!)
            
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    creator: true,
                    booster: true
                }
            })

            if (!order) {
                await interaction.reply({
                    content: 'Could not find order associated with this thread!',
                    ephemeral: true
                })
                return
            }

            const isCreator = order.creator.discordId === interaction.user.id

            if (!isAdmin && !isCreator) {
                await interaction.reply({
                    content: 'Only admins or the order creator can complete orders!',
                    ephemeral: true
                })
                return
            }

            const modal = createCustomModal({
                customId: `complete-order-modal_${orderId}`,
                title: 'Complete Order',
                components: [
                    createTextInput({
                        customId: 'order-price',
                        label: 'Order Price',
                        placeholder: 'Enter the final price...',
                        style: TextInputStyle.Short,
                        required: true
                    })
                ]
            })

            await interaction.showModal(modal)

        } catch (error) {
            console.error('Error in payclose command:', error)
            await interaction.reply({
                content: 'There was an error processing the command.',
                ephemeral: true
            })
        }
    }
}) 