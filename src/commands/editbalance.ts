import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits
} from 'discord.js'
import Command from '../templates/command.js'
import { createEmbed } from '../utils/embedBuilder.js'
import { prisma } from '../prisma/prismaClient.js'

export default new Command({
    data: new SlashCommandBuilder()
        .setName('editbalance')
        .setDescription('Edit a user\'s balance (Admin only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to edit balance')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('action')
                .setDescription('Add or remove coins')
                .setRequired(true)
                .addChoices(
                    { name: 'Add', value: 'add' },
                    { name: 'Remove', value: 'remove' }
                )
        )
        .addNumberOption(option =>
            option
                .setName('amount')
                .setDescription('Amount of coins')
                .setRequired(true)
                .setMinValue(0)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const member = await interaction.guild?.members.fetch(interaction.user.id)
            const isAdmin = member?.roles.cache.has(process.env.ADMIN_ROLE_ID!)

            if (!isAdmin) {
                await interaction.reply({
                    content: 'Only admins can edit balances!',
                    ephemeral: true
                })
                return
            }

            const targetUser = interaction.options.getUser('user', true)
            const action = interaction.options.getString('action', true)
            const amount = interaction.options.getNumber('amount', true)

            let user = await prisma.user.findUnique({
                where: { discordId: targetUser.id }
            })

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        discordId: targetUser.id,
                        username: targetUser.username,
                        balance: 0
                    }
                })
            }

            if (action === 'remove' && user.balance < amount) {
                await interaction.reply({
                    embeds: [createEmbed({
                        title: '❌ Balance Edit Failed',
                        description: `Cannot remove ${amount} coins from <@${targetUser.id}>'s balance.\n` +
                            `Current balance: ${user.balance} coins`,
                        color: '#ff0000',
                        footer: 'WoW Services Management'
                    })],
                    ephemeral: true
                })
                return
            }

            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    balance: action === 'add' 
                        ? { increment: amount }
                        : { decrement: amount }
                }
            })

            try {
                await targetUser.send({
                    embeds: [createEmbed({
                        title: '💰 Balance Updated',
                        description: `Your balance has been ${action === 'add' ? 'increased' : 'decreased'} by ${amount} coins.\n\n` +
                            `💎 **New Balance:** ${updatedUser.balance} coins\n\n` +
                            `💡 Use \`/balance\` to check your balance anytime!`,
                        color: action === 'add' ? '#00ff00' : '#ffa500',
                        footer: 'WoW Services Management'
                    })]
                })
            } catch (error) {
                console.error('Error sending DM:', error)
            }

            await interaction.reply({
                embeds: [createEmbed({
                    title: '✅ Balance Updated',
                    description: `Successfully ${action === 'add' ? 'added' : 'removed'} ${amount} coins ${action === 'add' ? 'to' : 'from'} <@${targetUser.id}>'s balance.\n\n` +
                        `💰 **New Balance:** ${updatedUser.balance} coins`,
                    color: '#00ff00',
                    footer: 'WoW Services Management'
                })],
                ephemeral: true
            })

        } catch (error) {
            console.error('Error editing balance:', error)
            await interaction.reply({
                content: 'There was an error editing the balance.',
                ephemeral: true
            })
        }
    }
}) 