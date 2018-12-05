const request = require('request');
const cheerio = require('cheerio');
const { connect, Schema, model } = require('mongoose');
let { Promise } = require('mongoose');

const get_kelly_criterion = (r, o) => {
  r = parseFloat(r)/100
  o = parseFloat(o) - 1
  return Math.round(((r * o - (1 - r))/o) * 100) / 100
};

const get_predict_rate = (p, hr, dr, ar) => {
  switch(p) {
    case '1':
        return hr;
    case 'X':
        return dr;
    case '2':
        return ar;
  };
};

const get_timestamp = (s) => {
  return new Date(s).getTime()/1000
}

Promise = global.Promise;
connect('mongodb://localhost:27017/ForebetTest', { useNewUrlParser: true });

const MatchSchema = new Schema({
  forebetId:          { type: Number, required: true, unique: true },
  league:             String,
  homeTeam:           String,
  awayTeam:           String,
  kickOffTime:        Date,
  forebetPredict1:    Number,
  forebetPredictX:    Number,
  forebetPredict2:    Number,
  forebetPick:        String,
  Odds:               Number,
  kellyCriterion:     Number,
  finished:           { type: Boolean, default: false },
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
          league:             $(element).find('.shortTag').text(),
          homeTeam:           $(element).find('.homeTeam').text(),
          awayTeam:           $(element).find('.awayTeam').text(),
          kickOffTime:        new Date(get_timestamp($(element).find('.date_bah').text())*1000),
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
        // console.log(index);
        // console.log($(element).find('.fav_icon').attr('id'));
        // console.log($(element).find('.shortTag').text());
        // console.log($(element).find('.homeTeam').text());
        // console.log($(element).find('.awayTeam').text());
        // console.log($(element).find('.date_bah').text());
        // console.log($($(element).find('td')['1']).text());
        // console.log($($(element).find('td')['2']).text());
        // console.log($($(element).find('td')['3']).text());
        // console.log($(element).find('.predict').text());
        // console.log($($(element).find('.odds2')['0']).text());
        // console.log(get_kelly_criterion($($(element).find('td')['3']).text(),$($(element).find('.odds2')['0']).text()))
      }
    });
  };
});
