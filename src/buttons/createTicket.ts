import { 
    ButtonInteraction,
    TextInputStyle
} from 'discord.js'
import Button from '../templates/button.js'
import { createCustomModal, createTextInput } from '../utils/modalBuilder.js'

export default new Button({
    customId: 'create-ticket',
    async execute(interaction: ButtonInteraction) {
        try {
            const modal = createCustomModal({
                customId: 'create-order-modal',
                title: 'Create New Order',
                components: [
                    createTextInput({
                        customId: 'order-title',
                        label: 'Order Title',
                        placeholder: 'e.g., Mythic +15 Dungeon Boost',
                        style: TextInputStyle.Short,
                        required: true,
                        maxLength: 100
                    }),
                    createTextInput({
                        customId: 'order-description',
                        label: 'Order Description (Optional)',
                        placeholder: 'Enter order details...',
                        style: TextInputStyle.Paragraph,
                        required: false
                    })
                ]
            })

            await interaction.showModal(modal)

        } catch (error) {
            console.error('Error creating order:', error)
            await interaction.reply({
                content: 'There was an error creating your order. Please try again.',
                ephemeral: true
            })
        }
    }
}) 