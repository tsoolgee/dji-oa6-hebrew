# תיקוני התנהגות לפי דוחות הבודקים (הרצה חד-פעמית)
import pathlib
R = pathlib.Path(__file__).parent.parent
p = R / 'src/app.js'
s = p.read_text(encoding='utf-8')

def rep(a, b, n=1):
    global s
    assert a in s, 'MISSING: ' + a[:90]
    s = s.replace(a, b, n)

# 1. חוקי מפרט: Auto כמו 16:9, ייצוב אופק, הילוך איטי, 8K
rep("""  const a = val('p_aspect'), r = val('p_res');""", """  const a0 = val('p_aspect'), a = a0 === 'Auto' ? '16:9' : a0, r = val('p_res');""")
rep("""function fixVideo() {
  const R = videoRules(); S.vals.p_res = R.res;
  if (!R.fps.includes(val('p_fps'))) S.vals.p_fps = R.fps.includes('30') ? '30' : R.fps[0];
  const eis = val('p_eis');
  if (val('p_res') === '8K' && !['RockSteady', 'RockSteady+'].includes(eis)) S.vals.p_eis = 'RockSteady';
  if (val('p_res') === '8K' && val('p_fov') === 'Ultra Wide') S.vals.p_fov = 'Wide';
}""", """function fixVideo() {
  const R = videoRules(); S.vals.p_res = R.res;
  if (!R.fps.includes(val('p_fps'))) S.vals.p_fps = R.fps.includes('30') ? '30' : R.fps[0];
}
/* אפשרויות שהמצלמה לא מאפשרת במצב הנוכחי (לפי דף המפרט) */
function disabled(id) {
  const a = val('p_aspect'), r = val('p_res'), f = parseInt(val('p_fps'));
  const dlog = String(val('ia_color')).startsWith('D-Log');
  if (id === 'p_eis') {
    if (r === '8K') return ['Off', 'HorizonBalancing', 'HorizonSteady'];
    const horizonOk = ['Auto', '16:9', 'Custom'].includes(a) && f <= 60;
    return horizonOk ? [] : ['HorizonBalancing', 'HorizonSteady'];
  }
  if (id === 'p_fov' && r === '8K') return ['Ultra Wide'];
  if (id === 'p_slowrate' && val('p_slowres') !== '1080p') return ['8x (240fps)'];
  if (id === 'p_slowres' && val('p_slowrate').startsWith('8x')) return ['4K', '2.7K'];
  if (id === 'ia_film' && (r === '8K' || dlog)) return N.ia_film.o.map(o => o[0]).filter(v => v !== 'Off');
  if (id === 'ia_iso' && r === '8K') return dlog ? ['12800', '25600'] : ['25600'];
  return [];
}
function normalize() {
  if (S.mode === 'm_video' || S.mode === 'm_portrait') fixVideo();
  ['p_eis', 'p_fov', 'p_slowrate', 'p_slowres', 'ia_film', 'ia_iso'].forEach(id => {
    const d = disabled(id);
    if (d.includes(val(id))) S.vals[id] = N[id].o.map(o => o[0]).find(v => !d.includes(v));
  });
  if (!apertureAvail(S.mode).includes(S.vals.aperture)) S.vals.aperture = apertureAvail(S.mode)[0];
}""")
rep("""  const showZoom = !['m_night', 'm_track', 'm_slow', 'm_tl', 'm_hyper'].includes(S.mode);""",
    """  const showZoom = !['m_night', 'm_track', 'm_slow', 'm_tl', 'm_hyper'].includes(S.mode) && !(S.mode === 'm_photo' && /^3[48]MP/.test(val('p_photosize')));""")
rep("""  if (S.mode === 'm_video' || S.mode === 'm_portrait') fixVideo();
  let h = '';""", """  normalize();
  let h = '';""")
# שבבי פרמטרים עם אפשרויות חסומות
rep("""  } else rows.forEach(k => { body += chips(k, N[k].o || [['On', 'פועל'], ['Off', 'כבוי']], val(k)); });""",
    """  } else rows.forEach(k => { body += chips(k, N[k].o || [['On', 'פועל'], ['Off', 'כבוי']], val(k), disabled(k)); });""")
