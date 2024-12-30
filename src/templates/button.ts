import { ButtonInteraction } from 'discord.js'

export default class Button {
    customId: string
    execute: (interaction: ButtonInteraction) => Promise<void>

    constructor(object: {
        customId: string
        execute: (interaction: ButtonInteraction) => Promise<void>
    }) {
        this.customId = object.customId
        this.execute = object.execute
    }
}

