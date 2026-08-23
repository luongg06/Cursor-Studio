/* ============================================================
   Cursor Studio – trang giới thiệu (GitHub Pages)
   Dùng chính engine của extension nên khách xem đúng thứ họ mua.
   ============================================================ */

const $ = id => document.getElementById(id);
const norm = s => String(s || '').replace(/\s+/g, ' ').trim();

/* ============================================================
   1. SONG NGỮ
   Bản tiếng Việt nằm sẵn trong HTML (trang vẫn đọc được khi tắt JS).
   Bảng dưới chỉ chứa bản tiếng Anh, tra theo nội dung tiếng Việt.
   ============================================================ */
const EN = {
  /* nav + hero */
  'Kho con trỏ': 'Cursors',
  'Bảng giá': 'Pricing',
  'Cài đặt': 'Install',
  'Hỏi đáp': 'FAQ',
  'Mua Pro': 'Get Pro',
  '✨ 12 con trỏ miễn phí vĩnh viễn, không cần tài khoản': '✨ 12 cursors free forever, no account needed',
  'Con trỏ chuột của bạnxứng đáng đẹp hơn thế':
    'Your mouse cursor<br><span class="grad">deserves better than this</span>',
  '78 con trỏ vector & emoji · 11 hiệu ứng đuôi vẽ trên canvas · 7 hiệu ứng click · 11 gói âm thanh. Chạy trên mọi trang web, nhẹ chưa tới 60 KB.':
    '<b>78</b> vector &amp; emoji cursors · <b>11</b> canvas trail effects · <b>7</b> click effects · <b>11</b> sound packs. Works on every website, under 60&nbsp;KB.',
  'Xem bảng giá': 'See pricing',
  'Hướng dẫn cài đặt': 'Installation guide',
  '👇 Con trỏ bạn đang thấy chính là extension đang chạy. Bấm thử đi.':
    '👇 The cursor you are looking at is the actual extension. Go on, click something.',
  '📱 Bạn đang dùng thiết bị cảm ứng nên không xem thử được. Mở trang này trên máy tính nhé.':
    '📱 You are on a touch device, so the live demo is off. Open this page on a desktop to try it.',

  /* playground */
  'Con trỏ': 'Cursor',
  'Hiệu ứng đuôi': 'Trail',
  'Khi bấm chuột': 'On click',
  'Âm thanh': 'Sound',

  /* gallery */
  'Cả kho 78 con trỏ': 'All 78 cursors',
  'Toàn bộ là SVG vector vẽ tay hoặc emoji động — sắc nét trên mọi màn hình, kể cả Retina 4K. Bấm vào icon bất kỳ để đổi con trỏ của trang này.':
    'Every one is a hand-drawn vector SVG or an animated emoji — crisp on any screen, 4K Retina included. Click any icon to change this page’s cursor.',

  /* features */
  'Không chỉ là đổi icon': 'More than just a new icon',
  '78 con trỏ': '78 cursors',
  'Mũi tên neon, pixel 8-bit, katana, đũa phép, cầu plasma, đá quý, lông vũ, tâm ngắm và 35 emoji động.':
    'Neon arrows, 8-bit pixel, katana, magic wand, plasma orb, gemstone, quill, sci-fi reticle and 35 animated emoji.',
  '11 hiệu ứng đuôi': '11 trail effects',
  'Sao chổi, dải lụa, dải neon phát sáng, bong bóng, tàn lửa, tuyết rơi, mưa sao, cầu vồng — vẽ trên canvas nên mượt.':
    'Comet, silk ribbon, glowing neon streak, bubbles, embers, snow, star rain, rainbow — drawn on canvas, so it stays smooth.',
  '7 hiệu ứng click': '7 click effects',
  'Gợn sóng, tia nổ, pháo giấy, sóng xung kích, mưa tim, nổ sao, giọt mực.':
    'Ripple, burst, confetti, shockwave, hearts, star pop, ink drop.',
  '11 gói âm thanh': '11 sound packs',
  'Phím đàn, chuông pha lê, laser, 8-bit, máy đánh chữ… tổng hợp bằng Web Audio nên 0 KB tải về.':
    'Piano keys, crystal chime, laser, 8-bit, typewriter… all synthesised with Web Audio, so 0 KB to download.',
  'Nhẹ và lịch sự': 'Light and well-behaved',
  'Giới hạn số hạt, tự ngủ khi đổi tab, tự trả lại con trỏ gốc khi bạn vào ô nhập liệu. Có "chế độ nhẹ" cho máy yếu.':
    'Particle caps, sleeps when you switch tabs, hands the native caret back inside text fields. There is a Lite mode for older machines.',
  'Không theo dõi bạn': 'It does not track you',
  'Không analytics, không quảng cáo, không gửi lịch sử duyệt web đi đâu. Bản miễn phí không hề kết nối mạng.':
    'No analytics, no ads, your browsing history never leaves the machine. The free tier makes no network requests at all.',

  /* compare */
  'Miễn phí vs Pro': 'Free vs Pro',
  'Miễn phí': 'Free',
  'Hiệu ứng click': 'Click effects',
  'Gói âm thanh': 'Sound packs',
  'Màu gradient tuỳ chỉnh': 'Custom gradient colour',
  'Cập nhật icon mới': 'New icons as they ship',

  /* pricing */
  'Một mã license dùng cho 3 thiết bị. Huỷ bất cứ lúc nào. Thanh toán qua Lemon Squeezy (Visa, Mastercard, PayPal, Apple Pay…).':
    'One licence key covers 3 devices. Cancel anytime. Payments handled by Lemon Squeezy (Visa, Mastercard, PayPal, Apple Pay…).',
  'dùng mãi mãi': 'free forever',
  '12 con trỏ cơ bản': '12 starter cursors',
  '2 hiệu ứng đuôi + 2 hiệu ứng click': '2 trail effects + 2 click effects',
  '2 gói âm thanh': '2 sound packs',
  'Màu tuỳ chỉnh': 'Custom colour',
  'Cài miễn phí': 'Install for free',
  'Pro hàng năm': 'Pro yearly',
  '/năm': '/year',
  'Toàn bộ 78 con trỏ': 'All 78 cursors',
  '11 hiệu ứng đuôi + 7 hiệu ứng click': '11 trail effects + 7 click effects',
  'Cập nhật icon mới cả năm': 'New icons all year',
  'Mua gói năm': 'Get yearly',
  'Pro hàng tháng': 'Pro monthly',
  '/tháng': '/month',
  'huỷ lúc nào cũng được': 'cancel whenever you like',
  'Toàn bộ con trỏ & hiệu ứng': 'Every cursor and effect',
  'Toàn bộ gói âm thanh': 'Every sound pack',
  'Hỗ trợ qua email': 'Email support',
  'Mua gói tháng': 'Get monthly',

  /* install */
  'Chạy trên Chrome, Edge, Brave, Opera và Cốc Cốc.': 'Works on Chrome, Edge, Brave, Opera and Cốc Cốc.',
  'Cách nhanh: Chrome Web Store': 'Fast route: Chrome Web Store',
  'Mở trang tiện ích rồi bấm Thêm vào Chrome. Xong.':
    'Open the listing and hit <b>Add to Chrome</b>. That is it.',
  'Mở Chrome Web Store': 'Open Chrome Web Store',
  'Cách thủ công: file .zip': 'Manual route: the .zip file',
  'Tải file .zip ở trang đơn hàng rồi giải nén ra thư mục bất kỳ.':
    'Download the <code>.zip</code> from your order page and unzip it anywhere.',
  'Vào địa chỉ chrome://extensions': 'Go to <code>chrome://extensions</code>',
  'Bật Chế độ nhà phát triển ở góc trên bên phải.': 'Turn on <b>Developer mode</b> (top-right).',
  'Bấm Tải tiện ích đã giải nén và chọn thư mục vừa giải nén (thư mục chứa manifest.json).':
    'Click <b>Load unpacked</b> and pick the unzipped folder (the one containing <code>manifest.json</code>).',
  'Ghim ra thanh công cụ': 'Pin it to the toolbar',
  'Bấm icon mảnh ghép 🧩 trên thanh công cụ → bấm đinh ghim cạnh Cursor Studio. Từ giờ bấm icon mũi tên tím là mở được bảng điều khiển.':
    'Click the puzzle icon 🧩 in the toolbar, then the pin next to <b>Cursor Studio</b>. From now on the purple arrow icon opens the control panel.',

  /* activate */
  'Kích hoạt bản Pro': 'Activate Pro',
  'Sau khi thanh toán, Lemon Squeezy gửi mã license vào email của bạn.':
    'After checkout, Lemon Squeezy emails you a licence key.',
  'Tìm mã license': 'Find your key',
  'Mã nằm trong email biên nhận, và cả ở trang app.lemonsqueezy.com/my-orders. Dạng như:':
    'It is in your email receipt, and also on <code>app.lemonsqueezy.com/my-orders</code>. It looks like:',
  'Dán vào extension': 'Paste it in',
  'Bấm icon Cursor Studio → tab Pro → dán mã vào ô → bấm Kích hoạt.':
    'Click the <b>Cursor Studio</b> icon → <b>Pro</b> tab → paste the key → hit <b>Activate</b>.',
  'Xong': 'Done',
  'Huy hiệu trên icon đổi thành PRO màu xanh. Toàn bộ 78 con trỏ và hiệu ứng mở khoá ngay.':
    'The badge on the icon turns green <b>PRO</b>. All 78 cursors and every effect unlock instantly.',
  'Đổi sang máy khác?': 'Moving to another computer?',
  'Một mã dùng được 3 thiết bị. Hết lượt thì vào máy cũ: tab Pro → Gỡ license khỏi thiết bị này, lượt kích hoạt được trả lại ngay.':
    'One key covers <b>3 devices</b>. Out of slots? On the old machine open the <b>Pro</b> tab and click <i>Remove licence from this device</i> — the slot is freed immediately.',

  /* faq */
  'Báo "Không tìm thấy mã license này" thì sao?': 'It says "licence key not found"',
  'Mã bị gõ sai hoặc dư dấu cách. Copy thẳng từ email, đừng gõ tay.':
    'The key was mistyped or has a stray space. Copy it straight from the email instead of typing it.',
  'Báo "Mã này đã kích hoạt đủ số thiết bị"?': 'It says "activation limit reached"',
  'Bạn đã dùng hết 3 lượt. Vào một máy cũ, mở tab Pro và bấm "Gỡ license khỏi thiết bị này" để lấy lại một lượt.':
    'All 3 activations are in use. On a machine you no longer use, open the Pro tab and click "Remove licence from this device" to free one.',
  'Báo "Không kết nối được máy chủ"?': 'It says "cannot reach the server"',
  'Lỗi mạng hoặc tường lửa. Extension vẫn giữ bản Pro chạy offline thêm 7 ngày, cứ thử lại sau.':
    'A network or firewall problem. Pro keeps working offline for another 7 days, so just try again later.',
  'Huỷ đăng ký thế nào?': 'How do I cancel?',
  'Trong email biên nhận có link "Manage subscription" của Lemon Squeezy. Bấm vào để đổi thẻ, đổi gói hoặc huỷ. Huỷ xong bạn vẫn dùng Pro tới hết chu kỳ đã trả tiền.':
    'Your email receipt has a "Manage subscription" link to the Lemon Squeezy portal. Use it to change card, switch plan or cancel. After cancelling you keep Pro until the end of the period you already paid for.',
  'Con trỏ không hiện ở vài trang?': 'The cursor is missing on some pages',
  'Các trang nội bộ của trình duyệt (chrome://…, cửa hàng tiện ích, trình xem PDF) chặn mọi extension. Đây là quy định bảo mật của Chrome chứ không phải lỗi.':
    'Browser-internal pages (chrome://…, the Web Store, the PDF viewer) block every extension. That is a Chrome security rule, not a bug.',
  'Máy yếu có bị giật không?': 'Will it lag on an older machine?',
  'Hiệu ứng có giới hạn số hạt và tự dừng khi bạn chuyển tab. Nếu vẫn nặng, mở tab Hiệu ứng và bật "Chế độ nhẹ", hoặc giảm "Mật độ hạt".':
    'Effects are particle-capped and pause when you switch tabs. If it still feels heavy, open the Effects tab and turn on Lite mode, or lower the particle density.',
  'Tắt riêng cho một trang web được không?': 'Can I disable it on one specific site?',
  'Được. Mở trang đó, bấm icon extension, tick vào ô "Tắt trên …" ở chân bảng điều khiển.':
    'Yes. Open that site, click the extension icon, and tick "Disable on …" at the bottom of the panel.',
  'Dùng được trên Edge / Brave / Cốc Cốc không?': 'Does it work on Edge / Brave / Cốc Cốc?',
  'Được hết, vì các trình duyệt này đều chạy nhân Chromium và đọc được cùng một extension.':
    'All of them, since they run the same Chromium core and load the very same extension.',

  /* privacy */
  'Chính sách quyền riêng tư': 'Privacy policy',
  'Cập nhật: 23/08/2026': 'Last updated: 23 Aug 2026',
  'Tóm gọn: Cursor Studio không thu thập, không lưu trữ, không bán bất kỳ dữ liệu cá nhân nào. Không analytics, không quảng cáo, không tracking pixel, không máy chủ riêng.':
    '<b>In short: Cursor Studio collects nothing, stores nothing, and sells nothing.</b> No analytics, no ads, no tracking pixels, no server of our own.',
  'Dữ liệu được lưu ở đâu': 'Where your data lives',
  'Chỉ nằm trong trình duyệt của bạn. chrome.storage.sync giữ các tuỳ chọn giao diện (con trỏ đang chọn, kích thước, hiệu ứng, âm lượng, danh sách tên miền bạn tự tắt). chrome.storage.local giữ mã license và mã thiết bị. Chúng tôi không đọc được hai mục này.':
    'Only inside your browser. <code>chrome.storage.sync</code> holds your appearance settings (chosen cursor, size, effects, volume, and the domains you disabled yourself). <code>chrome.storage.local</code> holds your licence key and device id. We cannot read either of them.',
  'Những gì extension KHÔNG đụng tới': 'What the extension never touches',
  'Lịch sử duyệt web, URL các trang bạn mở, nội dung trang, văn bản bạn gõ, mật khẩu, cookie, vị trí, camera, micro, file trên máy. Toạ độ chuột chỉ dùng tức thời để vẽ hình, không lưu và không gửi đi.':
    'Browsing history, the URLs you open, page content, anything you type, passwords, cookies, location, camera, microphone, local files. Mouse coordinates are used to draw a shape for one frame — never stored, never sent.',
  'Vì sao cần quyền truy cập mọi trang web': 'Why it asks for access to all websites',
  'Quyền này là bắt buộc về mặt kỹ thuật để extension chèn được lớp vẽ con trỏ lên trang bạn đang xem. Content script chỉ đọc toạ độ chuột để vẽ, không đọc nội dung trang.':
    'That permission is technically required to draw the cursor layer over the page you are viewing. The content script only reads mouse coordinates in order to draw; it does not read page content.',
  'Kết nối mạng duy nhất': 'The only network call',
  'Chỉ khi bạn bấm "Kích hoạt" license, hoặc khi tự kiểm tra lại license 12 giờ/lần nếu bạn đã mua Pro. Địa chỉ: api.lemonsqueezy.com/v1/licenses/… — gửi đi mã license và mã thiết bị, nhận về "còn hiệu lực hay không". Người dùng bản miễn phí không bao giờ phát sinh kết nối mạng nào.':
    'Only when you press Activate, or during the 12-hourly re-check if you own Pro. Endpoint: <code>api.lemonsqueezy.com/v1/licenses/…</code> — it sends your licence key and device id, and gets back whether the licence is still valid. <b>Free users never trigger a single network request.</b>',
  'Thanh toán': 'Payments',
  'Do Lemon Squeezy xử lý với tư cách Merchant of Record. Chúng tôi không nhìn thấy và không lưu số thẻ của bạn. Xem thêm chính sách của Lemon Squeezy.':
    'Handled by Lemon Squeezy as Merchant of Record. We never see or store your card details. See the <a href="https://www.lemonsqueezy.com/privacy" target="_blank" rel="noopener">Lemon Squeezy privacy policy</a>.',
  'Xoá dữ liệu': 'Deleting your data',
  'Gỡ cài đặt extension là Chrome xoá sạch toàn bộ dữ liệu nói trên. Muốn gỡ license trước thì vào tab Pro và bấm "Gỡ license khỏi thiết bị này".':
    'Uninstalling the extension makes Chrome wipe everything above. To release your licence first, open the Pro tab and click "Remove licence from this device".',
  'Liên hệ': 'Contact',
  'Thắc mắc về quyền riêng tư, gửi tới địa chỉ hỗ trợ.':
    'Privacy questions go to <span id="contactMail">our support address</span>.',

  /* footer */
  'Quyền riêng tư': 'Privacy'
};

