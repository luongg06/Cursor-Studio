/* ============================================================
   Cursor Studio – ĐỘNG CƠ ÂM THANH
   Mọi tiếng động đều được tổng hợp trực tiếp bằng Web Audio API
   => không cần file mp3, extension cực nhẹ, không tốn băng thông.
   ============================================================ */

const CSAudio = (() => {
  let ctx = null;
  let noise = null;
  let lastAt = 0;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  /* bộ đệm nhiễu trắng dùng lại nhiều lần */
  function noiseBuffer(c) {
    if (noise) return noise;
    const len = Math.floor(c.sampleRate * 0.4);
    noise = c.createBuffer(1, len, c.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return noise;
  }

  function env(c, dest, peak, attack, decay) {
    const g = c.createGain();
    const t = c.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    g.connect(dest);
    return g;
  }

  function osc(c, type, freq) {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    return o;
  }

  function tone(c, dest, type, f0, f1, dur, peak) {
    const t = c.currentTime;
    const o = osc(c, type, f0);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = env(c, dest, peak, 0.005, dur);
    o.connect(g);
    o.start(t);
    o.stop(t + dur + 0.05);
    return o;
  }

  function noiseHit(c, dest, freq, q, dur, peak, type) {
    const t = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c);
    const bp = c.createBiquadFilter();
    bp.type = type || 'bandpass';
    bp.frequency.value = freq;
    bp.Q.value = q;
    const g = env(c, dest, peak, 0.003, dur);
    src.connect(bp).connect(g);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  const PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

  /* ---------------- các gói âm thanh ---------------- */
  const PACKS = [
    { id: 'none', name: 'Muted', icon: '🔇', pro: false, play: null },

    {
      id: 'tick', name: 'Soft Tick', icon: '👆', pro: false,
      play: (c, out, p) => {
        tone(c, out, 'sine', 760 * p, 520 * p, 0.055, 0.9);
        noiseHit(c, out, 2600, 1.4, 0.02, 0.25, 'highpass');
      }
    },
    {
      id: 'bubble', name: 'Bubble', icon: '🫧', pro: false,
      play: (c, out, p) => {
        tone(c, out, 'sine', 260 * p, 940 * p, 0.11, 0.8);
      }
    },
    {
      id: 'pop', name: 'Button Pop', icon: '🔘', pro: true,
      play: (c, out, p) => {
        tone(c, out, 'triangle', 900 * p, 180 * p, 0.08, 0.85);
        noiseHit(c, out, 1200, 0.8, 0.025, 0.2);
      }
    },
    {
      id: 'water', name: 'Water Drop', icon: '💧', pro: true,
      play: (c, out, p) => {
        tone(c, out, 'sine', 1400 * p, 240 * p, 0.16, 0.8);
        tone(c, out, 'sine', 700 * p, 180 * p, 0.22, 0.35);
      }
    },
    {
      id: 'laser', name: 'Laser', icon: '🔫', pro: true,
      play: (c, out, p) => {
        const t = c.currentTime;
        const o = osc(c, 'sawtooth', 1500 * p);
        o.frequency.exponentialRampToValueAtTime(180 * p, t + 0.2);
        const lp = c.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(4000, t);
        lp.frequency.exponentialRampToValueAtTime(500, t + 0.2);
        const g = env(c, out, 0.7, 0.004, 0.2);
        o.connect(lp).connect(g);
        o.start(t); o.stop(t + 0.26);
      }
    },
    {
      id: 'piano', name: 'Piano Keys', icon: '🎹', pro: true,
      play: (c, out, p) => {
        const f = PENTA[Math.floor(Math.random() * PENTA.length)] * p;
        [[1, 0.6], [2, 0.22], [3, 0.09]].forEach(([m, v]) => {
          tone(c, out, 'sine', f * m, f * m, 0.7, v);
        });
      }
    },
    {
      id: 'crystal', name: 'Crystal Chime', icon: '🔔', pro: true,
      play: (c, out, p) => {
        const f = PENTA[Math.floor(Math.random() * PENTA.length)] * p;
        tone(c, out, 'sine', f * 2, f * 2, 1.1, 0.4);
        tone(c, out, 'sine', f * 3.01, f * 3.01, 0.8, 0.16);
      }
    },
    {
      id: 'magic', name: 'Magic', icon: '✨', pro: true,
      play: (c, out, p) => {
        const base = 660 * p;
        [0, 1, 2, 3].forEach(i => {
          const t = c.currentTime + i * 0.045;
          const o = osc(c, 'triangle', base * Math.pow(1.26, i));
          const g = c.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
          o.connect(g).connect(out);
          o.start(t); o.stop(t + 0.34);
        });
      }
    },
    {
      id: 'retro', name: '8-bit', icon: '🕹️', pro: true,
      play: (c, out, p) => {
        const t = c.currentTime;
        const o = osc(c, 'square', 330 * p);
        o.frequency.setValueAtTime(330 * p, t);
        o.frequency.setValueAtTime(494 * p, t + 0.05);
        o.frequency.setValueAtTime(660 * p, t + 0.1);
        const g = env(c, out, 0.35, 0.004, 0.14);
        o.connect(g);
        o.start(t); o.stop(t + 0.2);
      }
    },
    {
      id: 'typewriter', name: 'Typewriter', icon: '⌨️', pro: true,
      play: (c, out, p) => {
        noiseHit(c, out, 1900 * p, 1.1, 0.045, 0.8);
        tone(c, out, 'triangle', 190 * p, 120 * p, 0.05, 0.5);
      }
    },
    {
      id: 'wood', name: 'Wood Block', icon: '🪵', pro: true,
      play: (c, out, p) => {
        tone(c, out, 'triangle', 440 * p, 170 * p, 0.09, 0.75);
        noiseHit(c, out, 800, 2.2, 0.03, 0.3);
      }
    }
  ];

  const MAP = {};
  PACKS.forEach(p => { MAP[p.id] = p; });

  /**
   * Phát âm thanh click.
   * @param {string} packId  id gói âm thanh
   * @param {object} o       { volume: 0..1, pitch: hệ số cao độ }
   */
  function play(packId, o) {
    o = o || {};
    const pack = MAP[packId];
    if (!pack || !pack.play) return;
    const vol = o.volume == null ? 0.16 : o.volume;
    if (vol <= 0) return;

    /* chặn spam: tối đa ~25 tiếng/giây */
    const now = Date.now();
    if (now - lastAt < 40) return;
    lastAt = now;

    const c = ensure();
    if (!c) return;
    try {
      const master = c.createGain();
      master.gain.value = vol;
      master.connect(c.destination);
      const pitch = (o.pitch || 1) * (0.97 + Math.random() * 0.06);
      pack.play(c, master, pitch);
      /* tự dọn node sau 2 giây */
      setTimeout(() => { try { master.disconnect(); } catch (e) {} }, 2000);
    } catch (e) { /* trình duyệt chặn audio */ }
  }

  function unlock() { ensure(); }

  return { packs: PACKS, map: MAP, play, unlock };
})();

const CS_SOUNDS = CSAudio.packs;