rep("""  const rows = n.o.map(o => `<button class="row ${o[0] === val(id) ? 'on' : ''}" data-pick="${id}" data-v="${esc(o[0])}"><span class="lb"><small dir="ltr">${esc(o[0])}</small><b>${esc(o[1])}</b></span>""",
    """  const dis = disabled(id);
  const rows = n.o.map(o => `<button class="row ${o[0] === val(id) ? 'on' : ''}" ${dis.includes(o[0]) ? 'disabled' : ''} data-pick="${id}" data-v="${esc(o[0])}"><span class="lb"><small dir="ltr">${esc(o[0])}</small><b dir="auto">${esc(o[1])}</b></span>""")

# 2. סימני מינוס/פלוס בעברית: כיוון אוטומטי
rep("""<span class="lb ${extra}"><small dir="ltr">${esc(n.en)}</small><b>${esc(n.he)}</b></span>""", """<span class="lb ${extra}"><small dir="ltr">${esc(n.en)}</small><b dir="auto">${esc(n.he)}</b></span>""")
rep("""${o[1] !== o[0] ? `<small>${esc(o[1])}</small>` : ''}""", """${o[1] !== o[0] ? `<small dir="auto">${esc(o[1])}</small>` : ''}""")
rep("""<small>${esc(optHe(id, val(id)))}</small>""", """<small dir="auto">${esc(optHe(id, val(id)))}</small>""")
rep("""<li class="${S.vals[n.id] === o[0] ? 'cur' : ''}"><span dir="ltr">${esc(o[0])}</span><b>${esc(o[1])}</b></li>""", """<li class="${S.vals[n.id] === o[0] ? 'cur' : ''}"><span dir="ltr">${esc(o[0])}</span><b dir="auto">${esc(o[1])}</b></li>""")
rep("""<span><small dir="ltr">${esc(o[0])}</small><b>${esc(o[1])}</b></span>""", """<span><small dir="ltr">${esc(o[0])}</small><b dir="auto">${esc(o[1])}</b></span>""")

# 3. מסך נעילה: שחרור רק בהחלקה למעלה
rep("""  if (S.vals.cc_lock === 'On' && s === 'live') { S.vals.cc_lock = 'Off'; toast('המסך שוחרר', 'Screen unlocked'); return render(); }""",
    """  if (S.dark) { S.dark = false; return render(); }
  if (S.vals.cc_lock === 'On' && s === 'live') { if (dir !== 'up') return toast('החליקו למעלה כדי לשחרר', 'Swipe up to unlock'); S.vals.cc_lock = 'Off'; toast('המסך שוחרר', 'Screen unlocked'); return render(); }""")
rep("""<small dir="ltr">Screen Locked · Swipe to unlock</small><b>המסך נעול · החליקו לשחרור</b>""", """<small dir="ltr">Screen Locked · Swipe up to unlock</small><b>המסך נעול · החליקו למעלה לשחרור</b>""")
# 4. בורר מצבים: החלקה למעלה מאשרת את הבחירה; פתיחה תמיד מהמצב הנוכחי
rep("""  if (dir === 'up') { if (s === 'live') { select(S.mode); return go('params'); } if (s === 'cc' || s === 'modes') return home(); }""",
    """  if (dir === 'up') {
    if (s === 'live') { select(S.mode); return go('params'); }
    if (s === 'modes') { if (S.modePick) S.mode = S.modePick; S.modePick = null; select(S.mode); return home(); }
    if (s === 'cc') return home();
  }""")
rep("""  if (d.go) {
    if (S.vals.cc_lock === 'On' && S.screen === 'live') return;""", """  if (d.go) {
    if (S.vals.cc_lock === 'On' && S.screen === 'live') return;
    if (d.go === 'modes') S.modePick = S.mode;""")
rep("""if (!apertureAvail(S.mode).includes(S.vals.aperture)) S.vals.aperture = apertureAvail(S.mode)[0]; return home(); }""", """return home(); }""")
# 5. סרגל אחסון
rep("""<i style="width:38%"></i></div><span dir="ltr">31.0 GB / 50 GB</span>""", """<i style="width:62%"></i></div><span dir="ltr">31.0 GB / 50 GB</span>""")

