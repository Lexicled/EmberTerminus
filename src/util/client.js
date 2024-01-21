const { Collection } = require('discord.js');

require('dotenv').config();

module.exports = (client) => {

  require('./eventLoader')(client);

  client.commands = new Collection();

  client.login(process.env.TOKEN);
};