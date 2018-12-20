const { mongoose } = require('../db/mongoose');
const { Match } = require('../models/match');

let kellyResult = 0;
let flatResult = 0;
const bet = 1;

Match.find({
  finished: true
}).then((matches) => {
  matches.map((match, index)=>{
    if(match.forebetResult == 1){
      console.log(flatResult)
      kellyResult += bet * match.kellyCriterion*(match.Odds-1);
      flatResult += bet*(match.Odds-1)
    } else if (match.forebetResult == 2){
      console.log(`${index} lose:1`)
      kellyResult -= bet * match.kellyCriterion
      flatResult -= bet
    }
  })
  console.log(`kellyResult:${kellyResult}`)
  console.log(`flatResult:${flatResult}`)
  mongoose.connection.close();
});
// let time = new Date().
// for (var i = 0; i < 100; i++) {
//   array[i]
// }
