import { ButtonBuilder, ButtonStyle } from 'discord.js'

export function createButton({
    customId,
    label,
    style = ButtonStyle.Primary
}: {
    customId: string
    label: string
    style?: ButtonStyle
}): ButtonBuilder {
    return new ButtonBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style)
}

