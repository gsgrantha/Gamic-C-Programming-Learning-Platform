/**
 * Store: spend coins on boosters and cosmetics.
 * Consumables: streak freeze, XP boost.  Cosmetics: avatars, themes, avatar frames.
 * The product list is stored in MongoDB (collection "storeitems").
 */
const catalog_ = require('./catalog');

/** Store products come from the "storeitems" collection (cached, see services/catalog.js) */
const items = () => catalog_.get().storeItems.map((i) => ({ id: i.itemId, type: i.type, name: i.name, icon: i.icon, value: i.value, price: i.price, desc: i.desc }));
const FIELD = { avatar: 'avatar', theme: 'theme', frame: 'frame' };
const byId = (id) => items().find((i) => i.id === id);
const owns = (user, item) => item.price === 0 || user.owned.includes(item.id);

function catalog(user) {
  const boostActive = !!(user.boostUntil && user.boostUntil > new Date());
  return items().map((i) => ({
    id: i.id, type: i.type, name: i.name, icon: i.icon, price: i.price, desc: i.desc,
    owned: i.type === 'booster' ? false : owns(user, i),
    equipped: i.type !== 'booster' && user[FIELD[i.type]] === i.value,
    held: i.id === 'streak-freeze' ? user.streakFreezes : undefined,
    active: i.id === 'xp-boost' ? boostActive : undefined,
    canAfford: user.coins >= i.price
  }));
}

function buy(user, id) {
  const item = byId(id);
  if (!item) return { error: 'Unknown item.' };
  if (item.price === 0) return { error: 'That item is free — just equip it.' };
  if (user.coins < item.price) return { error: 'Not enough coins. Complete missions and lessons to earn more!' };
  if (item.id === 'streak-freeze') {
    if (user.streakFreezes >= 3) return { error: 'You can hold at most 3 Streak Freezes.' };
    user.streakFreezes += 1;
  } else if (item.id === 'xp-boost') {
    const start = user.boostUntil && user.boostUntil > new Date() ? +user.boostUntil : Date.now();
    user.boostUntil = new Date(start + 30 * 60 * 1000);
  } else {
    if (owns(user, item)) return { error: 'You already own this.' };
    user.owned.push(item.id);
  }
  user.coins -= item.price;
  return { item };
}

function equip(user, id) {
  const item = byId(id);
  if (!item || item.type === 'booster') return { error: 'Unknown item.' };
  if (!owns(user, item)) return { error: 'Buy this item first.' };
  user[FIELD[item.type]] = item.value;
  return { item };
}

module.exports = { items, catalog, buy, equip };
