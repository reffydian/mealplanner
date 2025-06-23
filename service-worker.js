const CACHE_NAME = 'menu-planner-v2'; // Naikkan versi cache agar SW update
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/planner.html',   // <-- FILE BARU
    '/shopping.html',  // <-- FILE BARU
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icon-128.png',
    '/icon-512.png'
];

// Event 'install' (tidak perlu diubah, hanya pastikan nama cache sudah baru)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache dibuka');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// Tambahkan event 'activate' untuk membersihkan cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Event 'fetch' (tidak perlu diubah)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});