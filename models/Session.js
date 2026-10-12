const mongoose = require('mongoose');

// Login / registration history (one document per sign-in).
const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  username: String,
  event: { type: String, enum: ['register', 'login'], required: true },
  ip: String,
  userAgent: String
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('Session', sessionSchema);
