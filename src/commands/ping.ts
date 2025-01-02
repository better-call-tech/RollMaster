import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from 'discord.js'
import Command from '../templates/command.ts'

export default new Command({
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    async execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({ content: 'Pong!', ephemeral: true })
    }
})
