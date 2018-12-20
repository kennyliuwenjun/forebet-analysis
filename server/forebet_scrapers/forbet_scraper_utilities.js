const moment = require('moment');

const FOREBET_DOMAIN = 'https://www.forebet.com';

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
};

const getForebetResult = (match) => {
  switch (match.forebetPick) {
    case '1':
      match.forebetResult = match.homeResult > match.awayResult ? 1 : 2;
      break;
    case 'X':
      match.forebetResult = match.homeResult == match.awayResult ? 1 : 2;
      break;
    case '2':
      match.forebetResult = match.homeResult < match.awayResult ? 1 : 2;
      break;
  }
}

module.exports = { FOREBET_DOMAIN, get_kelly_criterion, get_predict_rate, get_time, getForebetResult };
