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
     2. Navegación e Interacción con Submenús (Servicio Técnico, Repuestos & Software)
     -------------------------------------------------------------------------- */
  const dropdownLinks = document.querySelectorAll('.dropdown-link, .mobile-sublink');

  dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const softwareCat = link.dataset.software;
      
      // Manejar Servicio Técnico (#card-...)
      if (targetId && targetId.startsWith('#card-')) {
        const targetCard = document.querySelector(targetId);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

          document.querySelectorAll('.service-card').forEach(c => c.classList.remove('highlight'));
          targetCard.classList.add('highlight');
          setTimeout(() => targetCard.classList.remove('highlight'), 3000);

          const accordionBtn = targetCard.querySelector('.accordion-toggle');
          const accordionContent = targetCard.querySelector('.accordion-content');
          if (accordionBtn && accordionContent) {
            accordionBtn.classList.add('active');
            accordionContent.classList.add('open');
          }
        }
      }

      // Manejar Repuestos (#repuestos-...)
      if (targetId && targetId.startsWith('#repuestos-')) {
        const targetRepuestoCard = document.querySelector(targetId);
        if (targetRepuestoCard) {
          targetRepuestoCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

          document.querySelectorAll('.repuesto-card-main').forEach(c => c.classList.remove('highlight'));
          targetRepuestoCard.classList.add('highlight');
          setTimeout(() => targetRepuestoCard.classList.remove('highlight'), 3000);
        }
      }

      // Manejar Desarrollo de Software (#desarrollo-software)
      if (softwareCat) {
        const softwareSection = document.querySelector('#desarrollo-software');
        if (softwareSection) {
          softwareSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Activar botón de tab correspondiente
          const targetTabBtn = document.querySelector(`.category-tabs .tab-btn[data-category="${softwareCat}"]`);
          if (targetTabBtn) {
            targetTabBtn.click();
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
     4. Simulador Interactivo de Funciones de Software
     -------------------------------------------------------------------------- */
  const featureSwitches = document.querySelectorAll('.feature-switch');
  const previewFeaturesList = document.getElementById('previewFeaturesList');

  const featureLabels = {
    'ot': 'Órdenes de Trabajo & Ticket QR',
    'ai_whatsapp': 'Avisos WhatsApp con IA',
    'billing': 'Control de Caja & Cobros',
    'inventory': 'Inventario de Repuestos',
    'cloud': 'Respaldo Cloud & Multiusuario'
  };

  function updateSimulatorPreview() {
    if (!previewFeaturesList) return;
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

  /* --------------------------------------------------------------------------
     5. Cotizador Interactivo Dual & Generador de WhatsApp
     -------------------------------------------------------------------------- */
  const calcTypeBtns = document.querySelectorAll('.calc-type-btn');
  const formService = document.getElementById('calcFormService');
  const formParts = document.getElementById('calcFormParts');
  const whatsappPreviewText = document.getElementById('whatsappPreviewText');
  const btnSendWhatsapp = document.getElementById('btnSendWhatsapp');

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
});
