const mongoose = require('mongoose');

// Core badges. Chapter / section badges are generated from the Section collection.
const badgeSchema = new mongoose.Schema({
  badgeId: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
  name: { type: String, required: true },
  icon: String,
  desc: String
});

module.exports = mongoose.model('Badge', badgeSchema);
