const mongoose = require('mongoose');

// Audit log: every attempt a player makes (lesson answer, challenge or practice-problem submission).
const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  username: String,
  activityId: { type: String, required: true, index: true },
  kind: { type: String, enum: ['lesson', 'challenge', 'problem'] },
  correct: { type: Boolean, default: false },
  code: { type: String, maxlength: 20000 },          // submitted source (code activities only)
  question: Number,                                  // lesson question index
  answer: Number,                                    // lesson option chosen
  compileError: { type: Boolean, default: false },
  xpAwarded: { type: Number, default: 0 }
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('Submission', submissionSchema);
