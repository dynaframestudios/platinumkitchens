/* ============================================
   PLATINUM KITCHENS & BEDROOMS — script.js
   ============================================ */

'use strict';

/* ── NAV: scroll state + burger ── */
const nav       = document.getElementById('nav');
const burger    = document.getElementById('burger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── ACTIVE NAV LINKS on scroll ── */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const link = navLinks.querySelector(`a[href="#${entry.target.id}"]`);
    if (link) link.style.color = entry.isIntersecting ? '#fff' : '';
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

/* ── REVEAL ON SCROLL ── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings inside same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const delay = siblings.indexOf(entry.target) * 100;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── GALLERY LIGHTBOX ── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');

const galleryItems  = [...document.querySelectorAll('.gallery__item')];
let currentIndex    = 0;

function openLightbox(index) {
  currentIndex = index;
  const img = galleryItems[index].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  const img = galleryItems[currentIndex].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  const img = galleryItems[currentIndex].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNext);
lightboxPrev.addEventListener('click', showPrev);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft')  showPrev();
});

/* ── TESTIMONIALS CAROUSEL ── */
const testimonials = document.querySelectorAll('.testimonial');
const dots         = document.querySelectorAll('.dot');
let currentSlide   = 0;
let autoSlide;

function showSlide(index) {
  testimonials.forEach(t => t.classList.remove('active'));
  dots.forEach(d => d.classList.remove('dot--active'));
  testimonials[index].classList.add('active');
  dots[index].classList.add('dot--active');
  currentSlide = index;
}

function nextSlide() {
  showSlide((currentSlide + 1) % testimonials.length);
}

function startAuto() {
  autoSlide = setInterval(nextSlide, 5000);
}

function resetAuto() {
  clearInterval(autoSlide);
  startAuto();
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    showSlide(parseInt(dot.dataset.idx));
    resetAuto();
  });
});

showSlide(0);
startAuto();

/* ── SMOOTH PARALLAX on hero bg ── */
const heroBg = document.querySelector('.hero__bg img');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `translateY(${y * 0.25}px)`;
    }
  }, { passive: true });
}

/* ── FOOTER YEAR ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── FORM: basic client-side validation feedback ── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#c0392b';
        valid = false;
      }
    });
    if (!valid) {
      e.preventDefault();
      const first = form.querySelector('[required]:invalid, [required][style*="c0392b"]');
      if (first) first.focus();
    }
  });

  // Clear red border on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}

/* ── COUNTER ANIMATION for stats ── */
function animateCounter(el, target, duration = 1500) {
  const start   = performance.now();
  const suffix  = el.textContent.replace(/[0-9]/g, '');

  const update = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat__num');

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el      = entry.target;
      const text    = el.textContent;
      const num     = parseInt(text.replace(/\D/g, ''), 10);
      const suffix  = text.replace(/[0-9]/g, '');
      if (!isNaN(num)) {
        el.textContent = '0' + suffix;
        animateCounter(el, num, 1800);
      }
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));
