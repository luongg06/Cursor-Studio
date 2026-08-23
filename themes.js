/* ============================================================
   Cursor Studio – THƯ VIỆN CON TRỎ & HIỆU ỨNG
   Tất cả icon đều là SVG vector vẽ tay hoặc emoji => nhẹ,
   nét ở mọi độ phân giải, không cần tải file ảnh.
   ============================================================ */

/* ---------- tiện ích vẽ SVG ---------- */

function csSparklePath(cx, cy, r, k) {
  k = k || 0.2;
  const i = r * k;
  return `M${cx} ${cy - r}` +
         `Q${cx + i} ${cy - i} ${cx + r} ${cy}` +
         `Q${cx + i} ${cy + i} ${cx} ${cy + r}` +
         `Q${cx - i} ${cy + i} ${cx - r} ${cy}` +
         `Q${cx - i} ${cy - i} ${cx} ${cy - r}Z`;
}

/* con trỏ pixel 8-bit: dựng từ các ô vuông 2x2 */
const CS_PIXEL_MAP = [
  '1..........',
  '11.........',
  '111........',
  '1111.......',
  '11111......',
  '111111.....',
  '1111111....',
  '11111111...',
  '111111111..',
  '1111111111.',
  '11111111111',
  '111111.....',
  '11.1111....',
  '1...1111...',
  '.....111...',
  '......11...'
];

function csPixelRects(fill) {
  let out = '';
  for (let r = 0; r < CS_PIXEL_MAP.length; r++) {
    const row = CS_PIXEL_MAP[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] !== '1') continue;
      out += `<rect x="${5 + c * 2}" y="${1 + r * 2}" width="2" height="2" fill="${fill}"/>`;
    }
  }
  return out;
}

