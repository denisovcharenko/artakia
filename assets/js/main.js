/* ═══════════════════════════════════════════════════════
   ARTAKIA — main.js
   Osmo Supply resources: Loader · Odometer · SplitText
   Reveal · Progress Nav · Footer Parallax · Directional
   Hover · Smooth Scroll · Highlight Text · Fade In
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

/* ─── 1. NUMBER LOADER (Osmo Supply 3-step) ──────────── */
function initLoaderThreeSteps() {
  const container = document.querySelector('.loading-container');
  const screen    = document.querySelector('.loading-screen');
  if (!container || !screen) return;

  /* Read digit height while screen is hidden: temporarily reveal off-screen */
  screen.style.visibility = 'hidden';
  screen.style.display    = 'flex';
  const H = document.querySelector('.loading__number')?.offsetHeight || 165;
  screen.style.display    = '';
  screen.style.visibility = '';

  const tl = gsap.timeline({
    onComplete() {
      gsap.to(screen, {
        yPercent: -100,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete() { container.style.display = 'none'; },
      });
    },
  });

  tl.set(screen, { display: 'flex' })
    .set('.loading__progress-inner', { scaleY: 0, transformOrigin: 'bottom' })
    .set('.loading__number-wrap',    { y: 0 })

    // Step 1 — 0 → 33
    .to('.loading__progress-inner',          { scaleY: 0.33, duration: 0.68, ease: 'power2.inOut' })
    .to('.is--second .loading__number-wrap', { y: -(3 * H), duration: 0.68, ease: 'power2.inOut' }, '<')
    .to('.is--third  .loading__number-wrap', { y: -(3 * H), duration: 0.68, ease: 'power2.inOut' }, '<')

    .to({}, { duration: 0.23 })

    // Step 2 — 33 → 67
    .to('.loading__progress-inner',          { scaleY: 0.67, duration: 0.53, ease: 'power2.inOut' })
    .to('.is--second .loading__number-wrap', { y: -(6 * H), duration: 0.53, ease: 'power2.inOut' }, '<')
    .to('.is--third  .loading__number-wrap', { y: -(7 * H), duration: 0.53, ease: 'power2.inOut' }, '<')

    .to({}, { duration: 0.19 })

    // Step 3 — 67 → 100
    .to('.loading__progress-inner',          { scaleY: 1,        duration: 0.45, ease: 'power2.inOut' })
    .to('.is--first  .loading__number-wrap', { y: -(1  * H),     duration: 0.45, ease: 'power2.inOut' }, '<')
    .to('.is--second .loading__number-wrap', { y: -(10 * H),     duration: 0.45, ease: 'power2.inOut' }, '<')
    .to('.is--third  .loading__number-wrap', { y: -(10 * H),     duration: 0.45, ease: 'power2.inOut' }, '<')

    .to({}, { duration: 0.3 });
}

/* ─── 2. MASKED TEXT REVEAL (chars) ─────────────────────── */
function initMaskTextReveal() {
  const els = document.querySelectorAll('[data-split="heading"][data-split-reveal="chars"]');
  if (!els.length) return;

  els.forEach(el => {
    el.style.visibility = 'visible';
    const split = new SplitText(el, {
      type: 'chars,words',
      charsClass: 'char',
      wordsClass: 'split-word',
    });

    gsap.fromTo(
      split.chars,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.022,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,
        },
      }
    );
  });
}

/* ─── 3. NUMBER ODOMETER ────────────────────────────────── */
function initNumberOdometer() {
  const groups = document.querySelectorAll('[data-odometer-group]');
  if (!groups.length) return;

  groups.forEach(group => {
    const el = group.querySelector('[data-odometer-element]');
    if (!el) return;
    const target = parseInt(el.dataset.odometerTarget, 10);
    const obj = { v: 0 };

    ScrollTrigger.create({
      trigger: group,
      start: 'top 80%',
      once: true,
      onEnter() {
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.v); },
        });
      },
    });
  });
}

