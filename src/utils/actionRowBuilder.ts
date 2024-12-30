import { ActionRowBuilder, ButtonBuilder } from 'discord.js'

export function createActionRows(buttons: ButtonBuilder[]) {
    const actionRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(buttons)
    
    return actionRow
}
  

