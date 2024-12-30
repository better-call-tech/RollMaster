import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ButtonStyle
} from 'discord.js'
import Command from '../templates/command.ts'
import { createButton } from '../utils/buttonBuilder.ts'
import { createActionRows } from '../utils/actionRowBuilder.ts'

export default new Command({
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with a modal!'),

    async execute(interaction: ChatInputCommandInteraction) {
        const button1 = createButton({
            customId: 'openModal',
            label: 'Open Modal',
            style: ButtonStyle.Primary
        })

        const button2 = createButton({
            customId: 'selectOption',
            label: 'Select an option button',
            style: ButtonStyle.Danger
        })

        const rows = createActionRows([button1, button2])

        await interaction.reply({
            content: 'Click the button to open a modal.',
            components: rows,
            ephemeral: true
        })
    }
})