/* ─── 4. PROGRESS NAVIGATION ────────────────────────────── */
function initProgressNavigation() {
  const navList = document.querySelector('[data-progress-nav-list]');
  if (!navList) return;

  const buttons   = navList.querySelectorAll('[data-progress-nav-target]');
  const indicator = navList.querySelector('.progress-nav__indicator');

  function moveIndicator(btn) {
    if (!indicator || !btn) return;
    const bRect = btn.getBoundingClientRect();
    const lRect = navList.getBoundingClientRect();
    gsap.to(indicator, {
      x:        bRect.left - lRect.left - 4,
      width:    bRect.width,
      duration: 0.35,
      ease:     'power2.out',
    });
  }

  function activate(target) {
    buttons.forEach(b => b.classList.remove('active'));
    const btn = navList.querySelector(`[data-progress-nav-target="${target}"]`);
    if (btn) { btn.classList.add('active'); moveIndicator(btn); }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = btn.dataset.progressNavTarget;
      const section = document.querySelector(id);
      if (section) {
        gsap.to(window, { scrollTo: { y: section, offsetY: 72 }, duration: 0.9, ease: 'power3.inOut' });
      }
      activate(id);
    });
  });

  document.querySelectorAll('[data-progress-nav-anchor]').forEach(section => {
    const id = '#' + section.id;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end:   'bottom 55%',
      onEnter:     () => activate(id),
      onEnterBack: () => activate(id),
    });
  });

  if (buttons.length) {
    buttons[0].classList.add('active');
    requestAnimationFrame(() => moveIndicator(buttons[0]));
  }
}

/* ─── 5. FOOTER PARALLAX ────────────────────────────────── */
function initFooterParallax() {
  const wrapper = document.querySelector('[data-footer-parallax]');
  if (!wrapper) return;

  const inner = wrapper.querySelector('[data-footer-parallax-inner]');
  const dark  = wrapper.querySelector('[data-footer-parallax-dark]');

  if (inner) {
    gsap.fromTo(inner,
      { yPercent: -10 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom',
          end:   'bottom bottom',
          scrub: true,
        },
      }
    );
  }

  if (dark) {
    gsap.fromTo(dark,
      { opacity: 0 },
      {
        opacity: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 80%',
          end:   'top 20%',
          scrub: true,
        },
      }
    );
  }
}

/* ─── 6a. SERVICES — desktop hover (init immediately) ───── */
function initSvcHoverDesktop() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const items = [...document.querySelectorAll('[data-directional-hover-item]')];
  if (!items.length) return;

  let curX = 0, curY = 0, activeItem = null;

  /* Init all tiles hidden below */
  items.forEach(item => {
    const tile = item.querySelector('[data-directional-hover-tile]');
    if (!tile) return;
    tile.style.transform  = 'translateY(102%)';
    tile.style.transition = `transform 0.6s ${EASE}`;
  });

  function dirFrom(item, y) {
    const r = item.getBoundingClientRect();
    return (y - r.top) < r.height / 2 ? 'top' : 'bottom';
  }

  function activate(item, dir) {
    const tile = item.querySelector('[data-directional-hover-tile]');
    if (!tile) return;
    item.classList.add('is-svc-active');
    tile.style.transition = 'none';
    tile.style.transform  = dir === 'top' ? 'translateY(-102%)' : 'translateY(102%)';
    void tile.offsetHeight;
    tile.style.transition = `transform 0.6s ${EASE}`;
    tile.style.transform  = 'translateY(0%)';
  }

  function deactivate(item, dir) {
    const tile = item.querySelector('[data-directional-hover-tile]');
    if (!tile) return;
    item.classList.remove('is-svc-active');
    tile.style.transform = dir === 'top' ? 'translateY(-102%)' : 'translateY(102%)';
  }

  function checkHover() {
    const el   = document.elementFromPoint(curX, curY);
    const item = el?.closest('[data-directional-hover-item]') || null;

    if (item === activeItem) return;

    if (activeItem) deactivate(activeItem, dirFrom(activeItem, curY));
    if (item)       activate(item, dirFrom(item, curY));
    activeItem = item;
  }

  /* Track cursor always */
  document.addEventListener('mousemove', e => { curX = e.clientX; curY = e.clientY; checkHover(); });

  /* Re-check during scroll — fixes trackpad suppressing mouseenter */
  window.addEventListener('scroll', checkHover, { passive: true });
}

