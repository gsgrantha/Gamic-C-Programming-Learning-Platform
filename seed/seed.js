/**
 * Loads everything into MongoDB.   npm run seed
 * Safe to run repeatedly: sections/problems are upserted, users are untouched.
 * Game catalogs (store, missions, badges, leagues, resources, external problems) are re-synced too.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Section = require('../models/Section');
const Problem = require('../models/Problem');
const { seedCatalogs } = require('./catalogs');
const { sections, problems } = require('./curriculum');

async function seed({ force = true } = {}) {
  await Promise.all(sections.map((s) => Section.findOneAndUpdate({ order: s.order }, s, { upsert: true, new: true, setDefaultsOnInsert: true })));
  await Promise.all(problems.map((p) => Problem.findOneAndUpdate({ pid: p.pid }, p, { upsert: true, new: true })));
  const catalogs = await seedCatalogs({ force });
  return { sections: sections.length, problems: problems.length, catalogs };
}

module.exports = seed;

if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      const r = await seed();
      console.log(`🌱 Seeded ${r.sections} sections and ${r.problems} practice problems.`);
      console.log('🌱 Catalogs:', JSON.stringify(r.catalogs));
    } catch (e) {
      console.error('Seed failed:', e.message);
      process.exitCode = 1;
    } finally { await mongoose.disconnect(); }
  })();
}
