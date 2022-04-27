const Discord = require('discord.js');
const StatRequest = require('../utils/StatRequest');

const getComparison = (country) => {
  const closedCases = parseFloat(country.deaths) + parseFloat(country.recovered);
  return new Discord.MessageEmbed()
    .setTitle(`COVID19 statistics for ${country.country}`)
    .addFields(
      {
        name: '\u200B',
        value: 'Total cases\nActive cases\nClosed cases\nDeaths\nRecovered',
        inline: true,
      },
      {
        name: '\u200B',
        value: `${country.cases}\n${parseFloat(country.cases) - closedCases}\n${closedCases}\n${country.deaths} (${((parseFloat(country.deaths) / closedCases) * 100).toFixed(2)}%)\n${country.recovered} (${((parseFloat(country.recovered) / closedCases) * 100).toFixed(2)}%)`,
        inline: true,
      },
    )
    .setTimestamp()
    .setFooter('Brought to you by CovidBot');
};

module.exports = {
  name: 'stats',
  description: 'Retrieve COVID19 stats',
  execute(message, args) {
    const selectedCountry = args && args.length > 0 && args[0].length > 0
      ? args[0].toUpperCase()
      : null;

    StatRequest.getByCountry(selectedCountry)
      .then((res) => {
        if (Array.isArray(res)) {
          const statsMessage = res
            .filter((item) => ['US', 'GB', 'FR', 'DE', 'BE', 'NL'].includes(item.country))
            .map((item) => getComparison(item));
          message.channel.send(statsMessage);
        } else {
          const statsMessage = getComparison(res);
          message.channel.send(statsMessage);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        message.channel.send(`I was unable to retrieve the current status${args && args.length > 0 && args[0].length > 0 ? ` for ${args[0]}` : ''}`);
      });
  },
};
