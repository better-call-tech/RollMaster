import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

/**
 * Represents a Command
 */
export default class Command {
    data: SlashCommandBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>

    /**
     * @param {{
     *   data: SlashCommandBuilder,
     *   execute: (interaction: ChatInputCommandInteraction) => Promise<void>
     * }} object
     */
    constructor(object: {
        data: SlashCommandBuilder
        execute: (interaction: ChatInputCommandInteraction) => Promise<void>
    }) {
        this.data = object.data
        this.execute = object.execute
    }
}

