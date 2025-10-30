// simple typewriter for hero title
const words = ['Web Developer', 'Full Stack Developer'];
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

// copy email to clipboard and simple form -> mailto handler
document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyEmail');
  const mailtoLink = document.getElementById('mailtoLink');
  const contactForm = document.getElementById('contactForm');

  if (copyBtn && mailtoLink) {
    copyBtn.addEventListener('click', async () => {
      const email = mailtoLink.getAttribute('href').replace('mailto:', '');
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1400);
      } catch (err) {
        // fallback: select mailto link
        alert('Copy this email: ' + email);
      }
    });
  }

  if (contactForm && mailtoLink) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const message = formData.get('message') || '';
      const to = mailtoLink.getAttribute('href').replace('mailto:', '');
      // open user's mail client with prefilled subject/body
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }
});