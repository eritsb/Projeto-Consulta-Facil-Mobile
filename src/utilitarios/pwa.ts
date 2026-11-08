import { Platform } from 'react-native';

function recursosDaPagina(): string[] {
  if (typeof window === 'undefined' || typeof performance === 'undefined') return [];

  const origem = window.location.origin;

  return performance
    .getEntriesByType('resource')
    .map((entrada) => entrada.name)
    .filter((url) => url.startsWith(origem))
    .filter((url) => /\.(js|css|png|jpe?g|svg|webp|ico|woff2?|ttf|otf|json)(\?|$)/i.test(url));
}

export function registrarServiceWorker(): void {
  if (Platform.OS !== 'web') return;
  if (process.env.NODE_ENV !== 'production') return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

  const registrar = () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registro) => navigator.serviceWorker.ready.then(() => registro.active))
      .then((ativo) => {
        if (!ativo) return;
        const urls = recursosDaPagina();
        if (urls.length > 0) ativo.postMessage({ type: 'CACHE_URLS', urls });
      })
      .catch(() => {
        // Sem service worker o app continua funcionando; apenas perde o cache offline.
      });
  };

  if (document.readyState === 'complete') {
    registrar();
  } else {
    window.addEventListener('load', registrar, { once: true });
  }
}
