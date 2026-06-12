/* ══════════════════════════════════════════════
   MONEDITO — app.js
══════════════════════════════════════════════ */

/* ─── 1. MOBILE NAV ─────────────────────────── */
(function initNav() {
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => menu.classList.toggle('open'));

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });

  document.addEventListener('click', e => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
})();

/* ─── 2. NAV SCROLL + PROGRESS BAR ─────────── */
(function initNavScroll() {
  const nav      = document.querySelector('.nav');
  const progress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const sy    = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('scrolled',      sy > 12);
    nav.classList.toggle('nav--scrolled', sy > 50);
    if (progress && total > 0) progress.style.width = (sy / total * 100).toFixed(1) + '%';
  }, { passive: true });
})();

/* ─── 3. THEME SWITCHER ─────────────────────── */
class ThemeSwitcher {
  constructor() {
    this.btns    = document.querySelectorAll('.ts-btn');
    this.body    = document.body;
    this.current = localStorage.getItem('monedito-theme') || 'pink';
    this.apply(this.current, false);
    this.btns.forEach(btn => btn.addEventListener('click', () => {
      if (btn.dataset.theme !== this.current) this.apply(btn.dataset.theme, true);
    }));
  }

  apply(theme, animate) {
    if (animate) {
      this.body.classList.add('theme-transitioning');
      setTimeout(() => this.body.classList.remove('theme-transitioning'), 650);
    }
    this.body.setAttribute('data-theme', theme);
    this.current = theme;
    localStorage.setItem('monedito-theme', theme);
    this.btns.forEach(b => b.classList.toggle('ts-btn--active', b.dataset.theme === theme));
    const cursorDot = document.getElementById('cursorDot');
    if (cursorDot) {
      cursorDot.style.background = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary').trim();
    }
  }
}

/* ─── 4. CUSTOM CURSOR ──────────────────────── */
class CustomCursor {
  constructor() {
    this.cursor  = document.getElementById('cursor');
    this.dot     = document.getElementById('cursorDot');
    if (!this.cursor || getComputedStyle(this.cursor).display === 'none') return;

    this.mouseX  = 0; this.mouseY  = 0;
    this.cursorX = 0; this.cursorY = 0;
    this.visible = false;
    this.initListeners();
    this.animate();
  }

  initListeners() {
    document.addEventListener('mousemove', e => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.dot.style.left = e.clientX + 'px';
      this.dot.style.top  = e.clientY + 'px';
      if (!this.visible) {
        this.visible = true;
        this.cursor.classList.add('visible');
      }
    });

    document.addEventListener('mouseleave', () => {
      this.cursor.classList.remove('visible');
      this.visible = false;
    });

    document.addEventListener('mousedown', () => {
      this.cursor.classList.remove('hovering');
      this.cursor.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => this.cursor.classList.remove('clicking'));

    document.querySelectorAll('a, button, .plan, .store, .ts-btn, .sp-card').forEach(el => {
      el.addEventListener('mouseenter', () => this.cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => this.cursor.classList.remove('hovering'));
    });
  }

  animate() {
    this.cursorX += (this.mouseX - this.cursorX) * 0.11;
    this.cursorY += (this.mouseY - this.cursorY) * 0.11;
    this.cursor.style.left = this.cursorX + 'px';
    this.cursor.style.top  = this.cursorY + 'px';
    requestAnimationFrame(() => this.animate());
  }
}

/* ─── 5. TILT 3D ────────────────────────────── */
function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const rx = ((e.clientY - top  - height / 2) / (height / 2)) * -6;
      const ry = ((e.clientX - left - width  / 2) / (width  / 2)) *  6;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ─── 6. CONFETTI ───────────────────────────── */