/* ─── 6b. SERVICES — mobile scroll (init after loader) ──── */
function initSvcScrollMobile() {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('[data-directional-hover]').forEach(list => {
    list.querySelectorAll('[data-directional-hover-item]').forEach(item => {
      const tile = item.querySelector('[data-directional-hover-tile]');
      if (!tile) return;

      gsap.set(tile, { yPercent: 102 });

      ScrollTrigger.create({
        trigger: item,
        start: 'top 35%',
        end:   'bottom 35%',
        onEnter: () => {
          gsap.killTweensOf(tile);
          item.classList.add('is-svc-active');
          gsap.fromTo(tile, { yPercent: 102 }, { yPercent: 0, duration: 0.65, ease: 'power2.out', overwrite: true });
        },
        onLeave: () => {
          gsap.killTweensOf(tile);
          item.classList.remove('is-svc-active');
          gsap.to(tile, { yPercent: -102, duration: 0.55, ease: 'power2.inOut', overwrite: true });
        },
        onEnterBack: () => {
          gsap.killTweensOf(tile);
          item.classList.add('is-svc-active');
          gsap.fromTo(tile, { yPercent: -102 }, { yPercent: 0, duration: 0.65, ease: 'power2.out', overwrite: true });
        },
        onLeaveBack: () => {
          gsap.killTweensOf(tile);
          item.classList.remove('is-svc-active');
          gsap.to(tile, { yPercent: 102, duration: 0.55, ease: 'power2.inOut', overwrite: true });
        },
      });
    });
  });
}

/* ─── 7. WORD CYCLING — char-by-char reveal ──────────────── */
function initTypewriter(words = ['Music', 'Brands', 'Potential', 'Projects']) {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;
  let current = 0;

  function buildChars(word) {
    el.innerHTML = '';
    [...word].forEach(ch => {
      const s = document.createElement('span');
      s.className = 'tw-char';
      s.textContent = ch;
      el.appendChild(s);
    });
    return el.querySelectorAll('.tw-char');
  }

  const init = buildChars(words[0]);
  gsap.set(init, { yPercent: 0, opacity: 1 });

  function cycle() {
    const next    = (current + 1) % words.length;
    const leaving = [...el.querySelectorAll('.tw-char')];

    gsap.to(leaving, {
      yPercent: -115,
      opacity:  0,
      duration: 0.28,
      stagger:  { amount: 0.18, from: 'start' },
      ease:     'power2.in',
      onComplete() {
        const entering = buildChars(words[next]);
        gsap.set(entering, { yPercent: 90, opacity: 0 });
        gsap.to(entering, {
          yPercent: 0,
          opacity:  1,
          duration: 0.32,
          stagger:  { amount: 0.22, from: 'start' },
          ease:     'power3.out',
          onComplete() {
            current = next;
            setTimeout(cycle, 2600);
          },
        });
      },
    });
  }

  setTimeout(cycle, 2600);
}

/* ─── 8. MA RECORDS TEXT REVEAL ──────────────────────────── */
function initMaTextReveal() {
  const section = document.querySelector('.ma');
  if (!section) return;

  const ems = section.querySelectorAll('.ma-col em');

  ScrollTrigger.create({
    trigger: section,
    start: 'top 65%',
    once: true,
    onEnter() {
      gsap.to(ems, {
        color: '#f2f0ed',
        duration: 0.45,
        stagger: 0.09,
        ease: 'power2.out',
      });
    },
  });
}

/* ─── 8b. BACKGROUND TEXT REVEAL ────────────────────────── */
function initBgTextReveal() {
  const section = document.querySelector('.bg-section');
  if (!section) return;
  const ems = section.querySelectorAll('.bg-p em');
  if (!ems.length) return;
  ScrollTrigger.create({
    trigger: section,
    start: 'top 65%',
    once: true,
    onEnter() {
      gsap.to(ems, { color: '#f2f0ed', duration: 0.45, stagger: 0.09, ease: 'power2.out' });
    },
  });
}

/* ─── 9. HIGHLIGHT TEXT ON SCROLL (word opacity scrub) ───── */
function initHighlightText() {
  const els = document.querySelectorAll('[data-highlight-text]');
  if (!els.length) return;

  els.forEach(el => {
    const split = new SplitText(el, { type: 'words', wordsClass: 'hl-word' });

    gsap.fromTo(split.words,
      { opacity: 0.08 },
      {
        opacity: 1,
        ease: 'none',
        stagger: { each: 0.1 },
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end:   'bottom 52%',
          scrub: 0.8,
        },
      }
    );
  });
}

