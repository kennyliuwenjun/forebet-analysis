const moment = require('moment');

const FOREBET_DOMAIN = 'https://www.forebet.com';

const get_kelly_criterion = (rate, odd) => {
  rate = parseFloat(rate)/100
  odd = parseFloat(odd) - 1
  return Math.round(((rate * odd - (1 - rate))/odd) * 100) / 100
};

function get_predict_rate(match){
  switch(match.forebetPick) {
    case '1':
        return match.homeWinPredict;
    case 'X':
        return match.drawPredict;
    case '2':
        return match.awayWinPredict;
  };
};

const get_time = (text) => {
  return moment.utc(text, "DD/MM/YYYY hh:mm").format('X') - 3600;
};

const getForebetResult = (match) => {
  switch (match.forebetPick) {
    case '1':
      match.resultStatus = match.homeResult > match.awayResult ? 1 : 2;
      break;
    case 'X':
      match.resultStatus = match.homeResult == match.awayResult ? 1 : 2;
      break;
    case '2':
      match.resultStatus = match.homeResult < match.awayResult ? 1 : 2;
      break;
  }
}

module.exports = { FOREBET_DOMAIN, get_kelly_criterion, get_predict_rate, get_time, getForebetResult };
