const { SlashCommandBuilder } = require('discord.js');
let PocketBase;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Shows your current balance."),

  async execute(interaction, client) {
      let user_id = interaction.user.id;
      if (user_id) {
        user_id = user_id.toString();
      }
      console.log(user_id)

      const module = await import('pocketbase');
      PocketBase = module.default || module;
      const pb = new PocketBase('http://127.0.0.1:8090');
      let record = null;
      let out = "0";
      try {
        record = await pb.collection('economy').getFirstListItem('user_id="' + user_id + '"', {
        });
        out = record.balance.toString();
      }
      catch {
        console.log("No record found! Creating new record...");
        const new_data = {
          "user_id": user_id,
          "balance": 0
        };
        
        const new_record = await pb.collection('economy').create(new_data);
        out = "0";
      }
      await interaction.reply('Current balance: ' + out + 'EC [EmberCoins].');
  },
};