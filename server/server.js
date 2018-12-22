const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const promiseRequest = require('request-promise');
const cheerio = require('cheerio');
const { mongoose } = require('./db/mongoose');
const { Match } = require('./models/match');
const { value_bets_scrap } = require('./forebet_scrapers/value_bets');
const { getMatches } = require('./forebet_scrapers/match_result');

const app = express();

app.use(bodyParser.json());

app.post('/fetch_value_bet_matches', async (req ,res) => {
  console.log(`fetch_value_bet_matches:${new Date()}`);
  const result = await value_bets_scrap()
  res.send(result);
});


app.post('/fetch_match_result', (req ,res) => {
  console.log(`fetch_match_result:${new Date()}`);
  Match.find({
    resultStatus: 0
  }).then(async matches => {
    const promises = matches.map(async (match,i) => {
      return getMatches(match,i);
    })
    const results = await Promise.all(promises);
    res.send(results);
  })
});

cron.schedule('*/1 * * * * *', () => {
  console.log('running a task every minute');
});


app.listen(3000, () => {
  console.log('Server on port 3000');
})
