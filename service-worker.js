const CACHE_NAME = 'hvac-bdz-academy-m1-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  '/biblioteca/index.html',
  '/biblioteca/historia-confort.html',
  '/biblioteca/que-es-hvac.html',
  '/biblioteca/calor-sensible-latente.html',
  '/biblioteca/ciclo-refrigeracion.html',
  '/biblioteca/tipos-sistemas.html',
  '/biblioteca/unidades-glosario.html',
  '/Cuadernillo_Participante_M1_Historia_Fundamentos_HVAC_BDZ_2026.pdf',
  '/Cuadernillo_Participante_M1_Historia_Fundamentos_HVAC_BDZ_2026.docx',
  '/Presentacion_M1_Historia_Fundamentos_HVAC_BDZ_2026%20(1).pdf'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const copy = response.clone();
        if (response.ok && new URL(request.url).origin === self.location.origin) {
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => caches.match('/offline.html'));
    })
  );
});
