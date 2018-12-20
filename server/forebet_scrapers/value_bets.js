const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const { Match } = require('../models/match');
const { FOREBET_DOMAIN, get_kelly_criterion, get_predict_rate, get_time } = require('./forbet_scraper_utilities');

const VALUE_BETS = '/en/value-bets';

const insertMatch = ( match, cb ) => {
  Match.find({forebetId: match.forebetId}, (err, docs) => {
    if (docs.length){
      cb(`already exist: ${match.forebetLink}`, null);
    } else {
      match.save( (err) => {
        cb(err, match);
      });
    }
  });
}

const value_bets_scrap = ( cb ) => {
  request(FOREBET_DOMAIN + VALUE_BETS, (error, response, html)=> {
   if(!error && response.statusCode == 200) {
     console.log( `scraping time : ${moment(new Date()).local()}`);
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
           homeWinPredict:     parseInt($($(element).find('td')['1']).text()),
           drawPredict:        parseInt($($(element).find('td')['2']).text()),
           awayWinPredict:     parseInt($($(element).find('td')['3']).text()),
           forebetPick:        $(element).find('.predict').text(),
           Odds:               parseFloat($($(element).find('.odds2')['0']).text())
         });
         match.kellyCriterion = get_kelly_criterion(get_predict_rate(match.forebetPick, match.homeWinPredict, match.drawPredict, match.awayWinPredict), match.Odds);
         insertMatch(match, (link, match) => {
           console.log('-------------------------------------------');
           if (link || !match){
              console.log('error updated match: ', link);
           } else {
              console.log('match updated: ', match);
           }
           console.log('-------------------------------------------');
         });
       }
     });
   };

   if(error){
     cb({'res':'not ok'})
   } else {
     cb({'res':'ok'})
   }
  });
};


module.exports = { value_bets_scrap }
