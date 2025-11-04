// simple typewriter for hero title
const words = ['Web Developer', 'Full Stack Developer','AWS Cloud Engineer','DevOps Engineer'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const textElement = document.getElementById('text');

function typeEffect() {
  const current = words[wordIndex];
  if (isDeleting) {
    charIndex = Math.max(0, charIndex - 1);
  } else {
    charIndex = Math.min(current.length, charIndex + 1);
  }

  textElement.textContent = current.substring(0, charIndex);

  let speed = isDeleting ? 80 : 140;

  if (!isDeleting && charIndex === current.length) {
    speed = 1000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 800;
  }

  setTimeout(typeEffect, speed);
}

// start after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // ensure element exists before starting
  if (textElement) typeEffect();
});

// reveal education items with IntersectionObserver
(function(){
  const observerOpts = { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        // optional: unobserve once visible
        io.unobserve(e.target);
      }
    });
  }, observerOpts);

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in-up').forEach(el => io.observe(el));
  });
})();

// Smooth scroll for page anchors and auto-hide navbar when leaving Home
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  const hero = document.querySelector('#home') || document.querySelector('.hero');

  // smooth scrolling for anchor links in navbar
  document.querySelectorAll('.custom-navbar a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      if (!target || target === '#') return;
      if (target === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // collapse bootstrap mobile menu if open
      const bsCollapse = document.getElementById('navbarNav');
      if (bsCollapse && bsCollapse.classList.contains('show')) {
        new bootstrap.Collapse(bsCollapse).hide();
      }
    });
  });

  // observe hero visibility; show navbar only when hero is in view
  if (hero && nav) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          nav.classList.remove('hidden');
        } else {
          nav.classList.add('hidden');
        }
      });
    }, { root: null, threshold: 0.12 });
    io.observe(hero);
    // initial state
    // if hero is not fully visible at load, hide nav
    // (works for direct deep-links)
    const rect = hero.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top > window.innerHeight) nav.classList.add('hidden');
  }
});

// Animated nav indicator + scrollspy (updates .active and animates the indicator)
document.addEventListener('DOMContentLoaded', () => {
  const navInner = document.querySelector('.nav-inner');
  if (!navInner) return;

  const indicator = navInner.querySelector('.nav-indicator');
  const links = Array.from(navInner.querySelectorAll('.nav-link'));

  const getRelRect = (el) => {
    const navRect = navInner.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { left: r.left - navRect.left, width: r.width };
  };

  const moveIndicator = (el) => {
    if (!indicator || !el) return;
    const r = getRelRect(el);
    indicator.style.width = r.width + 'px';
    indicator.style.transform = `translateX(${Math.round(r.left)}px)`;
    indicator.style.opacity = '1';
  };

  const hideIndicator = () => { if (indicator) indicator.style.opacity = '0'; };

  // Hover preview: show indicator on hovered link
  links.forEach(l => {
    l.addEventListener('mouseenter', () => moveIndicator(l));
    l.addEventListener('focus', () => moveIndicator(l));
    l.addEventListener('mouseleave', () => {
      const active = navInner.querySelector('.nav-link.active');
      if (active) moveIndicator(active);
    });
  });

  // On click, set active immediately and move indicator
  links.forEach(l => l.addEventListener('click', (e) => {
    // small delay to allow smooth scroll to start
    setTimeout(() => {
      links.forEach(x => x.classList.remove('active'));
      l.classList.add('active');
      moveIndicator(l);
    }, 60);
  }));

  // Scrollspy: observe target sections referenced by nav links
  const sections = links.map(a => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return null;
    return { link: a, section: document.querySelector(href) };
  }).filter(Boolean);

  if (sections.length) {
    const io = new IntersectionObserver((entries) => {
      // pick the most visible section
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const matching = sections.find(s => s.section === visible.target);
      if (matching) {
        links.forEach(l => l.classList.remove('active'));
        matching.link.classList.add('active');
        moveIndicator(matching.link);
      }
    }, { threshold: [0.2, 0.45, 0.7] });

    sections.forEach(s => { if (s.section) io.observe(s.section); });
  }

  // position indicator on load & when resizing
  window.addEventListener('resize', () => {
    const active = navInner.querySelector('.nav-link.active');
    if (active) moveIndicator(active);
  });

  // initial placement: use active link if present
  const initActive = navInner.querySelector('.nav-link.active') || links[0];
  if (initActive) moveIndicator(initActive);
});

// animate skill rings (writes --p on each .skill-circle and updates the displayed percent)
(function(){
  const cards = document.querySelectorAll('.skill-card');
  if (!cards.length) return;

  // helper: convert hex like "#06b33b" or "06b33b" to rgba string with alpha
  const hexToRgba = (hex, alpha = 0.28) => {
    if (!hex) return null;
    let h = String(hex).trim().replace('#','');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const int = parseInt(h, 16);
    if (Number.isNaN(int)) return null;
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const animateCard = (card) => {
    // Prefer explicit data-percent on the card, otherwise fall back to the
    // visible percent text inside the .skill-value (allows changing via HTML).
    const value = card.querySelector('.skill-value');
    const rawTarget = (card.dataset.percent !== undefined && card.dataset.percent !== '')
      ? card.dataset.percent
      : (value ? value.textContent : '0');
    const target = parseInt(String(rawTarget).replace(/[^0-9]/g, ''), 10) || 0;
    const circle = card.querySelector('.skill-circle');
    if (!circle || !value) return;

    const duration = 2000;
    const start = performance.now();
    // mark active so CSS can apply an enhanced glow/scale while animating
    card.classList.add('active');
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = Math.round(target * eased);
      circle.style.setProperty('--p', current);
      value.textContent = current + '%';
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCard(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  // On DOM ready: set per-card CSS variables (from data-accent) and start observing
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.skill-card').forEach(card => {
      // set --skill-accent from data-accent if provided (avoids inline styles in HTML)
      const accent = card.dataset.accent;
      if (accent) {
        card.style.setProperty('--skill-accent', accent);
        // also set a computed rgba variant used for glows/text-shadow
        const rgba = hexToRgba(accent, 0.28);
        if (rgba) card.style.setProperty('--skill-accent-rgba', rgba);
      }
      // Ensure each circle starts at 0 (so CSS doesn't rely on inline style)
      const circle = card.querySelector('.skill-circle');
      if (circle) circle.style.setProperty('--p', 0);
      io.observe(card);
    });
  });
})();