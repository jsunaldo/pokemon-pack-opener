// Pokémon Pack Opener — service worker
// Card/pack images: cache-first (they never change).
// App shell: network-first with a short timeout, falling back to cache when offline.
// Everything else (set data JSON, API): stale-while-revalidate.

const CACHE = 'pack-opener-v2';
const IMG_HOSTS = ['images.pokemontcg.io', 'archives.bulbagarden.net'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['./', './pack-opener-manifest.json'])).catch(() => {})
  );
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('pack-opener-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // App shell navigation: fresh when online (3.5s budget), cached when offline
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await Promise.race([
          fetch(req),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3500)),
        ]);
        if (res.ok) cache.put('./', res.clone()).catch(() => {});
        return res;
      } catch {
        return (await cache.match('./')) || (await cache.match(req)) || Response.error();
      }
    })());
    return;
  }

  // Card artwork and pack art: immutable — cache first, keep forever
  if (IMG_HOSTS.includes(url.host)) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone()).catch(() => {});
      return res;
    })());
    return;
  }

  // Set data + everything else: serve cache instantly, refresh in background
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    const network = fetch(req)
      .then(res => { if (res.ok) cache.put(req, res.clone()).catch(() => {}); return res; })
      .catch(() => null);
    return hit || (await network) || new Response('Offline', { status: 503 });
  })());
});
