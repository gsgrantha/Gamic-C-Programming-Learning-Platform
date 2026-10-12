// Learning Resources: links to the W3Schools C tutorial. The list itself is stored in MongoDB
// (collection "resourcesections") and loaded through GET /api/resources.
import { api } from './api.js';

let cache = null;
export const loadResources = () => (cache ||= api.resources().catch((e) => { cache = null; throw e; }));

export const w3url = (base, file) => base + file;

/** First W3Schools link for a GamiC chapter id (null when there is no matching topic) */
export async function chapterLink(chapterId) {
  try {
    const { base, sections } = await loadResources();
    for (const s of sections) for (const g of s.groups) if (g.chapters.includes(chapterId) && g.links.length) return { label: g.title, href: base + g.links[0][1] };
  } catch (_) { /* resources unavailable: lesson still works without the link */ }
  return null;
}
