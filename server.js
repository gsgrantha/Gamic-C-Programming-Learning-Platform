require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const seed = require('./seed/seed');
const { seedCatalogs } = require('./seed/catalogs');
const catalog = require('./services/catalog');
const Section = require('./models/Section');

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is missing. Copy .env.example to .env first.');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '50kb' }));

// ---- API ----
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many attempts. Please wait a few minutes.' } });
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api', require('./routes/course'));
app.use('/api/missions', require('./routes/missions'));
app.use('/api/store', require('./routes/store'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api', require('./routes/social'));
app.use('/api', require('./routes/catalog'));
app.get('/api/health', (req, res) => res.json({ ok: true, name: 'GamiC' }));
app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));

// ---- Front-end (static) ----
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ---- Error handler ----
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' });
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    if ((await Section.countDocuments()) === 0) {
      const r = await seed();
      console.log(`🌱 First run: seeded ${r.sections} sections and ${r.problems} practice problems.`);
    }
    await seedCatalogs();          // fills any empty catalog collection (store, missions, badges, ...)
    await catalog.start();         // cache catalogs in memory, refreshed every minute
    app.listen(PORT, () => console.log(`🎮 GamiC running at http://localhost:${PORT}`));
  } catch (e) {
    console.error('❌ Could not start:', e.message);
    console.error('   Is MongoDB running? Check MONGO_URI in your .env file.');
    process.exit(1);
  }
})();
