/* =====================================================
   PORTAFOLIO — MAY BARBOSA
   Interacciones | script.js
   ===================================================== */

'use strict';

/* ══════════════════════════════════════════════════
   1. HEADER — Scroll shadow + nav activo
   ══════════════════════════════════════════════════ */
const header  = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  /* Sombra del header */
  header.classList.toggle('scrolled', window.scrollY > 20);

  /* Back-to-top visible */
  backTop.classList.toggle('visible', window.scrollY > 400);

  /* Nav link activo según sección visible */
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle(
      'active',
      link.getAttribute('href') === `#${current}`
    );
  });
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ══════════════════════════════════════════════════
   2. HAMBURGER MENU (móvil)
   ══════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navList   = document.querySelector('.nav__list');

hamburger.addEventListener('click', () => {
  const isOpen = navList.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

/* Cerrar menú al hacer clic en un link */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ══════════════════════════════════════════════════
   3. REVEAL ON SCROLL — Intersection Observer
   ══════════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // Solo una vez
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════════════════
   4. SKILL BARS — Animar al entrar en vista
   ══════════════════════════════════════════════════ */
const skillFills = document.querySelectorAll('.skill-bar__fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

/* ══════════════════════════════════════════════════
   5. BACK TO TOP
   ══════════════════════════════════════════════════ */
const backTop = document.getElementById('backTop');

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══════════════════════════════════════════════════
   6. FORMULARIO DE CONTACTO — Validación simulada
   ══════════════════════════════════════════════════ */
const form       = document.querySelector('.contacto__form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre  = form.nombre.value.trim();
    const email   = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();

    /* Validación básica */
    if (!nombre || !email || !mensaje) {
      showStatus('Por favor completa todos los campos.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showStatus('Ingresa un correo electrónico válido.', 'error');
      return;
    }

    /* Simulación de envío */
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Enviando…';
    submitBtn.disabled = true;

    setTimeout(() => {
      showStatus('¡Mensaje enviado! Te responderé pronto 🎨', 'success');
      form.reset();
      submitBtn.textContent = 'Enviar mensaje';
      submitBtn.disabled = false;
    }, 1800);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.style.color = type === 'error' ? '#A31D1D' : '#2e7d4f';
  setTimeout(() => { formStatus.textContent = ''; }, 5000);
}

/* ══════════════════════════════════════════════════
   7. CARDS — Teclado accesible (Enter/Space)
   ══════════════════════════════════════════════════ */
const mediaCards = document.querySelectorAll('.media-card');

mediaCards.forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });

  card.addEventListener('click', () => {
    /* Aquí puedes conectar la lógica de abrir un modal o sección */
    const title = card.querySelector('.media-card__title')?.textContent;
    console.log(`Abriendo: ${title}`);
  });
});

/* ══════════════════════════════════════════════════
   8. SMOOTH SCROLL para links internos
   ══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════════════════════════════
   9. INIT
   ══════════════════════════════════════════════════ */
onScroll(); // Ejecutar en carga para estado inicial correcto
