import {
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    MentionableSelectMenuBuilder
} from 'discord.js'

type SelectMenuType = 'string' | 'user' | 'role' | 'channel' | 'mentionable'

export function createSelectMenu({
    type,
    customId,
    placeholder = '',
    options
}: {
    type: SelectMenuType
    customId: string
    placeholder?: string
    options?: { label: string; value: string }[]
}):
    | StringSelectMenuBuilder
    | UserSelectMenuBuilder
    | RoleSelectMenuBuilder
    | ChannelSelectMenuBuilder
    | MentionableSelectMenuBuilder {
    switch (type) {
        case 'string': {
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(customId)
                .setPlaceholder(placeholder)

            if (options) {
                selectMenu.addOptions(options)
            }

            return selectMenu
        }
        case 'user': {
            return new UserSelectMenuBuilder()
                .setCustomId(customId)
                .setPlaceholder(placeholder)
        }
        case 'role': {
            return new RoleSelectMenuBuilder()
                .setCustomId(customId)
                .setPlaceholder(placeholder)
        }
        case 'channel': {
            return new ChannelSelectMenuBuilder()
                .setCustomId(customId)
                .setPlaceholder(placeholder)
        }
        case 'mentionable': {
            return new MentionableSelectMenuBuilder()
                .setCustomId(customId)
                .setPlaceholder(placeholder)
        }
        default:
            throw new Error('Invalid select menu type specified')
    }
}

