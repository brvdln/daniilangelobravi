/* ============================================
   DANIIL ANGELO BRAVI — main.js
   ============================================ */

(function initHeroSlideshow() {
  const hero = document.getElementById('hero-slideshow');
  if (!hero) return;
  const imgs = hero.querySelectorAll('img');
  if (imgs.length < 2) return;
  let i = 0;
  setInterval(() => {
    imgs[i].classList.remove('is-active');
    i = (i + 1) % imgs.length;
    imgs[i].classList.add('is-active');
  }, 5000);
})();

(function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const btn = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => {
      links.classList.toggle('open');
      btn.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        btn.classList.remove('open');
      });
    });
  }
})();

(function initVideoLightbox() {
  const lb = document.getElementById('video-lightbox');
  if (!lb) return;
  const iframe = document.getElementById('video-lightbox-iframe');
  const lbClose = lb.querySelector('.lightbox-close');

  function open(videoId) {
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.video-wrap[data-video-id]').forEach(wrap => {
    wrap.addEventListener('click', () => open(wrap.dataset.videoId));
  });

  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  if (lbClose) lbClose.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
})();

(function initGalleryFadeIn() {
  document.querySelectorAll('.gallery-item img').forEach(img => {
    if (img.complete) {
      img.classList.add('is-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('is-loaded'));
    }
  });
})();

(function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('.lightbox-caption');
  const lbClose = lb.querySelector('.lightbox-close');
  const lbPrev = lb.querySelector('.lightbox-prev');
  const lbNext = lb.querySelector('.lightbox-next');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  let index = -1;

  const FRAME_PRICE = 180;
  const calc = document.getElementById('price-calculator');
  const pcBasePrice = calc ? calc.querySelector('.pc-base-price') : null;
  const pcFrameCheck = document.getElementById('pc-frame-check');
  const pcCountry = document.getElementById('pc-country');
  const pcTotalPrice = calc ? calc.querySelector('.pc-total-price') : null;
  const pcCta = document.getElementById('pc-cta');
  const pcTermsCheck = document.getElementById('pc-terms-check');
  let currentBasePrice = 0;

  function updateCtaState() {
    if (!pcCta) return;
    const accepted = pcTermsCheck && pcTermsCheck.checked;
    pcCta.classList.toggle('is-disabled', !accepted);
    pcCta.setAttribute('aria-disabled', accepted ? 'false' : 'true');
  }

  if (pcTermsCheck) pcTermsCheck.addEventListener('change', updateCtaState);

  function formatEur(n) {
    return '€' + n.toLocaleString('it-IT');
  }

  function updateTotal() {
    if (!pcTotalPrice) return;
    const frame = pcFrameCheck && pcFrameCheck.checked ? FRAME_PRICE : 0;
    const shipping = pcCountry ? parseInt(pcCountry.value, 10) : 0;
    pcTotalPrice.textContent = formatEur(currentBasePrice + frame + shipping);
  }

  if (pcFrameCheck) pcFrameCheck.addEventListener('change', updateTotal);
  if (pcCountry) pcCountry.addEventListener('change', updateTotal);

  function show(i) {
    if (!items.length) return;
    index = (i + items.length) % items.length;
    const item = items[index];
    const img = item.querySelector('img');
    const cap = item.querySelector('.caption');
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    if (lbCap) lbCap.textContent = cap ? cap.textContent : '';

    if (calc) {
      const price = parseInt(item.dataset.price || '', 10);
      if (!isNaN(price)) {
        currentBasePrice = price;
        if (pcBasePrice) pcBasePrice.textContent = formatEur(price);
        if (pcFrameCheck) pcFrameCheck.checked = false;
        if (pcCountry) pcCountry.selectedIndex = 0;
        if (pcTermsCheck) pcTermsCheck.checked = false;
        updateTotal();
        updateCtaState();
        if (pcCta && item.dataset.stripeLink) pcCta.href = item.dataset.stripeLink;
        calc.classList.add('visible');
      } else {
        calc.classList.remove('visible');
      }
    }
  }

  function open(i) {
    show(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    lbImg.src = '';
    document.body.style.overflow = '';
    if (calc) calc.classList.remove('visible');
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  if (lbClose) lbClose.addEventListener('click', close);
  if (lbPrev) lbPrev.addEventListener('click', () => show(index - 1));
  if (lbNext) lbNext.addEventListener('click', () => show(index + 1));

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();

(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
