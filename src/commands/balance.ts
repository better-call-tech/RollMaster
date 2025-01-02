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
        .setName('balance')
        .setDescription('Check your balance')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to check balance (Admin only)')
                .setRequired(false)
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const member = await interaction.guild?.members.fetch(interaction.user.id)
            const isAdmin = member?.roles.cache.has(process.env.ADMIN_ROLE_ID!)
            const targetUser = interaction.options.getUser('user') ?? interaction.user

            if (!isAdmin && targetUser.id !== interaction.user.id) {
                await interaction.reply({
                    content: 'You can only check your own balance!',
                    ephemeral: true
                })
                return
            }

            await interaction.deferReply({ ephemeral: true })

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

            const balanceEmbed = createEmbed({
                title: '💰 Balance Check',
                description: targetUser.id === interaction.user.id ? 
                    `Your current balance is **${user.balance}** coins` :
                    `Balance for <@${targetUser.id}> is **${user.balance}** coins`,
                color: '#5865F2',
                footer: 'WoW Services Management'
            })

            await interaction.editReply({
                embeds: [balanceEmbed]
            })

        } catch (error) {
            console.error('Error checking balance:', error)
            await interaction.editReply({
                content: 'There was an error checking the balance.'
            })
        }
    }
}) 