let lang = 'vi';
const originals = new Map();

function initI18n() {
  document.querySelectorAll('[data-i18n],[data-i18n-html]').forEach(el => {
    const isHtml = el.hasAttribute('data-i18n-html');
    originals.set(el, { key: norm(el.textContent), vi: isHtml ? el.innerHTML : el.textContent, isHtml });
  });
  let saved = null;
  /* Khoa 'cs-lang-v2': ban cu tung tu dong ghi 'vi' cho trinh duyet tieng Viet
     du khach chua he bam nut co, lam ho bi khoa cung vao tieng Viet. Doi ten
     khoa de bo qua toan bo gia tri cu do. */
  try { saved = localStorage.getItem('cs-lang-v2'); } catch (e) {}
  /* Mac dinh tieng Anh. persist = false: lan tu dong nay KHONG duoc ghi nho,
     chi luu khi khach that su bam nut co. */
  setLang(saved || 'en', false);
}

function setLang(next, persist) {
  lang = next === 'en' ? 'en' : 'vi';
  document.documentElement.lang = lang;
  if (persist) {
    try { localStorage.setItem('cs-lang-v2', lang); } catch (e) {}
  }
  $('langBtn').textContent = lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN';

  originals.forEach((o, el) => {
    if (lang === 'vi') {
      o.isHtml ? (el.innerHTML = o.vi) : (el.textContent = o.vi);
      return;
    }
    const en = EN[o.key];
    if (en == null) return;                 // chưa dịch -> giữ nguyên tiếng Việt
    o.isHtml ? (el.innerHTML = en) : (el.textContent = en);
  });
  paintDynamic();
}

