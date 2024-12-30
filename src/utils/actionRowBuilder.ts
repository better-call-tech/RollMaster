import {
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    MentionableSelectMenuBuilder,
  } from 'discord.js';
  
  // Define all allowed component types
  type AllowedComponent =
    | ButtonBuilder
    | StringSelectMenuBuilder
    | UserSelectMenuBuilder
    | RoleSelectMenuBuilder
    | ChannelSelectMenuBuilder
    | MentionableSelectMenuBuilder;
  
  export function createActionRows(components: AllowedComponent[]): ActionRowBuilder<AllowedComponent>[] {
    const rows: ActionRowBuilder<AllowedComponent>[] = [];
    let currentRow = new ActionRowBuilder<AllowedComponent>();
  
    components.forEach((component, index) => {
      if (currentRow.components.length < 5) {
        currentRow.addComponents(component);
      } else {
        rows.push(currentRow);
        currentRow = new ActionRowBuilder<AllowedComponent>().addComponents(component);
      }

      if (index === components.length - 1) {
        rows.push(currentRow);
      }
    });
  
    return rows;
  }
  

