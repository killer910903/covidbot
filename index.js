const Discord = require('discord.js');
const process = require('process');
const fs = require('fs');

const client = new Discord.Client();
const config = require('./config.json');

client.commands = new Discord.Collection();
fs.readdirSync('./commands')
  .filter((file) => file.endsWith('.js'))
  .forEach((file) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  });

client.once('ready', () => {
  // eslint-disable-next-line no-console
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity('/help for help');
});

client.on('message', (message) => {
  if (!message.content.startsWith(config.discord.commandPrefix) || message.author.bot) return;

  const args = message.content.slice(config.discord.commandPrefix.length)
    .trim()
    .split(/ +/);
  const command = args.shift()
    .toLowerCase();

  const toExecute = client.commands.get(command);
  if (toExecute && toExecute.execute) {
    toExecute.execute(message, args);
  }
});

client.login(process.env.DISCORD_TOKEN)
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
