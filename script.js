/* ═══════════════════════════════════════════════════════
   LIKHITH RAMESHA — PORTFOLIO SCRIPTS
   Custom cursor · Nav · Counter animations · Scroll reveals
   GSAP ScrollTrigger · Magnetic buttons
════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Theme Toggle ──────────────────────────────────────── */
  const html = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  
  // Start with light theme (v2 — warm beige)
  html.setAttribute('data-theme', 'light');
  
  if (themeBtn) {
    // Set initial icon to moon (we're in light mode, so show moon to switch to dark)
    themeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    themeBtn.setAttribute('aria-label', 'Switch to dark mode');

    themeBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      themeBtn.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} mode`);
      // In light mode → show moon icon; in dark mode → show sun icon
      themeBtn.innerHTML = next === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    });
  }

  /* ── Mobile menu ──────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  /* ── Nav scroll behavior ──────────────────────────────── */
  const nav = document.getElementById('nav');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = current;
  }, { passive: true });

  /* ── Custom cursor ────────────────────────────────────── */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  
  if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });
    
    function animateCursor() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const interactives = document.querySelectorAll('a, button, .project-card, .identity-card, .tl-card, .carousel-item');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
  }

  /* ── Scroll-triggered fade-up ────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Counter animation ────────────────────────────────── */
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const isDecimal = target % 1 !== 0;
    
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num[data-count]');
  
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseFloat(entry.target.dataset.count);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => counterObserver.observe(el));
  }

  /* ── Magnetic button effect ──────────────────────────── */
  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta');
  
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-2px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── GSAP ScrollTrigger (if available) ──────────────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax on hero orbs
    gsap.to('.orb-1', {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    gsap.to('.orb-2', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      }
    });

    // Hero orbs only — GSAP parallax (non-conflicting with fade-up CSS system)
    // Note: project cards, experience cards, and pitch use CSS fade-up system
    // to avoid GSAP inline-style conflicts

    // Pitch quote subtle scale-in
    gsap.fromTo('.pitch-quote', 
      { scale: 0.97, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.pitch-section',
          start: 'top 75%',
          once: true,
        }
      }
    );

    // Vibe score counter in project visual
    const vibeScoreEl = document.querySelector('.vs-num');
    if (vibeScoreEl) {
      ScrollTrigger.create({
        trigger: '.pc-large',
        start: 'top 75%',
        once: true,
        onEnter: () => animateCounter(vibeScoreEl, 92, 1500),
      });
    }
  }

  /* ── Project card tilt effect ─────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotX = (y - 0.5) * -6;
      const rotY = (x - 0.5) * 6;
      card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Typing effect on hero badge ─────────────────────── */
  // Subtle text shimmer on hero headline
  const heroHeadline = document.querySelector('.hero-headline');
  if (heroHeadline) {
    heroHeadline.addEventListener('mouseenter', () => {
      heroHeadline.style.filter = 'brightness(1.1)';
    });
    heroHeadline.addEventListener('mouseleave', () => {
      heroHeadline.style.filter = '';
    });
  }

  /* ── Smooth anchor scroll ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Carousel pause on hover already handled by CSS ──── */
  /* Additional: individual item hover lift */
  document.querySelectorAll('.carousel-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.parentElement.style.animationPlayState = 'paused';
    });
    item.addEventListener('mouseleave', () => {
      item.parentElement.style.animationPlayState = 'running';
    });
  });

  /* ── Page loaded class ───────────────────────────────── */
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

})();
