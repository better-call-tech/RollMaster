import { UserSelectMenuInteraction } from 'discord.js';
import SelectMenu from '../templates/selectMenu.ts';

export default new SelectMenu<UserSelectMenuInteraction>({
  customId: 'userSelect',
  async execute(interaction: UserSelectMenuInteraction) {
    const selectedUser = interaction.values[0];
    await interaction.reply({
      content: `You selected the user: <@${selectedUser}>`,
      ephemeral: true,
    });
  },
});