function spawnConfetti(originX, originY) {
  const COLORS = ['#f472b6','#ec4899','#818cf8','#60a5fa','#34d399','#fbbf24','#f97316','#fb7185'];
  for (let i = 0; i < 32; i++) {
    const p     = document.createElement('div');
    const angle = Math.random() * 2 * Math.PI;
    const speed = 90 + Math.random() * 180;
    const size  = 5 + Math.random() * 7;
    p.className = 'confetti-particle';
    p.style.cssText = [
      `left:${originX}px`, `top:${originY}px`,
      `width:${size}px`, `height:${size}px`,
      `background:${COLORS[Math.floor(Math.random() * COLORS.length)]}`,
      `border-radius:${Math.random() > .5 ? '50%' : '2px'}`,
      `--dx:${Math.cos(angle) * speed}px`,
      `--dy:${Math.sin(angle) * speed - (100 + Math.random() * 100)}px`,
      `--rot:${Math.random() * 720 - 360}deg`,
      `animation-duration:${.7 + Math.random() * .4}s`,
      `animation-delay:${Math.random() * .1}s`,
    ].join(';');
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove(), { once: true });
  }
}

function initConfetti() {
  document.querySelectorAll('.confetti-trigger').forEach(btn => {
    btn.addEventListener('click', e => spawnConfetti(e.clientX, e.clientY));
  });
}

/* ─── 7. SCROLL REVEAL (unified) ────────────── */
function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Primary: .reveal → .visible (most elements)
  const primaryObs = new IntersectionObserver((entries, self) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('visible');
      self.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Secondary: .faq-item, .sp-card → .is-visible (separate CSS animation)
  const cardObs = new IntersectionObserver((entries, self) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-visible');
      self.unobserve(en.target);
    });
  }, { threshold: 0.12 });

  // Feature list stagger: .feature → .li--visible on each li
  const featureObs = new IntersectionObserver((entries, self) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      self.unobserve(en.target);
      en.target.querySelectorAll('.feature__list li').forEach((li, i) => {
        setTimeout(() => li.classList.add('li--visible'), i * 80);
      });
    });
  }, { threshold: 0.15 });

  // Single elements
  document.querySelector('.cta__box')?.classList.add('reveal');
  document.querySelector('.cta__box') && primaryObs.observe(document.querySelector('.cta__box'));

  // Grid stagger groups
  [
    { selector: '.steps',         child: '.step' },
    { selector: '.pricing__grid', child: '.plan' },
    { selector: '.sec-grid',      child: '.sec-badge' },
  ].forEach(({ selector, child }) => {
    document.querySelectorAll(`${selector} ${child}`).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.1}s`;
      primaryObs.observe(el);
    });
  });

  // Section headers
  document.querySelectorAll(
    '.pricing__head, .how__head, .faq__head, .security__head, .cmp__head'
  ).forEach(el => { el.classList.add('reveal'); primaryObs.observe(el); });

  // Feature copy + visual (stagger per pair)
  document.querySelectorAll('.feature__copy, .feature__visual').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 2) * 0.12}s`;
    primaryObs.observe(el);
  });

  // Cards with is-visible (stagger siblings)
  document.querySelectorAll('.faq__list, .sp__grid').forEach(parent => {
    parent.querySelectorAll('.faq-item, .sp-card').forEach((el, i) => {
      el.style.transitionDelay = `${i * 70}ms`;
      cardObs.observe(el);
    });
  });

  // Feature list stagger
  document.querySelectorAll('.feature').forEach(f => {
    f.classList.add('anim-ready');
    featureObs.observe(f);
  });
}

