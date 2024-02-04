const { SlashCommandBuilder } = require('discord.js');
let PocketBase;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("transfer")
    .setDescription("Transfer money to another user.")
    .addUserOption(option => 
        option.setName('player')
            .setDescription('Select a player')
            .setRequired(true))
    .addIntegerOption(option => 
        option.setName('amount')
            .setDescription('Enter a number')
            .setRequired(true)),

  async execute(interaction, client) {
      const player = interaction.options.getUser('player');
      const amount = interaction.options.getInteger('amount');
      let user_id = interaction.user.id;
      if (user_id) {
        user_id = user_id.toString();
      }
      const recipient_id = player.id.toString();
      console.log(recipient_id);

      const module = await import('pocketbase');
      PocketBase = module.default || module;
      const pb = new PocketBase('http://127.0.0.1:8090');
      let in_debt = false;
      try {
        const record_a = await pb.collection('economy').getFirstListItem('user_id="' + user_id + '"', {
        });
        const db_id_a = record_a.id;
        const data_a = {
            "user_id": user_id,
            "balance": record_a.balance - amount
        };
        if (!record_a.balance || record_a.balance - amount <= 0) {
          in_debt = true;
        }
        else {
          const new_record_a = await pb.collection('economy').update(db_id_a, data_a);
        }
      }
      catch {
        console.log("No record found! Creating new record...");
        const new_data_a = {
          "user_id": user_id,
          "balance": 0
        };
        
        const new_record_a = await pb.collection('economy').create(new_data_a);
        in_debt = true;
        out = "0";
      }
      try {
        const record_b = await pb.collection('economy').getFirstListItem('user_id="' + recipient_id + '"', {
        });
        const db_id_b = record_b.id;
        const data_b = {
            "user_id": recipient_id,
            "balance": record_b.balance + amount
        };
        if (in_debt == false) {
          console.log("Not in debt");
          const new_record_b = await pb.collection('economy').update(db_id_b, data_b);
          console.log("Transaction done");
          await interaction.reply("Transaction successful!");
        }
        else {
          await interaction.reply("You don't have enough EC! Use '/balance' to see your balance.");
        }
      }
      catch {
        console.log("No record found! Creating new record...");
        const new_data_b = {
          "user_id": recipient_id,
          "balance": amount
        };

        if (in_debt == false) {
          const new_record_b = await pb.collection('economy').create(new_data_b);
          await interaction.reply("Transaction successful!");
        }
        else {
          await interaction.reply("You don't have enough EC! Use '/balance' to see your balance.");
        }
        out = "0";
      }
  },
};