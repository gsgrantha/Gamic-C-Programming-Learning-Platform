// Thin wrapper around fetch for the GamiC REST API
const KEY = 'gamic_token';

export const auth = {
  get token() { return localStorage.getItem(KEY); },
  set token(t) { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); },
  get loggedIn() { return !!localStorage.getItem(KEY); }
};

async function request(method, url, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth.token) headers.Authorization = 'Bearer ' + auth.token;
  let res;
  try {
    res = await fetch('/api' + url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch (e) {
    throw new Error('Cannot reach the server. Is it running?');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  register: (b) => request('POST', '/auth/register', b),
  login: (b) => request('POST', '/auth/login', b),
  me: () => request('GET', '/auth/me'),
  course: () => request('GET', '/course'),
  lesson: (id) => request('GET', '/lessons/' + id),
  problems: () => request('GET', '/problems'),
  problem: (id) => request('GET', '/problems/' + id),
  submit: (id, body) => request('POST', `/activities/${id}/submit`, body),
  run: (code, stdin) => request('POST', '/activities/run', { code, stdin }),
  leaderboard: (scope = 'weekly') => request('GET', '/leaderboard?scope=' + scope),
  user: (name) => request('GET', '/users/' + encodeURIComponent(name)),
  missions: () => request('GET', '/missions'),
  claim: (id) => request('POST', '/missions/claim', { id }),
  store: () => request('GET', '/store'),
  buy: (id) => request('POST', '/store/buy', { id }),
  equip: (id) => request('POST', '/store/equip', { id }),
  badges: () => request('GET', '/badges'),
  profile: () => request('GET', '/profile'),
  resources: () => request('GET', '/resources'),
  external: () => request('GET', '/external'),
  externalDone: (key, done) => request('POST', '/external/done', { key, done }),
  certificates: () => request('GET', '/certificates'),
  verifyCert: (id) => request('GET', '/certificates/verify/' + encodeURIComponent(id))
};
