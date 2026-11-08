const CACHE = 'consulta-facil-v1';
const APP_SHELL = [
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      await Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => undefined)));
      await self.skipWaiting();
    }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(chaves.filter((chave) => chave !== CACHE).map((chave) => caches.delete(chave))),
      )
      .then(() => self.clients.claim()),
  );
});

function respostaIndisponivel() {
  return new Response('Recurso indisponível sem conexão.', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/sw.js') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copia = response.clone();
            caches.open(CACHE).then((cache) => cache.put('/index.html', copia));
          }
          return response;
        })
        .catch(() =>
          caches.match('/index.html').then(
            (cacheado) =>
              cacheado ||
              new Response(
                'Você está offline. Abra o Consulta Fácil novamente quando tiver internet.',
                {
                  status: 503,
                  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
                },
              ),
          ),
        ),
    );
    return;
  }

  const cacheFirst =
    url.pathname.startsWith('/_expo/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/favicon.ico';

  if (cacheFirst) {
    event.respondWith(
      caches.match(request).then((cacheado) => {
        if (cacheado) return cacheado;

        return fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const copia = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copia));
            }
            return response;
          })
          .catch(() => respostaIndisponivel());
      }),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const copia = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copia));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cacheado) => cacheado || respostaIndisponivel())),
  );
});

self.addEventListener('message', (event) => {
  const dados = event.data;

  if (dados === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (dados && dados.type === 'CACHE_URLS' && Array.isArray(dados.urls)) {
    const urls = dados.urls.filter((url) => {
      try {
        return new URL(url, self.location.origin).origin === self.location.origin;
      } catch {
        return false;
      }
    });

    event.waitUntil(
      caches
        .open(CACHE)
        .then((cache) =>
          Promise.all(urls.map((url) => cache.add(url).catch(() => undefined))),
        ),
    );
  }
});
