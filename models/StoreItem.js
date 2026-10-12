const mongoose = require('mongoose');

// One document per store product (boosters, avatars, themes, frames). Edit prices in Atlas – no code change needed.
const storeItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
  type: { type: String, enum: ['booster', 'avatar', 'theme', 'frame'], required: true },
  name: { type: String, required: true },
  icon: String,
  value: String,            // what gets equipped (emoji / theme key / frame key)
  price: { type: Number, default: 0 },
  desc: String
});

module.exports = mongoose.model('StoreItem', storeItemSchema);
