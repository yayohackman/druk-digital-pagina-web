/* ==========================================================================
   MEDICIÓN DE DRUK DIGITAL
   Google Analytics 4 + Pixel de Meta + clics a WhatsApp, teléfono y Maps.

   CÓMO ACTIVARLO (solo hay que pegar los IDs aquí abajo):
   1. Google Analytics: analytics.google.com > Administrar > Flujos de datos > Web.
      Copia el "ID de medición" (empieza con G-) y pégalo en GA4_ID.
   2. Pixel de Meta: business.facebook.com > Administrador de eventos >
      Conectar orígenes de datos > Web > Pixel. Copia el número y pégalo en META_PIXEL_ID.
   Mientras estén vacíos, no se carga nada de Google ni de Meta.
   Vercel Analytics (ya instalado) recibe el evento de WhatsApp desde ahora.
   ========================================================================== */
(function () {
  'use strict';

  var GA4_ID = '';          // ejemplo: 'G-ABC123XYZ9'
  var META_PIXEL_ID = '';   // ejemplo: '123456789012345'

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

  function send(eventName, params, metaEvent) {
    if (window.gtag && GA4_ID) window.gtag('event', eventName, params);
    if (window.fbq && META_PIXEL_ID && metaEvent) window.fbq('track', metaEvent, { content_name: params.consulta || eventName });
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
      }, 'Contact');
    } else if (/^tel:/i.test(href)) {
      send('phone_click', { pagina: pagina }, 'Contact');
    } else if (/maps\.app\.goo\.gl|google\.[a-z.]+\/maps/i.test(href)) {
      send('maps_click', { pagina: pagina }, 'FindLocation');
    }
  }, true);
})();
