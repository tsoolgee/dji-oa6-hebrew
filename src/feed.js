// תמונה חיה מדומה בעינית: נוף מצויר בקנבס שמגיב להגדרות המצלמה
const Feed = (() => {
  let cv, cx, W = 0, H = 0, t0 = performance.now(), raf = 0, running = false;
  // רכסים קבועים (אקראיות עם זרע קבוע כדי שהנוף לא ישתנה בכל טעינה)
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const ridge = (n, amp) => Array.from({ length: n + 1 }, (_, i) => Math.sin(i * .9) * amp * .5 + (rnd() - .5) * amp);
  const R1 = ridge(24, .10), R2 = ridge(16, .07), R3 = ridge(10, .05);
  const CLOUDS = Array.from({ length: 9 }, () => ({ x: rnd(), y: .06 + rnd() * .22, s: .06 + rnd() * .09, v: .004 + rnd() * .008 }));
  const STARS = Array.from({ length: 140 }, () => ({ x: rnd(), y: rnd() * .55, r: rnd() * 1.2 + .3, p: rnd() * 6 }));
  const LIGHTS = Array.from({ length: 60 }, () => ({ x: rnd(), y: .56 + rnd() * .08, c: rnd() }));

  function size() {
    const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    const w = Math.round(r.width * d), h = Math.round(r.height * d);
    if (w && h && (w !== W || h !== H)) { W = cv.width = w; H = cv.height = h; }
  }
  function path(pts, base, y0) {
    cx.beginPath(); cx.moveTo(0, H);
    pts.forEach((v, i) => cx.lineTo(i / (pts.length - 1) * W, (y0 + v) * H));
    cx.lineTo(W, H); cx.closePath();
  }
  function frame(now) {
    if (!running) return;
    size();
    const st = Feed.state();
    const speed = st.mode === 'm_slow' ? .25 : (st.mode === 'm_tl' || st.mode === 'm_hyper') ? 8 : 1;
    const t = (now - t0) / 1000 * speed;
    const night = st.mode === 'm_night';
    // תנועת יד: תלויה בייצוב
    const shakeAmp = { Off: 1, RockSteady: .18, 'RockSteady+': .08, HorizonBalancing: .1, HorizonSteady: .06 }[st.eis] ?? .15;
    const rollAmp = { HorizonBalancing: 0, HorizonSteady: 0 }[st.eis] ?? (st.eis === 'Off' ? 2.2 : 1.1);
    const sx = (Math.sin(t * 2.1) + Math.sin(t * 5.3) * .5) * shakeAmp * W * .006;
    const sy = (Math.cos(t * 1.7) + Math.sin(t * 4.1) * .5) * shakeAmp * H * .008;
    const roll = Math.sin(t * .6) * rollAmp * Math.PI / 180;
    const fovZ = { 'Ultra Wide': 1, Wide: 1.1, 'Natural Wide': 1.14, 'Standard (Dewarp)': 1.26 }[st.fov] ?? 1.1;
    const z = fovZ * (parseFloat(st.zoom) || 1) * (st.eis === 'RockSteady+' ? 1.06 : st.eis === 'HorizonSteady' ? 1.12 : 1);
    cx.save();
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.translate(W / 2 + sx, H / 2 + sy); cx.rotate(roll); cx.scale(z, z); cx.translate(-W / 2, -H / 2);
    // שמיים
    const g = cx.createLinearGradient(0, 0, 0, H * .6);
    if (night) { g.addColorStop(0, '#050a1c'); g.addColorStop(1, '#1b2a4a'); }
    else { g.addColorStop(0, '#5f9fd0'); g.addColorStop(.7, '#bcd8e6'); g.addColorStop(1, '#f1e6cf'); }
    cx.fillStyle = g; cx.fillRect(-W, -H, W * 3, H * 3);
    if (night) {
      STARS.forEach(s => { cx.globalAlpha = .45 + .55 * Math.abs(Math.sin(t * .8 + s.p)); cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(s.x * W, s.y * H, s.r * W / 700, 0, 7); cx.fill(); });
      cx.globalAlpha = 1; cx.fillStyle = '#f4f1e0'; cx.beginPath(); cx.arc(W * .78, H * .16, W * .028, 0, 7); cx.fill();
    } else {
      const sun = cx.createRadialGradient(W * .74, H * .2, 0, W * .74, H * .2, W * .22);
      sun.addColorStop(0, 'rgba(255,248,225,1)'); sun.addColorStop(.12, 'rgba(255,240,200,.9)'); sun.addColorStop(1, 'rgba(255,240,200,0)');
      cx.fillStyle = sun; cx.fillRect(0, 0, W, H);
      if (st.star) { // אפקט כוכב במצב f/4.0
        cx.strokeStyle = 'rgba(255,250,235,.8)'; cx.lineWidth = W * .002;
        for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + .3; cx.beginPath(); cx.moveTo(W * .74 - Math.cos(a) * W * .09, H * .2 - Math.sin(a) * W * .09); cx.lineTo(W * .74 + Math.cos(a) * W * .09, H * .2 + Math.sin(a) * W * .09); cx.stroke(); }
      }
      CLOUDS.forEach(c => {
        const x = ((c.x + t * c.v) % 1.3 - .15) * W, y = c.y * H, s = c.s * W;
        cx.fillStyle = 'rgba(255,255,255,.82)';
        [[0, 0, 1], [.7, .1, .75], [-.7, .12, .7], [.3, -.3, .7]].forEach(([dx, dy, k]) => { cx.beginPath(); cx.ellipse(x + dx * s, y + dy * s, s * k, s * k * .55, 0, 0, 7); cx.fill(); });
      });
    }
    // רכסים
    path(R1, 0, .44); cx.fillStyle = night ? '#141d30' : '#7d93a6'; cx.fill();
    path(R2, 0, .5); cx.fillStyle = night ? '#0f1726' : '#5f7a6a'; cx.fill();
    if (night) LIGHTS.forEach(l => { cx.fillStyle = l.c > .5 ? 'rgba(255,200,120,.95)' : 'rgba(255,240,210,.9)'; cx.fillRect(l.x * W, l.y * H, W * .0035, W * .0035); });
    // אגם
    const lg = cx.createLinearGradient(0, H * .6, 0, H);
    if (night) { lg.addColorStop(0, '#1a2842'); lg.addColorStop(1, '#070b14'); } else { lg.addColorStop(0, '#9cc3d6'); lg.addColorStop(1, '#3e6a80'); }
    cx.fillStyle = lg; cx.fillRect(-W, H * .6, W * 3, H);
    cx.strokeStyle = night ? 'rgba(255,230,180,.25)' : 'rgba(255,255,255,.35)'; cx.lineWidth = Math.max(1, H * .003);
    for (let i = 0; i < 26; i++) {
      const y = H * (.62 + i * .015), off = Math.sin(t * 1.3 + i) * W * .04;
      cx.beginPath(); cx.moveTo(W * (.55 + .2 * Math.sin(i * 1.7)) + off, y); cx.lineTo(W * (.55 + .2 * Math.sin(i * 1.7)) + off + W * (.04 + (i % 4) * .015), y); cx.stroke();
    }
    path(R3, 0, .86); cx.fillStyle = night ? '#05080d' : '#2f4a2c'; cx.fill();
    cx.restore();
    // "ערכת צבע" לפי ההגדרות
    const f = [];
    const ev = parseFloat(st.ev) || 0; if (ev) f.push(`brightness(${(1 + ev * .22).toFixed(2)})`);
    if (String(st.color).startsWith('D-Log') && !st.recovery) f.push('saturate(.55) contrast(.72) brightness(1.08)');
        if (st.film === 'CC') f.push('sepia(.25) saturate(1.1) contrast(1.05)');
    if (st.film === 'NC') f.push('saturate(.8) hue-rotate(-8deg)');
    if (st.wb && st.wb !== 'Auto') { const k = parseInt(st.wb); f.push(k < 5000 ? `sepia(.0) hue-rotate(${(5000 - k) / 60}deg) saturate(1.1)` : `sepia(${Math.min(.5, (k - 5000) / 10000).toFixed(2)})`); }
    if (st.dim) f.push('brightness(.9)');
    cv.style.filter = f.join(' ') || 'none';
    raf = requestAnimationFrame(frame);
  }
  return {
    state: () => ({}),
    once() { const r = running; running = true; frame(performance.now()); cancelAnimationFrame(raf); running = r; },
    mount(canvas, stateFn) {
      cv = canvas; cx = cv.getContext('2d'); this.state = stateFn;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      running = true; raf = requestAnimationFrame(now => { frame(now); if (reduce) running = false; });
      document.addEventListener('visibilitychange', () => {
        if (reduce) return;
        if (document.hidden) { running = false; cancelAnimationFrame(raf); } else if (!running) { running = true; raf = requestAnimationFrame(frame); }
      });
      new ResizeObserver(() => { if (!running) { running = true; frame(performance.now()); if (reduce) running = false; } }).observe(cv);
    },
  };
})();
