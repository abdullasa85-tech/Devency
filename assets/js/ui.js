/* ============================================================
   ui.js — FAQ + Tabs + Scroll Reveal + Calculator + Sticky
   ============================================================ */
'use strict';

/* ── Scroll Reveal ── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Animate progress bars inside revealed sections
        e.target.querySelectorAll('.dash-bar-fill').forEach(bar => {
          const w = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = w; }, 100);
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Calculator ── */
function updateCalc() {
  const reg = parseFloat(document.getElementById('calc-reg')?.value) || 0;
  const val = parseFloat(document.getElementById('calc-val')?.value) || 0;
  const total = document.getElementById('calc-total');
  if (total) total.textContent = '$' + (reg * val * 12).toLocaleString('en-US');
}
window.updateCalc = updateCalc;

/* ── FAQ ── */
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ── Service Tabs ── */
function switchSvcTab(tab) {
  document.querySelectorAll('.svc-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('svc-' + tab);
  if (panel) panel.classList.add('active');

  document.querySelectorAll('.svc-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
}
window.switchSvcTab = switchSvcTab;

/* ── Pricing Tabs ── */
function switchPricingTab(tab) {
  document.querySelectorAll('.pricing-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('pkg-' + tab);
  if (panel) panel.classList.add('active');

  document.querySelectorAll('.pricing-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
}
window.switchPricingTab = switchPricingTab;

/* ── Expand More ── */
function toggleMore(btn) {
  const extra  = btn.nextElementSibling;
  const isOpen = extra.classList.contains('open');
  extra.classList.toggle('open', !isOpen);

  const arSpan = btn.querySelector('.ar');
  const enSpan = btn.querySelector('.en');
  if (arSpan) arSpan.textContent = isOpen ? '+ مزيد' : '- إخفاء';
  if (enSpan) enSpan.textContent = isOpen ? '+ More'  : '- Hide';
}
window.toggleMore = toggleMore;

/* ── Sticky CTA ── */
function initSticky() {
  const cta = document.getElementById('stickyCta');
  if (!cta) return;
  window.addEventListener('scroll', () => {
    cta.classList.toggle('show', window.scrollY > 500);
  });
}

/* ── Init All ── */
function initUI() {
  initReveal();
  initFaq();
  initSticky();
  updateCalc();
}

window.initUI = initUI;
