import { ColorResolvable, EmbedBuilder, EmbedField } from 'discord.js'

type EmbedOptions = {
    title?: string
    description?: string
    color?: ColorResolvable
    fields?: EmbedField[]
    footer?: string
    image?: string
    thumbnail?: string
    timestamp?: boolean
}

export function createEmbed({
    title,
    description,
    color = '#5865F2',
    fields = [],
    footer,
    image,
    thumbnail,
    timestamp = false
}: EmbedOptions): EmbedBuilder {
    const embed = new EmbedBuilder().setColor(color)

    if (title) embed.setTitle(title)
    if (description) embed.setDescription(description)
    if (fields.length) embed.addFields(fields)
    if (footer) embed.setFooter({ text: footer })
    if (image) embed.setImage(image)
    if (thumbnail) embed.setThumbnail(thumbnail)
    if (timestamp) embed.setTimestamp()

    return embed
}

