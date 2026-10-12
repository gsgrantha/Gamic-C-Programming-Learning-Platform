const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: String,
  min: { type: Number, required: true, unique: true }   // XP needed to enter the league
});

module.exports = mongoose.model('League', leagueSchema);
