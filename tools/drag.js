function initSwipe(el) {
  // גרירה חיה: המסך עוקב אחרי האצבע/העכבר, ובשחרור נפתח או חוזר למקומו
  let D = null;
  const W = () => el.clientWidth, H = () => el.clientHeight;
  const layer = html => { const l = document.createElement('div'); l.className = 'draglayer'; l.innerHTML = html; el.appendChild(l); return l; };
  const tf = (node, x, y, anim) => { node.style.transition = anim ? 'transform .2s ease, opacity .2s ease' : 'none'; node.style.transform = `translate(${x}px,${y}px)`; };
  function begin(e, dx, dy) {
    const h = Math.abs(dx) > Math.abs(dy), s = S.screen, t = D.target;
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
    swiping = true;
    clearTimeout(lpT);
    if (S.modal || !S.on) return (D.kind = 'none');
    const wh = t.closest('.wheel');
    if (wh && h) { D.kind = 'wheel'; D.id = wh.dataset.wheel; D.node = wh.firstElementChild; D.base = new DOMMatrix(getComputedStyle(D.node).transform).m41; return; }
    const sc = t.closest('.lbody,.pbody');
    if (sc && !h) { D.kind = 'scroll'; D.node = sc; D.base = sc.scrollTop; return; }
    if (S.dark || (S.vals.cc_lock === 'On' && s === 'live')) return (D.kind = 'tap');
    if (s === 'live' && !h && dy > 0) { S.ccPage = 0; D.kind = 'open'; D.dir = 'down'; D.node = layer(scrCC()); tf(D.node, 0, -H()); return; }
    if (s === 'live' && !h && dy < 0) { D.kind = 'open'; D.dir = 'up'; D.node = layer(scrParams()); tf(D.node, 0, H()); return; }
    if (s === 'live' && h) { S.modePick = S.mode; D.kind = 'fade'; D.dir = dx < 0 ? 'left' : 'right'; D.node = layer(scrModes()); D.node.style.opacity = 0; return; }
    if (s === 'cc' && !h && dy < 0) { D.kind = 'close'; D.dir = 'up'; D.node = $('#ui'); return; }
    if (s === 'params' && !h && dy > 0) { D.kind = 'close'; D.dir = 'down'; D.node = $('#ui'); return; }
    if (s === 'modes' && h) { D.kind = 'modes'; D.node = $('#ui .mtrack'); return; }
    if (s === 'modes' && !h && dy < 0) { D.kind = 'close'; D.dir = 'up'; D.node = $('#ui'); return; }
    if (s === 'cc' && h) { D.kind = 'page'; D.node = $('#ui .cc'); return; }
    if (s === 'playback' && h && dx < 0) { D.kind = 'close'; D.dir = 'left'; D.node = $('#ui'); return; }
    D.kind = 'none';
  }
  function move(dx, dy) {
    const n = D.node;
    switch (D.kind) {
      case 'wheel': n.style.transition = 'none'; n.style.transform = `translateX(${D.base + dx}px)`; break;
      case 'scroll': n.scrollTop = D.base - dy; break;
      case 'open': tf(n, 0, D.dir === 'down' ? Math.min(0, -H() + dy) : Math.max(0, H() + dy)); break;
      case 'fade': n.style.opacity = Math.min(1, Math.abs(dx) / (W() * .35)); break;
      case 'close': tf(n, D.dir === 'left' ? Math.min(0, dx) : 0, D.dir === 'up' ? Math.min(0, dy) : D.dir === 'down' ? Math.max(0, dy) : 0); break;
      case 'modes': if (n) { n.style.transition = 'none'; n.style.transform = `translateX(${dx}px)`; } break;
      case 'page': if (n) tf(n, S.ccPage === 0 ? Math.min(0, dx) : Math.max(0, dx), 0); break;
    }
  }
  function end(dx, dy) {
    const n = D.node, k = D.kind;
    const done = fn => setTimeout(() => { if (n && n.classList.contains('draglayer')) n.remove(); else if (n) { n.style.transform = ''; n.style.transition = ''; } fn && fn(); }, 200);
    if (k === 'wheel') { const step = Math.round(-dx / (W() * .16)); if (step) stepWheel(D.id, step); else centerWheels(); return; }
    if (k === 'open') {
      const ok = Math.abs(dy) > H() * .28;
      tf(n, 0, ok ? 0 : (D.dir === 'down' ? -H() : H()), true);
      return done(() => { if (ok) { if (D.dir === 'down') { select('cc'); go('cc'); } else { select(S.mode); go('params'); } } });
    }
    if (k === 'fade') {
      const ok = Math.abs(dx) > W() * .12; n.style.transition = 'opacity .2s'; n.style.opacity = ok ? 1 : 0;
      return done(() => { if (ok) { select('modes'); go('modes'); } });
    }
    if (k === 'close') {
      const dist = D.dir === 'left' ? -dx : D.dir === 'up' ? -dy : dy, size = D.dir === 'left' ? W() : H();
      const ok = dist > size * .25;
      tf(n, D.dir === 'left' ? (ok ? -W() : 0) : 0, D.dir === 'up' ? (ok ? -H() : 0) : D.dir === 'down' ? (ok ? H() : 0) : 0, true);
      return done(() => { if (ok) { if (S.screen === 'modes') { if (S.modePick) S.mode = S.modePick; S.modePick = null; select(S.mode); } home(); } });
    }
    if (k === 'modes') {
      const step = Math.round(-dx / (W() * .26)), i = MODES.indexOf(S.modePick), j = Math.max(0, Math.min(MODES.length - 1, i + step));
      S.modePick = MODES[j]; select(MODES[j]); return render();
    }
    if (k === 'page') {
      const ok = Math.abs(dx) > W() * .2 && ((S.ccPage === 0 && dx < 0) || (S.ccPage === 1 && dx > 0));
      tf(n, ok ? (dx < 0 ? -W() : W()) : 0, 0, true);
      return done(() => { if (ok) { S.ccPage = S.ccPage ? 0 : 1; if (S.ccPage) select('storage'); render(); } });
    }
    if (k === 'tap') { if (Math.abs(dy) > Math.abs(dx)) swipe(dy > 0 ? 'down' : 'up'); else swipe(dx < 0 ? 'left' : 'right'); }
  }
  el.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    D = { x: e.clientX, y: e.clientY, target: e.target, kind: null };
    swiping = false;
    if (S.screen === 'playback' && !e.target.closest('button')) lpT = setTimeout(() => { S.fast = true; render(); }, 450);
  });
  el.addEventListener('pointermove', e => {
    if (!D) return;
    const dx = e.clientX - D.x, dy = e.clientY - D.y;
    if (!D.kind) { if (Math.hypot(dx, dy) < 8) return; begin(e, dx, dy); }
    move(dx, dy);
  });
  const up = e => {
    clearTimeout(lpT); if (S.fast) { S.fast = false; render(); }
    if (!D) return;
    const dx = e.clientX - D.x, dy = e.clientY - D.y, was = D;
    if (was.kind) { end(dx, dy); setTimeout(() => swiping = false, 60); }
    D = null;
  };
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', e => { if (D && D.kind) end(0, 0); D = null; swiping = false; });
  el.addEventListener('dragstart', e => e.preventDefault());
}
