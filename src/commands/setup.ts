import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    ButtonStyle
} from 'discord.js'
import Command from '../templates/command.js'
import { setConfig, getConfig } from '../services/configService.js'
import { createEmbed } from '../utils/embedBuilder.js'
import { createButton } from '../utils/buttonBuilder.js'
import { createActionRows } from '../utils/actionRowBuilder.js'

export default new Command({
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup order system channels')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) as SlashCommandBuilder,

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const guild = interaction.guild
            if (!guild) return

            // Check both DB and actual channels
            const existingOrderChannelId = await getConfig('ORDER_CREATE_CHANNEL')
            const existingOrdersChannelId = await getConfig('ORDERS_CHANNEL')

            let channelsExist = false

            if (existingOrderChannelId || existingOrdersChannelId) {
                try {
                    const orderChannel = existingOrderChannelId ? 
                        await guild.channels.fetch(existingOrderChannelId) : null
                    const ordersChannel = existingOrdersChannelId ? 
                        await guild.channels.fetch(existingOrdersChannelId) : null

                    if (orderChannel || ordersChannel) {
                        channelsExist = true
                    }
                } catch (error) {
                    // Channels don't exist in server, clear config
                    if (existingOrderChannelId) await setConfig('ORDER_CREATE_CHANNEL', '')
                    if (existingOrdersChannelId) await setConfig('ORDERS_CHANNEL', '')
                }
            }

            if (channelsExist) {
                const alreadySetupEmbed = createEmbed({
                    title: '⚠️ Setup Already Exists',
                    description: 'The WoW Services system is already set up!\n\n' +
                        'To create a new setup, please delete the existing:\n' +
                        '• WoW Services category\n' +
                        '• All associated channels\n' +
                        'Then run this command again.',
                    color: '#FFA500'
                })

                await interaction.reply({ embeds: [alreadySetupEmbed], ephemeral: true })
                return
            }

            const setupEmbed = createEmbed({
                title: '🔧 Setting up WoW Services System...',
                description: 'Creating necessary channels and configurations...',
                color: '#FFA500'
            })

            await interaction.reply({ embeds: [setupEmbed], ephemeral: true })

            const category = await guild.channels.create({
                name: '🎮 WoW SERVICES',
                type: ChannelType.GuildCategory
            })

            const orderChannel = await guild.channels.create({
                name: '💫┃create-order',
                type: ChannelType.GuildText,
                parent: category,
                topic: '✨ Create your WoW service orders here!'
            })

            const ordersChannel = await guild.channels.create({
                name: '🎯┃active-orders',
                type: ChannelType.GuildText,
                parent: category,
                topic: '📋 Active WoW service orders and boosting requests'
            })

            await setConfig('ORDER_CREATE_CHANNEL', orderChannel.id)
            await setConfig('ORDERS_CHANNEL', ordersChannel.id)

            const orderEmbed = createEmbed({
                title: '🎮 WoW Boosting Services',
                description: '**Welcome to our WoW Services System!**\n\n' +
                    '• Create orders for any WoW service\n' +
                    '• Automatic booster selection via roll system\n' +
                    '• Track your orders in dedicated threads\n\n' +
                    '📝 Click the button below to create your order!',
                color: '#5865F2',
                footer: '🌟 Quality WoW Services | Fast & Reliable'
            })

            const button = createButton({
                customId: 'create-ticket',
                label: '📝 Create New Order',
                style: ButtonStyle.Primary,
                emoji: '✨'
            })

            await orderChannel.send({
                embeds: [orderEmbed],
                components: [createActionRows([button])]
            })

            const successEmbed = createEmbed({
                title: '✅ Setup Complete!',
                description: '**Successfully created:**\n\n' +
                    `📁 Category: ${category.name}\n` +
                    `📝 Order Creation: ${orderChannel}\n` +
                    `🎯 Active Orders: ${ordersChannel}\n\n` +
                    '**System is ready to use!**',
                color: '#00ff00',
            })

            await interaction.editReply({
                embeds: [successEmbed]
            })

        } catch (error) {
            console.error('Error in setup command:', error)
            const errorEmbed = createEmbed({
                title: '❌ Setup Failed',
                description: 'There was an error setting up the channels. Please try again.',
                color: '#ff0000'
            })
            
            await interaction.editReply({
                embeds: [errorEmbed]
            })
        }
    }
}) 