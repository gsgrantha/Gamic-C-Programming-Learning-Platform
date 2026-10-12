const mongoose = require('mongoose');

// Daily pool, weekly missions and one-time quests.
// "metric" tells the server what to count (xp, lessons, challenges, problems, questions, days,
// activitiesDone, level, bestStreak, problemsDone, badgeCount).
const missionSchema = new mongoose.Schema({
  missionId: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
  scope: { type: String, enum: ['daily', 'weekly', 'quest'], required: true },
  title: { type: String, required: true },
  icon: String,
  metric: { type: String, required: true },
  target: { type: Number, required: true },
  reward: { type: Number, required: true }
});

module.exports = mongoose.model('Mission', missionSchema);