/* ─── 8. ANIMATED COUNTERS ──────────────────── */
function initCounters() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cfg      = window.MONEDITO_CURRENCY?.config ?? { rate: 1000, locale: 'es-CO', code: 'COP', compact: true };
  const duration = 1100;

  const fmt = (usdAbs) => {
    const val  = Math.round(usdAbs * cfg.rate);
    const opts = { style: 'currency', currency: cfg.code, maximumFractionDigits: 0 };
    if (cfg.compact && val >= 1_000_000) {
      Object.assign(opts, { notation: 'compact', compactDisplay: 'short', maximumSignificantDigits: 3 });
    }
    return new Intl.NumberFormat(cfg.locale, opts).format(val);
  };

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const obs = new IntersectionObserver((entries, self) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      self.unobserve(en.target);

      const el  = en.target;
      const raw = parseFloat(el.dataset.usd);
      if (isNaN(raw)) return;

      const sign  = raw < 0 ? '−' : (el.dataset.sign === '+' ? '+' : '');
      const start = performance.now();

      (function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = sign + fmt(Math.abs(raw) * easeOut(t));
        if (t < 1) requestAnimationFrame(tick);
      })(performance.now());
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-usd]').forEach(el => obs.observe(el));
}

/* ─── 9. HERO TYPEWRITER ─────────────────────── */
function initHeroTyper() {
  const el = document.getElementById('heroTyper');
  if (!el) return;

  const phrases = [
    'La IA registra todo.',
    'Sin planillas. Sin estrés.',
    'Pregúntale lo que quieras.',
    'La IA analiza y avisa.',
    'Tu plata, en orden.',
    'Sin abrir ninguna app.',
    'La IA hace el trabajo.',
    'Y tus metas avanzan.',
    'Listo — en segundos.',
    'Solo habla. Nada más.',
  ];

  const SHOW = 57000;
  const TSPD = 52;
  const DSPD = 24;
  let idx = 0;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cursor = document.querySelector('.typer-cursor');
    if (cursor) cursor.style.display = 'none';
    setInterval(() => {
      el.style.transition = 'opacity .35s';
      el.style.opacity = '0';
      setTimeout(() => {
        idx = (idx + 1) % phrases.length;
        el.textContent = phrases[idx];
        el.style.opacity = '1';
      }, 380);
    }, 15000);
    return;
  }

  function type(phrase, cb) {
    let i = 0;
    el.textContent = '';
    (function next() {
      if (i < phrase.length) { el.textContent += phrase[i++]; setTimeout(next, TSPD); }
      else cb();
    })();
  }

  function erase(cb) {
    (function next() {
      const len = el.textContent.length;
      if (len > 0) { el.textContent = el.textContent.slice(0, -1); setTimeout(next, DSPD); }
      else cb();
    })();
  }

  function cycle() {
    type(phrases[idx], () => {
      setTimeout(() => erase(() => { idx = (idx + 1) % phrases.length; setTimeout(cycle, 220); }), SHOW);
    });
  }

  setTimeout(() => erase(() => { idx = 1; setTimeout(cycle, 220); }), SHOW);
}

