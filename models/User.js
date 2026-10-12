const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  activityId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  solved: { type: [Number], default: [] }, // lesson questions answered correctly
  wrong: { type: Number, default: 0 },     // wrong answers (for the perfect-lesson badge)
  completedAt: Date
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 20, match: /^[a-zA-Z0-9_]+$/ },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  xp: { type: Number, default: 0, index: -1 },
  streak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: null }, // YYYY-MM-DD (UTC)
  badges: [{ _id: false, id: String, earnedAt: { type: Date, default: Date.now } }],
  progress: [progressSchema],

  // --- economy / customisation ---
  coins: { type: Number, default: 0 },
  streakFreezes: { type: Number, default: 0 },
  boostUntil: { type: Date, default: null },
  avatar: { type: String, default: '😎' },
  theme: { type: String, default: 'default' },
  frame: { type: String, default: 'none' },
  owned: { type: [String], default: [] },

  // --- other-platform practice: keys of ExternalProblem the player ticked as done ---
  externalDone: { type: [String], default: [] },

  // --- account activity ---
  lastLoginAt: { type: Date, default: null },
  loginCount: { type: Number, default: 0 },

  // --- missions & activity tracking ---
  claimed: { type: [String], default: [] },       // "missionId:period"
  activityDays: { type: [String], default: [] },  // YYYY-MM-DD, last 120
  daily: {
    date: String,
    xp: { type: Number, default: 0 }, lessons: { type: Number, default: 0 }, challenges: { type: Number, default: 0 },
    problems: { type: Number, default: 0 }, questions: { type: Number, default: 0 }
  },
  weekly: {
    week: String,                                  // Monday of the week, YYYY-MM-DD
    xp: { type: Number, default: 0, index: -1 }, lessons: { type: Number, default: 0 }, challenges: { type: Number, default: 0 },
    problems: { type: Number, default: 0 }, questions: { type: Number, default: 0 }, days: { type: [String], default: [] }
  }
}, { timestamps: true });

userSchema.virtual('level').get(function () { return Math.floor(this.xp / 100) + 1; });

userSchema.methods.getProgress = function (activityId) {
  return this.progress.find((p) => p.activityId === activityId);
};

/** The streak as it stands today: a broken streak shows 0 even before the next activity resets it. */
userSchema.methods.liveStreak = function () {
  if (!this.lastActiveDate) return 0;
  const gap = Math.round((Date.parse(new Date().toISOString().slice(0, 10)) - Date.parse(this.lastActiveDate)) / 86400000);
  return gap <= 1 || gap - 1 <= (this.streakFreezes || 0) ? this.streak : 0;
};

userSchema.methods.toPublic = function () {
  return {
    id: this._id, username: this.username, email: this.email, xp: this.xp,
    level: Math.floor(this.xp / 100) + 1, xpIntoLevel: this.xp % 100,
    streak: this.liveStreak(), bestStreak: this.bestStreak, badges: this.badges, createdAt: this.createdAt,
    coins: this.coins, streakFreezes: this.streakFreezes, avatar: this.avatar, theme: this.theme, frame: this.frame,
    owned: this.owned, boostUntil: this.boostUntil, boostActive: !!(this.boostUntil && this.boostUntil > new Date())
  };
};

module.exports = mongoose.model('User', userSchema);
