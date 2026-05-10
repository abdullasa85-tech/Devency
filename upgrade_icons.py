import re

# ==================== قراءة الملف ====================
with open('pasted-text.txt', 'r', encoding='utf-8') as f:
    html = f.read()

print("✅ تم قراءة الملف بنجاح - حجم:", len(html), "حرف")

# ==================== رسومات SVG فاخرة ====================
svgs = {
    '🕌': '<svg width="32" height="32" viewBox="0 0 24 24" fill="#0d4f3c" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22" stroke="#c9a84c" stroke-width="2.5" fill="none"/></svg>',
    '💰': '<svg width="32" height="32" viewBox="0 0 24 24" fill="#c9a84c" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="20" height="14" rx="2" ry="2" stroke="#0d4f3c" stroke-width="2"/><line x1="2" y1="10" x2="22" y2="10" stroke="#0d4f3c" stroke-width="2"/><circle cx="12" cy="15" r="2" fill="#0d4f3c"/></svg>',
    '📈': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a8a64" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    '🔍': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    '🛡️': '<svg width="26" height="26" viewBox="0 0 24 24" fill="#c9a84c" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10" fill="none" stroke="#0d4f3c" stroke-width="2.5"/></svg>',
    '📊': '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    '🌍': '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a8a64" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    '🤝': '<svg width="26" height="26" viewBox="0 0 24 24" fill="#c9a84c" xmlns="http://www.w3.org/2000/svg"><path d="M17 8c0-2.76-2.24-5-5-5S7 5.24 7 8"/><path d="M12 13c-3.87 0-7 3.13-7 7h14c0-3.87-3.13-7-7-7z"/></svg>',
    '💸': '<svg width="28" height="28" viewBox="0 0 24 24" fill="#ef4444" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="12" cy="15" r="2" fill="#fff"/></svg>',
    '📉': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
    '⏳': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    '🎯': '<svg width="42" height="42" viewBox="0 0 24 24" fill="#c9a84c" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#0d4f3c" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="6" stroke="#0d4f3c" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="2" fill="#0d4f3c"/></svg>',
    '📱': '<svg width="42" height="42" viewBox="0 0 24 24" fill="#1a8a64" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="3" width="14" height="18" rx="2" ry="2" stroke="#c9a84c" stroke-width="2" fill="none"/><circle cx="12" cy="17" r="1.2" fill="#c9a84c"/></svg>',
    '🔬': '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    '✍️': '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    '📧': '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    '✅': '<svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    '⚡': '<svg width="24" height="24" viewBox="0 0 24 24" fill="#c9a84c" xmlns="http://www.w3.org/2000/svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    '🚀': '<svg width="34" height="34" viewBox="0 0 24 24" fill="#1a8a64" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>',
}

# ==================== استبدال كل الأيموجي ====================
for emoji, svg in svgs.items():
    html = re.sub(re.escape(emoji), svg, html)

# ==================== تعديل CSS ====================
css_fix = """
.float-icon, .svc-icon, .why-icon, .addon-icon, .loss-stat-icon, .risk-icon, .success-icon {
    font-size: 0 !important;
    line-height: 1 !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
}
.trust-b span svg, .about-pill svg {
    vertical-align: middle;
    margin-inline-end: 6px;
}
"""

if '</style>' in html:
    html = html.replace('</style>', css_fix + '</style>')

# ==================== حفظ الملف النهائي ====================
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("🎉 تم بنجاح!")
print("📁 تم إنشاء ملف index.html مع رسومات SVG فاخرة")
