  // Hamburger menu toggle (mobile)
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('is-open', !isOpen);
    });
    // Zamknij po kliknięciu linka (mobile)
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      });
    });
    // Esc zamyka menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
        navToggle.focus();
      }
    });
  }

  // FAQ accordion + obsługa klawiatury (Enter/Space)
  function toggleFaq(q) {
    const item = q.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      const otherQ = i.querySelector('.faq-question');
      if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      q.setAttribute('aria-expanded', 'true');
    } else {
      q.setAttribute('aria-expanded', 'false');
    }
  }
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => toggleFaq(q));
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaq(q);
      }
    });
  });

  // Scroll reveal — dodaj klasę .reveal lub .reveal-left do elementów poniżej hero
  const revealEls = document.querySelectorAll(
    '.value-item, .service-card, .client-card, .testimonial, .about-feature, .pstep, .faq-item'
  );

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Opóźnienie zależne od pozycji wśród rodzeństwa
        const siblings = [...entry.target.parentElement.children];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.08}s`;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => {
    el.classList.add('reveal');
    revealObs.observe(el);
  });

  // Parallax — lekkie przesunięcie kart w hero przy scrollu
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const cards = document.querySelectorAll('.hcard');
    cards.forEach((card, i) => {
      card.style.transform = `translateY(${y * (i % 2 === 0 ? -0.03 : -0.05)}px)`;
    });
  }, { passive: true });

  // Liczniki animowane — countup z 0 do wartości docelowej gdy element pojawi się w viewport
  const nums = document.querySelectorAll('[data-count]');
  // Ustaw od razu na "0" żeby nie było flash przy starcie
  nums.forEach(n => { n.textContent = '0' + (n.dataset.suffix || ''); });
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400; // ms
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutQuart — szybko na start, wolno na końcu
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.floor(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.4 });
  nums.forEach(n => countObs.observe(n));

  // Nav shrink on scroll
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.padding = window.scrollY > 60 ? '0.8rem 5vw' : '';
    }, { passive: true });
  }

  // Cookie banner (RODO — wersja informacyjna, tylko cookies techniczne)
  const COOKIE_KEY = 'cookies-consent';
  const cookieBanner = document.querySelector('.cookie-banner');
  if (cookieBanner) {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setTimeout(() => cookieBanner.classList.add('is-visible'), 800);
    }
    const acceptBtn = cookieBanner.querySelector('[data-cookie-action="accept"]');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'accepted');
        cookieBanner.classList.remove('is-visible');
      });
    }
  }
