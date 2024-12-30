import { ModalSubmitInteraction } from 'discord.js'

export default class Modal {
    customId: string
    execute: (interaction: ModalSubmitInteraction) => Promise<void>

    constructor(object: {
        customId: string
        execute: (interaction: ModalSubmitInteraction) => Promise<void>
    }) {
        this.customId = object.customId
        this.execute = object.execute
    }
}

