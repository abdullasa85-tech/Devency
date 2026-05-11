/* ============================================================
   lang.js — نظام تبديل اللغة
   ============================================================ */
'use strict';

const html = document.documentElement;
let currentLang = 'ar';

function toggleLang() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  html.setAttribute('data-lang', currentLang);
  html.setAttribute('lang', currentLang);
  html.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

  const btnAr = document.getElementById('btn-ar');
  const btnEn = document.getElementById('btn-en');
  if (btnAr) btnAr.classList.toggle('active', currentLang === 'ar');
  if (btnEn) btnEn.classList.toggle('active', currentLang === 'en');

  // Refresh summary bar labels after lang switch
  if (typeof updateSummaryBar === 'function') updateSummaryBar();
}

// Export for other modules
window.currentLang = currentLang;
window.toggleLang  = toggleLang;
