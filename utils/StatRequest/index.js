const https = require('https');
const config = require('../../config.json');

const getByCountry = (country) => new Promise((resolve, reject) => {
  const selectedCountry = country && country.length > 0 ? country : '';
  const url = `${config.covidApi.status}${selectedCountry}`;

  https.get(url, (res) => {
    let body = '';

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (json && json.error) return reject(json);
        return resolve(json);
      } catch (error) {
        return reject(error);
      }
    });
  })
    .on('error', (error) => reject(error));
});

module.exports = {
  getByCountry,
};
