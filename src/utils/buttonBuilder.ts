import { ButtonBuilder, ButtonStyle, ComponentEmojiResolvable } from 'discord.js'

export function createButton({
    customId,
    label,
    style = ButtonStyle.Primary,
    emoji
}: {
    customId: string
    label: string
    style?: ButtonStyle
    emoji?: ComponentEmojiResolvable
}): ButtonBuilder {
    const button = new ButtonBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style)

    if (emoji) {
        button.setEmoji(emoji)
    }

    return button
}

