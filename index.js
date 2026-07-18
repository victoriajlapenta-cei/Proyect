
(function () {

  'use strict';

  const headerEl = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  const navScrollHandler = () => {
    const isScrolled = window.scrollY > 20;
    headerEl.classList.toggle('header--scrolled', isScrolled);
  };


  window.addEventListener('scroll', navScrollHandler);

  const activeLinkObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');

          navLinks.forEach((link) => link.classList.remove('nav__link--active'));

          const activeLink = document.querySelector(`.nav__link[href="#${currentId}"]`);
          if (activeLink) activeLink.classList.add('nav__link--active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => activeLinkObserver.observe(section));

  const hamburgerBtn = document.getElementById('hamburger');
  const navListEl    = document.getElementById('navList');

  let isMenuOpen = false;

  const hamburgerHandler = () => {
    isMenuOpen = !isMenuOpen;

    hamburgerBtn.setAttribute('aria-expanded', String(isMenuOpen));
    hamburgerBtn.classList.toggle('nav__hamburger--open', isMenuOpen);
    navListEl.classList.toggle('nav__list--open', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  };

  const closeMobileMenuHandler = () => {
    if (isMenuOpen) hamburgerHandler();
  };

  hamburgerBtn.addEventListener('click', hamburgerHandler);
  navLinks.forEach((link) => link.addEventListener('click', closeMobileMenuHandler));

  const sliderTrack = document.getElementById('sliderTrack');
  const sliderPrev  = document.getElementById('sliderPrev');
  const sliderNext  = document.getElementById('sliderNext');
  const sliderDots  = document.querySelectorAll('.slider__dot');
  const sliderEl    = document.getElementById('testimoniosSlider');

  let currentSlide     = 0;
  const totalSlides    = sliderDots.length;
  let sliderInterval   = null;
  const AUTOPLAY_DELAY = 5000;

  const goToSlide = (index) => {
    currentSlide = (index + totalSlides) % totalSlides;

    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    sliderDots.forEach((dot, i) => {
      const isActive = i === currentSlide;
      dot.classList.toggle('slider__dot--active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  };

  const startAutoplay = () => {
    sliderInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, AUTOPLAY_DELAY);
  };

  const stopAutoplay = () => {
    clearInterval(sliderInterval);
  };

  const sliderPrevHandler = () => {
    stopAutoplay();
    goToSlide(currentSlide - 1);
    startAutoplay();
  };

  const sliderNextHandler = () => {
    stopAutoplay();
    goToSlide(currentSlide + 1);
    startAutoplay();
  };


  const sliderDotHandler = (event) => {
    const index = Number(event.currentTarget.dataset.index);
    stopAutoplay();
    goToSlide(index);
    startAutoplay();
  };

  sliderEl.addEventListener('mouseenter', stopAutoplay);
  sliderEl.addEventListener('mouseleave', startAutoplay);


  sliderPrev.addEventListener('click', sliderPrevHandler);
  sliderNext.addEventListener('click', sliderNextHandler);
  sliderDots.forEach((dot) => dot.addEventListener('click', sliderDotHandler));

  startAutoplay();

  const acordeonBtns = document.querySelectorAll('.acordeon__btn');

  const acordeonHandler = (event) => {
    const btn = event.currentTarget;

    const isExpanded = btn.getAttribute('aria-expanded') === 'true';

    const panelId = btn.getAttribute('aria-controls');
    const panel   = document.getElementById(panelId);

    acordeonBtns.forEach((otherBtn) => {
      const otherId    = otherBtn.getAttribute('aria-controls');
      const otherPanel = document.getElementById(otherId);
      otherBtn.setAttribute('aria-expanded', 'false');
      if (otherPanel) otherPanel.hidden = true;
    });

    if (!isExpanded) {
      btn.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    }
  };

  acordeonBtns.forEach((btn) => btn.addEventListener('click', acordeonHandler));

  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  const validateField = (fieldId, groupId, testFn) => {
    const field   = document.getElementById(fieldId);
    const group   = document.getElementById(groupId);
    const isValid = testFn(field.value.trim());

    group.classList.toggle('form__group--error', !isValid);
    return isValid;
  };

  const formValidationHandler = (event) => {
    event.preventDefault();

    const isNombreValid   = validateField('nombre',   'group-nombre',   (v) => v.length >= 2);
    const isEmailValid    = validateField('email',    'group-email',    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    const isServicioValid = validateField('servicio', 'group-servicio', (v) => v !== '');
    const isMensajeValid  = validateField('mensaje',  'group-mensaje',  (v) => v.length >= 10);

    const isFormValid = isNombreValid && isEmailValid && isServicioValid && isMensajeValid;
    if (!isFormValid) return;

    submitBtn.disabled      = true;
    submitBtn.textContent   = 'Enviando...';

    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.hidden        = false;
    }, 1200);
  };

  const clearErrorHandler = (event) => {
    const groupId = `group-${event.currentTarget.id}`;
    const group   = document.getElementById(groupId);
    if (group) group.classList.remove('form__group--error');
  };

  contactForm.addEventListener('submit', formValidationHandler);

  ['nombre', 'email', 'servicio', 'mensaje'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', clearErrorHandler);
  });

  const revealCards = document.querySelectorAll('.servicio-card');

  const scrollRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {

          requestAnimationFrame(() => {
            entry.target.classList.add('servicio-card--visible');
          });

          scrollRevealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.08}s`;
    scrollRevealObserver.observe(card);
  });

})(); 