# 6. לחצנים פיזיים: SnapShot, טיימר יחיד, דף החלפה מהירה ופעולות QS
old_start = s.index("let qsT, qsLong = false;")
old_end = s.index("/* ---------- מפת התפריטים ---------- */")
s = s[:old_start] + r"""let qsT, qsLong = false, qsBack, snapOff;
const QS_ITEMS = () => [
  ...(val('qs_screen') === 'On' ? ['screen'] : []),
  ...['m_video', 'm_photo', 'm_slow', 'm_tl', 'm_hyper', 'm_night', 'm_track'].filter(m => val('qs_m_' + m.slice(2)) === 'On'),
  ...(val('qs_m_custom') === 'On' ? ['custom'] : []),
  ...(val('qs_m_play') === 'On' ? ['play'] : []),
];
const QS_LABEL = { screen: ['Screen Switch', 'החלפת מסך'], custom: ['C1', 'מצב מותאם 1'], play: ['Playback', 'גלריה'] };
function qsLabel(k) { return N[k] ? [N[k].en, N[k].he] : QS_LABEL[k]; }
function recTime() { const t = S.rec ? Math.floor((Date.now() - S.recStart) / 1000) : 0; return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; }
function shutter() {
  select('btn_shutter'); clearTimeout(snapOff);
  if (!S.on) {
    S.on = true; S.stack = []; S.screen = 'live'; S.snap = true;
    if (val('s_snap') === 'Video' || S.mode === 'm_photo') S.mode = 'm_video';
    S.rec = true; S.recStart = Date.now(); toast('SnapShot: המצלמה נדלקה ומקליטה', 'SnapShot'); return render();
  }
  if (S.dark) { S.dark = false; }
  if (S.screen !== 'live') { S.stack = []; S.screen = 'live'; }
  if (S.mode === 'm_photo') { const f = $('#flash'); f.hidden = false; setTimeout(() => f.hidden = true, 140); toast('צולמה תמונה', 'Photo taken'); return render(); }
  S.rec = !S.rec; S.recStart = Date.now();
  if (!S.rec && S.snap) {
    S.snap = false; toast('SnapShot: המצלמה תיכבה בעוד 3 שניות', 'Auto power off in 3s');
    snapOff = setTimeout(() => { if (!S.rec) { S.on = false; render(); } }, 3000);
  }
  render();
}
function tick() {}
function qsDown() { qsLong = false; qsT = setTimeout(() => { qsLong = true; S.on = !S.on; S.rec = false; S.snap = false; S.dark = false; select('btn_qs'); home(); toast(S.on ? 'המצלמה נדלקה' : 'המצלמה כובתה', S.on ? 'Power on' : 'Power off'); }, 700); }
function qsApply(k) {
  if (k === 'screen') { S.screen = 'live'; S.stack = []; flip(); return; }
  if (k === 'play') { S.stack = [['live']]; S.screen = 'playback'; return render(); }
  if (k === 'custom') { home(); return toast('הופעל מצב מותאם C1', 'C1'); }
  S.mode = k; home();
}
function qsUp() {
  clearTimeout(qsT); if (qsLong || !S.on) return; select('btn_qs');
  if (S.dark) { S.dark = false; return render(); }
  if (S.rec) return ['m_video', 'm_slow', 'm_portrait'].includes(S.mode) ? toast('סומן רגע שיא', 'Highlight marked') : undefined;
  if (S.screen === 'qspage') {
    const list = QS_ITEMS(); if (!list.length) return home();
    S.qsPick = list[(list.indexOf(S.qsPick) + 1) % list.length];
    const [en, he] = qsLabel(S.qsPick);
    if (val('qs_prompt') === 'On') toast(`הכרזה קולית: "${en}"`, en);
    render(); clearTimeout(qsBack); qsBack = setTimeout(() => { if (S.screen === 'qspage') qsApply(S.qsPick); }, 2500); return;
  }
  if (S.screen !== 'live') return home();
  const f = val('qs_feature');
  if (f === 'Screen Off') { S.dark = true; return render(); }
  if (f === 'Zoom') { const o = N.lv_zoom.o.map(x => x[0]); S.vals.lv_zoom = o[(o.indexOf(val('lv_zoom')) + 1) % o.length]; toast('זום ' + val('lv_zoom'), 'Zoom'); return render(); }
  if (f === 'Lock Screen') { S.vals.cc_lock = 'On'; return render(); }
  if (f === 'Start/End Pre-Rec') { S.vals.p_prerec = val('p_prerec') === 'Off' ? '10s' : 'Off'; toast('הקלטה מוקדמת: ' + (val('p_prerec') === 'Off' ? 'כבויה' : 'פועלת'), 'Pre-Rec'); return render(); }
  S.qsPick = QS_ITEMS().includes(S.mode) ? S.mode : QS_ITEMS()[0];
  S.stack = [['live']]; S.screen = 'qspage'; render();
  clearTimeout(qsBack); qsBack = setTimeout(() => { if (S.screen === 'qspage') qsApply(S.qsPick); }, 2500);
}
function scrQS() {
  const items = QS_ITEMS().map(k => { const [en, he] = qsLabel(k); return `<button class="qsi ${k === S.qsPick ? 'on' : ''}" data-qs="${k}">${ic(N[k] ? N[k].icon : k === 'screen' ? 'front' : k === 'play' ? 'play' : 'custom')}<span class="lb"><small dir="ltr">${esc(en)}</small><b dir="auto">${esc(he)}</b></span></button>`; }).join('');
  return `<div class="qsp"><div class="qshead"><span class="lb"><small dir="ltr">Quick Switch</small><b>החלפה מהירה</b></span><button class="qsedit" data-go="cc_qs" data-sel="cc_qs">${ic('gear')}</button></div><div class="qslist">${items}</div>
  <div class="mhint"><small dir="ltr">Press QS to switch</small><b>לחיצה נוספת על QS עוברת לפריט הבא</b></div></div>`;
}

""" + s[old_end:]
rep("""  else if (s === 'playback') h = scrPlayback();""", """  else if (s === 'playback') h = scrPlayback();
  else if (s === 'qspage') h = scrQS();""")
