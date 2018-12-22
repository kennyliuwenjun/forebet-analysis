const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  forebetId:          { type: Number, required: true, unique: true },
  forebetLink:        String,
  league:             String,
  homeTeam:           String,
  awayTeam:           String,
  kickOffTime:        Number,
  homeWinPredict:     Number,
  drawPredict:        Number,
  awayWinPredict:     Number,
  forebetPick:        String,
  Odds:               Number,
  kellyCriterion:     Number,
  valueBet:           { type: Boolean, default: false },
  resultStatus:       { type: Number, default: 0 },  //0: not start, 1: predcit win, 2: precit lost, 3: match cancelled
  homeResult:         { type: Number, default: 0 },
  awayResult:         { type: Number, default: 0 },
  betPlaced:          { type: Boolean, default: false }
});

const Match = mongoose.model('Match', MatchSchema);

module.exports = { Match };
