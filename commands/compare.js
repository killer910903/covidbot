const Discord = require('discord.js');
const StatRequest = require('../utils/StatRequest');

const getStatusErrorMessage = (country) => `I was unable to retrieve the current status for ${country}`;

const getComparison = (country1, country2) => {
  const closedCases1 = parseFloat(country1.deaths) + parseFloat(country1.recovered);
  const closedCases2 = parseFloat(country2.deaths) + parseFloat(country2.recovered);

  return new Discord.MessageEmbed()
    .setTitle(`COVID19 comparison between ${country1.country} and ${country2.country}`)
    .addFields(
      {
        name: '\u200B',
        value: 'Total cases\nActive cases\nClosed cases\nDeaths\nRecovered',
        inline: true,
      },
      {
        name: country1.country,
        value: `${country1.cases}\n${parseFloat(country1.cases) - closedCases1}\n${closedCases1}\n${country1.deaths} (${((parseFloat(country1.deaths) / closedCases1) * 100).toFixed(2)}%)\n${country1.recovered} (${((parseFloat(country1.recovered) / closedCases1) * 100).toFixed(2)}%)`,
        inline: true,
      },
      {
        name: country2.country,
        value: `${country2.cases}\n${parseFloat(country2.cases) - closedCases2}\n${closedCases2}\n${country2.deaths} (${((parseFloat(country2.deaths) / closedCases2) * 100).toFixed(2)}%)\n${country2.recovered} (${((parseFloat(country2.recovered) / closedCases2) * 100).toFixed(2)}%)`,
        inline: true,
      },
    )
    .setTimestamp()
    .setFooter('Brought to you by CovidBot');
};

module.exports = {
  name: 'compare',
  description: 'Compare the statistics of two countries',
  execute(message, args) {
    if (!args || args.length === 0) {
      message.channel.send('Please specify the countries that you\'d like to compare');
      return;
    }
    if (args.length < 2) {
      message.channel.send('Please specify two countries');
      return;
    }

    if (args[0].toUpperCase() === args[1].toUpperCase()) {
      message.channel.send('Please specify two unique countries');
      return;
    }

    StatRequest.getByCountry(args[0].toUpperCase())
      .then((country1Response) => {
        StatRequest.getByCountry(args[1].toUpperCase())
          .then((country2Response) => {
            message.channel.send(getComparison(country1Response, country2Response));
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
            message.channel.send(getStatusErrorMessage(args[1]));
          });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        message.channel.send(getStatusErrorMessage(args[0]));
      });
  },
};