/* ============================================================
   2. NHỮNG CHỖ LẤY SỐ TỪ config.js
   ============================================================ */
function paintDynamic() {
  const P = CS_CONFIG.PRICE;
  $('priceMonthly').textContent = P.monthly;
  $('priceYearly').textContent = P.yearly;
  $('ribbonSave').textContent = lang === 'vi'
    ? 'Tiết kiệm ' + P.savePercent + '%'
    : 'Save ' + P.savePercent + '%';
  $('perMonth').textContent = lang === 'vi'
    ? 'chỉ ≈ ' + P.yearlyPerMonth + ' mỗi tháng'
    : 'about ' + P.yearlyPerMonth + ' a month';
  $('ver').textContent = CS_CONFIG.VERSION;

  const mail = CS_CONFIG.SUPPORT_EMAIL;
  const cm = $('contactMail');
  if (cm) cm.innerHTML = '<a href="mailto:' + mail + '">' + mail + '</a>';
  $('footMail').innerHTML = '<a href="mailto:' + mail + '">' + mail + '</a>';

  const cws = $('cwsLink');
  if (CS_CONFIG.CWS && CS_CONFIG.CWS.indexOf('REPLACE') < 0) {
    cws.href = CS_CONFIG.CWS;
    cws.target = '_blank';
    cws.rel = 'noopener';
  } else {
    cws.href = '#install';
    cws.setAttribute('aria-disabled', 'true');
    cws.style.opacity = '.45';
    cws.style.pointerEvents = 'none';
    cws.textContent = lang === 'vi' ? 'Đang chờ duyệt' : 'Pending review';
  }
}

