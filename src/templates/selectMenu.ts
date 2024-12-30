import {
    StringSelectMenuInteraction,
    UserSelectMenuInteraction,
    RoleSelectMenuInteraction,
    ChannelSelectMenuInteraction,
    MentionableSelectMenuInteraction,
} from 'discord.js'

export type SelectMenuInteractionType =
    | StringSelectMenuInteraction
    | UserSelectMenuInteraction
    | RoleSelectMenuInteraction
    | ChannelSelectMenuInteraction
    | MentionableSelectMenuInteraction

export default class SelectMenu<T extends SelectMenuInteractionType> {
    customId: string
    execute: (interaction: T) => Promise<void>

    constructor({
        customId,
        execute
    }: {
        customId: string
        execute: (interaction: T) => Promise<void>
    }) {
        this.customId = customId
        this.execute = execute
    }
}

