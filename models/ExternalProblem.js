const mongoose = require('mongoose');

// Practice problems that live on other sites (LeetCode, Codeforces, HackerRank, Beecrowd) – links only.
const externalSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },   // "platform:id"
  order: { type: Number, default: 0 },
  platform: { type: String, required: true, index: true },
  platformName: String,
  extId: String,
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Advanced'] },
  href: { type: String, required: true }
});

module.exports = mongoose.model('ExternalProblem', externalSchema);
