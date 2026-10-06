// Service worker de la app del técnico (tecnico.html).
// Guarda la página y sus librerías en el teléfono para que la app abra aunque
// no haya señal. Los datos (Firestore, Storage, inicio de sesión) NO pasan por
// aquí: Firebase ya los maneja sin conexión por su cuenta.
//
// Al cambiar tecnico.html no hace falta tocar este archivo: la página se pide
// primero a la red y solo se usa la copia guardada si no hay señal.
var CACHE = 'cafiver-tecnico-v1';

var PRECARGA = [
  'tecnico.html',
  'manifest-tecnico.json',
  'icon-192.png',
  'icon-512.png',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage-compat.js',
  'https://unpkg.com/@zxing/library@0.19.1/umd/index.min.js',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css',
  'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@500;600&family=Hanken+Grotesk:wght@400;500;700&display=swap'
];

// Librerías y fuentes de CDN: versión fija, se sirven de la copia guardada.
var CDN = ['www.gstatic.com', 'unpkg.com', 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com',
           'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    // Uno por uno: si un CDN falla, lo demás sí se guarda.
    return Promise.all(PRECARGA.map(function (u) {
      return fetch(u).then(function (r) { if (r.ok) return c.put(u, r); }).catch(function () {});
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; })
                         .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // La app del técnico: red primero, copia guardada si no hay señal.
  if (url.origin === location.origin && /\/tecnico\.html$/.test(url.pathname)) {
    e.respondWith(fetch(req).then(function (r) {
      if (r.ok) { var copia = r.clone(); caches.open(CACHE).then(function (c) { c.put('tecnico.html', copia); }); }
      return r;
    }).catch(function () {
      return caches.match('tecnico.html');
    }));
    return;
  }

  // Íconos y manifest propios, y librerías de CDN: copia guardada primero.
  var propio = url.origin === location.origin && /\/(icon-\d+\.png|manifest-tecnico\.json)$/.test(url.pathname);
  var cdn = CDN.indexOf(url.hostname) >= 0 &&
            (url.hostname !== 'www.gstatic.com' || url.pathname.indexOf('/firebasejs/') === 0);
  if (!propio && !cdn) return;   // todo lo demás (Firestore, Storage, consola) va directo a la red
  e.respondWith(caches.match(req).then(function (hit) {
    if (hit) return hit;
    return fetch(req).then(function (r) {
      if (r.ok || r.type === 'opaque') { var copia = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copia); }); }
      return r;
    });
  }));
});
