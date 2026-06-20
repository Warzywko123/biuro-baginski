  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
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

  // Liczniki animowane
  const nums = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let cur = 0;
      const step = target / 50;
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur) + (el.dataset.suffix || '');
        if (cur >= target) clearInterval(t);
      }, 28);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => countObs.observe(n));

  // Nav shrink on scroll
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.style.padding = window.scrollY > 60 ? '0.8rem 5vw' : '';
  }, { passive: true });
