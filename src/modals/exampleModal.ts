import { ModalSubmitInteraction } from 'discord.js'
import Modal from '../templates/modal.ts'

export default new Modal({
    customId: 'exampleModal',
    async execute(interaction: ModalSubmitInteraction) {
        const input = interaction.fields.getTextInputValue('inputField')
        await interaction.reply({
            content: `You submitted: ${input}`,
            ephemeral: true
        })
    }
})