/* ─── 10. FADE-IN REVEAL (paragraphs & small text) ──────── */
function initFadeInReveal() {
  const els = document.querySelectorAll('[data-fade-in]');
  if (!els.length) return;

  els.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      }
    );
  });
}

/* ─── 11. SMOOTH SCROLL ───────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        document.body.removeAttribute('data-nav-open');
        gsap.to(window, { scrollTo: { y: target, offsetY: 72 }, duration: 0.9, ease: 'power3.inOut' });
      }
    });
  });
}

/* ─── 12. CUSTOM CURSOR ──────────────────────────────────── */
function initBasicCustomCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.6, ease: 'power3' });

  window.addEventListener('mousemove', function onFirstMove(e) {
    gsap.set(cursor, { x: e.clientX, y: e.clientY });
    gsap.to(cursor, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
    window.removeEventListener('mousemove', onFirstMove);

    window.addEventListener('mousemove', e => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
  });
}

/* ─── 13. COPY EMAIL TO CLIPBOARD (3-state) ─────────────── */
function initCopyEmailClipboard() {
  document.querySelectorAll('[data-copy-button]').forEach(btn => {
    let timer;

    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-copy-email') ||
        btn.querySelector('[data-copy-email-element]')?.textContent.trim();
      if (!email) return;

      navigator.clipboard.writeText(email).then(() => {
        clearTimeout(timer);
        btn.dataset.copyButton = 'copied';
        timer = setTimeout(() => {
          btn.dataset.copyButton = '';
        }, 2200);
      });
    });
  });
}

