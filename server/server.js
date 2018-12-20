const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const promiseRequest = require('request-promise');
const cheerio = require('cheerio');
const { mongoose } = require('./db/mongoose');
const { Match } = require('./models/match');
const { value_bets_scrap } = require('./forebet_scrapers/value_bets');
const { getMatches } = require('./forebet_scrapers/match_result');

const app = express();

app.use(bodyParser.json());

app.post('/fetch_value_bet_matches', (req ,res) => {
  value_bets_scrap((results)=> {
    res.send(results)
  });
});


app.post('/fetch_match_result', (req ,res) => {
  console.log(`fetch_match_result:${new Date()}`);
  Match.find({
    finished: false
  }).then(async matches => {
    const promises = matches.map(async (match,i) => {
      return getMatches(match,i);
    })
    const results = await Promise.all(promises);
    res.send(results);
  })
});


app.listen(3000, () => {
  console.log('Server on port 3000');
})
