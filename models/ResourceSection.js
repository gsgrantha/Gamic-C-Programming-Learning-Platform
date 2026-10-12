const mongoose = require('mongoose');

// Learning-resources page (W3Schools links). order 0 = the "Practice & reference" block.
const resourceSchema = new mongoose.Schema({
  order: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  icon: String,
  groups: [{
    _id: false,
    title: String,
    icon: String,
    chapters: [String],                    // GamiC chapter ids this group belongs to
    links: [{ _id: false, title: String, file: String }]
  }]
});

module.exports = mongoose.model('ResourceSection', resourceSchema);