/* ─── CONTENT INJECTION ──────────────────────────────────── */
function injectContent(d) {
  const html = (sel, val) => { const el = document.querySelector(sel); if (el && val != null) el.innerHTML = val; };
  const text = (sel, val) => { const el = document.querySelector(sel); if (el && val != null) el.textContent = val; };

  // SEO & Nav
  if (d.page_title) document.title = d.page_title;
  text('.nav-cta', d.nav_cta);

  // Hero
  text('.hero-hl-bold', d.hero_bold);
  text('.loc-city',     d.hero_location_city);
  text('.loc-world',    d.hero_location_world);
  html('.hero-desc',    d.hero_desc);
  text('.hero-cta-label', d.hero_cta_label);

  // About
  text('.about-h',    d.about_heading);
  html('.about-lead', d.about_lead);
  const aboutCols = document.querySelectorAll('.about-col');
  if (aboutCols[0] && d.about_col_1) aboutCols[0].innerHTML = d.about_col_1;
  if (aboutCols[1] && d.about_col_2) aboutCols[1].innerHTML = d.about_col_2;

  // Stats (array format)
  if (Array.isArray(d.stats)) {
    const targets = document.querySelectorAll('[data-odometer-target]');
    const labels  = document.querySelectorAll('.stat-lbl');
    d.stats.forEach((s, i) => {
      if (targets[i] && s.value != null) targets[i].dataset.odometerTarget = s.value;
      if (labels[i]  && s.label)         labels[i].textContent = s.label;
    });
  }

  // Partners marquee
  if (Array.isArray(d.partners) && d.partners.length) {
    const track = document.querySelector('.marquee-track');
    if (track) {
      const cards = d.partners.map(p =>
        `<div class="logo-card"><img src="${p.logo}" alt="${p.name}"></div>`
      ).join('');
      track.innerHTML = cards + cards;
    }
  }

  // MA Records
  const maCols = document.querySelectorAll('.ma-col');
  if (maCols[0] && d.ma_col_1) maCols[0].innerHTML = d.ma_col_1;
  if (maCols[1] && d.ma_col_2) maCols[1].innerHTML = d.ma_col_2;

  // Background
  text('.bg-h',      d.bg_heading);
  text('.bg-tagline', d.bg_tagline);
  const bgPs = document.querySelectorAll('.bg-p');
  if (bgPs[0] && d.bg_p_1) bgPs[0].innerHTML = d.bg_p_1;
  if (bgPs[1] && d.bg_p_2) bgPs[1].innerHTML = d.bg_p_2;

  // Video
  if (d.video_url) {
    const box = document.querySelector('.video-box');
    if (box) {
      const u = d.video_url;
      let embed = '';
      const isYtEmbed = u.includes('youtube.com/embed/');
      const ytId = !isYtEmbed && u.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
      const vmId = u.match(/vimeo\.com\/(\d+)/)?.[1];
      if (isYtEmbed) {
        embed = `<iframe src="${u}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
      } else if (ytId) {
        embed = `<iframe src="https://www.youtube.com/embed/${ytId}" frameborder="0" allowfullscreen></iframe>`;
      } else if (vmId) {
        embed = `<iframe src="https://player.vimeo.com/video/${vmId}" frameborder="0" allowfullscreen></iframe>`;
      } else {
        embed = `<video src="${u}" autoplay muted loop playsinline></video>`;
      }
      box.innerHTML = embed;
      box.querySelector('iframe,video').style.cssText = 'width:100%;height:100%;object-fit:cover;border:0;';
    }
  }

  // Services
  if (d.services) {
    document.querySelectorAll('.svc-row').forEach((row, i) => {
      const svc = d.services[i];
      if (!svc) return;
      const nameEl = row.querySelector('.svc-name');
      const descEl = row.querySelector('.svc-desc');
      const tagsEl = row.querySelector('.tags');
      if (nameEl && svc.name) nameEl.textContent = svc.name;
      if (descEl && svc.desc) descEl.textContent = svc.desc;
      if (tagsEl && svc.tags) tagsEl.innerHTML = svc.tags.map(t => `<span class="tag">${t}</span>`).join('');
    });
  }

  // Philosophy quote
  text('.phil-quote-muted',  d.phil_quote_muted);
  text('.phil-quote-bright', d.phil_quote_bright);
  html('.phil-center-text',  d.phil_center);

  if (d.philosophy) {
    document.querySelectorAll('.phil-item').forEach((el, i) => {
      if (!d.philosophy[i]) return;
      const t = el.querySelector('.phil-title');
      const p = el.querySelector('.phil-desc');
      if (t) t.textContent = d.philosophy[i].title;
      if (p) p.textContent = d.philosophy[i].desc;
    });
  }

  // Footer
  text('.footer-eyebrow', d.footer_eyebrow);
  const slides = document.querySelectorAll('.footer-cta-slide');
  if (slides[0] && d.footer_slide_1) slides[0].textContent = d.footer_slide_1;
  if (slides[2] && d.footer_slide_3) slides[2].textContent = d.footer_slide_3;
  if (d.contact_email) {
    if (slides[1]) slides[1].textContent = d.contact_email;
    document.querySelectorAll('[data-copy-button]').forEach(btn => {
      btn.dataset.copyEmail = d.contact_email;
    });
  }
  text('.copyright', d.footer_copyright);
}

/* ─── MOBILE NAV ─────────────────────────────────────────── */
function initMobileNav() {
  const toggle     = document.querySelector('[data-nav-toggle]');
  const mobileNav  = document.querySelector('[data-mobile-nav]');
  const closeItems = document.querySelectorAll('[data-nav-close]');
  if (!toggle) return;

  function open() {
    document.body.setAttribute('data-nav-open', '');
    toggle.setAttribute('aria-expanded', 'true');
    mobileNav?.setAttribute('aria-hidden', 'false');
  }
  function close() {
    document.body.removeAttribute('data-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav?.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', () =>
    document.body.hasAttribute('data-nav-open') ? close() : open()
  );

  closeItems.forEach(item => item.addEventListener('click', close));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.hasAttribute('data-nav-open')) close();
  });
}

/* ─── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initBasicCustomCursor();
  initCopyEmailClipboard();
  initMobileNav();
  initSvcHoverDesktop();
  initLoaderThreeSteps();

  let heroWords = ['Music', 'Brands', 'Potential', 'Projects'];
  try {
    const res  = await fetch('/content/data.json?v=' + Date.now());
    const data = await res.json();
    if (Array.isArray(data.hero_words) && data.hero_words.length) heroWords = data.hero_words;
    injectContent(data);
  } catch {}

  // 3.2s — enough for loader animation (≈ 3.0s) + brief overlap
  gsap.delayedCall(3.2, () => {
    initTypewriter(heroWords);
    initMaskTextReveal();
    initNumberOdometer();
    initProgressNavigation();
    initFooterParallax();
    initSvcScrollMobile();
    initMaTextReveal();
    initBgTextReveal();
    initHighlightText();
    initFadeInReveal();
    initSmoothScroll();
    ScrollTrigger.refresh();
  });
});
