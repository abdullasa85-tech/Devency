/* ============================================================
   form.js — منطق الفورم الكامل
   Web3Forms (إيميل) + Google Apps Script (Google Sheets)
   ============================================================ */
'use strict';

/* ====================================================
   CONFIG — ضع مفاتيحك هنا
   ==================================================== */
const WEB3FORMS_KEY  = 'YOUR_WEB3FORMS_ACCESS_KEY';   // من web3forms.com
const SHEETS_URL     = 'YOUR_APPS_SCRIPT_DEPLOY_URL'; // من Google Apps Script
const WHATSAPP_NUM   = '4917684159236';                // رقم WhatsApp بدون +

/* ── Selected Services State ── */
const selectedServices = {};

/* ── Step Labels ── */
const STEP_LABELS = {
  ar: ['الخطوة 1 من 5','الخطوة 2 من 5','الخطوة 3 من 5','الخطوة 4 من 5','الخطوة 5 من 5'],
  en: ['Step 1 of 5',  'Step 2 of 5',  'Step 3 of 5',  'Step 4 of 5',  'Step 5 of 5']
};
const STEP_PCTS = [20, 40, 60, 80, 100];

/* ============================================================
   Checkbox Cards
   ============================================================ */
function initCheckboxCards() {
  document.querySelectorAll('.checkbox-card').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      toggleCheckCard(card);
    });
  });
}

function toggleCheckCard(el) {
  const wasSelected = el.classList.contains('selected');
  el.classList.toggle('selected', !wasSelected);

  const checkbox = el.querySelector('input[type="checkbox"]');
  if (checkbox) checkbox.checked = !wasSelected;

  const key     = el.dataset.key;
  const price   = parseInt(el.dataset.price) || 0;
  const labelAr = el.dataset.labelAr;
  const labelEn = el.dataset.labelEn;

  if (!wasSelected) {
    selectedServices[key] = { price, labelAr, labelEn };
  } else {
    delete selectedServices[key];
  }
  updateSummaryBar();
}

/* ============================================================
   Summary Bar
   ============================================================ */
function updateSummaryBar() {
  const keys    = Object.keys(selectedServices);
  const bar     = document.getElementById('summaryBar');
  const items   = document.getElementById('summaryItems');
  const totalEl = document.getElementById('summaryTotal');
  if (!bar) return;

  if (keys.length === 0) { bar.classList.remove('visible'); return; }

  bar.classList.add('visible');
  let sum = 0;
  items.innerHTML = '';
  keys.forEach(k => {
    const s = selectedServices[k];
    sum += s.price;
    const chip = document.createElement('div');
    chip.className = 'form-summary-chip';
    const label = currentLang === 'ar' ? s.labelAr : s.labelEn;
    chip.innerHTML = `<span class="check">&#10003;</span>${label}`;
    items.appendChild(chip);
  });
  if (totalEl) totalEl.textContent = '$' + sum.toLocaleString('en-US');
}
window.updateSummaryBar = updateSummaryBar;

/* ============================================================
   Select Package (from pricing section buttons)
   ============================================================ */
function selectPackage(pkg) {
  document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    goStep(1);
    setTimeout(() => {
      const card = document.querySelector(`.checkbox-card[data-key="${pkg}"]`);
      if (card && !card.classList.contains('selected')) toggleCheckCard(card);
    }, 400);
  }, 600);
}
window.selectPackage = selectPackage;

/* ============================================================
   Step Navigation
   ============================================================ */
