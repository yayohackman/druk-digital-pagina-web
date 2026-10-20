/* ==========================================================================
   MEDICIÓN DE DRUK DIGITAL
   Google Analytics 4 + Pixel de Meta + clics a WhatsApp, teléfono y Maps.

   CÓMO ACTIVARLO (solo hay que pegar los IDs aquí abajo):
   1. Google Analytics: analytics.google.com > Administrar > Flujos de datos > Web.
      Copia el "ID de medición" (empieza con G-) y pégalo en GA4_ID.
   2. Pixel de Meta: business.facebook.com > Administrador de eventos >
      Conectar orígenes de datos > Web > Pixel. Copia el número y pégalo en META_PIXEL_ID.
   Mientras estén vacíos, no se carga nada de Google, Meta ni TikTok.
   Vercel Analytics (ya instalado) recibe el evento de WhatsApp desde ahora.
   ========================================================================== */
(function () {
  'use strict';

  var GA4_ID = 'G-LYWH1TTN3D';   // Google Analytics 4 - flujo "DRUK Digital Web"
  var META_PIXEL_ID = '1598726791188172';   // Pixel de Meta - "DRUK Digital Web"
  var TIKTOK_PIXEL_ID = 'DBBRDPJC77U7U7J8RT3G';   // Pixel de TikTok - "DRUK Digital Web"

  /* ---------- Google Analytics 4 ---------- */
  if (GA4_ID) {
    var gs = document.createElement('script');
    gs.async = true;
    gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(gs);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID);
  }

  /* ---------- Pixel de Meta ---------- */
  if (META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  /* ---------- Pixel de TikTok ---------- */
  if (TIKTOK_PIXEL_ID) {
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; };
      ttq.load = function (e, n) {
        var r = 'https://analytics.tiktok.com/i18n/pixel/events.js', o = n && n.partner;
        ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r; ttq._t = ttq._t || {}; ttq._t[e] = +new Date; ttq._o = ttq._o || {}; ttq._o[e] = n || {};
        n = document.createElement('script'); n.type = 'text/javascript'; n.async = !0; n.src = r + '?sdkid=' + e + '&lib=' + t;
        e = document.getElementsByTagName('script')[0]; e.parentNode.insertBefore(n, e);
      };
      ttq.load(TIKTOK_PIXEL_ID);
      ttq.page();
    }(window, document, 'ttq');
  }

  /* ---------- Qué servicio o producto consultó (sale del mensaje de WhatsApp) ---------- */
  function whatsappTopic(href) {
    try {
      var text = new URL(href).searchParams.get('text') || '';
      var bold = text.match(/\*([^*]+)\*/);          // "...servicio de *Cambio de Display*..."
      if (bold) return bold[1].slice(0, 100);
      return text.replace(/^¡?Hola DRUK Digital!?\s*/i, '').slice(0, 100) || 'general';
    } catch (e) {
      return 'general';
    }
  }

  function send(eventName, params, metaEvent, tiktokEvent) {
    if (window.gtag && GA4_ID) window.gtag('event', eventName, params);
    if (window.fbq && META_PIXEL_ID && metaEvent) window.fbq('track', metaEvent, { content_name: params.consulta || eventName });
    if (window.ttq && TIKTOK_PIXEL_ID && tiktokEvent) window.ttq.track(tiktokEvent, { content_name: params.consulta || eventName });
    if (window.va) window.va('event', { name: eventName, data: params });
  }

  /* ---------- Escucha todos los clics de la página ---------- */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a) return;
    var href = a.href || '';
    var pagina = location.pathname.replace(/^\//, '') || 'index.html';

    if (/wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(href)) {
      var btn = (a.textContent || a.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 60);
      send('whatsapp_click', {
        consulta: whatsappTopic(href),
        boton: btn || (a.classList.contains('floating-whatsapp') ? 'flotante' : 'icono'),
        pagina: pagina
      }, 'Contact', 'Contact');
    } else if (/^tel:/i.test(href)) {
      send('phone_click', { pagina: pagina }, 'Contact', 'Contact');
    } else if (/maps\.app\.goo\.gl|google\.[a-z.]+\/maps/i.test(href)) {
      send('maps_click', { pagina: pagina }, 'FindLocation', 'ClickButton');
    }
  }, true);
})();
