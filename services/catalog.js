/**
 * Catalog cache. Store items, missions, badges, leagues, resources and external problems live in
 * MongoDB. They are read into memory at start-up (so game logic stays fast and synchronous) and
 * refreshed every minute – so edits made in Atlas show up on the site without a restart.
 */
const StoreItem = require('../models/StoreItem');
const Mission = require('../models/Mission');
const Badge = require('../models/Badge');
const League = require('../models/League');
const ResourceSection = require('../models/ResourceSection');
const ExternalProblem = require('../models/ExternalProblem');

const REFRESH_MS = 60 * 1000;
let data = { storeItems: [], missions: [], badges: [], leagues: [], resources: [], external: [] };
let timer = null;

async function load() {
  const [storeItems, missions, badges, leagues, resources, external] = await Promise.all([
    StoreItem.find().sort('order').lean(),
    Mission.find().sort('order').lean(),
    Badge.find().sort('order').lean(),
    League.find().sort('min').lean(),
    ResourceSection.find().sort('order').lean(),
    ExternalProblem.find().sort('order').lean()
  ]);
  data = { storeItems, missions, badges, leagues, resources, external };
  return data;
}

/** Load now, then keep refreshing in the background */
async function start() {
  await load();
  if (!timer) {
    timer = setInterval(() => load().catch((e) => console.error('Catalog refresh failed:', e.message)), REFRESH_MS);
    timer.unref();
  }
}

const get = () => data;

module.exports = { load, start, get };
