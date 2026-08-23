/* ============================================================
   Cursor Studio – ĐỘNG CƠ RENDER
   Một engine dùng chung cho cả trang web (content script) lẫn
   khung xem trước trong popup.

   Kiến trúc 3 lớp để animation CSS và vị trí chuột không đè nhau:
     .cs-cursor        -> JS đặt vị trí (translate3d)
     .cs-cursor-state  -> JS đặt xoay/phóng to (hover, click)
     .cs-cursor-inner  -> CSS animation (xoay, nảy, đập...)
   ============================================================ */

const CursorStudioEngine = (() => {

  const MAX_PARTICLES = 280;

  /* ---------- tiện ích ---------- */
  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [167, 139, 250];
  }
  function rgba(hex, a) {
    const c = hexToRgb(hex);
    return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function drawStar(ctx, x, y, r, points, rot) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const rad = i % 2 === 0 ? r : r * 0.45;
      const a = rot + (i * Math.PI) / points;
      const px = x + Math.cos(a) * rad;
      const py = y + Math.sin(a) * rad;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawSparkle(ctx, x, y, r) {
    const k = r * 0.2;
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.quadraticCurveTo(x + k, y - k, x + r, y);
    ctx.quadraticCurveTo(x + k, y + k, x, y + r);
    ctx.quadraticCurveTo(x - k, y + k, x - r, y);
    ctx.quadraticCurveTo(x - k, y - k, x, y - r);
    ctx.closePath();
    ctx.fill();
  }

  /* ============================================================ */
  function create(opts) {
    opts = opts || {};
    const doc = opts.doc || document;
    const host = opts.host || doc.documentElement;
    const absolute = opts.mode === 'absolute';

    /* ---------- DOM ---------- */
    const layer = doc.createElement('div');
    layer.className = 'cs-layer' + (absolute ? ' cs-abs' : '');

    const canvas = doc.createElement('canvas');
    canvas.className = 'cs-canvas';

    const cursor = doc.createElement('div');
    cursor.className = 'cs-cursor';
    const stateEl = doc.createElement('div');
    stateEl.className = 'cs-cursor-state';
    const inner = doc.createElement('div');
    inner.className = 'cs-cursor-inner';

    stateEl.appendChild(inner);
    cursor.appendChild(stateEl);
    layer.appendChild(canvas);
    layer.appendChild(cursor);
    host.appendChild(layer);

    const ctx = canvas.getContext('2d');

    /* ---------- trạng thái ---------- */
    let S = Object.assign({}, typeof CS_DEFAULTS !== 'undefined' ? CS_DEFAULTS : {});
    let isPro = false;
    let theme = csTheme(S.theme);
    let trailId = 'sparkle';
    let clickId = 'ripple';
    let soundId = 'tick';
    let accent = '#a78bfa';
    let hotspot = { hx: 0.5, hy: 0.5 };
    let boxW = 32, boxH = 32;

    let mx = -9999, my = -9999;      // vị trí chuột thật
    let px = -9999, py = -9999;      // vị trí con trỏ (đã làm mượt)
    let vx = 0, vy = 0;
    let visible = false;
    let hovering = false;
    let pop = 0;                      // độ nảy khi click
    let curScale = 1, curRot = 0;

    const parts = [];
    const rings = [];
    let ribbon = [];

    let raf = null, last = 0, dpr = 1, W = 0, H = 0;
    let destroyed = false;
    let wasDirty = false;

    /* ---------- kích thước canvas ---------- */
    function resize() {
      const w = absolute ? host.clientWidth : (opts.win || window).innerWidth;
      const h = absolute ? host.clientHeight : (opts.win || window).innerHeight;
      dpr = Math.min(2, (opts.win || window).devicePixelRatio || 1);
      W = w; H = h;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* ---------- áp dụng cấu hình ---------- */
    function gateTheme(id) {
      const t = csTheme(id);
      return (t.pro && !isPro) ? csTheme('arrow-neon') : t;
    }
    function gateList(map, id, fallback) {
      const it = map[id];
      if (!it) return fallback;
      return (it.pro && !isPro) ? fallback : id;
    }

    function setSettings(next, pro) {
      S = Object.assign({}, S, next || {});
      isPro = !!pro;

      theme = gateTheme(S.theme);
      trailId = gateList(CS_TRAIL_MAP, S.trail, 'sparkle');
      clickId = gateList(CS_CLICK_MAP, S.click, 'ripple');
      soundId = gateList(CSAudio.map, S.soundPack, 'tick');

      const custom = isPro && S.useCustomColor ? S.customColor : null;
      accent = custom || theme.color || '#a78bfa';

      if (S.reduceMotion) { trailId = 'none'; }

      buildCursor(custom);
      layer.style.opacity = String(S.opacity == null ? 1 : S.opacity);
      resize();
    }

    function buildCursor(custom) {
      const size = Math.max(10, Math.min(72, S.size || 28));
      hotspot = csHotspot(theme);
      if (theme.kind === 'emoji') {
        boxW = boxH = size;
        inner.textContent = theme.glyph;
        inner.style.fontSize = size + 'px';
        inner.style.filter = 'drop-shadow(0 2px 5px rgba(0,0,0,.45))';
      } else {
        boxW = boxH = Math.round(size * (theme.scale || 1.35));
        inner.textContent = '';
        inner.innerHTML = csRenderSvg(theme, custom);
        inner.style.fontSize = '';
        inner.style.filter = `drop-shadow(0 2px 6px rgba(0,0,0,.4)) drop-shadow(0 0 7px ${rgba(accent, 0.45)})`;
      }
      cursor.style.width = boxW + 'px';
      cursor.style.height = boxH + 'px';
      inner.className = 'cs-cursor-inner' + (S.reduceMotion || theme.anim === 'none' ? '' : ' cs-anim-' + theme.anim);
    }

    /* ---------- sinh hạt cho hiệu ứng đuôi ---------- */
    function emit(x, y, dx, dy) {
      if (trailId === 'none' || !visible) return;
      const speed = Math.hypot(dx, dy);
      const dens = S.trailDensity == null ? 1 : S.trailDensity;
      const sz = (S.trailSize == null ? 1 : S.trailSize) * ((S.size || 28) / 28);

      if (trailId === 'ribbon' || trailId === 'neon' || trailId === 'comet' || trailId === 'rainbow') {
        ribbon.push({ x, y, t: performance.now() });
        return;
      }
      if (speed < 0.6) return;

      const n = Math.min(4, Math.max(1, Math.round(speed / 26 * dens)));
      for (let i = 0; i < n; i++) {
        if (parts.length > MAX_PARTICLES) break;
        const jitter = trailId === 'snow' ? 26 : 8;
        const p = {
          x: x + rnd(-jitter, jitter),
          y: y + rnd(-jitter, jitter),
          vx: 0, vy: 0,
          life: 0, max: 0.7,
          r: 3 * sz, rot: rnd(0, 6.28), vr: rnd(-0.14, 0.14),
          type: trailId, color: accent, glyph: theme.glyph || '✨'
        };
        switch (trailId) {
          case 'dots':
            p.r = rnd(2, 5) * sz; p.max = rnd(0.45, 0.8);
            p.vx = dx * -0.05 + rnd(-0.4, 0.4); p.vy = dy * -0.05 + rnd(-0.4, 0.4);
            break;
          case 'sparkle':
            p.r = rnd(2.5, 6.5) * sz; p.max = rnd(0.5, 0.95);
            p.vx = rnd(-0.7, 0.7); p.vy = rnd(-0.7, 0.7);
            break;
          case 'bubble':
            p.r = rnd(4, 11) * sz; p.max = rnd(0.9, 1.6);
            p.vx = rnd(-0.3, 0.3); p.vy = rnd(-1.4, -0.5);
            break;
          case 'fire':
            p.r = rnd(3, 8) * sz; p.max = rnd(0.4, 0.85);
            p.vx = rnd(-0.5, 0.5); p.vy = rnd(-1.8, -0.6);
            break;
          case 'snow':
            p.r = rnd(2, 5) * sz; p.max = rnd(1.2, 2.4);
            p.vx = rnd(-0.35, 0.35); p.vy = rnd(0.4, 1.2);
            break;
          case 'stars':
            p.r = rnd(4, 9) * sz; p.max = rnd(0.6, 1.1);
            p.vx = rnd(-0.9, 0.9); p.vy = rnd(-0.9, 0.9);
            break;
          case 'glyph':
            p.r = rnd(9, 15) * sz; p.max = rnd(0.5, 0.9);
            p.vx = rnd(-0.5, 0.5); p.vy = rnd(-0.5, 0.5);
            break;
        }
        parts.push(p);
      }
    }

    /* ---------- hiệu ứng khi click ---------- */
    function burst(x, y, kind) {
      const sz = (S.size || 28) / 28;
      const add = (o) => { if (parts.length < MAX_PARTICLES + 90) parts.push(o); };

      switch (kind) {
        case 'ripple':
          rings.push({ x, y, r: 3, max: 46 * sz, life: 0, dur: 0.5, w: 2.6, color: accent, fill: 0 });
          break;
        case 'shock':
          rings.push({ x, y, r: 2, max: 62 * sz, life: 0, dur: 0.42, w: 4, color: accent, fill: 0 });
          rings.push({ x, y, r: 2, max: 34 * sz, life: 0, dur: 0.6, w: 1.6, color: '#ffffff', fill: 0 });
          break;
        case 'ink':
          rings.push({ x, y, r: 4, max: 30 * sz, life: 0, dur: 0.7, w: 0, color: accent, fill: 1 });
          for (let i = 0; i < 7; i++) {
            const a = rnd(0, 6.28), s = rnd(1.5, 4.5);
            add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: 0.6, r: rnd(2, 5) * sz, rot: 0, vr: 0, type: 'dots', color: accent, grav: 0.08 });
          }
          break;
        case 'burst':
          for (let i = 0; i < 14; i++) {
            const a = (i / 14) * 6.28 + rnd(-0.2, 0.2), s = rnd(2.5, 6);
            add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: rnd(0.4, 0.7), r: rnd(2, 5) * sz, rot: a, vr: 0.2, type: 'sparkle', color: accent, drag: 0.9 });
          }
          break;
        case 'stars':
          for (let i = 0; i < 10; i++) {
            const a = rnd(0, 6.28), s = rnd(2, 5.5);
            add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 0, max: rnd(0.6, 1), r: rnd(5, 10) * sz, rot: a, vr: rnd(-0.25, 0.25), type: 'stars', color: accent, grav: 0.06, drag: 0.94 });
          }
          break;
        case 'hearts':
          for (let i = 0; i < 8; i++) {
            add({ x: x + rnd(-10, 10), y: y + rnd(-6, 6), vx: rnd(-1, 1), vy: rnd(-3.2, -1.4), life: 0, max: rnd(0.8, 1.4), r: rnd(10, 17) * sz, rot: rnd(-0.3, 0.3), vr: rnd(-0.05, 0.05), type: 'glyph', glyph: '💖', color: accent, drag: 0.98 });
          }
          break;
        case 'confetti':
          for (let i = 0; i < 22; i++) {
            const a = rnd(-Math.PI, 0), s = rnd(3, 8);
            add({
              x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: rnd(0.9, 1.5),
              r: rnd(3, 6) * sz, rot: rnd(0, 6.28), vr: rnd(-0.35, 0.35), type: 'confetti',
              color: ['#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#fb7185'][i % 6],
              grav: 0.22, drag: 0.985
            });
          }
          break;
      }
    }

    /* ---------- vòng lặp render ---------- */
    function step(now) {
      if (destroyed) return;
      raf = requestAnimationFrame(step);
      const dt = Math.min(64, now - (last || now)) / 16.667;
      last = now;

      /* làm mượt vị trí con trỏ */
      const smooth = Math.max(0, Math.min(0.92, S.smooth == null ? 0.35 : S.smooth));
      const follow = 1 - Math.pow(smooth, Math.max(0.001, dt));
      if (px < -5000) { px = mx; py = my; }
      const nx = px + (mx - px) * (smooth === 0 ? 1 : follow);
      const ny = py + (my - py) * (smooth === 0 ? 1 : follow);
      vx = nx - px; vy = ny - py;
      px = nx; py = ny;

      /* xoay nhẹ theo hướng di chuyển + phóng to khi hover + nảy khi click */
      const wantRot = S.rotate ? Math.max(-13, Math.min(13, vx * 1.1)) : 0;
      curRot += (wantRot - curRot) * 0.2;
      pop = Math.max(0, pop - dt * 0.09);
      const wantScale = (hovering && S.hoverGrow ? 1.22 : 1) + Math.sin(pop * Math.PI) * 0.45;
      curScale += (wantScale - curScale) * 0.3;

      cursor.style.transform = `translate3d(${px - hotspot.hx * boxW}px, ${py - hotspot.hy * boxH}px, 0)`;
      stateEl.style.transform = `rotate(${curRot.toFixed(2)}deg) scale(${curScale.toFixed(3)})`;

      draw(dt, now);
    }

    function draw(dt, now) {
      if (S.reduceMotion) { ribbon.length = 0; }

      /* không có gì để vẽ -> bỏ qua cả frame, đỡ tốn pin */
      if (!parts.length && !rings.length && !ribbon.length) {
        if (wasDirty) { ctx.clearRect(0, 0, W, H); wasDirty = false; }
        return;
      }
      wasDirty = true;
      ctx.clearRect(0, 0, W, H);

      /* --- dải lụa / sao chổi / neon / cầu vồng --- */
      if (ribbon.length) {
        const keep = trailId === 'comet' ? 190 : 340;
        while (ribbon.length && now - ribbon[0].t > keep) ribbon.shift();
        if (ribbon.length > 90) ribbon.splice(0, ribbon.length - 90);
        if (trailId === 'none') ribbon.length = 0;
      }
      if (ribbon.length > 1 && visible) {
        const baseW = (S.size || 28) * 0.5 * (S.trailSize == null ? 1 : S.trailSize);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (trailId === 'neon' || trailId === 'comet') {
          ctx.globalCompositeOperation = 'lighter';
          ctx.shadowBlur = 14;
          ctx.shadowColor = accent;
        }
        for (let i = 1; i < ribbon.length; i++) {
          const p0 = ribbon[i - 1], p1 = ribbon[i];
          const t = i / ribbon.length;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineWidth = Math.max(0.6, baseW * t * (trailId === 'comet' ? 0.8 : 1));
          if (trailId === 'rainbow') {
            ctx.strokeStyle = `hsla(${(now * 0.12 + i * 9) % 360},95%,62%,${(t * 0.9).toFixed(3)})`;
          } else {
            ctx.strokeStyle = rgba(accent, t * (trailId === 'neon' ? 0.85 : 0.7));
          }
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = 'source-over';
      }

      /* --- hạt --- */
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life += dt / 60;
        if (p.life >= p.max) { parts.splice(i, 1); continue; }
        const k = 1 - p.life / p.max;          // 1 -> 0
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.grav) p.vy += p.grav * dt;
        if (p.drag) { p.vx *= Math.pow(p.drag, dt); p.vy *= Math.pow(p.drag, dt); }
        p.rot += (p.vr || 0) * dt;
        if (p.type === 'snow') p.x += Math.sin((p.life + p.rot) * 3) * 0.6 * dt;

        ctx.globalAlpha = Math.max(0, Math.min(1, k));
        switch (p.type) {
          case 'dots':
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r * k, 0, 6.2832); ctx.fill();
            break;
          case 'sparkle':
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = p.color;
            drawSparkle(ctx, p.x, p.y, p.r * (0.4 + k * 0.8));
            ctx.globalCompositeOperation = 'source-over';
            break;
          case 'bubble':
            ctx.strokeStyle = rgba(p.color, 0.85);
            ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.stroke();
            ctx.fillStyle = rgba('#ffffff', 0.35 * k);
            ctx.beginPath(); ctx.arc(p.x - p.r * 0.32, p.y - p.r * 0.32, p.r * 0.22, 0, 6.2832); ctx.fill();
            break;
          case 'fire': {
            ctx.globalCompositeOperation = 'lighter';
            const hue = 45 - (1 - k) * 45;
            ctx.fillStyle = `hsla(${hue},100%,${45 + k * 25}%,${k})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r * k, 0, 6.2832); ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            break;
          }
          case 'snow':
            ctx.fillStyle = rgba('#ffffff', 0.9);
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.5 + k * 0.5), 0, 6.2832); ctx.fill();
            break;
          case 'stars':
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = p.color;
            drawStar(ctx, p.x, p.y, p.r * (0.4 + k * 0.7), 5, p.rot);
            ctx.globalCompositeOperation = 'source-over';
            break;
          case 'confetti':
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.r * 0.5, -p.r * 0.28, p.r, p.r * 0.56);
            ctx.restore();
            break;
          case 'glyph':
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.font = `${Math.round(p.r * 1.7)}px system-ui, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.glyph || '✨', 0, 0);
            ctx.restore();
            break;
        }
      }

      /* --- vòng sóng khi click --- */
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.life += dt / 60;
        if (r.life >= r.dur) { rings.splice(i, 1); continue; }
        const t = r.life / r.dur;
        const ease = 1 - Math.pow(1 - t, 3);
        ctx.globalAlpha = (1 - t) * 0.85;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r + (r.max - r.r) * ease, 0, 6.2832);
        if (r.fill) { ctx.fillStyle = r.color; ctx.fill(); }
        else { ctx.strokeStyle = r.color; ctx.lineWidth = r.w * (1 - t) + 0.4; ctx.stroke(); }
      }
      ctx.globalAlpha = 1;
    }

    /* ---------- API ---------- */
    function pointer(x, y) {
      const dx = x - mx, dy = y - my;
      mx = x; my = y;
      if (!visible) show();
      emit(x, y, dx, dy);
    }

    function click(x, y, silent) {
      if (x != null) { mx = x; my = y; }
      pop = 1;
      if (clickId !== 'none') burst(mx, my, clickId);
      if (!silent && S.sound && typeof CSAudio !== 'undefined') {
        CSAudio.play(soundId, { volume: S.volume, pitch: theme.tone || 1 });
      }
    }

    function show() { visible = true; cursor.style.display = 'block'; }
    function hide() { visible = false; cursor.style.display = 'none'; ribbon.length = 0; }
    function setHover(v) { hovering = !!v; }

    function start() {
      if (!raf) { last = 0; raf = requestAnimationFrame(step); }
    }
    function stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }
    function destroy() {
      destroyed = true;
      stop();
      try { layer.remove(); } catch (e) {}
    }

    resize();
    hide();
    start();

    return {
      layer, canvas, cursor,
      setSettings, pointer, click, show, hide, setHover,
      resize, start, stop, destroy,
      get theme() { return theme; },
      get pro() { return isPro; }
    };
  }

  return { create };
})();
