// Sitio de limpieza profesional — interacciones

(function () {
  let closeMobileNav = () => {};
  let closeServiceChooser = () => {};

  // -------- Atmósfera temática específica de cada página --------
  const pageEffects = {
    'index': 'bubbles',
    'servicios': 'scanner',
    'sofas': 'steam',
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

  // -------- Identidad única Lava Express --------
  document.documentElement.dataset.brand = 'lava-express';
  delete document.documentElement.dataset.theme;
  try { localStorage.removeItem('fcm-theme'); } catch (_) { /* Preferencia antigua opcional */ }

  const setupBrandIdentity = () => {
    document.title = document.title.includes('Lava Express')
      ? document.title
      : `${document.title} | Lava Express`;

    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      document.head.appendChild(themeColor);
    }
    themeColor.content = '#06152F';

    [
      { rel: 'icon', sizes: '512x512' },
      { rel: 'apple-touch-icon', sizes: '512x512' }
    ].forEach(({ rel, sizes }) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.type = 'image/png';
      link.sizes = sizes;
      link.href = 'assets/lava-express-icon.png';
    });

    document.querySelectorAll('.brand').forEach((brand) => {
      brand.setAttribute('aria-label', 'Lava Express · Inicio');
      brand.innerHTML = '<img class="brand-logo" src="assets/lava-express-horizontal.png" alt="Lava Express · Lavado a vapor" />';
    });
    document.querySelectorAll('.footer-service-label').forEach((label) => {
      label.innerHTML = '<img class="footer-logo" src="assets/lava-express-horizontal.png" alt="Lava Express · Lavado a vapor" loading="lazy" />';
    });

    document.querySelectorAll('.footer-meta').forEach((meta) => {
      if (meta.textContent.includes('Limpieza profesional en Madrid')) {
        meta.innerHTML = `© <span id="year"></span> Lava Express · Lavado a vapor en Madrid.`;
      }
    });

    document.querySelectorAll('.site-footer .footer-inner').forEach((footer) => {
      if (!footer.querySelector('.footer-tagline')) {
        const tagline = document.createElement('p');
        tagline.className = 'footer-tagline';
        tagline.textContent = 'Lavado a vapor y limpieza profesional de tapicerías a domicilio en Madrid.';
        const firstParagraph = footer.querySelector('p');
        footer.insertBefore(tagline, firstParagraph || null);
      }
      if (footer.querySelector('.footer-legal-nav')) return;
      const legal = document.createElement('nav');
      legal.className = 'footer-legal-nav';
      legal.setAttribute('aria-label', 'Información legal');
      legal.innerHTML = '<a href="aviso-legal.html">Aviso legal</a><a href="privacidad.html">Privacidad</a><a href="cookies.html">Cookies</a><a href="condiciones-servicio.html">Condiciones del servicio</a>';
      footer.appendChild(legal);
    });
  };

  setupBrandIdentity();

  // -------- Selector directo de familia de servicio --------
  const setupServiceChooser = () => {
    const headerInner = document.querySelector('.header-inner');
    const headerCta = headerInner?.querySelector('.header-cta');
    if (!headerInner || !headerCta || headerInner.querySelector('.service-chooser')) return;

    const chooser = document.createElement('div');
    chooser.className = 'service-chooser';
    chooser.innerHTML = `
      <button type="button" class="service-chooser-trigger" data-service-chooser-trigger aria-expanded="false" aria-haspopup="true">
        <span>¿Qué necesitas limpiar?</span><b aria-hidden="true">⌄</b>
      </button>
      <div class="service-chooser-menu" data-service-chooser-menu hidden>
        <span class="service-chooser-kicker">Ir directamente a</span>
        <a href="servicios.html#hogar"><strong>Hogar</strong><small>Sofás, sillas y colchones</small></a>
        <a href="servicios.html#textiles"><strong>Textiles</strong><small>Alfombras, moquetas y cortinas</small></a>
        <a href="servicios.html#movilidad"><strong>Vehículos y bebé</strong><small>Coches, carritos y sillas infantiles</small></a>
        <a href="servicios.html#profesional"><strong>Empresas</strong><small>Oficinas, alojamientos y locales</small></a>
      </div>`;
    headerInner.insertBefore(chooser, headerCta);

    const trigger = chooser.querySelector('[data-service-chooser-trigger]');
    const menu = chooser.querySelector('[data-service-chooser-menu]');
    const closeChooser = () => {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    };
    closeServiceChooser = closeChooser;
    trigger.addEventListener('click', () => {
      const willOpen = menu.hidden;
      if (willOpen) {
        closeMobileNav();
      }
      menu.hidden = !willOpen;
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
    chooser.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeChooser));
    document.addEventListener('click', (event) => {
      if (!chooser.contains(event.target)) closeChooser();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) {
        closeChooser();
        trigger.focus();
      }
    });
  };

  setupServiceChooser();

  // -------- Menú móvil --------
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    const servicePages = new Set(['servicios', 'sofas', 'sillas-butacas', 'colchones', 'alfombras', 'coches', 'empresas']);
    const homePages = new Set(['index', 'antes-despues', 'blog', 'guia-limpiar-sofa', 'guia-acaros-colchon', 'guia-tapiceria-coche']);
    const activeSection = servicePages.has(pageSlug) ? 'servicios' : homePages.has(pageSlug) ? 'index' : pageSlug;
    const mainNavigation = [
      ['index', 'index.html', 'Inicio'],
      ['servicios', 'servicios.html', 'Servicios'],
      ['tarifas', 'tarifas.html', 'Precios'],
      ['zonas-madrid', 'zonas-madrid.html', 'Zonas'],
      ['contacto', 'contacto.html', 'Contacto']
    ];
    nav.innerHTML = mainNavigation.map(([key, href, label]) => {
      if (key !== 'servicios') return `<a href="${href}"${key === activeSection ? ' class="active"' : ''}>${label}</a>`;
      return `<div class="nav-dropdown${key === activeSection ? ' is-active' : ''}">
        <button class="nav-dropdown-trigger${key === activeSection ? ' active' : ''}" type="button" aria-expanded="false" aria-haspopup="true">${label}<span aria-hidden="true">⌄</span></button>
        <div class="nav-dropdown-menu" role="menu">
          <a href="servicios.html" role="menuitem"><strong>Todos los servicios</strong><small>Ver el catálogo completo</small></a>
          <a href="sofas.html" role="menuitem"><strong>Sofás</strong><small>Tapicería y chaise longue</small></a>
          <a href="sillas-butacas.html" role="menuitem"><strong>Sillas y butacas</strong><small>Asientos, respaldos y orejeros</small></a>
          <a href="colchones.html" role="menuitem"><strong>Colchones</strong><small>Higiene y tratamiento antiácaros</small></a>
          <a href="alfombras.html" role="menuitem"><strong>Alfombras y textiles</strong><small>Limpieza por m²</small></a>
          <a href="coches.html" role="menuitem"><strong>Vehículos y bebé</strong><small>Tapicería interior</small></a>
          <a href="empresas.html" role="menuitem"><strong>Empresas</strong><small>Oficinas y alojamientos</small></a>
        </div>
      </div>`;
    }).join('');

    const serviceDropdown = nav.querySelector('.nav-dropdown');
    const serviceTrigger = nav.querySelector('.nav-dropdown-trigger');
    const closeServiceDropdown = () => {
      if (!serviceDropdown || !serviceTrigger) return;
      serviceDropdown.classList.remove('open');
      serviceTrigger.setAttribute('aria-expanded', 'false');
    };
    serviceTrigger?.addEventListener('click', () => {
      const open = serviceDropdown.classList.toggle('open');
      serviceTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    if (!nav.querySelector('.nav-mobile-head')) {
      nav.insertAdjacentHTML('afterbegin', `
        <div class="nav-mobile-head">
          <span class="nav-mobile-kicker">Servicio en Madrid</span>
          <strong>Todo lo importante, a un toque</strong>
          <small>Servicios, precios, zonas y contacto.</small>
        </div>`);
      nav.insertAdjacentHTML('beforeend', `
        <div class="nav-mobile-services">
          <span>¿Qué necesitas limpiar?</span>
          <div><a href="servicios.html#hogar">Hogar</a><a href="servicios.html#textiles">Textiles</a><a href="servicios.html#movilidad">Vehículos y bebé</a><a href="servicios.html#profesional">Empresas</a></div>
        </div>
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
      if (willOpen) { closeServiceChooser(); closeServiceDropdown(); }
      setNavOpen(willOpen);
    });
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        setNavOpen(false);
        closeServiceDropdown();
      })
    );
    document.addEventListener('click', (event) => {
      if (serviceDropdown && !serviceDropdown.contains(event.target)) closeServiceDropdown();
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

  // -------- Recorrido uniforme de decisión en cada servicio --------
  const serviceBlueprints = {
    sofas: {
      label: 'Sofás y chaise longue',
      clean: 'Sofás de 1 a 5+ plazas, chaise longue, rinconeras y sillones tapizados.',
      problems: 'Suciedad de uso, polvo, cercos, manchas localizadas y olores. La viabilidad se confirma al revisar el tejido.',
      price: 'Desde 50€ para una plaza, 75€ para dos y 90€ para tres. Precio final confirmado mediante fotografías.',
      process: 'Revisión, aspirado, producto compatible, trabajo de zonas críticas y extracción controlada.',
      drying: 'Habitualmente dentro de 24 horas, según relleno, ventilación, temperatura y época del año.',
      faq: [['¿Se eliminan todas las manchas?', 'No se puede garantizar sin revisar su origen, antigüedad y los productos aplicados anteriormente.'], ['¿Hay que mover el sofá?', 'No. Trabajamos a domicilio y te indicamos antes cómo despejar la zona.']],
      whatsapp: 'Hola, quiero presupuesto para limpiar un sofá. Plazas: ____. Municipio: ____. Adjunto fotos.',
      related: [['Sillas y butacas', 'sillas-butacas.html'], ['Alfombras y textiles', 'alfombras.html'], ['Colchones', 'colchones.html']]
    },
    'sillas-butacas': {
      label: 'Sillas y butacas',
      clean: 'Sillas de comedor, butacas, orejeros, bancos tapizados, pufs y reposapiés.',
      problems: 'Manchas de comida o bebida, suciedad de uso, roce en respaldos y reposabrazos y olores.',
      price: 'Desde 10€/unidad para asiento, 15€/unidad para silla completa y 40€ para butaca. Mínimo de servicio: 40€.',
      process: 'Clasificamos piezas y tejidos, protegemos estructuras, tratamos cada zona y realizamos extracción controlada.',
      drying: 'Depende del relleno y del número de caras tapizadas. Damos una recomendación concreta al finalizar.',
      faq: [['¿Se pueden limpiar conjuntos completos?', 'Sí. Valoramos el lote completo para optimizar el desplazamiento y el tiempo de trabajo.'], ['¿Tratáis madera o metal?', 'Protegemos la estructura, pero el servicio presupuestado corresponde a la parte tapizada.']],
      whatsapp: 'Hola, quiero presupuesto para sillas o butacas. Cantidad: ____. Municipio: ____. Adjunto fotos.',
      related: [['Sofás', 'sofas.html'], ['Servicios para empresas', 'empresas.html'], ['Alfombras y textiles', 'alfombras.html']]
    },
    colchones: {
      label: 'Colchones',
      clean: 'Colchones individuales, de matrimonio, queen y king, además de bases y cabeceros bajo valoración.',
      problems: 'Polvo, suciedad acumulada, manchas orgánicas, cercos y olores. Explicamos qué resultado es razonable esperar.',
      price: 'Desde 55€ individual, 70€ matrimonio y 85€ queen o king. Se confirma tras revisar tamaño y caras.',
      process: 'Inspección, aspirado, tratamiento localizado y extracción adaptada al material y al estado del colchón.',
      drying: 'Debe quedar bien ventilado y no utilizarse hasta completar el secado. El tiempo varía según humedad y tejido.',
      faq: [['¿Se limpian las dos caras?', 'Podemos presupuestar una o dos caras. Indícalo al enviar las fotografías.'], ['¿Se puede dormir esa misma noche?', 'Depende de la ventilación y la hora del servicio; te lo indicaremos antes de reservar.']],
      whatsapp: 'Hola, quiero presupuesto para un colchón. Medida: ____. Caras: ____. Municipio: ____. Adjunto fotos.',
      related: [['Sofás', 'sofas.html'], ['Sillas y butacas', 'sillas-butacas.html'], ['Alfombras y textiles', 'alfombras.html']]
    },
    alfombras: {
      label: 'Alfombras y textiles',
      clean: 'Alfombras, moquetas, cortinas y visillos compatibles con tratamiento a domicilio.',
      problems: 'Polvo, suciedad de paso, manchas, olores y pérdida de aspecto. Revisamos composición y sistema de instalación.',
      price: 'Alfombras desde 10€/m² y moquetas desde 8€/m². Medidas, fibra y accesibilidad determinan el importe final.',
      process: 'Identificación de fibra, prueba de estabilidad, aspirado, tratamiento localizado y extracción cuando procede.',
      drying: 'Varía especialmente por grosor, superficie y ventilación. Te indicamos cómo colocar y ventilar cada pieza.',
      faq: [['¿Limpiáis cualquier alfombra?', 'Primero revisamos etiqueta, fibra, base y estabilidad del color. Algunas piezas requieren otro procedimiento.'], ['¿Hay que descolgar las cortinas?', 'Depende del tejido y la instalación; lo confirmamos con fotografías.']],
      whatsapp: 'Hola, quiero presupuesto para alfombra, moqueta o cortinas. Medidas: ____. Municipio: ____. Adjunto fotos.',
      related: [['Sofás', 'sofas.html'], ['Colchones', 'colchones.html'], ['Servicios para empresas', 'empresas.html']]
    },
    coches: {
      label: 'Vehículos y bebé',
      clean: 'Asientos y tapicerías de coche, además de carritos y sillas infantiles desmontables bajo valoración.',
      problems: 'Suciedad de uso, manchas de bebida o comida, huellas, polvo y olores en superficies textiles.',
      price: 'Tapicería completa desde 85€, carritos desde 25€ y sillas infantiles desde 25€.',
      process: 'Revisamos accesos y materiales, aspiramos, tratamos manchas y extraemos la suciedad con humedad controlada.',
      drying: 'El vehículo o pieza debe permanecer ventilado hasta completar el secado antes de volver a utilizarse.',
      faq: [['¿Necesitáis toma de corriente?', 'Te confirmaremos los requisitos del servicio y el espacio necesario antes de cerrar la cita.'], ['¿Limpiáis techo y paneles?', 'Se valoran según material, estado y riesgo de desprendimiento. Envíanos fotografías específicas.']],
      whatsapp: 'Hola, quiero presupuesto para vehículo o artículo infantil. Tipo: ____. Municipio: ____. Adjunto fotos.',
      related: [['Sofás', 'sofas.html'], ['Sillas y butacas', 'sillas-butacas.html'], ['Servicios para empresas', 'empresas.html']]
    },
    empresas: {
      label: 'Empresas y alojamientos',
      clean: 'Sillas de oficina, recepciones, butacas, colchones, cabeceros, alfombras y moquetas por lotes.',
      problems: 'Suciedad de uso intensivo, manchas localizadas y desgaste visual en espacios de atención o trabajo.',
      price: 'Presupuesto por volumen, superficies, accesibilidad y planificación. Los lotes se valoran mediante inventario y fotos.',
      process: 'Inventario, valoración, plan por zonas, ejecución coordinada y recomendación de mantenimiento.',
      drying: 'Planificamos las zonas para respetar ventilación y secado sin bloquear toda la actividad del espacio.',
      faq: [['¿Podéis trabajar por fases?', 'Sí. Podemos organizar el servicio por plantas, salas o grupos de piezas.'], ['¿Ofrecéis mantenimiento periódico?', 'Se estudia según volumen, frecuencia y necesidades reales del negocio.']],
      whatsapp: 'Hola, solicito presupuesto profesional. Tipo de negocio: ____. Piezas: ____. Municipio: ____. Adjunto fotos.',
      related: [['Sillas y butacas', 'sillas-butacas.html'], ['Alfombras y moquetas', 'alfombras.html'], ['Colchones', 'colchones.html']]
    }
  };

  const setupServiceDecisionGuide = () => {
    const data = serviceBlueprints[pageSlug];
    const hero = document.querySelector('.page-hero');
    if (!data || !hero || document.querySelector('.service-decision-section')) return;
    // Todas las fichas muestran siempre un bloque de FAQ completo, incluso si
    // una futura plantilla solo define dos preguntas específicas.
    const faqItems = [...(data.faq || [])];
    if (faqItems.length < 3) {
      faqItems.push(['¿Cómo recibo el presupuesto?', 'Envíanos municipio, tipo de pieza y dos o tres fotografías por WhatsApp. Confirmamos el importe antes de reservar.']);
    }
    const guide = document.createElement('section');
    guide.className = 'section service-decision-section';
    guide.innerHTML = `
      <div class="container">
        <header class="section-head service-decision-head" data-reveal>
          <p class="eyebrow">Todo lo necesario antes de reservar</p>
          <h2>${data.label}: información clara en 7 pasos</h2>
          <p class="section-sub">Revisa alcance, precio y condiciones. Si encaja contigo, envíanos las fotos desde el último paso.</p>
        </header>
        <ol class="service-decision-grid">
          <li data-reveal><span>01</span><div><small>Qué limpiamos</small><p>${data.clean}</p></div></li>
          <li data-reveal><span>02</span><div><small>Qué problemas tratamos</small><p>${data.problems}</p></div></li>
          <li data-reveal><span>03</span><div><small>Precio orientativo</small><p>${data.price}</p></div></li>
          <li data-reveal><span>04</span><div><small>Cómo trabajamos</small><p>${data.process}</p></div></li>
          <li data-reveal><span>05</span><div><small>Tiempo de secado</small><p>${data.drying}</p></div></li>
          <li class="service-decision-faq" data-reveal><span>06</span><div><small>Preguntas frecuentes</small>${faqItems.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></li>
          <li class="service-decision-cta" data-reveal><span>07</span><div><small>Solicita tu presupuesto</small><p>Envía fotografías, cantidad y municipio. Confirmaremos alcance y precio antes de reservar.</p><a class="btn btn-primary" href="https://wa.me/34655441162?text=${encodeURIComponent(data.whatsapp)}" target="_blank" rel="noopener">Enviar fotos y recibir precio</a><em class="whatsapp-response-note">Respuesta habitual: en horario comercial.</em></div></li>
        </ol>
      </div>`;
    hero.insertAdjacentElement('afterend', guide);

    const related = document.createElement('section');
    related.className = 'section related-services';
    related.innerHTML = `<div class="container"><header class="section-head" data-reveal><p class="eyebrow">Completa el servicio</p><h2>También puede interesarte</h2></header><div class="related-services-grid">${data.related.map(([label, href], index) => `<a href="${href}" data-reveal><span>0${index + 1}</span><strong>${label}</strong><b aria-hidden="true">→</b></a>`).join('')}</div></div>`;
    const finalCta = document.querySelector('.contact-cta');
    const footer = document.querySelector('.site-footer');
    (finalCta || footer)?.insertAdjacentElement('beforebegin', related);
  };

  setupServiceDecisionGuide();

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
    const postcode = checker.querySelector('[data-coverage-postcode]');
    const submit = checker.querySelector('[data-coverage-submit]');
    const result = checker.querySelector('[data-coverage-result]');
    const eyebrow = checker.querySelector('[data-coverage-eyebrow]');
    const title = checker.querySelector('[data-coverage-title]');
    const text = checker.querySelector('[data-coverage-text]');
    const whatsapp = checker.querySelector('[data-coverage-whatsapp]');
    const icon = checker.querySelector('.coverage-result-icon');
    if (!select || !submit || !result || !title || !text || !whatsapp) return;

    const showCoverage = () => {
      const postcodeValue = postcode?.value.trim() || '';
      const value = select.value || '';
      if (!value && !postcodeValue) {
        (postcode || select).focus();
        return;
      }

      const location = postcodeValue || value;
      const needsCheck = value === 'other' || Boolean(postcodeValue);
      result.hidden = false;
      result.classList.toggle('is-consult', needsCheck);
      if (icon) icon.textContent = needsCheck ? '?' : '✓';

      if (needsCheck) {
        if (eyebrow) eyebrow.textContent = 'Consulta rápida';
        title.textContent = 'Comprobamos tu localidad';
        text.textContent = 'Confirmaremos disponibilidad, ruta y cualquier posible suplemento antes de reservar. No se confirma una cita sin revisar primero tus fotos.';
        whatsapp.textContent = 'Consultar por WhatsApp';
        whatsapp.href = 'https://wa.me/34655441162?text=' + encodeURIComponent(`Hola, quiero comprobar cobertura. Mi municipio o código postal es: ${location}. Adjunto fotos.`);
      } else {
        if (eyebrow) eyebrow.textContent = 'Cobertura confirmada';
        title.textContent = `Sí, trabajamos en ${value}`;
        text.textContent = 'Desplazamiento incluido. Revisamos tus fotos y confirmamos precio y disponibilidad antes de acordar la cita.';
        whatsapp.textContent = 'Pedir presupuesto';
        whatsapp.href = 'https://wa.me/34655441162?text=' + encodeURIComponent(`Hola, quiero pedir presupuesto para una limpieza de tapicería en ${location}. Adjunto fotos.`);
      }
    };

    const syncCoverageButton = () => {
      submit.disabled = !(select.value || postcode?.value.trim());
      result.hidden = true;
    };
    select.addEventListener('change', syncCoverageButton);
    postcode?.addEventListener('input', syncCoverageButton);
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

  // -------- MENSAJE CLARO DE CONVERSIÓN --------
  document.querySelectorAll('#calcWaBtn, [data-contact-submit]').forEach((button) => {
    button.textContent = 'Enviar fotos y recibir precio';
  });
  document.querySelectorAll('.booking-flow > .btn, .contact-cta .btn-primary').forEach((button) => {
    if (/WhatsApp|Empezar por/.test(button.textContent)) button.textContent = 'Enviar fotos y recibir precio';
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