/* ─── 10. VOICE DEMO ─────────────────────────── */
function initVoiceDemo() {
  const btn  = document.getElementById('voiceBtn');
  const demo = document.getElementById('voiceDemo');
  if (!btn || !demo) return;

  const DEMOS = [
    { user: '"Gasté $350 en el súper hoy"',       ai: 'Listo — Registré $350 en Comida. Llevas 76% del presupuesto mensual.' },
    { user: '"¿Cuánto gasté esta semana?"',        ai: 'Esta semana gastaste $1,240. Tu mayor gasto fue Comida con $480.' },
    { user: '"Pagué Netflix, $15"',                ai: 'Registrado — $15 en Subscripciones. Tienes 3 suscripciones activas este mes.' },
    { user: '"Quiero ahorrar $2,000 para un viaje"', ai: 'Perfecto. Ahorrando $500 por mes lo logras en 4 meses. ¿Empezamos hoy?' },
    { user: '"¿Estoy dentro del presupuesto?"',    ai: 'Sí — llevas 61% del gasto mensual con 68% del mes transcurrido. Vas muy bien.' },
    { user: '"¿Cuánto gasté en delivery este mes?"', ai: 'Gastaste $320 en delivery — $95 más que el mes pasado. ¿Quieres que te avise si superas $250?' },
  ];

  let idx   = 0;
  let timer = null;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    clearTimeout(timer);
    runDemo();
  });

  window.addEventListener('scroll', () => {
    if (!demo.classList.contains('open')) return;
    const r = btn.getBoundingClientRect();
    demo.style.left = r.left + 'px';
    demo.style.top  = (r.bottom + 12) + 'px';
  }, { passive: true });

  document.addEventListener('click', e => {
    if (demo.classList.contains('open') && !demo.contains(e.target)) {
      clearTimeout(timer);
      demo.classList.remove('open');
      demo.setAttribute('aria-hidden', 'true');
    }
  });

  function setStatus(text) {
    const el = document.getElementById('vdStatus');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = text; el.style.opacity = '1'; }, 120);
  }

  function runDemo() {
    const conv   = DEMOS[idx % DEMOS.length];
    const wave   = document.getElementById('vdWave');
    const userEl = document.getElementById('vdUser');
    const respEl = document.getElementById('vdResponse');
    const bubble = document.getElementById('vdBubble');
    const status = document.getElementById('vdStatus');
    idx++;

    userEl.textContent = '';
    bubble.textContent = '';
    userEl.classList.remove('visible');
    respEl.classList.remove('visible');
    wave.classList.remove('done');
    if (status) { status.style.opacity = '1'; status.textContent = 'Escuchando...'; }
    wave.classList.add('listening');

    const rect = btn.getBoundingClientRect();
    demo.style.left = rect.left + 'px';
    demo.style.top  = (rect.bottom + 12) + 'px';
    demo.classList.add('open');
    demo.setAttribute('aria-hidden', 'false');

    timer = setTimeout(() => {
      wave.classList.remove('listening');
      wave.classList.add('done');
      setStatus('Procesando...');

      setTimeout(() => {
        userEl.classList.add('visible');
        typeText(userEl, conv.user, 22, () => {
          timer = setTimeout(() => {
            setStatus('Monedito');
            respEl.classList.add('visible');
            typeText(bubble, conv.ai, 14, () => {
              timer = setTimeout(() => {
                demo.classList.remove('open');
                demo.setAttribute('aria-hidden', 'true');
              }, 2200);
            });
          }, 280);
        });
      }, 120);
    }, 1100);
  }
}

function typeText(el, text, speed, callback) {
  let i = 0;
  el.textContent = '';
  (function next() {
    if (i < text.length) { el.textContent += text[i++]; setTimeout(next, speed); }
    else if (callback) callback();
  })();
}