function goStep(n) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const step = document.getElementById('step' + n);
  if (step) step.classList.add('active');

  ['pb1','pb2','pb3','pb4','pb5'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('active', 'done');
    if (i + 1 === n)     el.classList.add('active');
    else if (i + 1 < n)  el.classList.add('done');
  });

  const labelEl = document.getElementById('progressLabel');
  const pctEl   = document.getElementById('progressPct');
  if (labelEl) labelEl.textContent = STEP_LABELS[currentLang][n - 1];
  if (pctEl)   pctEl.textContent   = STEP_PCTS[n - 1] + '%';

  document.getElementById('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
window.goStep = goStep;

/* ============================================================
   Validate Step 1
   ============================================================ */
function validateStep1() {
  const hasService = Object.keys(selectedServices).length > 0;
  const name       = document.getElementById('f_name')?.value.trim();
  const org        = document.getElementById('f_org')?.value.trim();
  const wa         = document.getElementById('f_wa')?.value.trim();
  const email      = document.getElementById('f_email')?.value.trim();
  const country    = document.getElementById('f_country')?.value;

  const hint = document.getElementById('hint-svc');
  const err  = document.getElementById('err1');

  if (hint) hint.classList.remove('show');
  if (err)  err.style.display = 'none';

  if (!hasService) {
    if (hint) hint.classList.add('show');
    return;
  }
  if (!name || !org || !wa || !email || !country) {
    if (err) {
      err.style.display = 'block';
      err.textContent = currentLang === 'ar'
        ? 'يرجى تعبئة جميع الحقول الإلزامية (*)'
        : 'Please fill in all required fields (*)';
    }
    return;
  }
  goStep(2);
}
window.validateStep1 = validateStep1;

/* ============================================================
   Submit Form — يرسل لـ Web3Forms + Google Sheets
   ============================================================ */
async function submitForm() {
  const btn   = document.getElementById('submitBtn');
  const errEl = document.getElementById('form-error');

  btn.disabled    = true;
  btn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Submitting...';
  if (errEl) errEl.style.display = 'none';

  /* ── جمع البيانات ── */
  const formData = {
    name:      document.getElementById('f_name')?.value.trim()    || '',
    org:       document.getElementById('f_org')?.value.trim()     || '',
    web:       document.getElementById('f_web')?.value.trim()     || '',
    country:   document.getElementById('f_country')?.value        || '',
    wa:        document.getElementById('f_wa')?.value.trim()       || '',
    email:     document.getElementById('f_email')?.value.trim()    || '',
    services:  Object.keys(selectedServices).join(', ')            || '—',
    totalEst:  '$' + Object.values(selectedServices).reduce((s, v) => s + v.price, 0).toLocaleString(),
    biz:       document.querySelector('input[name="biz"]:checked')?.value    || '—',
    team:      document.getElementById('f_team')?.value            || '—',
    clients:   document.getElementById('f_clients')?.value         || '—',
    budget:    document.querySelector('input[name="budget"]:checked')?.value || '—',
    goal:      document.querySelector('input[name="goal"]:checked')?.value   || '—',
    timing:    document.querySelector('input[name="timing"]:checked')?.value || '—',
    challenge: document.getElementById('f_challenge')?.value.trim() || '—'
  };

  /* ── إرسال متوازي للاثنين ── */
  await Promise.allSettled([

    /* 1) Web3Forms — يرسل إيميل تلقائي */
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key:  WEB3FORMS_KEY,
        subject:     `[Devency] طلب استشارة — ${formData.org} | ${formData.services}`,
        from_name:   formData.name,
        email:       formData.email,
        redirect:    'false',
        message: [
          `الاسم: ${formData.name}`,
          `المؤسسة: ${formData.org}`,
          `الموقع: ${formData.web || '—'}`,
          `الدولة: ${formData.country}`,
          `WhatsApp: ${formData.wa}`,
          `البريد: ${formData.email}`,
          `الخدمات: ${formData.services}`,
          `الإجمالي المتوقع: ${formData.totalEst}`,
          `نوع النشاط: ${formData.biz}`,
          `حجم الفريق: ${formData.team}`,
          `العملاء الحاليون: ${formData.clients}`,
          `الميزانية: ${formData.budget}`,
          `الهدف: ${formData.goal}`,
          `موعد البدء: ${formData.timing}`,
          `التحدي: ${formData.challenge}`
        ].join('\n')
      })
    }),

    /* 2) Google Apps Script — يسجل بالـ Google Sheets */
    fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

  ]);

  /* ── عرض شاشة النجاح دائماً ── */
  showSuccess();
}
window.submitForm = submitForm;

/* ============================================================
   Show Success Screen
   ============================================================ */
function showSuccess() {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const progressWrap = document.querySelector('.progress-wrap');
  if (progressWrap) progressWrap.style.display = 'none';

  const screen = document.getElementById('successScreen');
  if (screen) screen.style.display = 'block';
}

/* ============================================================
   Init Form
   ============================================================ */
function initForm() {
  initCheckboxCards();
}
window.initForm = initForm;
