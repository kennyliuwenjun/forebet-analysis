const request = require('request');
const promiseRequest = require('request-promise');
const cheerio = require('cheerio');
// const CircularJSON = require('circular-json');
const moment = require('moment');
const { Match } = require('../models/match');
const { FOREBET_DOMAIN, get_kelly_criterion, get_predict_rate, get_time } = require('./forbet_scraper_utilities');

const VALUE_BETS = '/en/value-bets';


const recursiveObjectPromiseAll = function (obj) {
  const keys = Object.keys(obj);
  return Promise.all(keys.map(key => {
    const value = obj[key];
    // Promise.resolve(value) !== value should work, but !value.then always works
    if (typeof value === 'object' && !value.then) {
      return recursiveObjectPromiseAll(value);
    }
    return value;
  }))
    .then(result => zipObject(keys, result));
};

async function value_bets_scrap() {
  const html =  await promiseRequest(FOREBET_DOMAIN + VALUE_BETS)
  const $ = cheerio.load(html);
  const tableArray = Object.values($($('.schema')['0']).find('tbody > tr'));
  const promises =  tableArray.map(async (element)=>{
    if ($(element).hasClass('fav_icon') || $(element).hasClass('tr_0') || $(element).hasClass('tr_1')) {
      let match = new Match({
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
      match.kellyCriterion = get_kelly_criterion(get_predict_rate(match), match.Odds);
      const matches = await Match.find({forebetId: match.forebetId})
      if (matches.length){
        return `Match already exist: ${match.forebetLink}. ${new Date(match.kickOffTime*1000).toLocaleString()}`
      } else {
        match = await match.save()
        return `Match saved: ${match.forebetLink}. ${new Date(match.kickOffTime*1000).toLocaleString()}`
      }
    }
  });
  const results = (await Promise.all(promises)).filter(function (el) {
    return el != null;
  });
  return results;
};


module.exports = { value_bets_scrap }