/* Mỗi hình dạng: hx/hy = "điểm nhọn" (hotspot) tính theo tỉ lệ 0..1 của khung */
const CS_SHAPES = {
  arrow: {
    hx: 0.125, hy: 0.09,
    body: g => `<path d="M4 3 L4 27 L10 21 L14.5 30 L17.5 28.5 L13 19.5 L20.5 19.5 Z"
      fill="url(#${g})" stroke="rgba(5,7,20,.72)" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M5.6 6.5 L5.6 22.5 L9.9 18.4" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.1" stroke-linecap="round"/>`
  },
  slim: {
    hx: 0.125, hy: 0.09,
    body: g => `<path d="M4 3 L4 27 L10 21 L14.5 30 L17.5 28.5 L13 19.5 L20.5 19.5 Z"
      fill="rgba(8,10,26,.55)" stroke="url(#${g})" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round"/>`
  },
  pixel: {
    hx: 0.16, hy: 0.06,
    body: g => `<g shape-rendering="crispEdges">${csPixelRects('rgba(4,6,16,.85)')}</g>
      <g shape-rendering="crispEdges" transform="translate(-1,-1)">${csPixelRects(`url(#${g})`)}</g>`
  },
  ring: {
    hx: 0.5, hy: 0.5,
    body: g => `<circle cx="16" cy="16" r="10" fill="none" stroke="url(#${g})" stroke-width="2.4"/>
      <circle cx="16" cy="16" r="10" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="0.7"/>
      <circle cx="16" cy="16" r="2.6" fill="url(#${g})"/>`
  },
  crosshair: {
    hx: 0.5, hy: 0.5,
    body: g => `<circle cx="16" cy="16" r="9.5" fill="none" stroke="url(#${g})" stroke-width="1.8" stroke-dasharray="7 5"/>
      <circle cx="16" cy="16" r="4" fill="none" stroke="url(#${g})" stroke-width="1.4"/>
      <path d="M16 1.5v6M16 24.5v6M1.5 16h6M24.5 16h6" stroke="url(#${g})" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="16" cy="16" r="1.3" fill="url(#${g})"/>`
  },
  dot: {
    hx: 0.5, hy: 0.5,
    body: g => `<circle cx="16" cy="16" r="10" fill="url(#${g})" opacity=".18"/>
      <circle cx="16" cy="16" r="6" fill="url(#${g})" opacity=".35"/>
      <circle cx="16" cy="16" r="3.2" fill="url(#${g})"/>`
  },
  plus: {
    hx: 0.5, hy: 0.5,
    body: g => `<path d="M16 3v9M16 20v9M3 16h9M20 16h9" stroke="url(#${g})" stroke-width="2.2" stroke-linecap="round"/>
      <rect x="12" y="12" width="8" height="8" fill="none" stroke="url(#${g})" stroke-width="1.4" rx="1"/>`
  },
  wand: {
    hx: 0.76, hy: 0.18,
    body: g => `<rect x="3" y="19.4" width="21" height="4" rx="2" transform="rotate(-42 13.5 21.4)" fill="url(#${g})"/>
      <rect x="3" y="19.4" width="7" height="4" rx="2" transform="rotate(-42 13.5 21.4)" fill="rgba(15,18,40,.65)"/>
      <path d="${csSparklePath(24, 6.5, 7)}" fill="url(#${g})"/>
      <path d="${csSparklePath(8.5, 8, 3.2)}" fill="url(#${g})" opacity=".8"/>`
  },
  spark: {
    hx: 0.5, hy: 0.5,
    body: g => `<path d="${csSparklePath(16, 16, 14)}" fill="url(#${g})"/>
      <path d="${csSparklePath(16, 16, 6)}" fill="#fff" opacity=".7"/>`
  },
  star: {
    hx: 0.5, hy: 0.5,
    body: g => `<path d="M16 2.5 L20 11.6 L30 12.8 L22.6 19.5 L24.7 29.5 L16 24.4 L7.3 29.5 L9.4 19.5 L2 12.8 L12 11.6 Z"
      fill="url(#${g})" stroke="rgba(6,8,22,.6)" stroke-width="1.1" stroke-linejoin="round"/>`
  },
  gem: {
    hx: 0.5, hy: 0.5,
    body: g => `<path d="M16 3 L28 12.5 L16 29 L4 12.5 Z" fill="url(#${g})" stroke="rgba(6,8,22,.55)" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M4 12.5h24M16 3v26M10 12.5 16 29 22 12.5" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="0.9"/>`
  },
  orb: {
    hx: 0.5, hy: 0.5,
    body: g => `<circle cx="16" cy="16" r="12" fill="url(#${g}-r)"/>
      <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"/>
      <ellipse cx="12" cy="11" rx="4.2" ry="2.8" fill="rgba(255,255,255,.55)" transform="rotate(-25 12 11)"/>`
  },
  moon: {
    hx: 0.5, hy: 0.5,
    body: g => `<path d="M22.5 3.5a13 13 0 1 0 0 25 10.6 10.6 0 1 1 0-25Z" fill="url(#${g})" stroke="rgba(6,8,22,.5)" stroke-width="1"/>
      <path d="${csSparklePath(25, 22, 3.4)}" fill="url(#${g})" opacity=".9"/>`
  },
  feather: {
    hx: 0.8, hy: 0.16,
    body: g => `<path d="M27 4C14.5 3 5.5 12 6 23.5l3.5 3.5C21 27 29.5 17.5 27 4Z" fill="url(#${g})" stroke="rgba(6,8,22,.5)" stroke-width="1" stroke-linejoin="round"/>
      <path d="M25.5 5.5 8 26" stroke="rgba(255,255,255,.65)" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M15 8.5 17 15M20 11 21.5 17M11 13 13 19" stroke="rgba(255,255,255,.35)" stroke-width="1" stroke-linecap="round"/>`
  },
  flame: {
    hx: 0.5, hy: 0.5,
    body: g => `<path d="M16 1.5c4.5 7.5 11 10 8.5 18C22.8 26 19.4 30 16 30S8 26.5 7.5 19.5C7 13 12 10.5 16 1.5Z" fill="url(#${g})"/>
      <path d="M16 12c2.4 4 5 5.6 4 9.6-.8 3-2.4 5-4 5s-3.4-1.8-4-5c-.8-4 1.6-5.6 4-9.6Z" fill="#fff8e1" opacity=".85"/>`
  },
  bolt: {
    hx: 0.5, hy: 0.5,
    body: g => `<path d="M19 1.5 6.5 18.5H14L12.5 30.5 26 12.5h-8Z" fill="url(#${g})" stroke="rgba(6,8,22,.55)" stroke-width="1.2" stroke-linejoin="round"/>`
  },
  heart: {
    hx: 0.5, hy: 0.5,
    body: g => `<path d="M16 29C4.5 20.6 1.5 14.4 5.5 9.2 9.2 4.4 14.6 6.6 16 10.6c1.4-4 6.8-6.2 10.5-1.4 4 5.2 1 11.4-10.5 19.8Z" fill="url(#${g})" stroke="rgba(6,8,22,.5)" stroke-width="1"/>
      <ellipse cx="11" cy="12" rx="2.6" ry="1.8" fill="rgba(255,255,255,.6)" transform="rotate(-30 11 12)"/>`
  },
  katana: {
    hx: 0.88, hy: 0.12,
    body: g => `<path d="M28.5 2.2 30 4.2 12.4 22.6 9.2 24l1.2-3.2Z" fill="url(#${g})" stroke="rgba(6,8,22,.5)" stroke-width=".9" stroke-linejoin="round"/>
      <rect x="4.4" y="21.2" width="9" height="3" rx="1.4" transform="rotate(-45 8.9 22.7)" fill="#e2b04a"/>
      <rect x="0.5" y="24.6" width="8" height="3.6" rx="1.8" transform="rotate(-45 4.5 26.4)" fill="#2b3145"/>`
  },
  paw: {
    hx: 0.5, hy: 0.5,
    body: g => `<ellipse cx="16" cy="21.5" rx="8" ry="6.6" fill="url(#${g})"/>
      <ellipse cx="7.4" cy="13.5" rx="3.5" ry="4.4" fill="url(#${g})" transform="rotate(-18 7.4 13.5)"/>
      <ellipse cx="13.2" cy="8.4" rx="3.4" ry="4.5" fill="url(#${g})"/>
      <ellipse cx="19.6" cy="8.4" rx="3.4" ry="4.5" fill="url(#${g})"/>
      <ellipse cx="25" cy="13.5" rx="3.5" ry="4.4" fill="url(#${g})" transform="rotate(18 25 13.5)"/>`
  },
  brush: {
    hx: 0.84, hy: 0.14,
    body: g => `<path d="M26 2c3 3 3 6 0 9l-7.5 7.5-4.5-4.5L21.5 6c2.5-2.5 3.5-3.2 4.5-4Z" fill="#cbd5e1"/>
      <path d="M13.4 15.6 17 19.2l-5.5 6.5c-2 2.4-5.6 3-8 1.4 2.6-1 2-3.4 3.2-5.6 1-1.9 3.6-4.4 6.7-5.9Z" fill="url(#${g})"/>`
  },
  pin: {
    hx: 0.5, hy: 0.94,
    body: g => `<path d="M16 1.5c5.8 0 10 4.2 10 9.6 0 7-7.4 13.3-9.2 19.2-.3.9-1.4.9-1.7 0C13.4 24.4 6 18.1 6 11.1c0-5.4 4.2-9.6 10-9.6Z" fill="url(#${g})" stroke="rgba(6,8,22,.5)" stroke-width="1"/>
      <circle cx="16" cy="11" r="3.8" fill="rgba(255,255,255,.85)"/>`
  }
};

/* bảng gradient dùng chung */
function csDefs(id, c1, c2, radial) {
  const lin = `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">` +
              `<stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
  const rad = radial ? `<radialGradient id="${id}-r" cx="35%" cy="30%" r="80%">` +
              `<stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>` : '';
  return `<defs>${lin}${rad}</defs>`;
}

/* làm tối / sáng một mã màu hex */
function csShade(hex, amt) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!m) return hex;
  const cl = v => Math.max(0, Math.min(255, v));
  const r = cl(parseInt(m[1], 16) + amt);
  const g = cl(parseInt(m[2], 16) + amt);
  const b = cl(parseInt(m[3], 16) + amt);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

/* Sinh chuỗi SVG hoàn chỉnh cho 1 theme (colorOverride = màu tuỳ chỉnh của Pro) */
function csRenderSvg(theme, colorOverride) {
  const shape = CS_SHAPES[theme.shape];
  if (!shape) return '';
  const gid = 'csg-' + String(theme.id).replace(/[^a-z0-9]/gi, '');
  const c1 = colorOverride || theme.c1;
  const c2 = colorOverride ? csShade(colorOverride, -40) : theme.c2;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%" style="overflow:visible">' +
         csDefs(gid, c1, c2, theme.shape === 'orb') + shape.body(gid) + '</svg>';
}

/* ---------- helper khai báo theme ---------- */
const CS_THEMES = [];
function csDefSvg(id, name, group, shape, c1, c2, opts) {
  opts = opts || {};
  CS_THEMES.push(Object.assign({
    id, name, group, kind: 'svg', shape, c1, c2,
    color: opts.color || c1,
    anim: opts.anim || 'none',
    tone: opts.tone || 1,
    scale: opts.scale || 1.35,
    pro: opts.pro !== false
  }, opts));
}
function csDefEmoji(id, name, group, glyph, color, opts) {
  opts = opts || {};
  CS_THEMES.push(Object.assign({
    id, name, group, kind: 'emoji', glyph, color,
    anim: opts.anim || 'none',
    tone: opts.tone || 1,
    scale: 1,
    hx: 0.5, hy: 0.5,
    pro: opts.pro !== false
  }, opts));
}

/* ============ NHÓM: MŨI TÊN ============ */
csDefSvg('arrow-neon',    'Neon',              'arrow', 'arrow', '#a78bfa', '#22d3ee', { pro: false });
csDefSvg('arrow-ice',     'Ice',               'arrow', 'arrow', '#e0f2fe', '#38bdf8', { pro: false, tone: 1.15 });
csDefSvg('arrow-gold',    'Solid Gold',        'arrow', 'arrow', '#fde68a', '#f59e0b', { tone: 0.95 });
csDefSvg('arrow-rose',    'Ruby',              'arrow', 'arrow', '#fda4af', '#e11d48', { tone: 1.05 });
csDefSvg('arrow-emerald', 'Emerald',           'arrow', 'arrow', '#6ee7b7', '#059669', { tone: 0.9 });
csDefSvg('arrow-magma',   'Magma',             'arrow', 'arrow', '#fca5a5', '#b91c1c', { tone: 0.8 });
csDefSvg('arrow-mono',    'Silver',            'arrow', 'arrow', '#f8fafc', '#94a3b8');
csDefSvg('slim-mono',     'Silver Outline',    'arrow', 'slim',  '#f8fafc', '#cbd5e1', { pro: false });
csDefSvg('slim-cyber',    'Cyber Outline',     'arrow', 'slim',  '#22d3ee', '#a855f7', { anim: 'breathe' });
csDefSvg('slim-lime',     'Lime Outline',      'arrow', 'slim',  '#bef264', '#22c55e');
csDefSvg('pixel-white',   'Retro Pixel',       'arrow', 'pixel', '#ffffff', '#cbd5e1', { pro: false });
csDefSvg('pixel-lime',    'Lime Pixel',        'arrow', 'pixel', '#bef264', '#65a30d');
csDefSvg('pixel-cyber',   'Neon Pixel',        'arrow', 'pixel', '#67e8f9', '#7c3aed');
csDefSvg('pin-drop',      'Map Pin',           'arrow', 'pin',   '#fb7185', '#be123c', { anim: 'float' });

/* ============ NHÓM: TỐI GIẢN ============ */
csDefSvg('ring-mint',     'Mint Ring',         'minimal', 'ring',      '#5eead4', '#0d9488', { pro: false });
csDefSvg('ring-violet',   'Violet Ring',       'minimal', 'ring',      '#c4b5fd', '#7c3aed');
csDefSvg('dot-glow',      'Glow Dot',          'minimal', 'dot',       '#f0abfc', '#a21caf', { pro: false, anim: 'breathe' });
csDefSvg('dot-cyan',      'Cyan Dot',          'minimal', 'dot',       '#67e8f9', '#0891b2', { anim: 'breathe' });
csDefSvg('cross-red',     'Crosshair',         'minimal', 'crosshair', '#fca5a5', '#dc2626', { anim: 'spin-slow' });
csDefSvg('cross-lime',    'Sniper Sight',      'minimal', 'crosshair', '#d9f99d', '#4d7c0f', { anim: 'spin-slow' });
csDefSvg('plus-sci',      'Sci-Fi Cross',      'minimal', 'plus',      '#a5f3fc', '#0e7490');

/* ============ NHÓM: MA THUẬT ============ */
csDefSvg('wand-violet',   'Magic Wand',        'magic', 'wand',  '#e9d5ff', '#8b5cf6', { anim: 'wiggle' });
csDefSvg('wand-gold',     'Gold Wand',         'magic', 'wand',  '#fef3c7', '#f59e0b', { anim: 'wiggle' });
csDefSvg('spark-pink',    'Sparkle',           'magic', 'spark', '#fbcfe8', '#db2777', { anim: 'pulse' });
csDefSvg('spark-cyan',    'Starlight',         'magic', 'spark', '#cffafe', '#06b6d4', { anim: 'pulse' });
csDefSvg('star-gold',     'Gold Star',         'magic', 'star',  '#fef08a', '#eab308', { pro: false, anim: 'spin-slow' });
csDefSvg('star-rose',     'Rose Star',         'magic', 'star',  '#fecdd3', '#f43f5e', { anim: 'spin-slow' });
csDefSvg('gem-pink',      'Gemstone',          'magic', 'gem',   '#f5d0fe', '#c026d3', { anim: 'breathe' });
csDefSvg('gem-blue',      'Diamond',           'magic', 'gem',   '#bfdbfe', '#2563eb', { anim: 'breathe' });
csDefSvg('orb-plasma',    'Plasma Orb',        'magic', 'orb',   '#f0abfc', '#4c1d95', { anim: 'float' });
csDefSvg('orb-fire',      'Fire Orb',          'magic', 'orb',   '#fed7aa', '#c2410c', { anim: 'float' });
csDefSvg('moon-night',    'Crescent Moon',     'magic', 'moon',  '#fef9c3', '#facc15', { anim: 'float' });
csDefSvg('flame-svg',     'Flame',             'magic', 'flame', '#fdba74', '#dc2626', { anim: 'flicker' });
csDefSvg('bolt-svg',      'Lightning',         'magic', 'bolt',  '#fef08a', '#f59e0b', { anim: 'flicker' });
csDefSvg('heart-svg',     'Heart',             'magic', 'heart', '#fda4af', '#e11d48', { pro: false, anim: 'beat' });
csDefSvg('heart-cyber',   'Neon Heart',        'magic', 'heart', '#a5b4fc', '#7c3aed', { anim: 'beat' });

/* ============ NHÓM: PHONG CÁCH ============ */
csDefSvg('katana-steel',  'Katana',            'style', 'katana',  '#e2e8f0', '#64748b', { anim: 'tilt' });
csDefSvg('katana-neon',   'Neon Katana',       'style', 'katana',  '#67e8f9', '#7c3aed', { anim: 'tilt' });
csDefSvg('feather-teal',  'Quill',             'style', 'feather', '#99f6e4', '#0f766e', { anim: 'float' });
csDefSvg('feather-rose',  'Feather',           'style', 'feather', '#fbcfe8', '#be185d', { anim: 'float' });
csDefSvg('brush-paint',   'Paintbrush',        'style', 'brush',   '#fca5a5', '#7c2d12', { anim: 'tilt' });
csDefSvg('paw-svg',       'Cat Paw',           'style', 'paw',     '#fcd34d', '#b45309', { anim: 'bounce' });
csDefSvg('paw-pink',      'Pink Paw',          'style', 'paw',     '#f9a8d4', '#be185d', { anim: 'bounce' });

/* ============ NHÓM: EMOJI ============ */
csDefEmoji('e-rocket',      'Rocket',            'emoji', '🚀', '#a78bfa', { pro: false, anim: 'wiggle' });
csDefEmoji('e-sparkle',     'Sparkles',          'emoji', '✨', '#f472b6', { pro: false, anim: 'pulse' });
csDefEmoji('e-paw',         'Paw Print',         'emoji', '🐾', '#c4b5fd', { pro: false, anim: 'bounce' });
csDefEmoji('e-clover',      'Four-Leaf Clover',  'emoji', '🍀', '#34d399', { pro: false, anim: 'float' });
csDefEmoji('e-fire',        'Fire',              'emoji', '🔥', '#fb923c', { anim: 'flicker' });
csDefEmoji('e-heart',       'Heart',             'emoji', '💖', '#f43f5e', { anim: 'beat' });
csDefEmoji('e-rainbow',     'Rainbow',           'emoji', '🌈', '#38bdf8', { anim: 'float' });
csDefEmoji('e-star',        'Star',              'emoji', '⭐', '#facc15', { anim: 'spin-slow' });
csDefEmoji('e-ghost',       'Ghost',             'emoji', '👻', '#e2e8f0', { anim: 'float' });
csDefEmoji('e-bolt',        'Bolt',              'emoji', '⚡', '#fde047', { anim: 'flicker' });
csDefEmoji('e-unicorn',     'Unicorn',           'emoji', '🦄', '#f0abfc', { anim: 'bounce' });
csDefEmoji('e-dragon',      'Dragon',            'emoji', '🐲', '#4ade80', { anim: 'wiggle' });
csDefEmoji('e-crown',       'Crown',             'emoji', '👑', '#fbbf24', { anim: 'float' });
csDefEmoji('e-skull',       'Skull',             'emoji', '💀', '#e5e7eb', { anim: 'tilt' });
csDefEmoji('e-alien',       'Alien',             'emoji', '👽', '#86efac', { anim: 'float' });
csDefEmoji('e-butterfly',   'Butterfly',         'emoji', '🦋', '#60a5fa', { anim: 'float' });
csDefEmoji('e-snow',        'Snowflake',         'emoji', '❄️', '#bae6fd', { anim: 'spin-slow' });
csDefEmoji('e-leaf',        'Maple Leaf',        'emoji', '🍁', '#f97316', { anim: 'wiggle' });
csDefEmoji('e-moon',        'Moon',              'emoji', '🌙', '#fde68a', { anim: 'float' });
csDefEmoji('e-sun',         'Sun',               'emoji', '☀️', '#fbbf24', { anim: 'spin-slow' });
csDefEmoji('e-sakura',      'Cherry Blossom',    'emoji', '🌸', '#fbcfe8', { anim: 'float' });
csDefEmoji('e-panda',       'Panda',             'emoji', '🐼', '#f8fafc', { anim: 'bounce' });
csDefEmoji('e-fox',         'Fox',               'emoji', '🦊', '#fb923c', { anim: 'bounce' });
csDefEmoji('e-dolphin',     'Dolphin',           'emoji', '🐬', '#38bdf8', { anim: 'float' });
csDefEmoji('e-bee',         'Bee',               'emoji', '🐝', '#fcd34d', { anim: 'wiggle' });
csDefEmoji('e-gem',         'Gem',               'emoji', '💎', '#67e8f9', { anim: 'pulse' });
csDefEmoji('e-gamepad',     'Game Controller',   'emoji', '🎮', '#a5b4fc', { anim: 'tilt' });
csDefEmoji('e-music',       'Music Note',        'emoji', '🎵', '#f0abfc', { anim: 'bounce' });
csDefEmoji('e-pizza',       'Pizza',             'emoji', '🍕', '#fbbf24', { anim: 'wiggle' });
csDefEmoji('e-coffee',      'Coffee',            'emoji', '☕', '#d6a06a', { anim: 'float' });
csDefEmoji('e-candy',       'Candy',             'emoji', '🍭', '#f9a8d4', { anim: 'spin-slow' });
csDefEmoji('e-target',      'Bullseye',          'emoji', '🎯', '#f87171', { anim: 'pulse' });
csDefEmoji('e-eye',         'Evil Eye',          'emoji', '🧿', '#60a5fa', { anim: 'breathe' });
csDefEmoji('e-wand',        'Fairy Wand',        'emoji', '🪄', '#e9d5ff', { anim: 'wiggle' });
csDefEmoji('e-ball',        'Soccer Ball',       'emoji', '⚽', '#f1f5f9', { anim: 'spin-slow' });

/* ---------- tra cứu ---------- */
const CS_THEME_MAP = {};
CS_THEMES.forEach(t => { CS_THEME_MAP[t.id] = t; });

const CS_GROUPS = [
  { id: 'all',     name:    'All' },
  { id: 'arrow',   name:  'Arrows' },
  { id: 'minimal', name:  'Minimal' },
  { id: 'magic',   name:    'Magic' },
  { id: 'style',   name:      'Style' },
  { id: 'emoji',   name: 'Emoji' }
];

function csTheme(id) {
  return CS_THEME_MAP[id] || CS_THEME_MAP['arrow-neon'] || CS_THEMES[0];
}

function csHotspot(theme) {
  if (theme.kind === 'emoji') return { hx: 0.5, hy: 0.5 };
  const s = CS_SHAPES[theme.shape] || { hx: 0.5, hy: 0.5 };
  return { hx: theme.hx != null ? theme.hx : s.hx, hy: theme.hy != null ? theme.hy : s.hy };
}

/* ============ HIỆU ỨNG ĐUÔI (TRAIL) ============ */
const CS_TRAILS = [
  { id: 'none',      name: 'None',          icon: '🚫', pro: false },
  { id: 'dots',      name: 'Soft Dots',     icon: '⚪', pro: false },
  { id: 'sparkle',   name: 'Sparkle',       icon: '✨', pro: false },
  { id: 'comet',     name: 'Comet',         icon: '☄️', pro: true },
  { id: 'ribbon',    name: 'Silk Ribbon',   icon: '🎀', pro: true },
  { id: 'neon',      name: 'Neon Streak',   icon: '🌟', pro: true },
  { id: 'bubble',    name: 'Bubbles',       icon: '🫧', pro: true },
  { id: 'fire',      name: 'Embers',        icon: '🔥', pro: true },
  { id: 'snow',      name: 'Snowfall',      icon: '❄️', pro: true },
  { id: 'stars',     name: 'Star Rain',     icon: '⭐', pro: true },
  { id: 'rainbow',   name: 'Rainbow',       icon: '🌈', pro: true },
  { id: 'glyph',     name: 'Icon Echo',     icon: '🔁', pro: true }
];

/* ============ HIỆU ỨNG CLICK ============ */
const CS_CLICKS = [
  { id: 'none',      name: 'None',          icon: '🚫', pro: false },
  { id: 'ripple',    name: 'Ripple',        icon: '⭕', pro: false },
  { id: 'burst',     name: 'Burst',         icon: '✳️', pro: false },
  { id: 'confetti',  name: 'Confetti',      icon: '🎊', pro: true },
  { id: 'shock',     name: 'Shockwave',     icon: '💥', pro: true },
  { id: 'hearts',    name: 'Hearts',        icon: '💕', pro: true },
  { id: 'stars',     name: 'Star Pop',      icon: '🌟', pro: true },
  { id: 'ink',       name: 'Ink Drop',      icon: '💧', pro: true }
];

const CS_TRAIL_MAP = {}; CS_TRAILS.forEach(t => { CS_TRAIL_MAP[t.id] = t; });
const CS_CLICK_MAP = {}; CS_CLICKS.forEach(t => { CS_CLICK_MAP[t.id] = t; });
