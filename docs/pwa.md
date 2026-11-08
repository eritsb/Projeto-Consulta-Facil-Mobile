# PWA — Consulta Fácil

O app agora pode ser instalado como PWA e funciona offline para o shell e os
recursos já visitados.

## O que foi implementado

- `public/manifest.json` com nome, ícones, cores, `start_url`, `scope` e
  `display: standalone`.
- `public/index.html` como template do build web, com meta tags de PWA,
  `theme-color`, `apple-touch-icon` e tela de carregamento.
- `public/sw.js` com:
  - precache do app shell (`index.html`, manifest e ícones);
  - cache-first para assets imutáveis (`/_expo/`, `/assets/`, `/icons/`);
  - network-first para navegação e demais requisições, com fallback de cache;
  - cache dos recursos carregados na primeira visita (mensagem `CACHE_URLS`).
- `src/utilitarios/pwa.ts` registra o service worker apenas em produção e na
  web.
- Ícones em `public/icons/` (192, 512, maskable 512 e apple-touch-icon).

## Como testar localmente

O service worker só é registrado em produção. Gere o build e sirva o `dist`:

```bash
npm run build:web
npx serve dist
```

Abra `http://localhost:8080`. No DevTools:

1. **Application → Manifest**: confira nome, ícones e cores.
2. **Application → Service Workers**: confira `sw.js` ativo.
3. **Network → Offline** e recarregue: o app deve abrir o shell.
4. No Chrome/Edge, use **Instalar app** na barra de endereço.
5. No iOS, use **Compartilhar → Adicionar à Tela de Início**.

> `python3 -m http.server` também serve os arquivos, mas não faz o fallback de
> rotas do SPA. Para testar navegação direta em `/login`, use um servidor com
> rewrite para `index.html` (Vercel, Netlify, Cloudflare Pages etc.).

## Requisitos de deploy

- HTTPS (obrigatório para service worker e instalação).
- Servir `dist/` como site estático.
- Redirecionar rotas desconhecidas para `/index.html` (SPA fallback).
- Servir `manifest.json` como `application/manifest+json` ou
  `application/json`.
- Não aplicar cache longo no `index.html` e no `sw.js`.

O repositório já inclui `public/_redirects` com o fallback para Netlify.
Para outros hosts, use a regra equivalente. Exemplo de rewrite na Vercel
(`vercel.json`):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Limitações

- Push notifications na web têm suporte limitado; o foco continua sendo
  `expo-notifications` no Android/iOS.
- `expo-secure-store` não existe no navegador; a sessão web usa `localStorage`.
- O prompt de instalação depende do navegador e de HTTPS. No iOS, a instalação
  é manual pelo menu Compartilhar.
- Para atualizar o cache, altere a constante `CACHE` em `public/sw.js`.

## Checklist de validação

- [ ] Build web gerado sem erros.
- [ ] `manifest.json` e ícones acessíveis.
- [ ] Service worker registrado e ativo.
- [ ] App abre com a rede desligada após a primeira visita.
- [ ] Instalação disponível no Chrome/Edge.
- [ ] Rotas diretas funcionam com SPA fallback no host.