function buy(plan) {
  const url = CS_CONFIG.CHECKOUT[plan];
  const note = $('buyNote');
  if (!url || url.indexOf('REPLACE') >= 0) {
    note.hidden = false;
    note.textContent = lang === 'vi'
      ? '⚠️ Chưa cấu hình link thanh toán trong config.js — xem LEMONSQUEEZY-SETUP.md.'
      : '⚠️ Checkout link is not configured yet in config.js — see LEMONSQUEEZY-SETUP.md.';
    return;
  }
  window.open(url, '_blank', 'noopener');
}

/* ============================================================
   3. CON TRỎ SỐNG NGAY TRÊN TRANG
   ============================================================ */
const FEATURED = ['wand-violet', 'arrow-neon', 'katana-neon', 'orb-plasma', 'star-gold',
                  'gem-blue', 'flame-svg', 'pixel-cyber', 'feather-teal', 'cross-red',
                  'e-unicorn', 'e-fire'];

let engine = null;
const demo = { theme: 'wand-violet', trail: 'neon', click: 'shock', soundPack: 'magic', sound: false };

function applyDemo() {
  if (!engine) return;
  engine.setSettings(Object.assign({}, CS_DEFAULTS, demo, { size: 30 }), true);
}

function initCursor() {
  engine = CursorStudioEngine.create({ host: document.documentElement, mode: 'fixed' });
  applyDemo();
  document.documentElement.classList.add('cursor-studio-active');

  document.addEventListener('mousemove', e => engine.pointer(e.clientX, e.clientY), { passive: true });
  document.addEventListener('mousedown', e => engine.click(e.clientX, e.clientY), { passive: true });
  document.addEventListener('mouseleave', () => engine.hide(), { passive: true });
  document.addEventListener('mouseover', e => {
    const el = e.target;
    const text = el && el.closest && el.closest('input,textarea,[contenteditable="true"]');
    document.documentElement.classList.toggle('cs-native', !!text);
    text ? engine.hide() : engine.show();
    engine.setHover(!!(el && el.closest && el.closest('a,button,summary,.gitem,.pg-tile')));
  }, { passive: true });
  window.addEventListener('resize', () => engine.resize(), { passive: true });
  document.addEventListener('visibilitychange', () => {
    document.hidden ? engine.stop() : engine.start();
  });
}

