const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows help page."),

  async execute(interaction, client) {
    await interaction.reply('/help: Displays help page.\n/mission: Generates a new mission.\n/balance: Shows your balance.\n/transfer [player] [amount]: Transfer EC to another player.');
  },
};