const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  forebetId:          { type: Number, required: true, unique: true },
  forebetLink:        String,
  league:             String,
  homeTeam:           String,
  awayTeam:           String,
  kickOffTime:        Number,
  forebetPredict1:    Number,
  forebetPredictX:    Number,
  forebetPredict2:    Number,
  forebetPick:        String,
  Odds:               Number,
  kellyCriterion:     Number,
  finished:           { type: Boolean, default: false },
  valueBet:           { type: Boolean, default: false },
  forebetResult:      { type: Number, default: 0 },
  homeResult:         { type: Number, default: 0 },
  awayResult:         { type: Number, default: 0 }
});

const Match = mongoose.model('Match', MatchSchema);

module.exports = { Match };
