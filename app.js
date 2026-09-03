/* ==========================================================================
   DRUK DIGITAL - Lógica Interactiva (JavaScript)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Número de WhatsApp Oficial del Negocio DRUK Digital (+593987334711)
  const WHATSAPP_PHONE = '593987334711';

  /* --------------------------------------------------------------------------
     1. Acordeones Desplegables de Diagnóstico (Servicio Técnico)
     -------------------------------------------------------------------------- */
  const accordionToggles = document.querySelectorAll('.accordion-toggle');

  accordionToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const content = toggle.nextElementSibling;
      const isOpen = content.classList.contains('open');

      if (!isOpen) {
        toggle.classList.add('active');
        content.classList.add('open');
      } else {
        toggle.classList.remove('active');
        content.classList.remove('open');
      }
    });
  });

  /* --------------------------------------------------------------------------
     2. Navegación e Interacción con Submenús (Soporte Multipágina & Anclajes)
     -------------------------------------------------------------------------- */
  function handleCardHighlightAndOpen(targetId) {
    if (!targetId) return;
    const cleanId = targetId.includes('#') ? '#' + targetId.split('#')[1] : targetId;
    const targetCard = document.querySelector(cleanId);
    if (targetCard) {
      setTimeout(() => {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.querySelectorAll('.service-card, .repuesto-card-main').forEach(c => c.classList.remove('highlight'));
        targetCard.classList.add('highlight');
        setTimeout(() => targetCard.classList.remove('highlight'), 3000);

        const accordionBtn = targetCard.querySelector('.accordion-toggle');
        const accordionContent = targetCard.querySelector('.accordion-content');
        if (accordionBtn && accordionContent) {
          accordionBtn.classList.add('active');
          accordionContent.classList.add('open');
        }
      }, 200);
    }
  }

  // Si la página se abrió directamente con un hash en la URL (ej: servicio-tecnico.html#card-macbook)
  if (window.location.hash) {
    handleCardHighlightAndOpen(window.location.hash);
  }

  const dropdownLinks = document.querySelectorAll('.dropdown-link, .mobile-sublink');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.includes('#')) {
        const [targetPage, targetId] = href.split('#');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Si el enlace apunta a la misma página actual
        if (!targetPage || targetPage === currentPage) {
          e.preventDefault();
          handleCardHighlightAndOpen('#' + targetId);
          if (history.pushState) {
            history.pushState(null, null, '#' + targetId);
          }
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     3. Filtrado de Soluciones de Software por Tipo de Negocio
     -------------------------------------------------------------------------- */
  const tabBtns = document.querySelectorAll('.category-tabs .tab-btn');
  const solutionCards = document.querySelectorAll('.solution-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.dataset.category;

      solutionCards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     4. Simulador Interactivo de Funciones de Software (Si está presente en el DOM)
     -------------------------------------------------------------------------- */
  const previewFeaturesList = document.getElementById('previewFeaturesList');
  if (previewFeaturesList) {
    const featureSwitches = document.querySelectorAll('.feature-switch');
    const featureLabels = {
      'ot': 'Órdenes de Trabajo & Ticket QR',
      'ai_whatsapp': 'Avisos WhatsApp con IA',
      'billing': 'Control de Caja & Cobros',
      'inventory': 'Inventario de Repuestos',
      'cloud': 'Respaldo Cloud & Multiusuario'
    };

    function updateSimulatorPreview() {
      previewFeaturesList.innerHTML = '';
      featureSwitches.forEach(sw => {
        if (sw.checked) {
          const key = sw.dataset.feature;
          const tag = document.createElement('span');
          tag.className = 'preview-feature-tag';
          tag.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> ${featureLabels[key] || key}`;
          previewFeaturesList.appendChild(tag);
        }
      });
    }

    featureSwitches.forEach(sw => {
      sw.addEventListener('change', updateSimulatorPreview);
    });
    updateSimulatorPreview();
  }

  /* --------------------------------------------------------------------------
     5. Cotizador Interactivo WhatsApp Dual (Si está presente en el DOM)
     -------------------------------------------------------------------------- */
  const calcTypeBtns = document.querySelectorAll('.calc-type-btn');
  const formService = document.getElementById('calcFormService');
  const formParts = document.getElementById('calcFormParts');
  const whatsappPreviewText = document.getElementById('whatsappPreviewText');
  const btnSendWhatsapp = document.getElementById('btnSendWhatsapp');

  if (whatsappPreviewText && btnSendWhatsapp) {
    let currentCalcMode = 'service'; // 'service' | 'parts'

    calcTypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        calcTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentCalcMode = btn.dataset.type;

        if (currentCalcMode === 'service') {
          if (formService) formService.style.display = 'flex';
          if (formParts) formParts.style.display = 'none';
        } else {
          if (formService) formService.style.display = 'none';
          if (formParts) formParts.style.display = 'flex';
        }
        updateWhatsAppPreview();
      });
    });

    function updateWhatsAppPreview() {
      let messageText = '';

      if (currentCalcMode === 'service') {
        const device = document.getElementById('techDeviceSelect')?.value || 'Computadora / CPU';
        const brand = document.getElementById('techBrandInput')?.value || 'No especificado';
        const issue = document.getElementById('techIssueSelect')?.value || 'Diagnóstico General';
        const detail = document.getElementById('techDetailInput')?.value || '';

        messageText = `*¡Hola DRUK Digital!* 🛠️⚡\nSolicito cotización de *Servicio Técnico*:\n- *Equipo:* ${device}\n- *Marca/Modelo:* ${brand}\n- *Falla/Servicio:* ${issue}`;
        if (detail.trim() !== '') {
          messageText += `\n- *Detalles adicionales:* ${detail}`;
        }
      } else {
        const partCategory = document.getElementById('partCategorySelect')?.value || 'Repuesto General';
        const partBrand = document.getElementById('partBrandInput')?.value || 'No especificado';
        const partSpecs = document.getElementById('partSpecsInput')?.value || 'No especificado';
        const partInstall = document.getElementById('partInstallSelect')?.value || 'No especificado';

        messageText = `*¡Hola DRUK Digital!* 📦🔧\nSolicito cotización de *Repuesto*:\n- *Categoría:* ${partCategory}\n- *Para Equipo:* ${partBrand}\n- *Especificaciones:* ${partSpecs}\n- *Instalación:* ${partInstall}`;
      }

      if (whatsappPreviewText) {
        whatsappPreviewText.textContent = messageText;
      }

      if (btnSendWhatsapp) {
        const encodedMsg = encodeURIComponent(messageText);
        btnSendWhatsapp.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMsg}`;
      }
    }

    document.querySelectorAll('#calcFormService select, #calcFormService input, #calcFormParts select, #calcFormParts input').forEach(input => {
      input.addEventListener('change', updateWhatsAppPreview);
      input.addEventListener('input', updateWhatsAppPreview);
    });

    updateWhatsAppPreview();
  }

  /* --------------------------------------------------------------------------
     6. Navegación Móvil (Drawer)
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (mobileDrawer.classList.contains('active')) {
        icon.className = 'bi bi-x-lg';
      } else {
        icon.className = 'bi bi-list';
      }
    });

    document.querySelectorAll('.mobile-drawer a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        mobileToggle.querySelector('i').className = 'bi bi-list';
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. Animación Interactiva 3D con Movimiento de Mouse (Parallax Geométrico)
     -------------------------------------------------------------------------- */
  const geoShapes = document.querySelectorAll('.geo-shape');
  
  if (geoShapes.length > 0) {
    let mouseX = 0;
    let mouseY = 0;
    let currX = 0;
    let currY = 0;

    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX = (e.clientX - cx) / cx; // Normalizado entre -1 y 1
      mouseY = (e.clientY - cy) / cy;
    });

    function renderParallax() {
      // Suavizado e inercia de movimiento (Lerp)
      currX += (mouseX - currX) * 0.06;
      currY += (mouseY - currY) * 0.06;

      geoShapes.forEach((shape) => {
        const speed = parseFloat(shape.getAttribute('data-speed')) || 25;
        const rot = parseFloat(shape.getAttribute('data-rot')) || 12;
        const moveX = currX * speed;
        const moveY = currY * speed;
        const rotateX = currY * rot;
        const rotateY = -currX * rot;

        shape.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      requestAnimationFrame(renderParallax);
    }

    renderParallax();
  }

  /* --------------------------------------------------------------------------
     8. Lógica del Hero Slider Carousel (Transiciones & Auto-Play)
     -------------------------------------------------------------------------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-slider-dots .dot');
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');
  const heroContainer = document.querySelector('.hero-slider-container');
  
  if (heroSlides.length > 1) {
    let currentSlide = 0;
    let autoSlideInterval = null;

    function goToSlide(index) {
      if (index < 0) {
        index = heroSlides.length - 1;
      } else if (index >= heroSlides.length) {
        index = 0;
      }

      heroSlides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      heroDots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      currentSlide = index;
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 20000);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    }

    if (heroNextBtn) {
      heroNextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        startAutoSlide();
      });
    }

    if (heroPrevBtn) {
      heroPrevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        startAutoSlide();
      });
    }

    heroDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIdx = parseInt(dot.getAttribute('data-slide'));
        goToSlide(slideIdx);
        startAutoSlide();
      });
    });

    if (heroContainer) {
      heroContainer.addEventListener('mouseenter', stopAutoSlide);
      heroContainer.addEventListener('mouseleave', startAutoSlide);
    }

    startAutoSlide();
  }

  /* --------------------------------------------------------------------------
     8b. Carga Inteligente de Video de Fondo (adaptado a la plataforma)
     En móvil, con "Reduced Motion" activado o con conexión lenta/datos
     limitados, se omite la descarga del video y se muestra solo la imagen
     poster estática. En desktop, cada video del slider se carga recién
     cuando su slide se vuelve visible (no los 4 de una sola vez), y el
     video fuera del slider (simulador) se carga solo al hacer scroll hasta
     él. Esto es lo que reduce el peso y la lentitud en celular.
     -------------------------------------------------------------------------- */
  (function () {
    const mqMobile = window.matchMedia('(max-width: 768px)');
    const mqReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
    const slowConnection = !!(conn && (conn.saveData || /2g/.test(conn.effectiveType || '')));

    function shouldSkipVideo() {
      return mqMobile.matches || mqReducedMotion.matches || slowConnection;
    }

    function activateVideo(video) {
      if (!video || !video.dataset.src || video.dataset.activated === 'true') return;
      if (shouldSkipVideo()) return; // se queda mostrando el poster, sin descargar el video
      video.dataset.activated = 'true';
      video.src = video.dataset.src;
      video.load();
      video.play().catch(() => {});
    }

    const allHeroVideos = document.querySelectorAll('.hero-video');
    const heroSlideVideos = [];
    const standaloneVideos = [];
    allHeroVideos.forEach((v) => (v.closest('.hero-slide') ? heroSlideVideos.push(v) : standaloneVideos.push(v)));

    // Slider: solo se activa el video del slide que está visible en este momento
    function activateActiveHeroSlide() {
      heroSlides.forEach((slide) => {
        if (slide.classList.contains('active')) {
          activateVideo(slide.querySelector('.hero-video'));
        }
      });
    }
    activateActiveHeroSlide();
    if (heroSlides.length) {
      const heroVideoObserver = new MutationObserver(activateActiveHeroSlide);
      heroSlides.forEach((slide) => heroVideoObserver.observe(slide, { attributes: true, attributeFilter: ['class'] }));
    }

    // Videos fuera del slider (ej. vista previa del simulador): se cargan
    // solo cuando el usuario llega a esa sección al hacer scroll
    if ('IntersectionObserver' in window && standaloneVideos.length) {
      const lazyVideoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activateVideo(entry.target);
            lazyVideoObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px' });
      standaloneVideos.forEach((v) => lazyVideoObserver.observe(v));
    } else {
      standaloneVideos.forEach(activateVideo);
    }

    // Si el usuario activa "reducir movimiento" mientras navega, pausamos
    // cualquier video que ya se hubiera activado
    mqReducedMotion.addEventListener('change', () => {
      if (mqReducedMotion.matches) {
        document.querySelectorAll('.hero-video[src]').forEach((v) => v.pause());
      }
    });
  })();

  /* --------------------------------------------------------------------------
     CONTADOR DINÁMICO CON DISTORSIÓN GLITCH (+3,725)
     -------------------------------------------------------------------------- */
  const counterEl = document.getElementById('counter-equipos-reparados');
  if (counterEl) {
    const BASE_NUMBER = 3725;
    let currentVal = BASE_NUMBER;
    const incrementSteps = [1, 2, 3]; // Suma +1, luego +2, luego +3, luego +1...
    let stepIndex = 0;
    let counterInterval = null;

    function formatNumber(num) {
      return '+' + num.toLocaleString('es-EC');
    }

    function triggerDistortionIncrement() {
      const increment = incrementSteps[stepIndex % incrementSteps.length];
      stepIndex++;
      currentVal += increment;

      // Disparar animación de distorsión
      counterEl.classList.remove('is-glitching');
      // Forzar reflujo para reiniciar keyframe
      void counterEl.offsetWidth;
      counterEl.classList.add('is-glitching');

      // Actualizar número a mitad de la distorsión
      setTimeout(() => {
        counterEl.textContent = formatNumber(currentVal);
      }, 140);
    }

    function startCounter() {
      if (counterInterval) clearInterval(counterInterval);
      currentVal = BASE_NUMBER;
      stepIndex = 0;
      counterEl.textContent = formatNumber(BASE_NUMBER);
      counterInterval = setInterval(triggerDistortionIncrement, 2000);
    }

    function stopAndResetCounter() {
      if (counterInterval) {
        clearInterval(counterInterval);
        counterInterval = null;
      }
      currentVal = BASE_NUMBER;
      stepIndex = 0;
      counterEl.textContent = formatNumber(BASE_NUMBER);
    }

    // Iniciar con IntersectionObserver (cuando el módulo es visible en pantalla)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter();
        } else {
          stopAndResetCounter();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(counterEl);

    // Si el slider de inicio cambia de diapositiva y regresa al slide 1, reiniciar conteo
    const slide1 = counterEl.closest('.hero-slide');
    if (slide1) {
      const mutationObserver = new MutationObserver(() => {
        if (slide1.classList.contains('active')) {
          startCounter();
        } else {
          stopAndResetCounter();
        }
      });
      mutationObserver.observe(slide1, { attributes: true, attributeFilter: ['class'] });
    }
  }

  /* --------------------------------------------------------------------------
     CONTADOR DE VISITAS HÍBRIDO EN VIVO (DRUK DIGITAL)
     -------------------------------------------------------------------------- */
  const visitorCountDisplay = document.getElementById('visitorCountDisplay');
  if (visitorCountDisplay) {
    // Consultar el conteo real en hits.sh
    fetch('https://hits.sh/www.drukdigital.es.svg?label=Visitas')
      .then(res => res.text())
      .then(svg => {
        const match = svg.match(/<title>Visitas:\s*([\d,]+)<\/title>/);
        if (match && match[1]) {
          const rawCount = parseInt(match[1].replace(/,/g, ''), 10);
          if (!isNaN(rawCount)) {
            visitorCountDisplay.innerHTML = `<span class="visitor-number">+${rawCount.toLocaleString('es-EC')}</span>`;
          }
        }
      })
      .catch(() => {
        // En caso de modo offline o bloqueo de red, el badge SVG actúa de fallback
      });
  }

});

