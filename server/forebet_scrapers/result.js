// const { mongoose } = require('../db/mongoose');
// const { Match } = require('../models/match');
//
// let kellyResult = 0;
// let flatResult = 0;
// const bet = 1;

cron.schedule('*/1 * * * * *', () => {
  console.log('running a task every minute');
});

// Match.find({
//   betPlaced: true
// }).then((matches) => {
//   matches.map((match, index)=>{
//     if(match.resultStatus == 1){
//       kellyResult += bet * match.kellyCriterion*match.Odds-bet * match.kellyCriterion;
//       flatResult += bet*(match.Odds-1)
//     } else if (match.resultStatus == 2){
//       kellyResult -= bet * match.kellyCriterion
//       flatResult -= bet
//     }
//   })
//   console.log(`kellyResult:${kellyResult}`)
//   console.log(`flatResult:${flatResult}`)
//   mongoose.connection.close();
// });
// let time = new Date().
// for (var i = 0; i < 100; i++) {
//   array[i]
// }
