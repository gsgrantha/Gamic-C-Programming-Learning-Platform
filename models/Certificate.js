const mongoose = require('mongoose');

// One document per issued certificate. The certId is public and can be verified by anyone.
const certificateSchema = new mongoose.Schema({
  certId: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  username: { type: String, required: true },                 // snapshot at issue time
  kind: { type: String, enum: ['section', 'course'], required: true },
  sectionOrder: { type: Number, default: 0 },                 // 0 for the full-course certificate
  title: { type: String, required: true },
  icon: String,
  issuedAt: { type: Date, default: Date.now }
});
certificateSchema.index({ user: 1, kind: 1, sectionOrder: 1 }, { unique: true }); // never issue twice

module.exports = mongoose.model('Certificate', certificateSchema);