/* ─── 11. PHONE STAGE SWITCHER ──────────────── */
function initPhoneStage() {
  const nav   = document.getElementById('phoneNav');
  const stage = document.getElementById('phoneStage');
  if (!nav || !stage) return;

  const cards   = Array.from(stage.querySelectorAll('.phone-card'));
  const navBtns = Array.from(nav.querySelectorAll('.phone-nav__btn'));
  let current   = 0;
  let animating = false;
  let autoTimer = null;

  function switchTo(idx) {
    if (idx === current || animating) return;
    animating = true;

    const prev    = current;
    const dir     = idx > prev ? 1 : -1;
    current       = idx;

    const outCard = cards[prev];
    const inCard  = cards[current];

    navBtns[prev].classList.remove('phone-nav__btn--active');
    navBtns[current].classList.add('phone-nav__btn--active');

    outCard.style.transition = 'opacity .28s var(--ease), transform .28s var(--ease)';
    outCard.style.opacity    = '0';
    outCard.style.transform  = `scale(.97) translateX(${dir * -38}px)`;

    inCard.style.transition = 'none';
    inCard.style.opacity    = '0';
    inCard.style.transform  = `scale(.97) translateX(${dir * 38}px)`;
    inCard.classList.add('phone-card--active');

    requestAnimationFrame(() => requestAnimationFrame(() => {
      inCard.style.transition = 'opacity .28s var(--ease), transform .28s var(--ease)';
      inCard.style.opacity    = '1';
      inCard.style.transform  = 'scale(1) translateX(0)';

      inCard.addEventListener('transitionend', function done(e) {
        if (e.propertyName !== 'opacity') return;
        inCard.removeEventListener('transitionend', done);

        outCard.style.transition = 'none';
        outCard.classList.remove('phone-card--active');
        outCard.style.opacity = outCard.style.transform = '';
        requestAnimationFrame(() => { outCard.style.transition = ''; });

        inCard.style.transition = inCard.style.opacity = inCard.style.transform = '';
        animating = false;
        if (current === 0) initTilt();
      });
    }));
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => switchTo((current + 1) % cards.length), 4000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  navBtns.forEach((btn, i) => btn.addEventListener('click', () => { stopAuto(); switchTo(i); startAuto(); }));
  stage.addEventListener('mouseenter', stopAuto);
  stage.addEventListener('mouseleave', startAuto);
  nav.addEventListener('mouseenter', stopAuto);
  nav.addEventListener('mouseleave', startAuto);

  startAuto();
}

/* ─── 12. VOICE CARD (Chat IA tab) ──────────── */
function initVoiceCard() {
  const micBtn   = document.getElementById('vcMicBtn');
  const msgsEl   = document.getElementById('vcMsgs');
  const waveWrap = document.getElementById('vcWaveWrap');
  const hintEl   = document.getElementById('vcHint');
  if (!micBtn || !msgsEl) return;

  const DEMOS = [
    { user: '"Gasté $350 en el súper hoy"',       ai: 'Listo — Registré $350 en Comida. Llevas 76% del presupuesto mensual.' },
    { user: '"¿Cuánto gasté esta semana?"',        ai: 'Esta semana gastaste $1,240. Tu mayor gasto fue Comida con $480.' },
    { user: '"Pagué Netflix, $15"',                ai: 'Registrado — $15 en Subscripciones. Tienes 3 suscripciones activas este mes.' },
    { user: '"Quiero ahorrar $2,000 para un viaje"', ai: 'Perfecto. Ahorrando $500 por mes lo logras en 4 meses. ¿Empezamos hoy?' },
    { user: '"¿Estoy dentro del presupuesto?"',    ai: 'Sí — llevas 61% del gasto mensual con 68% del mes transcurrido. Vas muy bien.' },
    { user: '"¿Cuánto gasté en delivery este mes?"', ai: 'Gastaste $320 en delivery — $95 más que el mes pasado. ¿Quieres que te avise si superas $250?' },
  ];

  let demoIdx = 0;
  let running = false;

  micBtn.addEventListener('click', () => {
    if (running) return;
    running = true;

    const conv = DEMOS[demoIdx % DEMOS.length];
    demoIdx++;

    msgsEl.querySelector('.vc__empty')?.remove();
    while (msgsEl.children.length >= 4) msgsEl.firstElementChild.remove();

    micBtn.classList.add('listening');
    waveWrap.classList.add('listening');
    if (hintEl) hintEl.textContent = 'Escuchando...';

    setTimeout(() => {
      micBtn.classList.remove('listening');
      waveWrap.classList.remove('listening');
      if (hintEl) hintEl.textContent = '';

      const userMsg = makeVcMsg('user', conv.user.replace(/^"|"$/g, ''));
      msgsEl.appendChild(userMsg);
      msgsEl.scrollTop = msgsEl.scrollHeight;

      setTimeout(() => {
        const aiMsg    = makeVcMsg('ai', '');
        const aiBubble = aiMsg.querySelector('.vc__msg-bubble');
        msgsEl.appendChild(aiMsg);
        msgsEl.scrollTop = msgsEl.scrollHeight;

        typeText(aiBubble, conv.ai, 14, () => {
          running = false;
          if (hintEl) hintEl.textContent = 'Toca para hablar';
          msgsEl.scrollTop = msgsEl.scrollHeight;
        });
      }, 380);
    }, 1000);
  });

  function makeVcMsg(type, text) {
    const wrap   = document.createElement('div');
    wrap.className = `vc__msg vc__msg--${type}`;

    const ico  = document.createElement('div');
    ico.className = 'vc__msg-ico';
    ico.innerHTML = type === 'user'
      ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>`
      : `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

    const bubble = document.createElement('div');
    bubble.className  = 'vc__msg-bubble';
    bubble.textContent = text;

    wrap.append(ico, bubble);
    return wrap;
  }
}

/* ─── 13. GOAL RING INTERACTION ─────────────── */
function initGoalRing() {
  const goals = Array.from(document.querySelectorAll('#phoneStage .gm__goal'));
  const arc   = document.querySelector('#phoneStage .gm-arc');
  const label = document.querySelector('#phoneStage .gm__ring-label strong');
  if (!goals.length || !arc || !label) return;

  const CIRC = 314;
  const pcts = [72, 47, 45];

  goals.forEach((goal, i) => {
    goal.addEventListener('click', () => {
      goals.forEach(g => g.classList.remove('gm__goal--active'));
      goal.classList.add('gm__goal--active');
      arc.style.strokeDashoffset = String(Math.round(CIRC * (1 - pcts[i] / 100)));
      label.textContent = pcts[i] + '%';
    });
  });
}

/* ─── 14. SWIPE PHONE (Gastos ↔ Ingresos) ───── */
class SwipePhone {
  constructor() {
    this.track  = document.getElementById('swTrack');
    this.thumb  = document.getElementById('swThumb');
    this.label  = document.getElementById('swControlLabel');
    this.arrows = document.getElementById('swArrows');
    if (!this.track) return;

    this.mode        = document.body.getAttribute('data-mode') || 'gastos';
    this.startX      = 0;
    this.startThumbX = this.mode === 'ingresos' ? this.maxX : 0;
    this.thumbX      = this.startThumbX;
    this.dragging    = false;
    this.initListeners();
  }

  get maxX() {
    const tw = this.track.getBoundingClientRect().width  || this.track.offsetWidth;
    const th = this.thumb.getBoundingClientRect().width  || this.thumb.offsetWidth;
    return Math.max(tw - th - 12, 0);
  }

  initListeners() {
    this.thumb.addEventListener('mousedown',  e => { e.preventDefault(); this.onStart(e.clientX); });
    window.addEventListener('mousemove',      e => this.onMove(e.clientX));
    window.addEventListener('mouseup',        e => this.onEnd(e.clientX));

    this.thumb.addEventListener('touchstart', e => this.onStart(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchmove', e => {
      if (this.dragging) { e.preventDefault(); this.onMove(e.touches[0].clientX); }
    }, { passive: false });
    window.addEventListener('touchend', e => this.onEnd(e.changedTouches[0].clientX), { passive: true });
  }

  onStart(x) {
    this.startX      = x;
    this.startThumbX = this.thumbX;
    this.dragging    = true;
    this.thumb.style.transition = 'none';
  }

  onMove(x) {
    if (!this.dragging) return;
    this.thumbX = Math.max(0, Math.min(this.startThumbX + (x - this.startX), this.maxX));
    this.thumb.style.transform = `translateX(${this.thumbX}px) translateY(-50%)`;
    if (this.arrows) {
      this.arrows.style.opacity = String(Math.max(0, 1 - (this.thumbX / (this.maxX || 1)) * 1.8));
    }
  }

  onEnd() {
    if (!this.dragging) return;
    this.dragging = false;
    this.thumb.style.transition = 'transform .38s cubic-bezier(.4,0,.2,1)';
    this.setMode(this.thumbX / (this.maxX || 1) > 0.48 ? 'ingresos' : 'gastos');
  }

  setMode(mode) {
    this.mode   = mode;
    this.thumbX = mode === 'ingresos' ? this.maxX : 0;
    this.thumb.style.transform = `translateX(${this.thumbX}px) translateY(-50%)`;
    if (this.arrows) this.arrows.style.opacity = mode === 'ingresos' ? '0' : '1';
    if (this.label) this.label.textContent = mode === 'ingresos' ? 'Ingresos' : 'Gastos';
    document.body.classList.add('theme-transitioning');
    document.body.setAttribute('data-mode', mode);
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 650);
  }
}

