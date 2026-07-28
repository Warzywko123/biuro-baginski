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

  // Scroll reveal — dodaj klasę .reveal do elementów poniżej hero
  const revealEls = document.querySelectorAll(
    '.value-item, .client-card, .testimonial, .about-feature, .faq-item, .about-img, .about-img-stat, .about-timeline'
  );

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Opóźnienie zależne od pozycji wśród rodzeństwa
        const siblings = [...entry.target.parentElement.children];
        const idx = siblings.indexOf(entry.target);
        const delay = `${idx * 0.08}s`;
        entry.target.style.transitionDelay = delay;
        entry.target.style.setProperty('--reveal-delay', delay);
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

  // Śledzenie kontaktu (GA4) — telefon i e-mail to główne kanały kontaktu z biurem
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener('click', function () {
      if (typeof gtag !== 'function') return;
      gtag('event', 'phone_click', {
        phone_number: this.getAttribute('href').replace('tel:', ''),
        link_text: this.textContent.trim(),
        page_location: window.location.pathname
      });
    });
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener('click', function () {
      if (typeof gtag !== 'function') return;
      gtag('event', 'mail_click', {
        link_text: this.textContent.trim(),
        page_location: window.location.pathname
      });
    });
  });

  // Baner cookies + Google Consent Mode v2 (RODO)
  // GA4 rusza dopiero po kliknięciu "Akceptuję".
  // Klucz celowo inny niż stary 'cookies-consent' — osoby, które kliknęły dawne
  // "Rozumiem" (baner czysto informacyjny), muszą dostać realny wybór, a nie
  // milczącą zgodę na analitykę.
  const COOKIE_KEY = 'cookies-consent-v2';
  const cookieBanner = document.querySelector('.cookie-banner');

  function updateGoogleConsent(granted) {
    if (typeof gtag !== 'function') return;
    gtag('consent', 'update', {
      'analytics_storage': granted ? 'granted' : 'denied',
      // ad_* zawsze denied — strona nie prowadzi reklam ani remarketingu
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });

    // Skrypt Google pobieramy DOPIERO tutaj — bez zgody przeglądarka
    // nie nawiązuje żadnego połączenia z serwerami Google.
    if (granted && typeof window.wczytajGoogleAnalytics === 'function') {
      window.wczytajGoogleAnalytics();
    }
  }

  // Zapisana zgoda obowiązuje na KAŻDEJ podstronie — także tam, gdzie nie ma
  // banera (np. 404.html). Dlatego przywracamy ją poza warunkiem na baner.
  const consent = localStorage.getItem(COOKIE_KEY);
  if (consent === 'accepted') updateGoogleConsent(true);

  if (cookieBanner) {
    if (consent !== 'accepted' && consent !== 'rejected') {
      setTimeout(() => cookieBanner.classList.add('is-visible'), 800);
    }

    const decide = (value) => {
      localStorage.setItem(COOKIE_KEY, value);
      updateGoogleConsent(value === 'accepted');
      cookieBanner.classList.remove('is-visible');
      // Mapa Google nasłuchuje tego zdarzenia i wczytuje się bez przeładowania
      document.dispatchEvent(new CustomEvent('cookies-decision', { detail: value }));
    };

    const acceptBtn = cookieBanner.querySelector('[data-cookie-action="accept"]');
    const rejectBtn = cookieBanner.querySelector('[data-cookie-action="reject"]');
    if (acceptBtn) acceptBtn.addEventListener('click', () => decide('accepted'));
    if (rejectBtn) rejectBtn.addEventListener('click', () => decide('rejected'));
  }

  // ── Mapa Google dopiero za zgodą (RODO) ──
  // Bez zgody iframe ma tylko data-src, więc przeglądarka nie łączy się
  // z Google. Adres IP odwiedzającego trafia tam dopiero po kliknięciu
  // "Akceptuję" w banerze albo "Pokaż mapę" na samej zaślepce.
  const mapy = document.querySelectorAll('[data-map-consent]');
  if (mapy.length) {
    const pokazMape = (kontener) => {
      const ramka = kontener.querySelector('iframe[data-src]');
      if (!ramka) return;
      ramka.src = ramka.getAttribute('data-src');
      ramka.removeAttribute('data-src');
      kontener.classList.add('is-map-loaded');
    };

    mapy.forEach((kontener) => {
      if (consent === 'accepted') {
        pokazMape(kontener);
        return;
      }
      const przycisk = kontener.querySelector('[data-map-action="load"]');
      if (przycisk) przycisk.addEventListener('click', () => pokazMape(kontener));
    });

    document.addEventListener('cookies-decision', (e) => {
      if (e.detail === 'accepted') mapy.forEach(pokazMape);
    });
  }
