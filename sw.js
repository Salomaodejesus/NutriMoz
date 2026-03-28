const CACHE_NAME = 'nutrimoz-cache-v1';
const urlsToCache =[
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalar o Service Worker e guardar os ficheiros no Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar os pedidos e devolver do Cache se estiver offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o ficheiro estiver no cache, devolve-o
        if (response) {
          return response;
        }
        // Caso contrário, tenta ir à internet buscar
        return fetch(event.request);
      })
  );
});

// Actualizar o Service Worker e limpar caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});