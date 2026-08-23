/* ============================================================
   Cursor Studio – cấu hình chung (dùng chung cho popup,
   content script, service worker và trang nâng cấp).
   ============================================================ */

const CS_CONFIG = {
  VERSION: '2.0.0',

  /* ⚠️ THAY 3 GIÁ TRỊ DƯỚI ĐÂY sau khi tạo sản phẩm trên Lemon Squeezy.
     - STORE:   https://<ten-store>.lemonsqueezy.com
     - monthly: link "Buy link" của variant Monthly
     - yearly:  link "Buy link" của variant Yearly
     Xem hướng dẫn chi tiết trong file LEMONSQUEEZY-SETUP.md         */
  STORE: 'https://your-store.lemonsqueezy.com',
  CHECKOUT: {
    monthly: 'https://your-store.lemonsqueezy.com/buy/REPLACE-MONTHLY-VARIANT-UUID',
    yearly:  'https://your-store.lemonsqueezy.com/buy/REPLACE-YEARLY-VARIANT-UUID'
  },

  PRICE: {
    monthly: '$3.99',
    yearly: '$16',
    yearlyPerMonth: '$1.33',
    savePercent: 67
  },

  /* API license của Lemon Squeezy (không cần API key, chỉ cần license key) */
  LS_API: 'https://api.lemonsqueezy.com/v1/licenses',

  SUPPORT_EMAIL: 'luongshinichi@gmail.com',

  /* Link trang tiện ích trên Chrome Web Store (điền sau khi được duyệt)
     và link trang giới thiệu trên GitHub Pages.                        */
  CWS: 'https://chromewebstore.google.com/detail/REPLACE-EXTENSION-ID',
  SITE: 'https://REPLACE-USERNAME.github.io/cursor-studio/',

  /* Kiểm tra lại license mỗi 12 giờ */
  RECHECK_HOURS: 12,
  /* Cho phép dùng offline bao nhiêu ngày nếu không gọi được API */
  GRACE_DAYS: 7
};

/* Giá trị mặc định của tất cả tuỳ chọn (lưu ở chrome.storage.sync) */
const CS_DEFAULTS = {
  enabled: true,
  theme: 'arrow-neon',
  size: 28,
  opacity: 1,
  smooth: 0.35,          // 0 = bám dính, 0.9 = trôi mượt
  rotate: true,          // nghiêng con trỏ theo hướng di chuyển
  hoverGrow: true,       // phóng to khi rê lên link/nút
  smartText: true,       // trả lại con trỏ gốc khi ở ô nhập liệu
  useCustomColor: false, // PRO
  customColor: '#a78bfa',

  trail: 'sparkle',
  trailDensity: 1,       // 0.2 – 2
  trailSize: 1,          // 0.5 – 2

  click: 'ripple',

  sound: true,
  soundPack: 'tick',
  volume: 0.16,

  reduceMotion: false,
  disabledSites: []
};

/* Trạng thái Pro (lưu ở chrome.storage.local) */
const CS_PRO_DEFAULT = {
  status: 'none',   // none | active | expired
  key: '',
  instanceId: '',
  instanceName: '',
  variantName: '',
  renewsAt: 0,
  checkedAt: 0,
  lastError: ''
};

/* Pro đang hiệu lực? Chỉ khi có license hợp lệ — không có bản dùng thử. */
function csIsPro(pro) {
  return !!pro && pro.status === 'active';
}

if (typeof module !== 'undefined') module.exports = { CS_CONFIG, CS_DEFAULTS, CS_PRO_DEFAULT, csIsPro };