rep("""  ui.innerHTML = h + (S.vals.cc_lock""", """  if (S.dark) h = '<div class="off"><small dir="ltr">Screen Off</small><b>המסך כבוי · נגיעה או QS מדליקים</b></div>' + (S.rec ? `<div class="ov tc rec"><span class="dot"></span>${recTime()}</div>` : '');
  ui.innerHTML = h + (S.vals.cc_lock""")
rep("""const SCR_NAME = { live: 'מסך הצילום',""", """const SCR_NAME = { qspage: 'דף ההחלפה המהירה', live: 'מסך הצילום',""")
rep("""  if (d.act) { const n = N[d.act]; toast(n.he, n.en); }""", """  if (d.act) { const n = N[d.act]; toast(n.he, n.en); }
  if (d.qs) { clearTimeout(qsBack); S.qsPick = d.qs; qsApply(d.qs); }""")
rep("""  const b = e.target.closest('button'); if (!b || swiping) return;""", """  if (S.dark) { S.dark = false; return render(); }
  const b = e.target.closest('button'); if (!b || swiping || b.disabled) return;""")
# טיימר הקלטה יחיד שמעדכן רק את השעון
rep("""  const t = S.rec ? Math.floor((Date.now() - S.recStart) / 1000) : 0;
  const tt = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;""", """  const tt = recTime();""")
rep("""  renderTree(); render(); renderInfo();""", """  setInterval(() => { if (S.rec) { const t = document.querySelector('#ui .ov.rec'); if (t) t.lastChild.textContent = recTime(); } }, 1000);
  renderTree(); render(); renderInfo();""")

# 7. "הצג" לפי ההקשר במפה (מצב נכון, צד נכון, USB)
rep("""function treeItem(id, depth, seen) {""", """function treeItem(id, depth, seen, ctx) {""")
rep("""n.kids.map(k => treeItem(k, depth + 1, new Set([...seen, id]))).join('')""", """n.kids.map(k => treeItem(k, depth + 1, new Set([...seen, id]), id)).join('')""")
rep("""<button class="tshow" data-show="${id}">הצג</button>""", """<button class="tshow" data-show="${id}" data-ctx="${ctx || ''}">הצג</button>""")
rep("""$('#tree').addEventListener('click', e => { const b = e.target.closest('[data-show]'); if (b) showOnCamera(b.dataset.show); });""",
    """$('#tree').addEventListener('click', e => { const b = e.target.closest('[data-show]'); if (b) showOnCamera(b.dataset.show, b.dataset.ctx); });""")
