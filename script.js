// Sitio de limpieza profesional — interacciones

(function () {
  let closeMobileNav = () => {};
  let closeThemeMenu = () => {};

  // -------- Atmósfera temática específica de cada página --------
  const pageEffects = {
    'index': 'bubbles',
    'servicios': 'scanner',
    'sofas': 'weave',
    'sillas-butacas': 'threads',
    'colchones': 'air',
    'alfombras': 'threads',
    'coches': 'streaks',
    'empresas': 'scanner',
    'antes-despues': 'split',
    'tarifas': 'measure',
    'zonas-madrid': 'radar',
    'contacto': 'messages',
    'blog': 'paper',
    'guia-limpiar-sofa': 'fibers',
    'guia-acaros-colchon': 'microscope',
    'guia-tapiceria-coche': 'dashboard'
  };
  const pageSlug = (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '');
  const pageEffect = pageEffects[pageSlug] || 'bubbles';
  document.documentElement.dataset.page = pageSlug;
  document.documentElement.dataset.pageEffect = pageEffect;
  const effectHost = document.querySelector('.hero, .page-hero, .blog-hero, .article-hero');
  if (effectHost && !effectHost.querySelector('.page-atmosphere')) {
    const atmosphere = document.createElement('div');
    atmosphere.className = `page-atmosphere effect-${pageEffect}`;
    atmosphere.setAttribute('aria-hidden', 'true');
    atmosphere.innerHTML = '<span></span><span></span><span></span><span></span><span></span><span></span>';
    effectHost.appendChild(atmosphere);
  }

  // -------- Selector de identidad visual --------
  const themes = {
    forest: { label: 'Bosque', description: 'Natural y cercana', colors: ['#163a33', '#c9df78', '#f7f5ef'] },
    ocean: { label: 'Agua', description: 'Limpia y técnica', colors: ['#123d52', '#70c8c4', '#f2f8f8'] },
    clay: { label: 'Arcilla', description: 'Cálida y doméstica', colors: ['#512f27', '#e7a06f', '#fbf4ee'] },
    graphite: { label: 'Grafito', description: 'Premium y sobria', colors: ['#242424', '#d8ba68', '#f5f1e7'] },
    clinical: { label: 'Clínico', description: 'Precisa y tecnológica', colors: ['#0647d7', '#00d6b4', '#f5f8ff'] },
    nocturne: { label: 'Nocturno', description: 'Oscura y exclusiva', colors: ['#071c2c', '#a8ff3e', '#17364a'] },
    lavender: { label: 'Lavanda', description: 'Boutique y elegante', colors: ['#4a285e', '#d5a8ff', '#f8f0ff'] },
    solar: { label: 'Solar', description: 'Gráfica y atrevida', colors: ['#1729c9', '#ffd84d', '#fff8db'] }
  };

  const applyTheme = (themeName) => {
    const selected = themes[themeName] ? themeName : 'forest';
    document.documentElement.dataset.theme = selected;
    try { localStorage.setItem('fcm-theme', selected); } catch (_) { /* Preferencia opcional */ }
    document.querySelectorAll('[data-theme-option]').forEach((option) => {
      option.setAttribute('aria-pressed', option.dataset.themeOption === selected ? 'true' : 'false');
    });
    const currentLabel = document.querySelector('[data-theme-current]');
    if (currentLabel) currentLabel.textContent = themes[selected].label;
    const trigger = document.querySelector('[data-theme-trigger]');
    if (trigger) trigger.setAttribute('aria-label', `Cambiar diseño. Seleccionado: ${themes[selected].label}`);
  };

  let initialTheme = 'forest';
  try { initialTheme = localStorage.getItem('fcm-theme') || 'forest'; } catch (_) { /* Sin almacenamiento */ }
  applyTheme(initialTheme);

  const setupThemeSwitcher = () => {
    const headerInner = document.querySelector('.header-inner');
    const headerCta = document.querySelector('.header-cta');
    if (!headerInner || !headerCta || headerInner.querySelector('.theme-switcher')) return;

    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.innerHTML = `
      <button type="button" class="theme-trigger" data-theme-trigger aria-expanded="false" aria-haspopup="true">
        <span class="theme-trigger-icon" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="theme-trigger-copy"><small>Diseño</small><strong data-theme-current>Bosque</strong></span>
        <span class="theme-chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="theme-menu" data-theme-menu hidden>
        <div class="theme-menu-head"><strong>Elige una dirección visual</strong><span>8 diseños completos · la web recuerda tu elección</span></div>
        ${Object.entries(themes).map(([key, theme]) => `
          <button type="button" class="theme-option" data-theme-option="${key}" aria-pressed="false">
            <span class="theme-swatches" aria-hidden="true">${theme.colors.map((color) => `<i style="--swatch:${color}"></i>`).join('')}</span>
            <span><strong>${theme.label}</strong><small>${theme.description}</small></span>
            <span class="theme-check" aria-hidden="true">✓</span>
          </button>`).join('')}
      </div>`;
    headerInner.insertBefore(switcher, headerCta);

    const trigger = switcher.querySelector('[data-theme-trigger]');
    const menu = switcher.querySelector('[data-theme-menu]');
    const closeMenu = () => {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    };
    closeThemeMenu = closeMenu;
    trigger.addEventListener('click', () => {
      const willOpen = menu.hidden;
      if (willOpen) closeMobileNav();
      menu.hidden = !willOpen;
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
    switcher.querySelectorAll('[data-theme-option]').forEach((option) => {
      option.addEventListener('click', () => {
        applyTheme(option.dataset.themeOption);
        closeMenu();
        trigger.focus();
      });
    });
    document.addEventListener('click', (event) => {
      if (!switcher.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) {
        closeMenu();
        trigger.focus();
      }
    });
    applyTheme(document.documentElement.dataset.theme);
  };

  setupThemeSwitcher();

  // -------- Menú móvil --------
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    if (!nav.querySelector('.nav-mobile-head')) {
      nav.insertAdjacentHTML('afterbegin', `
        <div class="nav-mobile-head">
          <span class="nav-mobile-kicker">Servicio en Madrid</span>
          <strong>¿Qué necesitas limpiar?</strong>
          <small>Explora servicios, precios y trabajos reales.</small>
        </div>`);
      nav.insertAdjacentHTML('beforeend', `
        <div class="nav-mobile-action">
          <span><small>Respuesta rápida</small><strong>Presupuesto por WhatsApp</strong></span>
          <a href="https://wa.me/34655441162?text=Hola%2C%20quiero%20pedir%20un%20presupuesto." target="_blank" rel="noopener" aria-label="Pedir presupuesto por WhatsApp">Pedir presupuesto <b aria-hidden="true">→</b></a>
        </div>`);
    }

    const setNavOpen = (open) => {
      nav.classList.toggle('open', open);
      toggle.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };
    closeMobileNav = () => setNavOpen(false);

    toggle.addEventListener('click', () => {
      const willOpen = !nav.classList.contains('open');
      if (willOpen) closeThemeMenu();
      setNavOpen(willOpen);
    });
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        setNavOpen(false);
      })
    );
    document.addEventListener('click', (event) => {
      if (nav.classList.contains('open') && !nav.contains(event.target) && !toggle.contains(event.target)) {
        setNavOpen(false);
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        setNavOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) setNavOpen(false);
    }, { passive: true });
  }

  // -------- Año dinámico --------
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // -------- Header shadow on scroll --------
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -------- Reveal on scroll (stagger por hermanos) --------
  if ('IntersectionObserver' in window) {
    const els = document.querySelectorAll('[data-reveal]');

    // Stagger automático: cada hermano con [data-reveal] hereda un delay creciente.
    const grouped = new Map();
    els.forEach((el) => {
      const parent = el.parentElement;
      if (!grouped.has(parent)) grouped.set(parent, []);
      grouped.get(parent).push(el);
    });
    grouped.forEach((siblings) => {
      siblings.forEach((el, i) => {
        if (siblings.length > 1) el.style.setProperty('--rd', `${i * 70}ms`);
      });
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
  }

  // -------- Contadores numéricos --------
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  // -------- Before / After Slider --------
  document.querySelectorAll('[data-ba]').forEach((slider) => {
    const handle = slider.querySelector('.ba-handle');

    const setPos = (pct) => {
      const clamped = Math.max(0, Math.min(100, pct));
      slider.style.setProperty('--pos', clamped + '%');
      if (handle) handle.setAttribute('aria-valuenow', Math.round(clamped));
    };

    const posFromEvent = (e) => {
      const rect = slider.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return (x / rect.width) * 100;
    };

    let dragging = false;

    const start = (e) => {
      dragging = true;
      slider.classList.add('is-dragging');
      setPos(posFromEvent(e));
      e.preventDefault();
    };
    const move = (e) => {
      if (!dragging) return;
      setPos(posFromEvent(e));
    };
    const end = () => {
      dragging = false;
      slider.classList.remove('is-dragging');
    };

    // Mouse
    slider.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    // Touch
    slider.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchend', end);

    // Click directo en cualquier zona del slider
    slider.addEventListener('click', (e) => {
      // Evita doble disparo al soltar el drag
      if (e.detail === 0) return;
      setPos(posFromEvent(e));
    });

    // Teclado en el handle
    if (handle) {
      handle.addEventListener('keydown', (e) => {
        const current = parseFloat(slider.style.getPropertyValue('--pos')) || 50;
        const step = e.shiftKey ? 10 : 4;
        if (e.key === 'ArrowLeft') { setPos(current - step); e.preventDefault(); }
        else if (e.key === 'ArrowRight') { setPos(current + step); e.preventDefault(); }
        else if (e.key === 'Home') { setPos(0); e.preventDefault(); }
        else if (e.key === 'End') { setPos(100); e.preventDefault(); }
      });
    }

    // Animación de bienvenida cuando entra en viewport (mueve solo)
    if ('IntersectionObserver' in window) {
      const baIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          baIO.unobserve(slider);
          // Animación: de 50 -> 30 -> 70 -> 50
          const sequence = [
            { to: 30, dur: 700 },
            { to: 70, dur: 900 },
            { to: 50, dur: 700 },
          ];
          let from = 50;
          let i = 0;
          const runStep = () => {
            if (i >= sequence.length || dragging) return;
            const { to, dur } = sequence[i++];
            const startTime = performance.now();
            const startPos = from;
            const tick = (now) => {
              if (dragging) return;
              const p = Math.min((now - startTime) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setPos(startPos + (to - startPos) * eased);
              if (p < 1) requestAnimationFrame(tick);
              else { from = to; runStep(); }
            };
            requestAnimationFrame(tick);
          };
          setTimeout(runStep, 250);
        });
      }, { threshold: 0.35 });
      baIO.observe(slider);
    }
  });

  // -------- 3D tilt en tarjetas --------
  const tiltSelector = '.service-card, .price-card, .trust-card';
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (supportsHover && !reduceMotion) {
    document.querySelectorAll(tiltSelector).forEach((card) => {
      card.setAttribute('data-tilt', '');
      let rafId = null;
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.setProperty('--tilt-y', (x * 7).toFixed(2) + 'deg');
          card.style.setProperty('--tilt-x', (-y * 7).toFixed(2) + 'deg');
          card.style.setProperty('--tilt-lift', '-4px');
        });
      };
      const onLeave = () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-lift', '0');
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  // -------- Magnetic CTA buttons --------
  if (supportsHover && !reduceMotion) {
    document.querySelectorAll('.btn-primary').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // -------- Active Link Highlight --------
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // -------- CALCULADORA INTERACTIVA DE PRESUPUESTOS --------
  const calcForm = document.getElementById('priceCalculator');
  if (calcForm) {
    const sizeSelect = calcForm.querySelector('[name="calc-size"]');
    const sizeOptions = {
      sofa: [
        ['1', '1 plaza / Sillón individual (desde 50€)'],
        ['2', '2 plazas (desde 75€)'],
        ['3', '3 plazas (desde 90€)'],
        ['4', '4 plazas (desde 120€)'],
        ['chaisse', 'Chaise longue 3-4 plazas (desde 130€)'],
        ['5plus', '5 o más plazas / Rinconera (desde 150€)']
      ],
      sillas: [
        ['pack4asiento', '4 sillas · solo asiento (desde 40€)'],
        ['pack4', '4 sillas · asiento y respaldo (desde 55€)'],
        ['pack6', '6 sillas · asiento y respaldo (desde 80€)'],
        ['butaca', 'Butaca / orejero (desde 40€)']
      ],
      colchon: [
        ['ind', 'Individual 90/105 cm (desde 55€)'],
        ['mat', 'Matrimonio 135/150 cm (desde 70€)'],
        ['king', 'Queen / King 180/200 cm (desde 85€)']
      ],
      coche: [
        ['completo', 'Tapicería completa (desde 85€)'],
        ['delanteros', 'Asientos delanteros (desde 50€)'],
        ['silla-bebe', 'Silla infantil (desde 25€)']
      ],
      alfombra: [
        ['pequena', 'Pequeña: hasta 3 m² (desde 35€)'],
        ['mediana', 'Mediana: 3-6 m² (desde 60€)'],
        ['grande', 'Grande: más de 6 m² (desde 90€)']
      ],
      empresa: [
        ['oficina10', 'Hasta 10 sillas de oficina (desde 120€)'],
        ['recepcion', 'Sofá o butacas de recepción (desde 90€)'],
        ['lote', 'Lote profesional a valorar por fotos']
      ]
    };

    const syncSizeOptions = (category) => {
      if (!sizeSelect || !sizeOptions[category]) return;
      sizeSelect.replaceChildren(...sizeOptions[category].map(([value, label], index) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        if (category === 'sofa' && index === 2) option.selected = true;
        return option;
      }));
    };

    const updateCalculator = () => {
      const category = calcForm.querySelector('[name="calc-category"]')?.value || 'sofa';
      const itemSize = calcForm.querySelector('[name="calc-size"]')?.value || '3';
      const condition = calcForm.querySelector('[name="calc-condition"]')?.value || 'normal';
      const zone = calcForm.querySelector('[name="calc-zone"]')?.value || 'madrid-centro';

      let basePrice = 75;
      let title = 'Sofá de 3 plazas';

      if (category === 'sofa') {
        const sizes = { '1': 50, '2': 75, '3': 90, '4': 120, 'chaisse': 130, '5plus': 150 };
        basePrice = sizes[itemSize] || 90;
        const labels = { '1': 'Sillón / 1 plaza', '2': 'Sofá 2 plazas', '3': 'Sofá 3 plazas', '4': 'Sofá 4 plazas', 'chaisse': 'Chaise Longue', '5plus': 'Sofá 5+ plazas' };
        title = labels[itemSize] || 'Sofá';
      } else if (category === 'sillas') {
        const sizes = { 'pack4asiento': 40, 'pack4': 55, 'pack6': 80, 'butaca': 40 };
        basePrice = sizes[itemSize] || 40;
        const labels = { 'pack4asiento': '4 sillas · solo asiento', 'pack4': '4 sillas completas', 'pack6': '6 sillas completas', 'butaca': 'Butaca / orejero' };
        title = labels[itemSize] || 'Sillas tapizadas';
      } else if (category === 'colchon') {
        const sizes = { 'ind': 55, 'mat': 70, 'king': 85 };
        basePrice = sizes[itemSize] || 70;
        const labels = { 'ind': 'Colchón Individual', 'mat': 'Colchón Matrimonio', 'king': 'Colchón Queen/King Size' };
        title = labels[itemSize] || 'Colchón';
      } else if (category === 'coche') {
        const sizes = { 'completo': 85, 'delanteros': 50, 'silla-bebe': 25 };
        basePrice = sizes[itemSize] || 85;
        const labels = { 'completo': 'Tapicería Completa Coche', 'delanteros': 'Asientos Delanteros Coche', 'silla-bebe': 'Silla de Coche Bebé' };
        title = labels[itemSize] || 'Coche';
      } else if (category === 'alfombra') {
        const sizes = { 'pequena': 35, 'mediana': 60, 'grande': 90 };
        basePrice = sizes[itemSize] || 60;
        const labels = { 'pequena': 'Alfombra Pequeña (<3m²)', 'mediana': 'Alfombra Mediana (3-6m²)', 'grande': 'Alfombra Grande (>6m²)' };
        title = labels[itemSize] || 'Alfombra';
      } else if (category === 'empresa') {
        const sizes = { 'oficina10': 120, 'recepcion': 90, 'lote': 0 };
        basePrice = sizes[itemSize] ?? 0;
        const labels = { 'oficina10': 'Hasta 10 sillas de oficina', 'recepcion': 'Tapicería de recepción', 'lote': 'Lote profesional a valorar' };
        title = labels[itemSize] || 'Servicio profesional';
      }

      // Incremento por estado de mancha
      let extraText = 'Estándar';
      if (condition === 'profunda') {
        basePrice += 15;
        extraText = 'Manchas profundas / Mascotas (+15€)';
      } else if (condition === 'desinfeccion') {
        basePrice += 20;
        extraText = 'Tratamiento antiácaros & bacterias (+20€)';
      }

      // Actualizar DOM
      const priceDisplay = document.getElementById('calcTotalPrice');
      if (priceDisplay) priceDisplay.textContent = basePrice ? basePrice + '€' : 'A valorar';

      const breakdownItem = document.getElementById('calcItemSummary');
      if (breakdownItem) breakdownItem.textContent = title;

      const breakdownCondition = document.getElementById('calcConditionSummary');
      if (breakdownCondition) breakdownCondition.textContent = extraText;

      // Actualizar enlace de WhatsApp
      const waBtn = document.getElementById('calcWaBtn');
      if (waBtn) {
        const priceMessage = basePrice ? `${basePrice}€` : 'a valorar con fotografías';
        const msg = encodeURIComponent(`Hola, he calculado un presupuesto en la web:\n- Servicio: ${title}\n- Tratamiento: ${extraText}\n- Zona: ${zone}\n- Precio estimado: ${priceMessage}\nMe gustaría confirmar disponibilidad. Te envío fotos.`);
        waBtn.setAttribute('href', `https://wa.me/34655441162?text=${msg}`);
      }
    };

    calcForm.addEventListener('change', (event) => {
      if (event.target?.name === 'calc-category') syncSizeOptions(event.target.value);
      updateCalculator();
    });
    updateCalculator();
  }

  // -------- COMPROBADOR SIMPLE DE COBERTURA --------
  document.querySelectorAll('[data-coverage-checker]').forEach((checker) => {
    const select = checker.querySelector('[data-coverage-select]');
    const submit = checker.querySelector('[data-coverage-submit]');
    const result = checker.querySelector('[data-coverage-result]');
    const eyebrow = checker.querySelector('[data-coverage-eyebrow]');
    const title = checker.querySelector('[data-coverage-title]');
    const text = checker.querySelector('[data-coverage-text]');
    const whatsapp = checker.querySelector('[data-coverage-whatsapp]');
    const icon = checker.querySelector('.coverage-result-icon');
    if (!select || !submit || !result || !title || !text || !whatsapp) return;

    const showCoverage = () => {
      const value = select.value;
      if (!value) {
        select.focus();
        return;
      }

      const needsCheck = value === 'other';
      result.hidden = false;
      result.classList.toggle('is-consult', needsCheck);
      if (icon) icon.textContent = needsCheck ? '?' : '✓';

      if (needsCheck) {
        if (eyebrow) eyebrow.textContent = 'Consulta rápida';
        title.textContent = 'Comprobamos tu localidad';
        text.textContent = 'Indícanos municipio o código postal. Confirmaremos disponibilidad, ruta y cualquier condición antes de reservar.';
        whatsapp.textContent = 'Consultar por WhatsApp';
        whatsapp.href = 'https://wa.me/34655441162?text=' + encodeURIComponent('Hola, quiero saber si ofrecéis servicio en mi municipio. Mi localidad o código postal es: ');
      } else {
        if (eyebrow) eyebrow.textContent = 'Cobertura confirmada';
        title.textContent = `Sí, trabajamos en ${value}`;
        text.textContent = 'Desplazamiento incluido. Revisamos tus fotos y confirmamos precio y disponibilidad antes de acordar la cita.';
        whatsapp.textContent = 'Pedir presupuesto';
        whatsapp.href = 'https://wa.me/34655441162?text=' + encodeURIComponent(`Hola, quiero pedir presupuesto para una limpieza de tapicería en ${value}. Adjunto fotos.`);
      }
    };

    select.addEventListener('change', () => {
      submit.disabled = !select.value;
      result.hidden = true;
    });
    submit.addEventListener('click', showCoverage);

    checker.querySelectorAll('[data-coverage-choice]').forEach((choice) => {
      choice.addEventListener('click', () => {
        select.value = choice.dataset.coverageChoice;
        submit.disabled = false;
        showCoverage();
      });
    });
  });


  // -------- SOLICITUD GUIADA DE CONTACTO --------
  document.querySelectorAll('[data-contact-planner]').forEach((planner) => {
    const service = planner.querySelector('[data-contact-service]');
    const town = planner.querySelector('[data-contact-town]');
    const details = planner.querySelector('[data-contact-details]');
    const submit = planner.querySelector('[data-contact-submit]');
    const servicePreview = planner.querySelector('[data-contact-preview-service]');
    const townPreview = planner.querySelector('[data-contact-preview-town]');
    if (!service || !town || !details || !submit) return;

    const syncContactPlanner = () => {
      const selectedService = service.value;
      const selectedTown = town.value.trim();
      if (servicePreview) servicePreview.textContent = selectedService || 'Sin seleccionar';
      if (townPreview) townPreview.textContent = selectedTown || 'Sin indicar';
      submit.disabled = !(selectedService && selectedTown);
    };

    planner.addEventListener('input', syncContactPlanner);
    planner.addEventListener('change', syncContactPlanner);
    planner.addEventListener('submit', (event) => {
      event.preventDefault();
      const selectedService = service.value;
      const selectedTown = town.value.trim();
      if (!selectedService) {
        service.focus();
        return;
      }
      if (!selectedTown) {
        town.focus();
        return;
      }

      const optionalDetails = details.value.trim();
      const message = [
        'Hola, quiero solicitar presupuesto.',
        `Servicio: ${selectedService}`,
        `Municipio: ${selectedTown}`,
        optionalDetails ? `Detalles: ${optionalDetails}` : null,
        'Ahora adjunto fotografías para que podáis valorar el trabajo.'
      ].filter(Boolean).join('\n');
      window.open(`https://wa.me/34655441162?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
    syncContactPlanner();
  });

  // -------- FILTRO DE PESTAÑAS EN GALERÍA ANTES Y DESPUÉS --------
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  if (galleryTabs.length > 0) {
    galleryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        galleryTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        const items = document.querySelectorAll('.ba-card');
        items.forEach((item) => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
})();
