import { 
    ModalSubmitInteraction,
    ButtonStyle
} from 'discord.js'
import Modal from '../templates/modal.js'
import { createEmbed } from '../utils/embedBuilder.js'
import { createButton } from '../utils/buttonBuilder.js'
import { createActionRows } from '../utils/actionRowBuilder.js'

export default new Modal({
    customId: 'complete-order-modal',
    async execute(interaction: ModalSubmitInteraction) {
        try {
            const orderId = interaction.customId.split('_')[1]
            const price = parseFloat(interaction.fields.getTextInputValue('order-price'))

            if (isNaN(price)) {
                await interaction.reply({
                    content: 'Please enter a valid price!',
                    ephemeral: true
                })
                return
            }

            const confirmEmbed = createEmbed({
                title: '🏁 Complete Order',
                description: `<@${interaction.user.id}> is marking this order as complete.\n\n` +
                    `💰 **Final Price:** ${price} coins\n\n` +
                    '**Distribution:**\n' +
                    `• Booster (70%): ${price * 0.7} coins\n` +
                    `• Creator (25%): ${price * 0.25} coins\n` +
                    `• Admin (5%): ${price * 0.05} coins\n\n` +
                    'Click confirm to process payment and close the order.',
                color: '#00ff00'
            })

            const confirmButton = createButton({
                customId: `confirm-complete_${orderId}_${price}`,
                label: 'Confirm & Pay',
                style: ButtonStyle.Success,
                emoji: '✅'
            })

            await interaction.reply({
                embeds: [confirmEmbed],
                components: [createActionRows([confirmButton])]
            })

        } catch (error) {
            console.error('Error in complete order modal:', error)
            await interaction.reply({
                content: 'There was an error processing the order completion.',
                ephemeral: true
            })
        }
    }
}) 