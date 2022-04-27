module.exports = {
  name: 'help',
  description: 'Read the help documentation',
  execute(message, args) {
    if (args.length > 0) return;
    message.channel.send(
      'Available commands:\n'
      + '```'
      + '/help : See the help documentation\n'
      + '/stats (country) : Get the latest COVID19 statistics. By default, the following countries will be listed: US, GB, FR, DE, BE, NL\n'
      + '/compare (country1) (country2) : Compare the statistics of two countries\n\n'
      + 'Example usage:\n'
      + '"/stats GB"\n'
      + '"/compare GB US"```',
    );
  },
};
