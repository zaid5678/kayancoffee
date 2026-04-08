/* ==========================================================================
   KAYAN COFFEE — Main JS
   Nav scroll behaviour, hamburger toggle, hours highlight,
   scroll-triggered fade-ins, Leaflet map init
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. NAV SCROLL EFFECT
   -------------------------------------------------------------------------- */
(function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* --------------------------------------------------------------------------
   2. HAMBURGER / MOBILE OVERLAY
   -------------------------------------------------------------------------- */
(function initHamburger() {
  const hamburger = document.querySelector('.nav__hamburger');
  const overlay = document.querySelector('.nav__overlay');
  if (!hamburger || !overlay) return;

  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
    hamburger.classList.toggle('is-open', isOpen);
    overlay.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggle);

  // Close on overlay link click
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) toggle();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) toggle();
  });
})();

/* --------------------------------------------------------------------------
   3. MARK ACTIVE NAV LINK
   -------------------------------------------------------------------------- */
(function markActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__overlay-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (
      (page === '' || page === 'index.html') && (href === '/' || href === 'index.html' || href === './') ||
      href.includes(page) && page !== 'index.html'
    ) {
      link.classList.add('nav__link--active');
    }
  });
})();

/* --------------------------------------------------------------------------
   4. HIGHLIGHT TODAY'S OPENING HOURS
   -------------------------------------------------------------------------- */
(function highlightToday() {
  // Works for both .hours__row and .find-info__hour-row elements
  const rows = document.querySelectorAll('[data-day]');
  if (!rows.length) return;

  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const today = days[new Date().getDay()];

  rows.forEach(row => {
    if (row.dataset.day === today) {
      row.classList.add('hours__row--today', 'find-info__hour-row--today');

      // Add "Today" badge to the day label
      const dayEl = row.querySelector('.hours__day, .find-info__hour-day');
      if (dayEl && !dayEl.querySelector('.hours__today-badge')) {
        const badge = document.createElement('span');
        badge.className = 'hours__today-badge';
        badge.textContent = 'Today';
        dayEl.appendChild(badge);
      }
    }
  });
})();

/* --------------------------------------------------------------------------
   5. SCROLL-TRIGGERED FADE-IN (IntersectionObserver)
   -------------------------------------------------------------------------- */
(function initScrollFades() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
})();

/* --------------------------------------------------------------------------
   6. LEAFLET MAP (Find Us page only)
   -------------------------------------------------------------------------- */
(function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') return;

  const lat = 51.5345;
  const lng = -0.2048;

  const map = L.map('map', {
    center: [lat, lng],
    zoom: 16,
    zoomControl: true,
    scrollWheelZoom: false,
  });

  // CartoDB Positron — warm, minimal, no blue
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(map);

  // Custom marker using brand brown
  const markerHtml = `
    <div style="
      width: 32px;
      height: 32px;
      background: #A0764A;
      border: 3px solid #6B4226;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(107, 66, 38, 0.35);
    "></div>
  `;

  const icon = L.divIcon({
    html: markerHtml,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
  });

  const marker = L.marker([lat, lng], { icon }).addTo(map);

  marker.bindPopup(`
    <div class="map-popup-name">Kayan Coffee</div>
    17 College Parade<br>
    London NW6 6RN
  `).openPopup();

  // Re-enable scroll wheel on click within the map
  mapEl.addEventListener('click', () => {
    map.scrollWheelZoom.enable();
  });

  mapEl.addEventListener('mouseleave', () => {
    map.scrollWheelZoom.disable();
  });
})();