/* ─── 15. CHAT CARD ANIMATE ─────────────────── */
function initChatAnimate() {
  const chatBody = document.querySelector('.chat-body');
  if (!chatBody || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  chatBody.classList.add('chat-body--ready');
  const msgs = Array.from(chatBody.querySelectorAll('.chat-msg'));

  new IntersectionObserver(([entry], obs) => {
    if (!entry.isIntersecting) return;
    obs.disconnect();
    msgs.forEach((msg, i) => setTimeout(() => msg.classList.add('chat-msg--visible'), i * 340 + 150));
  }, { threshold: 0.3 }).observe(chatBody);
}

/* ─── 16. SIGN-UP FORMS ─────────────────────── */
function initToast() {
  const toast    = document.getElementById('signupToast');
  const closeBtn = document.getElementById('toastClose');
  const form     = document.getElementById('toastForm');
  const success  = document.getElementById('toastSuccess');
  if (!toast || !form) return;

  document.querySelector('.nav__cta')?.addEventListener('click', e => {
    e.preventDefault();
    toast.classList.add('open');
    form.querySelector('input').focus();
  });

  closeBtn.addEventListener('click', () => toast.classList.remove('open'));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.querySelector('input').value) return;
    form.hidden = true;
    success.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('open');
      setTimeout(() => {
        form.hidden = false;
        success.classList.remove('visible');
        form.reset();
      }, 400);
    }, 2800);
  });
}

