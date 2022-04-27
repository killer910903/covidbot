const config = require('../config.json');

module.exports = {
  name: 'about',
  description: 'Read more about this bot',
  execute(message) {
    message.channel.send(`This bot was created by ${config.author.name}${config.author.url ? `\n${config.author.url}` : ''}`);
  },
};
