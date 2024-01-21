const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

function generateCoords() {
  region = process.env.REGION;
  let solarSystemIndex = parseInt((Math.random() * 122).toString(), 16);
  if(solarSystemIndex < 100) {
    if(solarSystemIndex < 10) {
      solarSystemIndex = '00' + solarSystemIndex.toString();
    }
    else {
      solarSystemIndex = '0' + solarSystemIndex.toString();
    }
  }
  else {
    solarSystemIndex = solarSystemIndex.toString()
  }
  return '0' + solarSystemIndex + region;
};
    
module.exports = {
  data: new SlashCommandBuilder()
    .setName('mission')
    .setDescription('Creates a mission.'),

  async execute(interaction, client) {

    await interaction.reply('Creating mission thread...');

    const thread_channel = await client.channels.fetch('1198245626564055170').catch(console.error);
    const coords = generateCoords();

    const thread = await thread_channel.threads.create({
      name: 'Exploration Mission',
      reason: 'Mission thread.',
    });

    if (thread.joinable) await thread.join();

    const id = '1198239622380134432';

    await thread.send({
      content: 'Mission: Fully discover and name the following star system: ' + coords + '. Upload a screenshot and mention an admin to complete the mission. XP Reward: 100.',
    });
  },
};