rep("""function showOnCamera(id) {
  S.on = true; S.stack = [];
  const chain = []; let x = id; while (x) { chain.unshift(x); x = PARENT[x]; }""", """function showOnCamera(id, ctx) {
  S.on = true; S.stack = []; S.dark = false;
  const chain = [id]; let x = ctx || PARENT[id]; while (x) { chain.unshift(x); x = PARENT[x]; }
  const wantFront = ['front_screen', 'lens', 'ct_sensor'].includes(id), wantRear = ['rear_screen'].includes(id);
  if ((wantFront && !S.front) || (wantRear && S.front)) flip();
  if (chain[0] === 'usb') { toast('החלון הזה קופץ כשמחברים את המצלמה למחשב בכבל', 'USB'); }""")
rep("""const CONF = {""", """const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CONF = {""")
rep("""  sc.dataset.s = s;
  renderCrumb();""", """  sc.dataset.s = s;
  if (REDUCE && typeof Feed !== 'undefined' && Feed.once) Feed.once();
  renderCrumb();""")
# 8. חצים במקלדת: כיוון הניווט ולא כיוון ההחלקה
rep("""    const k = { ArrowDown: 'down', ArrowUp: 'up', ArrowLeft: 'left', ArrowRight: 'right' }[e.key];""", """    const k = { ArrowDown: 'down', ArrowUp: 'up', ArrowLeft: 'right', ArrowRight: 'left' }[e.key];""")
# 9. טקסט כפתור ההיפוך
rep("""S.front ? 'הצג את הצד האחורי' : 'הפוך לצד הקדמי'""", """S.front ? 'הפוך לצד האחורי' : 'הפוך לצד הקדמי'""")
p.write_text(s, encoding='utf-8')

f = R / 'src/feed.js'
t = f.read_text(encoding='utf-8')
t = t.replace("if (st.color === 'D-Log M') f.push(", "if (String(st.color).startsWith('D-Log') && !st.recovery) f.push(")
t = t.replace("if (st.color === 'HLG') f.push('saturate(1.15) contrast(1.05)');\n", "")
f.write_text(t, encoding='utf-8')
s = p.read_text(encoding='utf-8')
s = s.replace("color: val('ia_color'), film: val('ia_film'),", "color: val('ia_color'), recovery: val('ia_recovery') === 'On', film: val('ia_film'),")
s = s.replace("dim: S.screen !== 'live',", "dim: S.screen !== 'live' || !!S.dark,")
p.write_text(s, encoding='utf-8')

tp = R / 'src/template.html'
h = tp.read_text(encoding='utf-8')
h = h.replace("""      <button data-sw="right">{{I_SIDE}}החלקה לצד</button>""", """      <button data-sw="left">{{I_SIDE}}החלקה שמאלה</button>
      <button data-sw="right">{{I_SIDE}}החלקה ימינה</button>""")
h = h.replace("/* רשימות */", """/* דף ההחלפה המהירה */
.qsp{position:absolute;inset:0;background:rgb(0 0 0/.88);display:flex;flex-direction:column;padding:2.4cqw 3cqw 8cqw}
.qshead{display:flex;justify-content:space-between;align-items:center}
.qsedit{width:6.4cqw;height:6.4cqw;display:grid;place-items:center;border-radius:50%;background:rgb(255 255 255/.12)}
.qslist{flex:1;display:flex;gap:2cqw;align-items:center;justify-content:center;flex-wrap:wrap}
.qsi{display:flex;flex-direction:column;align-items:center;gap:1cqw;padding:1.6cqw 2cqw;border-radius:2cqw;border:.3cqw solid transparent;min-width:15cqw}
.qsi .lb{align-items:center!important;text-align:center}
.qsi.on{border-color:var(--ui);color:var(--ui)}
.row:disabled{opacity:.3;cursor:not-allowed}

/* רשימות */""")
tp.write_text(h, encoding='utf-8')
print('app ok')
