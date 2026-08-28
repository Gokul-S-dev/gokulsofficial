/**
 * ==========================================
 * GOKUL S - PORTFOLIO INTERACTIVITY & LOGIC
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Typewriter Effect ---
  const textElement = document.getElementById('text');
  if (textElement) {
    const words = [
      'Full Stack Developer',
      'AWS Certified Cloud Engineer',
      'MERN Stack Specialist',
      'DevOps Enthusiast'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        charIndex = Math.max(0, charIndex - 1);
      } else {
        charIndex = Math.min(currentWord.length, charIndex + 1);
      }

      textElement.textContent = currentWord.substring(0, charIndex);

      let speed = isDeleting ? 60 : 120;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 2200; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
      }

      setTimeout(typeEffect, speed);
    }

    typeEffect();
  }

  // --- 2. Navbar Scroll & Scroll Progress Bar ---
  const nav = document.getElementById('mainNav');
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTop');

  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Scroll progress bar
    if (scrollProgress && docHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      scrollProgress.style.width = `${progress}%`;
    }

    // Navbar glass backdrop on scroll
    if (nav) {
      if (scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    // Scroll-to-top button visibility
    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 3. Navbar Active State Indicator & Scrollspy ---
  const navInner = document.querySelector('.nav-inner');
  if (navInner) {
    const indicator = navInner.querySelector('.nav-indicator');
    const links = Array.from(navInner.querySelectorAll('.nav-link'));
    const sections = links.map(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        return { link, section: document.querySelector(href) };
      }
      return null;
    }).filter(Boolean);

    function moveIndicator(el) {
      if (!indicator || !el) return;
      const navRect = navInner.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const left = elRect.left - navRect.left;
      indicator.style.width = `${elRect.width}px`;
      indicator.style.transform = `translateX(${Math.round(left)}px)`;
      indicator.style.opacity = '1';
    }

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          // Collapse mobile menu if open
          const bsCollapse = document.getElementById('navbarNav');
          if (bsCollapse && bsCollapse.classList.contains('show')) {
            const bs = bootstrap.Collapse.getInstance(bsCollapse);
            if (bs) bs.hide();
          }
        }
      });
    });

    // Scrollspy Observer
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const match = sections.find(s => s.section === entry.target);
          if (match) {
            links.forEach(l => l.classList.remove('active'));
            match.link.classList.add('active');
            moveIndicator(match.link);
          }
        }
      });
    }, { root: null, threshold: 0.3 });

    sections.forEach(s => {
      if (s.section) spyObserver.observe(s.section);
    });

    // Initial positioning
    const activeLink = navInner.querySelector('.nav-link.active') || links[0];
    if (activeLink) {
      setTimeout(() => moveIndicator(activeLink), 100);
    }

    window.addEventListener('resize', () => {
      const currentActive = navInner.querySelector('.nav-link.active');
      if (currentActive) moveIndicator(currentActive);
    });
  }

  // --- 4. Scroll Reveal Animations ---
  const fadeElements = document.querySelectorAll('.fade-in-up');
  if (fadeElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { root: null, threshold: 0.1 });

    fadeElements.forEach(el => revealObserver.observe(el));
  }

  // --- 5. Animated Skill Progress Rings ---
  const skillCards = document.querySelectorAll('.skill-card');
  if (skillCards.length) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const targetPercent = parseInt(card.dataset.percent || '0', 10);
          const circle = card.querySelector('.skill-circle');
          const valueSpan = card.querySelector('.skill-value');

          if (circle && valueSpan) {
            let start = 0;
            const duration = 1200;
            const startTime = performance.now();

            function animate(now) {
              const elapsed = now - startTime;
              const progress = Math.min(1, elapsed / duration);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.round(targetPercent * eased);

              circle.style.setProperty('--p', currentVal);
              valueSpan.textContent = `${currentVal}%`;

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            }

            requestAnimationFrame(animate);
          }
          skillObserver.unobserve(card);
        }
      });
    }, { threshold: 0.2 });

    skillCards.forEach(card => skillObserver.observe(card));
  }

  // --- 6. Certifications Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const certItems = document.querySelectorAll('.certificate-item');

  if (filterBtns.length && certItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter.toLowerCase();

        certItems.forEach(item => {
          if (filter === 'all') {
            item.classList.remove('hidden');
          } else {
            if (item.classList.contains(filter)) {
              item.classList.remove('hidden');
            } else {
              item.classList.add('hidden');
            }
          }
        });
      });
    });
  }

  // --- 7. Lightbox Modal for Certificates & Gallery ---
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const lbCaption = lightbox.querySelector('#lb-caption');
    const lbClose = lightbox.querySelector('.lightbox-close');

    function openLightbox(imgSrc, captionText) {
      if (!lbImg) return;
      lbImg.src = imgSrc;

      if (lbCaption) {
        if (captionText && captionText.includes('|')) {
          const parts = captionText.split('|');
          lbCaption.innerHTML = `<div class="lb-title">${parts[0]}</div><div class="lb-desc">${parts.slice(1).join(' ')}</div>`;
        } else {
          lbCaption.innerHTML = `<div class="lb-title">${captionText || 'Certificate View'}</div>`;
        }
      }

      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lbImg) lbImg.src = '';
    }

    // Attach click handlers to certificate items and achievement cards
    const galleryItems = document.querySelectorAll('.certificate-item, .achievement-card-wrap');
    galleryItems.forEach(item => {
      const img = item.querySelector('img');
      const titleEl = item.querySelector('.achievement-title');
      const descEl = item.querySelector('.achievement-desc');

      let caption = item.dataset.caption;
      if (!caption && titleEl) {
        caption = `${titleEl.textContent.trim()}|${descEl ? descEl.textContent.trim() : ''}`;
      } else if (!caption && img) {
        caption = img.alt;
      }

      // Create overlay with eye button dynamically for cert items if not present
      if (item.classList.contains('certificate-item') && !item.querySelector('.certificate-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'certificate-overlay';
        overlay.innerHTML = `
          <button class="eye-btn" aria-label="View Certificate">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        `;
        item.appendChild(overlay);
      }

      item.addEventListener('click', () => {
        if (img && img.src) openLightbox(img.src, caption);
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  // --- 8. Toast Notification & Copy Email ---
  const toast = document.getElementById('toast');
  function showToast(message) {
    if (!toast) return;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  const copyBtn = document.getElementById('copyEmail');
  const emailEl = document.getElementById('contact-email');

  if (copyBtn && emailEl) {
    copyBtn.addEventListener('click', async () => {
      const emailText = emailEl.textContent.trim();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailText);
        } else {
          const ta = document.createElement('textarea');
          ta.value = emailText;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        showToast('Email address copied to clipboard!');
      } catch (err) {
        showToast('Failed to copy email.');
      }
    });
  }

  // --- 9. Contact Form Submission (Mailto client) ---
  const contactForm = document.getElementById('contactForm');
  const contactFeedback = document.getElementById('contactFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (document.getElementById('cf-name') || {}).value || '';
      const email = (document.getElementById('cf-email') || {}).value || '';
      const subject = (document.getElementById('cf-subject') || {}).value || '';
      const message = (document.getElementById('cf-message') || {}).value || '';

      if (!email || !message) {
        showToast('Please provide your email address and message.');
        return;
      }

      const recipient = 'sggokul762@gmail.com';
      const mailSubject = encodeURIComponent(subject || `Portfolio Contact from ${name || 'Visitor'}`);
      const mailBody = encodeURIComponent(`Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`);

      const mailtoUrl = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;

      if (contactFeedback) {
        contactFeedback.classList.add('active');
        setTimeout(() => {
          contactFeedback.classList.remove('active');
        }, 3000);
      }

      window.location.href = mailtoUrl;
      showToast('Opening default email application...');
    });
  }

});