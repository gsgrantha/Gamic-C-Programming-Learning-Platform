const mongoose = require('mongoose');

// "Coding Problems" practice track (Easy / Medium / Hard) — open to everyone, no unlock order
const problemSchema = new mongoose.Schema({
  pid: { type: String, required: true, unique: true },
  order: Number,
  needs: String,                                    // chapter id the problem is built on (see seed/prereq.js)
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Advanced'] },
  title: String,
  brief: String,
  hint: String,
  starter: String,
  solution: String,
  tests: [{ _id: false, stdin: String, stdout: String }],
  xp: { type: Number, default: 20 }
});

module.exports = mongoose.model('Problem', problemSchema);
