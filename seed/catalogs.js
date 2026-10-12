/**
 * Loads the game catalogs (store, missions, badges, leagues, resources, external problems) into MongoDB.
 * By default a collection is only filled when it is empty, so edits made in Atlas are never overwritten.
 * Pass { force: true } to re-sync every catalog from the JSON files in seed/data.
 */
const StoreItem = require('../models/StoreItem');
const Mission = require('../models/Mission');
const Badge = require('../models/Badge');
const League = require('../models/League');
const ResourceSection = require('../models/ResourceSection');
const ExternalProblem = require('../models/ExternalProblem');

const store = require('./data/store.json');
const missions = require('./data/missions.json');
const badges = require('./data/badges.json');
const leagues = require('./data/leagues.json');
const resources = require('./data/resources.json');
const external = require('./data/external.json');

async function sync(Model, keyField, docs, force) {
  if (!force && (await Model.estimatedDocumentCount()) > 0) return 0;
  await Model.bulkWrite(docs.map((d) => ({
    updateOne: { filter: { [keyField]: d[keyField] }, update: { $set: d }, upsert: true }
  })));
  return docs.length;
}

async function seedCatalogs({ force = false } = {}) {
  const platformName = Object.fromEntries(external.platforms.map((p) => [p.key, p.name]));
  const r = {};
  r.storeItems = await sync(StoreItem, 'itemId', store.map((i, n) => ({
    itemId: i.id, order: n, type: i.type, name: i.name, icon: i.icon, value: i.value, price: i.price, desc: i.desc
  })), force);
  r.missions = await sync(Mission, 'missionId', missions.map((m, n) => ({ ...m, order: n })), force);
  r.badges = await sync(Badge, 'badgeId', badges.map((b, n) => ({ ...b, order: n })), force);
  r.leagues = await sync(League, 'name', leagues, force);
  r.resources = await sync(ResourceSection, 'order', resources.sections.map((s) => ({
    order: s.order, title: s.title, icon: s.icon,
    groups: s.groups.map((g) => ({ title: g.title, icon: g.icon, chapters: g.chapters, links: g.links.map(([title, file]) => ({ title, file })) }))
  })), force);
  r.external = await sync(ExternalProblem, 'key', external.problems.map((e, n) => ({
    key: e.key, order: n, platform: e.platform, platformName: platformName[e.platform], extId: e.id,
    title: e.title, difficulty: e.difficulty, href: e.href
  })), force);
  return r;
}

module.exports = { seedCatalogs, W3_HOME: resources.home, W3_BASE: resources.base };
