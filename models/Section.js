const mongoose = require('mongoose');

// A Section holds chapters; each chapter holds items (lesson / challenge / debug / recap / final / project).
// Items have different shapes, so Mixed is used on purpose.
const sectionSchema = new mongoose.Schema({
  order: { type: Number, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  icon: String,
  description: String,
  chapters: [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model('Section', sectionSchema);
