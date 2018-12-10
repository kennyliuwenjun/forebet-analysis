const request = require('request');
const cheerio = require('cheerio');
const { Match } = require('../models/match');
const { get_kelly_criterion, get_time } = require('./forbet_scraper_utilities');

const insertMatch = ( match, cb ) => {
  Match.find({forebetId: match.forebetId}, (err, docs) => {
    if (docs.length){
      cb('Match exists already', null);
    } else {
      match.save( (err) => {
        cb(err, match);
      });
    }
  });
}

const today_matches_scrap = () => {
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
           console.log('-------------------------------------------');
           if (err2 || !match){
              console.log('error updated match: ', err2);
           } else {
              console.log('match updated: ', match);
           }
           console.log('-------------------------------------------');
         });
       }
     });
   };
  });
};


module.exports = { today_matches_scrap }
