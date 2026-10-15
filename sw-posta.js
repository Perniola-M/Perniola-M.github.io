const CACHE = 'email-perniola-v1';
const RISORSE = [
  './Destinatari.html',
  './manifest-posta.webmanifest',
  './posta-192.png',
  './posta-512.png',
  './posta-180.png',
  './Foto1.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(RISORSE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(nomi => Promise.all(nomi.filter(nome => nome !== CACHE).map(nome => caches.delete(nome))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(risposta => {
          const copia = risposta.clone();
          caches.open(CACHE).then(cache => cache.put('./Destinatari.html', copia));
          return risposta;
        })
        .catch(() => caches.match('./Destinatari.html'))
    );
    return;
  }
  event.respondWith(caches.match(event.request).then(copia => copia || fetch(event.request)));
});
