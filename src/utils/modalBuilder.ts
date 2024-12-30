import {
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js'

export function createCustomModal({
    customId,
    title,
    components
}: {
    customId: string
    title: string
    components: TextInputBuilder[]
}): ModalBuilder {
    const modal = new ModalBuilder().setCustomId(customId).setTitle(title)

    components.forEach((component) => {
        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
            component
        )
        modal.addComponents(row)
    })

    return modal
}

export function createTextInput({
    customId,
    label,
    placeholder = '',
    style = TextInputStyle.Short
}: {
    customId: string
    label: string
    placeholder?: string
    style?: TextInputStyle
}): TextInputBuilder {
    return new TextInputBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setPlaceholder(placeholder)
        .setStyle(style)
}

