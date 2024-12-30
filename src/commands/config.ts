import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ChannelType,
    PermissionFlagsBits,
    ButtonStyle,
    TextChannel
} from 'discord.js'
import Command from '../templates/command.js'
import { setConfig } from '../services/configService.js'
import { createEmbed } from '../utils/embedBuilder.js'
import { createButton } from '../utils/buttonBuilder.js'
import { createActionRows } from '../utils/actionRowBuilder.js'

export default new Command({
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure bot settings')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticket-channel')
                .setDescription('Set the channel for ticket creation')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('The channel to create tickets in')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        ) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand()

        if (subcommand === 'ticket-channel') {
            const channel = interaction.options.getChannel('channel', true) as TextChannel
            
            await setConfig('TICKET_CHANNEL', channel.id)
            
            const configEmbed = createEmbed({
                title: '✅ Configuration Updated',
                description: `Ticket channel has been set to ${channel}`,
                color: '#00ff00'
            })

            await interaction.reply({ embeds: [configEmbed], ephemeral: true })
            
            const ticketEmbed = createEmbed({
                title: '🎫 Create WoW Service Order',
                description: 'Click the button below to create a new service order ticket.',
                color: '#5865F2',
                footer: 'WoW Services Management'
            })

            const button = createButton({
                customId: 'create-ticket',
                label: 'Create Order',
                style: ButtonStyle.Primary,
                emoji: '🎫'
            })

            const row = createActionRows([button])

            await channel.send({
                embeds: [ticketEmbed],
                components: [row]
            })
        }
    }
}) 