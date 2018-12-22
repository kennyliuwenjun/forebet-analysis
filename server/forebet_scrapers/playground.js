// const request = require('request-promise');
// const cheerio = require('cheerio');
// // const { mongoose } = require('../db/mongoose');
// const { Match } = require('../models/match');
// const { FOREBET_DOMAIN, getForebetResult } = require('./forbet_scraper_utilities');
//
// async function aaaaa(){
//   const matches = ['/en/predictions-tips-novara-olbia-calcio-871445','/en/predictions-tips-fc-crotone-venezia-fc-843690']
//   const promises = matches.map(async (match,i) => {
//     const res = await request(encodeURI('https://www.forebet.com' + match));
//     return res;
//   })
//   const aaa = await Promise.all(promises);
//   console.log(aaa)
// }
// aaaaa()
// Match.find({finished:true}).sort({kickOffTime: 1}).then((matches)=>{
//   matches.map((match)=>{
//     match.finished = false;
//     match.save();
//   })
// })
let time = 1545307200000
let chinaOffSet = 60*60*3*1000
// time -= chinaOffSet
for (let i = 0; i < 100; i++) {
  console.log('------------')
  console.log(new Date(time).toLocaleString());
  time+=25200000
  console.log(new Date(time).toLocaleString())
  time+=43200000
}
