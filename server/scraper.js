const request = require('request');
const cheerio = require('cheerio');

request('https://www.forebet.com/en/football-tips-and-predictions-for-today', (error, response, html)=> {
  if(!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    $('.schema').find('tbody > tr').each( (index, element) => {
      if ($(element).hasClass('tr_0') || $(element).hasClass('tr_1')) {
        console.log(index);
        console.log($(element).find('.homeTeam').text());
      }
    });
  };
});
