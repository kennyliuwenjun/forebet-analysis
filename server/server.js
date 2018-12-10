const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Match } = require('./models/match');
const { today_matches_scrap } = require('./forebet_scrapers/today_matches');

const app = express();

app.use(bodyParser.json());

app.post('/aaa', (req ,res) => {
  today_matches_scrap();
});

app.listen(3000, () => {
  console.log('Server on port 3000');
})