function initInlineSignup() {
  const form    = document.getElementById('inlineForm');
  const success = document.getElementById('inlineSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.querySelector('input').value) return;
    form.hidden = true;
    const consent = form.closest('.inline-signup')?.nextElementSibling;
    if (consent?.classList.contains('form-consent')) consent.hidden = true;
    success.classList.add('visible');
  });
}

function initBanner() {
  const banner   = document.getElementById('signupBanner');
  const closeBtn = document.getElementById('bannerClose');
  const form     = document.getElementById('bannerForm');
  const success  = document.getElementById('bannerSuccess');
  if (!banner || !form) return;

  if (!sessionStorage.getItem('bannerShown')) {
    let shown = false;
    window.addEventListener('scroll', function checkBanner() {
      if (shown) return;
      const pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (pct > 0.65) {
        shown = true;
        banner.classList.add('open');
        sessionStorage.setItem('bannerShown', '1');
        window.removeEventListener('scroll', checkBanner);
      }
    }, { passive: true });
  }

  closeBtn.addEventListener('click', () => banner.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') banner.classList.remove('open'); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.querySelector('input').value) return;
    form.hidden = true;
    success.classList.add('visible');
    setTimeout(() => {
      banner.classList.remove('open');
      setTimeout(() => {
        form.hidden = false;
        success.classList.remove('visible');
        form.reset();
      }, 450);
    }, 3000);
  });
}

function initCtaForm() {
  const form    = document.getElementById('ctaForm');
  const success = document.getElementById('ctaSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.querySelector('input').value) return;
    form.hidden = true;
    success.classList.add('visible');
  });
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  new ThemeSwitcher();
  new SwipePhone();
  new CustomCursor();
  initTilt();
  initConfetti();
  initReveal();
  initCounters();
  initPhoneStage();
  initHeroTyper();
  initChatAnimate();
  initVoiceCard();
  initGoalRing();
  initVoiceDemo();
  initToast();
  initInlineSignup();
  initBanner();
  initCtaForm();

  document.querySelectorAll('details.faq-item').forEach(details => {
    details.addEventListener('toggle', () => details.classList.toggle('open', details.open));
  });
});
