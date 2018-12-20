const promiseRequest = require('request-promise');
const cheerio = require('cheerio');
const { FOREBET_DOMAIN, getForebetResult } = require('./forbet_scraper_utilities');

async function getMatches( match ){
  const html = await promiseRequest(encodeURI(FOREBET_DOMAIN + match.forebetLink))
  const $ = cheerio.load(html);
  const element = $($('.schema')['0']).find('tbody > tr')[3];
  if ($(element).hasClass('fav_icon') || $(element).hasClass('tr_0') || $(element).hasClass('tr_1')) {
    if ($(element).find('.scoreLnk').text().trim() == 'FT') {
      match.finished = true
      match.homeResult = $(element).find('.lscrsp').text().trim()[0];
      match.awayResult = $(element).find('.lscrsp').text().trim()[4];
      getForebetResult(match);
      match = await match.save();
      return `Match saved ${match.forebetResult}:${match.forebetLink}`
    } else if ($(element).find('.lmin_td').text().trim() == 'Aban.' || $(element).find('.lmin_td').text().trim() == 'Postp.'){
      match = await match.remove()
      return `Match removed: ${match.forebetLink}`
    } else {
      return `Match not finished: ${match.forebetLink}`
    }
  }
};

module.exports = { getMatches }