/* ---------- các nút chọn trong khu thử ---------- */
function tile(label, iconHtml, active, onClick) {
  const b = document.createElement('button');
  b.className = 'pg-tile' + (active ? ' on' : '');
  b.innerHTML = (iconHtml || '') + (label ? '<span>' + label + '</span>' : '');
  b.addEventListener('click', onClick);
  return b;
}

function renderPickers() {
  const cur = $('pickCursor');
  cur.innerHTML = '';
  FEATURED.forEach(id => {
    const t = csTheme(id);
    cur.appendChild(tile('', t.kind === 'emoji' ? t.glyph : csRenderSvg(t), demo.theme === id, () => {
      demo.theme = id; applyDemo(); renderPickers(); markGallery();
    }));
  });

  const tr = $('pickTrail');
  tr.innerHTML = '';
  CS_TRAILS.forEach(t => tr.appendChild(tile(t.name, '', demo.trail === t.id, () => {
    demo.trail = t.id; applyDemo(); renderPickers();
  })));

  const cl = $('pickClick');
  cl.innerHTML = '';
  CS_CLICKS.forEach(t => cl.appendChild(tile(t.name, '', demo.click === t.id, () => {
    demo.click = t.id; applyDemo(); renderPickers();
  })));

  const sd = $('pickSound');
  sd.innerHTML = '';
  CSAudio.packs.forEach(p => sd.appendChild(tile(p.name, '', demo.sound && demo.soundPack === p.id, () => {
    demo.soundPack = p.id;
    demo.sound = p.id !== 'none';
    CSAudio.play(p.id, { volume: 0.2 });
    applyDemo();
    renderPickers();
  })));
}

