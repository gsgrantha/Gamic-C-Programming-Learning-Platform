/**
 * Prints every collection in your database with its document count.   npm run db:check
 * Use it to confirm the app is connected to MongoDB Atlas and all data is stored there.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
require('../models/User'); require('../models/Section'); require('../models/Problem'); require('../models/Certificate');
require('../models/StoreItem'); require('../models/Mission'); require('../models/Badge'); require('../models/League');
require('../models/ResourceSection'); require('../models/ExternalProblem'); require('../models/Submission'); require('../models/Session');

(async () => {
  try {
    await connectDB();
    const rows = [];
    for (const name of Object.keys(mongoose.models)) {
      const M = mongoose.models[name];
      rows.push({ model: name, collection: M.collection.collectionName, documents: await M.estimatedDocumentCount() });
    }
    console.table(rows);
  } catch (e) { console.error('DB check failed:', e.message); process.exitCode = 1; }
  finally { await mongoose.disconnect(); }
})();
