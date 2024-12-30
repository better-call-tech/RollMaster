import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    Events,
    Interaction,
    ModalSubmitInteraction
} from 'discord.js'
import Event from '../templates/event.ts'
import { commands } from '../commands/index.ts'
import { buttons } from '../buttons/index.ts'
import { modals } from '../modals/index.ts'
import { selectMenus } from '../selectMenus/index.ts'
import { isSelectMenuInteraction } from '../utils/selectMenuUtils.ts'
import { SelectMenuInteractionType } from '../templates/selectMenu.ts'

export default new Event({
    name: Events.InteractionCreate,
    execute: async (interaction: Interaction) => {
        try {
            if (interaction.isChatInputCommand()) {
                await handleCommandInteraction(interaction)
            } else if (interaction.isButton()) {
                await handleButtonInteraction(interaction)
            } else if (interaction.isModalSubmit()) {
                await handleModalInteraction(interaction)
            } else if (isSelectMenuInteraction(interaction)) {
                await handleSelectMenuInteraction(interaction)
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                await handleError(interaction, error)
            }
        }
    }
})

const handleCommandInteraction = async (
    interaction: ChatInputCommandInteraction
) => {
    const command = commands[interaction.commandName]
    if (!command) {
        await interaction.reply({
            content: 'Command not found!',
            ephemeral: true
        })
        return
    }
    await command.execute(interaction)
}

const handleButtonInteraction = async (interaction: ButtonInteraction) => {
    const button = buttons[interaction.customId]
    if (!button) {
        await interaction.reply({
            content: 'Button not found!',
            ephemeral: true
        })
        return
    }
    await button.execute(interaction)
}

const handleModalInteraction = async (interaction: ModalSubmitInteraction) => {
    const modal = modals[interaction.customId]
    if (!modal) {
        await interaction.reply({
            content: 'Modal not found!',
            ephemeral: true
        })
        return
    }
    await modal.execute(interaction)
}

const handleSelectMenuInteraction = async (
    interaction: SelectMenuInteractionType
) => {
    const selectMenu = selectMenus[interaction.customId]
    if (!selectMenu) {
        await interaction.reply({
            content: 'Select menu not found!',
            ephemeral: true
        })
        return
    }
    await selectMenu.execute(interaction)
}

const handleError = async (interaction: Interaction, error: Error) => {
    console.error('Error executing interaction:', error)

    if (interaction.isRepliable()) {
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'An unexpected error occurred.',
                ephemeral: true
            })
        } else {
            await interaction.reply({
                content: 'An unexpected error occurred.',
                ephemeral: true
            })
        }
    }
}

