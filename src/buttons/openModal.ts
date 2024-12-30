import { ButtonInteraction, TextInputStyle } from 'discord.js'
import Button from '../templates/button.ts'
import { createCustomModal, createTextInput } from '../utils/modalBuilder.ts'

export default new Button({
    customId: 'openModal',
    async execute(interaction: ButtonInteraction) {
        const modal = createCustomModal({
            customId: 'exampleModal',
            title: 'Open Modal',
            components: [
                createTextInput({
                    customId: 'inputField',
                    label: 'Input Field',
                    style: TextInputStyle.Short
                })
            ]
        })
        await interaction.showModal(modal)
    }
})

