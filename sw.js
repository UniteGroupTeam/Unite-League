const CACHE_NAME = 'unite-league-v1';
const ASSETS = [
    '/index.html',
    '/clash.html',
    '/reglas.html',
    '/index.css',
    '/common.js',
    '/fortnite.js',
    '/clash.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