/* ---------- kho 78 con trỏ ---------- */
function renderGallery() {
  const g = $('gallery');
  g.innerHTML = '';
  CS_THEMES.forEach(t => {
    const d = document.createElement('button');
    d.className = 'gitem';
    d.dataset.id = t.id;
    d.title = t.name;
    d.innerHTML = t.kind === 'emoji' ? t.glyph : csRenderSvg(t);
    d.addEventListener('click', () => {
      demo.theme = t.id; applyDemo(); markGallery(); renderPickers();
    });
    g.appendChild(d);
  });
  markGallery();
}

function markGallery() {
  document.querySelectorAll('.gitem').forEach(el => {
    el.classList.toggle('on', el.dataset.id === demo.theme);
  });
}

/* ============================================================
   4. KHỞI ĐỘNG
   ============================================================ */
(function boot() {
  initI18n();
  $('langBtn').addEventListener('click', () => setLang(lang === 'vi' ? 'en' : 'vi', true));
  $('buyMonthly').addEventListener('click', () => buy('monthly'));
  $('buyYearly').addEventListener('click', () => buy('yearly'));

  const touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (touch) {
    document.body.classList.add('is-touch');
    renderGallery();
    return;
  }

  if (reduce) { demo.trail = 'none'; demo.click = 'ripple'; }
  renderGallery();
  renderPickers();
  initCursor();
})();
