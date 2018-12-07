const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const { connect, Schema, model } = require('mongoose');
let { Promise } = require('mongoose');

const get_kelly_criterion = (rate, odd) => {
  rate = parseFloat(rate)/100
  odd = parseFloat(odd) - 1
  return Math.round(((rate * odd - (1 - rate))/odd) * 100) / 100
};

const get_predict_rate = (predict, home_rate, draw_rate, away_rate) => {
  switch(predict) {
    case '1':
        return home_rate;
    case 'X':
        return draw_rate;
    case '2':
        return away_rate;
  };
};

const get_time = (text) => {
  return moment.utc(text, "DD/MM/YYYY hh:mm").format('X') - 3600;
}

Promise = global.Promise;
connect('mongodb://localhost:27017/ForebetTest', { useNewUrlParser: true });

const MatchSchema = new Schema({
  forebetId:          { type: Number, required: true, unique: true },
  forebetLink:        String,
  league:             String,
  homeTeam:           String,
  awayTeam:           String,
  kickOffTime:        Number,
  forebetPredict1:    Number,
  forebetPredictX:    Number,
  forebetPredict2:    Number,
  forebetPick:        String,
  Odds:               Number,
  kellyCriterion:     Number,
  finished:           { type: Boolean, default: false },
  valueBet:           { type: Boolean, default: false },
  result:             Boolean,
  homeResult:         Number,
  awayResult:         Number
});

const Match = model('Match', MatchSchema);

const insertMatch = ( match, cb ) => {
  Match.find({forebetId: match.forebetId}, (err, docs) => {
    if (docs.length){
      cb('Match exists already',null);
    } else {
      match.save( (err) => {
        cb(err, match);
      });
    }
  });
}


request('https://www.forebet.com/en/football-tips-and-predictions-for-today', (error, response, html)=> {
  if(!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    $($('.schema')['0']).find('tbody > tr').each( (index, element) => {
      if ($(element).hasClass('fav_icon') || $(element).hasClass('tr_0') || $(element).hasClass('tr_1')) {
        const match = new Match({
          forebetId:          parseInt($(element).find('.fav_icon').attr('id')),
          forebetLink:        $(element).find('a').attr('href'),
          league:             $(element).find('.shortTag').text(),
          homeTeam:           $(element).find('.homeTeam').text(),
          awayTeam:           $(element).find('.awayTeam').text(),
          kickOffTime:        get_time($(element).find('.date_bah').text()),
          forebetPredict1:    parseInt($($(element).find('td')['1']).text()),
          forebetPredictX:    parseInt($($(element).find('td')['2']).text()),
          forebetPredict2:    parseInt($($(element).find('td')['3']).text()),
          forebetPick:        $(element).find('.predict').text(),
          Odds:               parseFloat($($(element).find('.odds2')['0']).text()),
          kellyCriterion:     get_kelly_criterion($($(element).find('td')['3']).text(),$($(element).find('.odds2')['0']).text()),
        })
        insertMatch(match, (err2, match) => {
          if (err2 || !match){
             console.log('error updated match: ', err2);
          } else {
             console.log('match updated: ', match);
          }
        });
      }
    });
  };
});
