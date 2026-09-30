// סימולטור מסך DJI Osmo Action 6. מיקומי הסמלים לפי האיורים במדריך הרשמי (עמ' 15, 16, 18, 20).
// המסך עצמו תמיד משמאל לימין כמו במצלמה; העברית רק מתווספת עליו.
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
// עוטף מידות כמו 3840×2160 בבידוד כיווניות, כדי שבעברית לא יתהפכו ל-2160×3840
const bd = s => String(s ?? '').replace(/\d+(?:\.\d+)?×\d+/g, m => '⁦' + m + '⁩');
const CONF = { h: ['מקור רשמי', 'ok'], m: ['ממדריכים וביקורות', 'mid'], l: ['לא אומת לאקשן 6 (לפי דגם קודם)', 'low'] };

/* ---------- מפת הורים (לנתיב "איך מגיעים") ---------- */
const PARENT = {};
(function walk(list, parent) {
  list.forEach(id => {
    if (!N[id] || id in PARENT) return;
    PARENT[id] = parent; walk(N[id].kids || [], id);
  });
})(ROOTS.flatMap(r => r[1]), null);
const HOW = {
  cc: 'במסך הצילום: החלקה למטה מהחלק העליון', cc_settings: 'מרכז הבקרה ← הגדרות (אייקון 4)', imgaudio: 'במסך הצילום: שני הקווים עם הנקודות, בצד ימין',
  modes: 'במסך הצילום: החלקה ימינה או שמאלה', playback: 'במסך הצילום: הריבוע עם המשולש, משמאל באמצע', storage: 'מרכז הבקרה ← החלקה שמאלה',
};
function howTo(id) {
  if (HOW[id]) return HOW[id];
  if (!N[id]) return '';
  if (PARENT[id] && MODES.includes(PARENT[id]) && N[PARENT[id]]) return 'בוחרים את מצב ' + N[PARENT[id]].he + ' ← החלקה למעלה' + (N[id].where ? ' ← ' + N[id].where : '');
  if (MODES.includes(id)) return HOW.modes + ' ← ' + N[id].he;
  const ch = []; let x = id;
  while (x && N[x]) {
    if (HOW[x]) { ch.unshift(HOW[x]); break; }
    if (MODES.includes(x)) { ch.unshift('בוחרים את מצב ' + N[x].he + ' ← החלקה למעלה'); break; }
    ch.unshift(N[x].he); x = PARENT[x];
  }
  return ch.join(' ← ');
}

/* ---------- מצב ---------- */
const S = { on: true, screen: 'live', stack: [], mode: 'm_video', rec: false, recStart: 0, ccPage: 0, pro: false, vals: {}, sel: 'lv_specs', captions: true, modal: null,
  clip: { mode: 'm_video', res: '4K', ar: '16:9', fps: 120, dur: 65, slow: [] }, used: { 'Internal Storage': 31.0, 'microSD Card': 119.0 }, dive: false };
for (const id in N) if (N[id].def !== undefined) S.vals[id] = N[id].def;
S.vals.aperture = 'ap_auto';
const val = id => S.vals[id];
const optHe = (id, v) => { const o = ((N[id] && N[id].o) || []).find(x => x[0] === v); return o ? o[1] : v; };
const STOR = { 'Internal Storage': 50, 'microSD Card': 238.3 };
const bigPhoto = () => /^3[48]MP| L$/.test(String(val('p_photosize')));
const zoomOk = () => !['m_night', 'm_track', 'm_slow', 'm_tl'].includes(S.mode) && !(S.mode === 'm_photo' && bigPhoto());
const isVid = () => S.mode === 'm_video' || S.mode === 'm_portrait';

/* ---------- חוקי מפרט (דף המפרט הרשמי) ---------- */
const resOf = () => String(val('p_res')).split('/')[0];
function fpsList() {
  const [r, a] = String(val('p_res')).split('/');
  let f = ['24', '25', '30', '48', '50', '60'];
  if (r === '8K' || S.mode === 'm_portrait') return ['24', '25', '30'];
  if (a === '1:1') return f;
  if (r === '1080p') return f.concat(['100', '120', '200', '240']);
  return f.concat(['100', '120']);
}
function resList() {
  const a = val('p_aspect');
  if (a === 'Custom') return ['4K/1:1'];
  let all = N.p_res.o.map(o => o[0]);
  if (S.mode === 'm_portrait') all = all.filter(v => !v.startsWith('8K'));
  if (a === 'Portrait') return all.filter(v => v.endsWith('/9:16'));
  return all.filter(v => !v.endsWith('/9:16') && v !== '4K/1:1');
}
const dlogOn = () => String(val('ia_color')).startsWith('D-Log');
function disabled(id) {
  const r = resOf(), a = String(val('p_res')).split('/')[1], f = parseInt(val('p_fps'));
  const dlog = dlogOn(), allBut = (k, keep) => ((N[k] && N[k].o) || []).map(o => o[0]).filter(v => v !== keep);
  if (id === 'p_eis') {
    if (r === '8K') return ['Off', 'HorizonBalancing', 'HorizonSteady'];
    const d = (['16:9', '1:1'].includes(a) && f <= 60) ? [] : ['HorizonBalancing', 'HorizonSteady'];
    if (val('p_fov') === 'Standard (Dewarp)') d.push('RockSteady+'); // צילום s47: עם Dewarp אין RS+ ברשימה
    return d;
  }
  if (id === 'p_fov' && r === '8K') return ['Ultra Wide'];
  if (id === 'p_slowrate' && val('p_slowres') !== '1080p') return ['8x (240fps)'];
  if (id === 'p_slowres' && String(val('p_slowrate')).startsWith('8x')) return ['4K', '2.7K'];
  if (id === 'ia_film') {
    const filmOk = !dlog && r !== '8K' && ((a === '16:9' && f <= 60) || (a === '4:3' && f <= 30));
    if (!filmOk && isVid()) return allBut('ia_film', 'Off');
  }
  if (id === 'ia_iso') {
    if (r === '8K') return dlog ? ['12800', '25600', '51200'] : ['25600', '51200'];
    if (S.mode !== 'm_night') return ['51200'];
  }
  if (id === 'p_loop' && (r === '8K' || a === '1:1' || val('p_aspect') === 'Custom')) return allBut('p_loop', 'Off');
  if (id === 'p_burst' && val('p_live') === 'On') return allBut('p_burst', 'Off');
  return [];
}
function apertureAvail(mode) {
  if (mode === 'm_tl') return ['ap_fixed', 'ap_star'];
  if (mode === 'm_night') return ['ap_large', 'ap_fixed', 'ap_star'];
  return ['ap_auto', 'ap_fixed', 'ap_star'];
}
function normalize() {
  if (isVid()) {
    const rl = resList(); if (!rl.includes(val('p_res'))) S.vals.p_res = rl.includes('4K/16:9') ? '4K/16:9' : rl.includes('4K/9:16') ? '4K/9:16' : rl[0];
    const fl = fpsList(); if (!fl.includes(val('p_fps'))) S.vals.p_fps = fl.includes('30') ? '30' : fl[0];
  }
  ['p_eis', 'p_fov', 'p_slowrate', 'p_slowres', 'ia_film', 'ia_iso', 'p_loop', 'p_burst'].forEach(id => {
    if (!N[id] || !N[id].o) return;
    const d = disabled(id);
    if (d.includes(val(id))) S.vals[id] = id === 'p_eis' ? 'RockSteady' : N[id].o.map(o => o[0]).find(v => !d.includes(v));
  });
  if (val('p_prerec') !== 'Off' && val('p_loop') !== 'Off') S.vals.p_loop = 'Off';
  if (val('p_live') === 'On' && val('p_burst') && val('p_burst') !== 'Off') S.vals.p_burst = 'Off';
  if ((resOf() === '8K' || dlogOn()) && val('ia_quality') === 'On') S.vals.ia_quality = 'Off';
  if (!apertureAvail(S.mode).includes(S.vals.aperture)) S.vals.aperture = apertureAvail(S.mode)[0];
}
const EIS_SHORT = { 'Off': 'Off', 'RockSteady': 'RS', 'RockSteady+': 'RS+', 'HorizonBalancing': 'HB', 'HorizonSteady': 'HS' };
const FOV_SHORT = { 'Ultra Wide': 'UW', 'Wide': 'W', 'Natural Wide': 'NW', 'Standard (Dewarp)': 'S' };
const FOV_TILE = { 'Ultra Wide': 'Ultra Wide', 'Wide': 'Wide', 'Natural Wide': 'Natural Wide', 'Standard (Dewarp)': 'Standard' };
function apertureLabel() { const a = S.vals.aperture; return a === 'ap_large' ? 'F2.0' : a === 'ap_star' ? 'F4.0' : a === 'ap_fixed' ? 'F2.8' : (S.mode === 'm_night' ? 'F2.0' : 'F2.8'); }
function remainStr() {
  const k = val('st_loc') in STOR ? val('st_loc') : 'Internal Storage', free = Math.max(0, STOR[k] - (S.used[k] || 0));
  if (S.mode === 'm_photo') return String(Math.min(9999, Math.floor(free * 1024 / 1.9)));
  const m = Math.floor(free * 5.95); return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}m`;
}
function specsLine() {
  const m = S.mode;
  if (isVid()) return `${resOf()}${val('p_fps')}/${EIS_SHORT[val('p_eis')]}/${FOV_SHORT[val('p_fov')]}`;
  if (m === 'm_photo') { const ps = String(val('p_photosize')); return `${/^\d+MP/.test(ps) ? ps.split(' ')[0] : ps.replace(' ', '')}/${FOV_SHORT[val('p_pfov')]}`; }
  if (m === 'm_slow') return `${val('p_slowres')}/${val('p_slowrate').split(' ')[0]}`;
  if (m === 'm_hyper') return `${val('p_tlres')}${val('p_tlfps')}/${val('p_speed') === 'Auto' ? 'Auto' : val('p_speed')}`;
  if (m === 'm_tl') return `${val('p_tlres')}${val('p_tlfps')}/${val('p_interval')}`;
  if (m === 'm_night') return `${val('p_nres')}${val('p_nfps')}/${EIS_SHORT[val('p_neis')]}/${FOV_SHORT[val('p_nfov')]}`;
  if (m === 'm_track') return `${val('p_trres')}${val('p_trfps')}`;
  return '';
}

/* ---------- ניווט ---------- */
function go(screen, arg) { S.stack.push([S.screen, S.arg]); S.screen = screen; S.arg = arg; render(); }
function back() { let p = S.stack.pop(); if (p && p[0] === 'qspage') p = S.stack.pop(); if (p) { S.screen = p[0]; S.arg = p[1]; } else S.screen = 'live'; render(); }
function home() { S.stack = []; S.screen = 'live'; S.arg = null; S.modal = null; render(); }
function select(id) { if (N[id]) { S.sel = id; renderInfo(); } }
let toastT;
function toast(he, en) {
  const t = $('#toast'); t.innerHTML = (en ? `<small>${esc(en)}</small>` : '') + (S.captions || !en ? `<b>${esc(he)}</b>` : ''); t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2200);
}
function lbl(id, extra = '') { const n = N[id]; return `<span class="lb ${extra}"><small dir="ltr">${esc(n.en)}</small><b dir="auto">${esc(n.he)}</b></span>`; }
function lb2(en, he) { return `<span class="lb"><small dir="ltr">${esc(en)}</small><b dir="auto">${esc(he)}</b></span>`; }
function cap(he, pos = '') { return `<i class="cap ${pos}">${esc(he)}</i>`; }

/* ---------- מסך הצילום (עמ' 15) ---------- */
function scrLive() {
  const m = N[S.mode];
  const showZoom = zoomOk();
  const store = val('st_loc') === 'microSD Card' ? 'sd' : 'store';
  const remain = remainStr();
  const grid = val('s_grid');
  const pre = S.cdLeft ? `<div class="ov badge tcb num">${S.cdLeft}</div>` : S.mode === 'm_video' && val('p_prerec') !== 'Off' ? `<div class="ov badge tcb">PRE-REC ${esc(val('p_prerec'))}</div>` : S.mode === 'm_video' && val('p_loop') !== 'Off' ? `<div class="ov badge tcb">LOOP ${esc(val('p_loop'))}</div>` : '';
  return `${grid === 'Grid' || grid === 'Grid & Diagonals' ? '<div class="gridov"></div>' : ''}${grid === 'Diagonals' || grid === 'Grid & Diagonals' ? '<div class="diagov"></div>' : ''}
  <button class="ov p1" data-go="storage" data-sel="lv_storage">${ic(store)}<span class="num">${remain}</span>${cap('זמן שנותר', 'below')}</button>
  ${S.rec ? `<div class="ov tc rec"><span class="dot"></span><span class="num">${recTime()}</span></div>` : pre}
  ${val('tc_show') === 'On' ? `<div class="ov tcode num">00:14:07:12</div>` : ''}
  <button class="ov p4" data-act="batt" data-sel="lv_battery"><span class="batt"><span class="num">100</span></span>${cap('סוללה', 'below r')}</button>
  <button class="ov p2" data-go="playback" data-sel="lv_playback">${ic('play')}${cap('גלריה', 'side')}</button>
  <button class="ov p3" data-go="modes" data-sel="lv_mode">${ic(m.icon)}${cap(m.he, 'above l')}</button>
  <button class="ov p5" data-go="imgaudio" data-sel="lv_imgaudio">${ic('sliders')}${cap('תמונה ושמע', 'side r')}</button>
  <button class="ov p6" data-go="aperture" data-sel="lv_aperture"><span class="num">${apertureLabel()}</span>${cap('צמצם', 'side r')}</button>
  <button class="ov p7" data-go="params" data-sel="lv_specs"><span class="num">${esc(specsLine())}</span>${cap('מפרט ההקלטה', 'above')}</button>
  ${showZoom ? `<button class="ov p8" data-zoom="1" data-sel="lv_zoom"><span class="zb num">${esc(val('lv_zoom').replace('.0', ''))}</span>${cap('זום', 'above r')}</button>` : ''}`;
}

/* ---------- בורר מצבים ---------- */
/* מצבים מותאמים (Video 1..5) יושבים בתחילת הגלגל, כמו בצילום s33 */
const WM = () => [...Array.from({ length: S.customCount || 0 }, (_, i) => 'cu' + (i + 1)), ...MODES];
const curPick = () => S.custom && S.custom <= (S.customCount || 0) ? 'cu' + S.custom : S.mode;
const selOf = m => /^cu/.test(m) ? 'm_video' : m;
function commitMode(m) { if (/^cu/.test(m)) { S.mode = 'm_video'; S.custom = +m.slice(2); } else { S.mode = m; S.custom = 0; } }
function scrModes() {
  const WL = WM(), idx = Math.max(0, WL.indexOf(S.modePick ?? curPick())); S.modePick = WL[idx];
  const cu = /^cu/.test(WL[idx]) ? +WL[idx].slice(2) : 0, id = cu ? 'm_video' : WL[idx], n = N[id];
  const spec = specsLine().split('/'), title = `${n.en}${cu ? ' ' + cu : ''}+${spec[0]}${spec.length > 2 ? '' : ''}${isVid() && id === S.mode ? '/' + (String(val('p_res')).split('/')[1] || '') : ''}`;
  const chips = [];
  if (['m_video', 'm_portrait', 'm_night'].includes(id)) chips.push(EIS_SHORT[val(id === 'm_night' ? 'p_neis' : 'p_eis')]);
  if (String(val('ia_color')).startsWith('D-Log')) chips.push('D-Log M');
  const items = WL.map((m, i) => { const d = i - idx; if (Math.abs(d) > 2) return ''; const sz = d === 0 ? 21.5 : Math.abs(d) === 1 ? 14.5 : 10, x = d === 0 ? 0 : Math.sign(d) * (Math.abs(d) === 1 ? 23.6 : 39), k = /^cu/.test(m) ? m.slice(2) : '';
    return `<button class="mbig ${d === 0 ? 'on' : ''}" data-mode="${m}" style="--sz:${sz}cqw;transform:translate(calc(-50% + ${x}cqw),-50%);opacity:${d === 0 ? 1 : Math.abs(d) === 1 ? .9 : .2}"><span style="display:block">${ic3d(k ? 'video' : N[m].icon)}</span>${k ? `<span class="mbadge num">${k}</span>` : ''}</button>`; }).join('');
  return `<div class="modes">
    <div class="mtitle num">${esc(title)}</div>
    <div class="mchips">${chips.map(c => `<span class="mchip num">${esc(c)}</span>`).join('')}</div>
    <div class="mtrack">${items}</div>
    ${S.captions ? `<div class="mcap">${lb2(n.en, n.he)}</div>` : ''}
    <div class="handle bot"></div></div>`;
}
/* אייקון "תלת-ממדי" של מצב צילום: מילוי מדורג לבן-אפור כמו בבורר המקורי */
function ic3d(name) {
  if (name === 'custom') return '<svg class="ic3" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="g3c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#b9c0c6"/></linearGradient><clipPath id="c3c"><circle cx="11" cy="11" r="10"/></clipPath></defs><circle cx="11" cy="11" r="10" fill="url(#g3c)"/><g clip-path="url(#c3c)" fill="#3d5a73"><circle cx="11" cy="8.4" r="3.7"/><path d="M3.2 21.5c.9-4.8 4-7.4 7.8-7.4s6.9 2.6 7.8 7.4z"/></g><circle cx="18" cy="17.8" r="3.9" fill="#1b1e21" stroke="#e8e2d4" stroke-width=".6"/><path d="M18 15.8v4M16 17.8h4" stroke="#f0b35a" stroke-width="1.1" stroke-linecap="round"/></svg>';
  if (name === 'video') return `<svg class="ic3" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="g3v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9c0c6"/></linearGradient></defs><rect x="1" y="5.5" width="14.5" height="13" rx="2.2" fill="url(#g3v)"/><path d="M6.4 8.6v6.8l5.6-3.4z" fill="#2f3b44"/><path d="M16.6 10.1 22.4 6.4v11.2l-5.8-3.7z" fill="url(#g3v)"/><path d="M18.2 9.4v5.2M19.6 8.5v7M21 7.6v8.8" stroke="#8d979f" stroke-width=".45"/></svg>`;
  const body = ICS[name] || ICS.video;
  return `<svg class="ic3" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9c0c6"/></linearGradient></defs><g fill="url(#g3)">${body}</g></svg>`;
}

/* ---------- לוח הפרמטרים (עמ' 16) ---------- */
const PSPEC = {
  m_video: { l: 'p_recmode', m: 'p_aspect', r: 'p_eisfov', w: ['p_res', 'p_fps'] },
  m_portrait: { m: 'p_aspect', r: 'p_eisfov', w: ['p_res', 'p_fps'] },
  m_night: { r: 'p_neisfov', w: ['p_nres', 'p_nfps'] }, // אריח הקלטה מוקדמת/במעגל מופיע במדריך אקשן 6 רק במצב וידאו
  m_photo: { l: 'p_countdown', m: 'p_live', r: 'p_pfov', w: ['p_photosize', 'p_burst', 'p_format'] },
  m_slow: { m: 'p_slowaspect', w: ['p_slowres', 'p_slowrate'] },
  m_hyper: { r: 'p_tlfps', w: ['p_speed', 'p_tlres'] },
  m_tl: { m: 'p_tlaspect', r: 'p_tlfps', w: ['p_interval', 'p_duration', 'p_tlres'] },
  m_track: { m: 'p_traspect', w: ['p_trres', 'p_trfps'] },
};
function tileContent(id) {
  if (id === 'p_recmode') {
    const pr = val('p_prerec'), lo = val('p_loop');
    return pr !== 'Off' ? `<span class="num">PRE ${esc(pr)}</span>` : lo !== 'Off' ? `<span class="num">LOOP ${esc(lo)}</span>` : ic('video');
  }
  if (id === 'p_aspect') { const a = val('p_aspect'); return a === 'Custom' ? '<span class="num">1:1</span>' : a === 'Portrait' ? '<span class="num">9:16</span>' : a === 'Landscape' ? '<span class="num">16:9</span>' : ic('autorot'); }
  if (id === 'p_eisfov') return `<span class="num">${EIS_SHORT[val('p_eis')]}</span><i class="sep"></i><span class="num">${FOV_TILE[val('p_fov')]}</span>`;
  if (id === 'p_neisfov') return `<span class="num">${EIS_SHORT[val('p_neis')]}</span><i class="sep"></i><span class="num">${FOV_TILE[val('p_nfov')]}</span>`;
  if (id === 'p_live') return `<span class="num">LIVE</span><i class="sep"></i><span class="num">${esc(val('p_live').toUpperCase())}</span>`;
  if (id === 'p_countdown') return `${ic('timer')}<span class="num">${esc(val('p_countdown'))}</span>`;
  if (id === 'p_pfov') return `<span class="num">${FOV_TILE[val('p_pfov')]}</span>`;
  return `<span class="num">${esc(val(id))}</span>`;
}
function wheelOpts(id) {
  if (id === 'p_res') return resList().map(v => [v, optHe('p_res', v)]);
  if (id === 'p_fps') return fpsList().map(v => [v, v]);
  const d = disabled(id); return (N[id].o || []).filter(o => !d.includes(o[0]));
}
function wheel(id) {
  const opts = wheelOpts(id), cur = val(id);
  const isFps = /fps$/.test(id);
  return `<div class="wsec">${isFps ? (S.captions ? `<div class="wlab caponly">${cap(N[id].he)}</div>` : '') : `<div class="wlab">${lbl(id)}</div>`}
    <div class="wheel" data-wheel="${id}"><div class="wtrack">${opts.map(o => `<button class="wv ${o[0] === cur ? 'on' : ''}" data-set="${id}" data-v="${esc(o[0])}"><span class="num">${esc(o[0].replace(/ \(.*\)/, ''))}</span></button>`).join('')}</div></div>${isFps && /^\d/.test(cur) ? '<div class="wunit num">fps</div>' : ''}</div>`;
}
function scrParams() {
  const sp = PSPEC[S.mode] || { w: [] };
  const t = k => k && N[k] ? `<button class="ptile" data-tileopt="${k}" data-sel="${k}">${tileContent(k)}${cap(N[k].he, 'below')}</button>` : '<span class="ptile empty"></span>';
  const fpsNow = parseInt(val(isVid() ? 'p_fps' : 'p_nfps')) || 30, recFps = fpsNow <= 25 ? 25 : fpsNow <= 60 ? 50 : 100;
  const note = (isVid() || S.mode === 'm_night') && fpsNow % 25 !== 0 ? `<div class="pnote"><span class="num">50Hz Anti-flicker Recommended:</span><span class="num">${recFps}</span>${S.captions ? '<b>מומלץ בישראל</b>' : ''}<button class="pinfo" data-act="pinfo">${ic('info')}</button></div>` : '';
  return `<div class="params"><div class="handle top"></div>
    <div class="ptiles">${t(sp.l)}${t(sp.m)}${t(sp.r)}</div>
    <div class="pbody">${sp.w.map(wheel).join('<div class="wdiv"></div>')}</div>${note}</div>`;
}
function centerWheels() {
  document.querySelectorAll('#ui .wheel').forEach(w => {
    const tr = w.firstElementChild, s = tr.querySelector('.on') || tr.firstElementChild; if (!s) return;
    const x = w.clientWidth / 2 - (s.offsetLeft + s.offsetWidth / 2);
    tr.style.transform = `translateX(${x}px)`;
  });
}
function stepWheel(id, dir) {
  const o = wheelOpts(id).map(x => x[0]); const i = o.indexOf(val(id));
  const j = Math.max(0, Math.min(o.length - 1, i + dir)); if (j !== i) setVal(id, o[j]);
}


/* ---------- בוררי ערך (צילומי מסך אמיתיים s36/s39/s45/s46/s47/s48) ---------- */
const dispV = (id, v) => String(v).replace('-bit', 'bit').replace('Standard (Dewarp)', 'Standard (Dewarp)');
const APL = { ap_auto: 'Auto', ap_large: 'Large Aperture (f/2.0)', ap_fixed: 'Fixed (f/2.8)', ap_star: 'Starburst (f/4.0)' };
const APD = { ap_auto: 'Variable aperture that automatically adjusts to shooting conditions.\nMaximizes aperture in low light', ap_fixed: 'Fixed f/2.8 aperture, like classic action cameras. Minimum focus distance is 35 cm', ap_star: 'Fixed aperture f/4.0 with minimum focus distance of 20 cm to capture six-point starburst effect', ap_large: 'Fixed f/2.0 aperture for maximum light' };
const PICK = {
  eisfov: () => ({ sel: 'p_eisfov', handle: 1, L: { id: 'p_eis' }, R: { id: 'p_fov', rev: 1 }, desc: val('p_fov') === 'Standard (Dewarp)' ? 'Equivalent focal length (15 mm)' : '' }),
  neisfov: () => ({ sel: 'p_neisfov', handle: 1, L: { id: 'p_neis' }, R: { id: 'p_nfov', rev: 1 } }),
  aperture: () => ({ sel: 'ia_aperture', handle: 1, title: 'Variable Aperture', he: 'צמצם משתנה',
    L: { list: apertureAvail(S.mode).map(k => [k, APL[k], N[k] ? N[k].he : '']), cur: S.vals.aperture, key: 'aperture' },
    R: S.vals.aperture === 'ap_auto' ? { id: 'ap_auto', fmt: v => v.replace(/\.0/g, '').replace('–', '-') } : null, desc: APD[S.vals.aperture] }),
  color: () => ({ sel: 'ia_color', topL: 'Color', topR: 'Color Recovery', L: { id: 'ia_color' }, R: { id: 'ia_recovery', list: [['Off', 'Off', 'כבוי'], ['On', 'On', 'פועל']] }, check: 1 }),
  imgadj: () => ({ sel: 'ia_texture', topL: 'Texture', topR: 'Noise Reduction', L: { id: 'ia_texture', rev: 1 }, R: { id: 'ia_nr', rev: 1 }, reset: 1, check: 1 }),
  wb: () => ({ sel: 'ia_wb', L: { id: 'ia_wb', skip: 'Auto', fmt: v => v, dim: val('ia_wb') === 'Auto' }, box: { id: 'ia_wb', label: 'M', text: 'AWB', on: val('ia_wb') === 'Auto', set: 'Auto' }, check: 1 }),
  exposure: () => ({ sel: 'ia_exp', topL: `S ${val('ia_shutter') === 'Auto' ? '1/' + (parseInt(val('p_fps')) || 30) : val('ia_shutter')}`, topLc: 'sel', topR: !S.pro ? '' : `${val('ia_exp') === 'M' ? val('ia_iso') : String(S.vals.iso_rng || '100~12800').split('~')[1]} ISO`, topRbadge: val('ia_exp') !== 'M' ? 'A' : '',
    L: { id: 'ia_ev', fmt: v => (v === '0' ? '+0.0' : v.length === 2 ? v + '.0' : v) + 'EV' },
    R: !S.pro ? null : val('ia_exp') === 'M' ? { id: 'ia_iso', skip: 'Auto' } : { id: 'iso_rng', list: ['100~1600', '100~3200', '100~6400', '100~12800'].map(v => [v, v, 'טווח ISO אוטומטי']), cur: S.vals.iso_rng || '100~12800', key: 'iso_rng' }, box: !S.pro ? null : { id: 'ia_exp', label: 'M', text: val('ia_exp') === 'M' ? 'M' : 'Auto', on: val('ia_exp') !== 'M', set: val('ia_exp') === 'M' ? 'Auto' : 'M' }, check: 1 }),
};
function vwheel(side, w) {
  let list = w.list || (N[w.id].o || []).filter(o => !disabled(w.id).includes(o[0])).map(o => [o[0], o[0], o[1]]);
  if (w.skip) list = list.filter(o => o[0] !== w.skip);
  if (w.rev) list = [...list].reverse();
  const cur = w.cur ?? val(w.id), i = Math.max(0, list.findIndex(o => o[0] === cur));
  const f = w.fmt || (v => dispV(w.id, v));
  const rows = [-2, -1, 0, 1, 2].map(d => { const o = list[i + d]; if (!o || (w.dim && d !== 0)) return '<span class="vv empty"></span>';
    return `<button class="vv d${Math.abs(d)} ${d === 0 && !w.dim ? 'on' : ''}" data-pk="${w.key || w.id}" data-v="${esc(o[0])}"><span class="num">${esc(f(o[1]))}</span>${d === 0 && S.captions && o[2] && o[2] !== o[1] ? `<i class="vcap">${esc(bd(o[2]))}</i>` : ''}</button>`; }).join('');
  return `<div class="vwheel ${side}" data-vw="${w.key || w.id}">${rows}</div>`;
}
function scrPick(key) {
  const P = PICK[key](), grid = ['Grid', 'Grid & Diagonals'].includes(val('s_grid'));
  return `<div class="pick">${grid ? '<div class="gridov"></div>' : ''}
    ${P.handle ? '<div class="handle top"></div>' : ''}
    ${P.handle ? `<button class="pk-back" data-back="1" aria-label="חזרה">${ic('back')}</button>` : ''}
    ${P.title ? `<div class="pk-title">${lb2(P.title, P.he || '')}</div>` : ''}
    ${P.topL ? `<div class="pk-tl num ${P.topLc || ''}">${esc(P.topL)}</div>` : ''}
    ${P.topR ? `<div class="pk-tr num ${P.box || P.reset ? 'withbox' : ''}">${esc(P.topR)}${P.topRbadge ? `<span class="pk-a">${P.topRbadge}</span>` : ''}</div>` : ''}
    ${vwheel('L', P.L)}${P.R ? vwheel('R', P.R) : ''}
    ${P.box ? `<div class="pk-box"><span class="pk-m num">${P.box.label}</span><button class="pk-mode ${P.box.on ? 'on' : ''}" data-pk="${P.box.id}" data-v="${esc(P.box.set)}"><span class="num">${esc(P.box.text)}</span></button></div>` : ''}
    ${P.reset ? `<button class="pk-reset" data-pkreset="${key}" aria-label="איפוס">${ic('reset')}</button>` : ''}
    ${P.check ? `<button class="pk-ok" data-back="1" aria-label="אישור">${ic('check')}</button>` : ''}
    ${P.desc ? `<div class="pk-desc">${esc(P.desc)}</div>` : ''}</div>`;
}

/* ---------- לוח תמונה ושמע (צילומים s50, s38) ---------- */
const IA_TILES = {
  img: () => S.pro ? ['ia_exp', 'ia_wb', 'ia_color', 'ia_aperture', 'ia_scenario', 'ia_imgadj', 'ia_film', 'ia_quality'] : ['ia_ev', 'ia_aperture', 'ia_color', 'ia_film', 'ia_scenario', 'ia_quality'],
  aud: () => ['ia_channel', 'ia_wind'],
};
const IA_LABEL = { ia_exp: ['Exposure', 'חשיפה'], ia_imgadj: ['Image Adjustment', 'התאמות תמונה'], ia_wind: ['Wind Noise Reduction', 'הפחתת רעשי רוח'], ia_scenario: ['Stabilization Scenario', 'תרחיש ייצוב'] };
function iaValue(k) {
  if (k === 'ia_aperture') return S.vals.aperture === 'ap_auto' ? String(val('ap_auto')).replace(/\.0/g, '').replace('–', '-') : APL[S.vals.aperture].replace(/.*\((.*)\)/, '$1');
  if (k === 'ia_wb') return val('ia_wb') === 'Auto' ? 'AWB' : val('ia_wb');
  if (k === 'ia_color') { const c = dispV(k, val(k)); return c.includes('10bit') ? esc(c.replace(' 10bit', '')) + '<span class="b10">10bit</span>' : esc(c); }
  if (k === 'ia_imgadj') return '';
  if (N[k] && N[k].type === 'toggle') return val(k) === 'On' ? 'On' : 'Off';
  return esc(val(k) ?? '');
}
function scrImg() {
  const tab = S.iaTab || 'img', tiles = IA_TILES[tab]().filter(k => N[k] || IA_LABEL[k]);
  const t = k => { const [en, he] = IA_LABEL[k] || [N[k].en, N[k].he], off = k === 'ia_quality' && (resOf() === '8K' || dlogOn());
    return `<button class="iat" ${off ? 'disabled' : ''} data-ia="${k}" data-sel="${N[k] ? k : 'imgaudio'}"><span class="iat-l">${lb2(en, he)}</span><span class="iat-v num">${iaValue(k)}</span></button>`; };
  return `<div class="imgp">
    <div class="imgp-top"><button class="iat-tab ${tab === 'img' ? 'on' : ''}" data-iatab="img" aria-label="תמונה">${ic('aperture')}</button><button class="iat-tab ${tab === 'aud' ? 'on' : ''}" data-iatab="aud" aria-label="שמע">${ic('mic')}</button>
      <button class="pro-b ${S.pro ? 'on' : ''}" data-row="ia_pro" data-sel="ia_pro"><span class="num">PRO</span></button></div>
    <div class="imgp-bar"></div>
    <div class="imgp-grid lbody">${tiles.map(t).join('')}</div></div>`;
}
/* ---------- שמירת ההגדרות כמצב מותאם (צילום s43) ---------- */
function scrSaveCur() {
  return `<div class="list"><div class="lhead"><button class="bk" data-back="1" aria-label="חזרה">${ic('back')}</button>${lb2('Save Current Settings', 'שמירת ההגדרות הנוכחיות')}<button class="bk" data-act="cu_del" aria-label="מחיקה">${ic('trashO')}</button></div>
    <div class="savecur"><button class="sc-i" data-act="cu_new" data-sel="cu_save">${ic3d('video')}<span class="mbadge num">${(S.customCount || 0) + 1}</span></button>
    <button class="sc-i" data-act="cu_new" data-sel="cu_save">${ic3d('custom')}</button><div class="sc-cap">${lb2('Custom', 'מצב מותאם')}</div></div></div>`;
}

/* ---------- מרכז הבקרה (עמ' 18) ואחסון (עמ' 20) ---------- */
const CC_TILES = ['cc_custom', 'cc_qs', 'cc_gesture', 'cc_settings', 'cc_orient', 'cc_lock', 'cc_voice', 'cc_front'];
function scrCC() {
  if (S.ccPage === 1) {
    const d = new Date(), p2 = n => String(n).padStart(2, '0');
    const card = (k, en, _u, total, of) => { const used = S.used[k] || 0; return `<button class="scard ${val('st_loc') === k ? 'on' : ''}" data-stor="${k}" data-sel="st_loc"><span class="shead num">${en}</span>
      <span class="ring" style="--p:${used / total}"><span class="num big">${used.toFixed(1)}GB</span><span class="num small">${of}</span></span>${cap(k === 'microSD Card' ? 'כרטיס זיכרון' : 'זיכרון פנימי', 'below')}</button>`; };
    return `<div class="cc stor"><div class="dots"><i></i><i class="on"></i></div>
      <div class="sdate num">${d.getFullYear()}.${p2(d.getMonth() + 1)}.${p2(d.getDate())}<span class="sp"></span>${p2(d.getHours())}:${p2(d.getMinutes())}</div>
      <div class="scards">${card('Internal Storage', 'Internal', 31.0, 50, '50.0GB')}${card('microSD Card', 'SD Card', 119.0, 238.3, '238.3GB')}
      <button class="scard fmt" data-go="storage" data-sel="storage"><span class="num">Format</span>${cap('פרמוט', 'below')}</button></div>
      <div class="handle bot"></div></div>`;
  }
  const tiles = CC_TILES.filter(id => N[id]).map(id => {
    const n = N[id], on = n.type === 'toggle' && val(id) === 'On';
    return `<div class="ccell"><button class="tile ${on ? 'on' : ''}" data-tile="${id}" data-sel="${id}" aria-label="${esc(n.en)}">${ic(n.icon)}</button>${S.captions ? lbl(id, 'tlab') : ''}</div>`;
  }).join('');
  return `<div class="cc"><div class="dots"><i class="on"></i><i></i></div><div class="tiles">${tiles}</div><div class="handle bot"></div></div>`;
}

/* ---------- רשימות ---------- */
function rowValue(id) {
  const n = N[id];
  if (n.type === 'toggle') return `<span class="sw ${val(id) === 'On' ? 'on' : ''}"><i></i></span>`;
  if (n.o && !n.kids.length) return `<span class="rv"><span dir="ltr">${esc(val(id))}</span>${S.captions ? `<small dir="auto">${esc(bd(optHe(id, val(id))))}</small>` : ''}</span>${ic('chevron', 'chev')}`;
  if (n.val) return `<span class="rv"><span dir="ltr">${esc(n.val)}</span></span>`;
  if (n.kids.length || n.type === 'page') return ic('chevron', 'chev');
  return '';
}
const PAGE_TITLE = { cc_qs: ['Quick Switch Button Settings', 'הגדרות לחצן ההחלפה המהירה'], cc_settings: ['Settings', 'הגדרות'] };
const NO_ICONS = ['cc_qs'];
function head(id) { const t = PAGE_TITLE[id]; return `<div class="lhead"><button class="bk" data-back="1" aria-label="חזרה">${ic('back')}</button>${t ? lb2(t[0], t[1]) : lbl(id)}<button class="bk" data-home="1" aria-label="סגירה">${ic('close')}</button></div>`; }
function scrList(id) {
  let kids = (N[id].kids || []).filter(k => N[k]);
  if (id === 'imgaudio') kids = kids.filter(k => S.pro || !N[k].pro || k === 'ia_pro');
  if (id === 'ia_aperture') { const av = apertureAvail(S.mode); kids = kids.filter(k => av.includes(k)); }
  const rows = kids.map(k => {
    const kn = N[k], isAp = k.startsWith('ap_'), on = isAp && S.vals.aperture === k;
    const off = k === 'ia_quality' && (resOf() === '8K' || dlogOn());
    return `<button class="row ${kn.danger ? 'danger' : ''} ${on ? 'on' : ''}" ${off ? 'disabled' : ''} data-row="${k}" data-sel="${k}">${NO_ICONS.includes(id) ? '' : ic(kn.icon)}${lbl(k)}${isAp ? (on ? '<span class="chk">' + ic('check') + '</span>' : '') : rowValue(k)}</button>`;
  }).join('');
  return `<div class="list">${head(id)}<div class="lbody">${rows}</div></div>`;
}
function scrOpts(id) {
  if (id === 's_snap' && S.customCount) {
    const sp = specsLine().split('/'), sub2 = `+${sp[0]}/${String(val('p_res')).split('/')[1] || '16:9'}`;
    const rows = Array.from({ length: S.customCount }, (_, i) => { const c = `Video ${i + 1}`;
      return `<button class="row ${c === val(id) ? 'on' : ''}" data-pick="${id}" data-v="${c}"><span class="cui">${ic('video')}<i class="cnum num">${i + 1}</i></span>${lb2(c + sub2, 'מצב מותאם ' + (i + 1))}${c === val(id) ? '<span class="chk">' + ic('check') + '</span>' : ''}</button>`; }).join('');
    return `<div class="list">${head(id)}<div class="lbody"><div class="lsec">${lb2('Custom Modes', 'מצבים מותאמים')}</div>${rows}</div></div>`;
  }
  const dis = disabled(id);
  const rows = N[id].o.map(o => `<button class="row ${o[0] === val(id) ? 'on' : ''}" ${dis.includes(o[0]) ? 'disabled' : ''} data-pick="${id}" data-v="${esc(o[0])}">${lb2(o[0], bd(o[1]))}${o[0] === val(id) ? '<span class="chk">' + ic('check') + '</span>' : ''}</button>`).join('');
  return `<div class="list">${head(id)}<div class="lbody">${rows}</div></div>`;
}

/* ---------- גלריה ---------- */
const fmtT = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.floor(s % 60)).padStart(2, '0');
function scrPlayback() {
  const c = S.clip || {}, pos = S.pbPos ?? 18, dur = c.dur || 0;
  return `<div class="pb">
    <button class="ov pbback" data-back="1" data-sel="playback">${ic('back')}${cap('חזרה', 'below')}</button>
    <div class="pbtop"><button class="ov" data-act="pb_vol" data-sel="pb_vol">${ic('speaker')}${cap('עוצמה', 'below')}</button><button class="ov" data-act="pb_share" data-sel="pb_share">${ic('share')}${cap('שיתוף', 'below')}</button><button class="ov" data-act="pb_del" data-sel="pb_del">${ic('trash')}${cap('מחיקה', 'below r')}</button></div>
    ${S.fast ? '<div class="ov badge tcb num">2x ▶▶</div>' : ''}
    <div class="pbbot"><button class="ov" data-act="pb_hl" data-sel="pb_hl">${ic('star')}${cap('רגע שיא', 'above l')}</button><div class="scrub"><i style="width:${pos}%"></i>${(S.marks || []).map(x => `<b style="left:${x}%"></b>`).join('')}${(c.slow || []).map(x => `<b class="slw" style="left:${x}%"></b>`).join('')}</div><span class="num">${c.photo ? '' : `${fmtT(pos / 100 * dur)} / ${fmtT(dur)}`}</span><button class="ov" data-act="pb_slow" data-sel="pb_slow">${ic('snail')}${cap('הילוך איטי במיוחד', 'above r')}</button></div></div>`;
}

/* ---------- חלון אישור (פרמוט, איפוס, מחיקה) ---------- */
function confirmBox(en, he, okEn, okHe, fn) { S.modal = { en, he, okEn, okHe, fn }; render(); }
function scrModal() {
  const m = S.modal;
  return `<div class="modal"><div class="mbox"><p>${lb2(m.en, m.he)}</p><div class="mbtns"><button class="mb" data-modal="0">${lb2('Cancel', 'ביטול')}</button><button class="mb ok" data-modal="1">${lb2(m.okEn, m.okHe)}</button></div></div></div>`;
}

function render() {
  const sc = $('#screen'), ui = $('#ui');
  const lbx = !!(S.front && val('cc_front') !== 'On' && S.screen === 'live');
  const ar = S.mode === 'm_photo' ? (/^38MP|^4:3/.test(String(val('p_photosize'))) ? '43' : '169') : isVid() ? (val('p_aspect') === 'Custom' ? '11' : String(val('p_res')).split('/')[1] === '4:3' ? '43' : '169') : '169';
  sc.classList.toggle('lb16', lbx && ar === '169'); sc.classList.toggle('lb43', lbx && ar === '43');
  sc.classList.toggle('orig', !S.captions);
  if (S.on && S.boot) { ui.innerHTML = '<div class="boot">OSMO</div>'; renderCrumb(); return; }
  if (!S.on) { ui.innerHTML = `<div class="off">${lb2('Press and hold QS to power on', 'המצלמה כבויה · לחיצה ארוכה על QS מדליקה')}</div>`; renderCrumb(); return; }
  normalize();
  let h = ''; const s = S.screen;
  if (s === 'live') h = scrLive();
  else if (s === 'modes') h = scrModes();
  else if (s === 'params') h = scrParams();
  else if (s === 'cc') h = scrCC();
  else if (s === 'playback') h = scrPlayback();
  else if (s === 'qspage') h = scrQS();
  else if (s === 'aperture') h = scrPick('aperture');
  else if (s === 'pick') h = scrPick(S.arg);
  else if (s === 'imgaudio') h = scrImg();
  else if (s === 'savecur') h = scrSaveCur();
  else if (s === 'opts') h = scrOpts(S.arg);
  else if (N[s]) h = scrList(s);
  if (S.dark) h = `<div class="off">${lb2('Screen Off', 'המסך כבוי · נגיעה או QS מדליקים')}</div>` + (S.rec ? `<div class="ov tc rec"><span class="dot"></span><span class="num">${recTime()}</span></div>` : '');
  if (S.modal) h += scrModal();
  if (S.vals.cc_lock === 'On' && s === 'live' && !S.dark) h += `<div class="lockov">${ic('lock')}${lb2('Swipe up to unlock', 'המסך נעול · החלקה למעלה לשחרור')}</div>`;
  if (S.scrLock && !S.dark) h += `<div class="lockov">${ic('lock')}${lb2('Swipe up to switch to this screen', 'החלקה למעלה מעבירה למסך הזה')}</div>`;
  ui.innerHTML = h;
  sc.dataset.s = s;
  if (s === 'params') centerWheels();
  if (REDUCE && typeof Feed !== 'undefined' && Feed.once) Feed.once();
  renderCrumb();
}
const SCR_NAME = { pick: 'בורר ערך', savecur: 'שמירת ההגדרות הנוכחיות', qspage: 'דף ההחלפה המהירה', live: 'מסך הצילום', modes: 'בורר מצבי הצילום', params: 'לוח הפרמטרים', cc: 'מרכז הבקרה', playback: 'גלריה', aperture: 'צמצם משתנה', opts: 'בחירת אפשרות' };
function renderCrumb() {
  const s = S.screen;
  $('#crumb').textContent = !S.on ? 'המצלמה כבויה' : (SCR_NAME[s] || (N[s] ? N[s].he : s)) + (s === 'opts' && N[S.arg] ? ': ' + N[S.arg].he : '') + (s === 'cc' && S.ccPage ? ' · אחסון' : '');
}

/* ---------- פאנל הסבר ---------- */
function renderInfo() {
  const n = N[S.sel]; if (!n) return;
  const c = CONF[n.conf] || CONF.h, how = howTo(n.id);
  const opts = n.o ? `<div class="iopts"><h4>אפשרויות</h4><ul>${n.o.map(o => `<li class="${S.vals[n.id] === o[0] ? 'cur' : ''}"><span dir="ltr">${esc(o[0])}</span><b dir="auto">${esc(bd(o[1]))}</b></li>`).join('')}</ul></div>` : '';
  const kids = n.kids && n.kids.length ? `<div class="iopts"><h4>בתוך התפריט</h4><ul>${n.kids.filter(k => N[k]).map(k => `<li><button data-jump="${k}" data-ctx="${n.id}"><span dir="ltr">${esc(N[k].en)}</span><b>${esc(N[k].he)}</b></button></li>`).join('')}</ul></div>` : '';
  $('#info').innerHTML = `<div class="ihead"><span class="iic">${ic(n.icon)}</span><div><small dir="ltr">${esc(n.en)}</small><h3>${esc(n.he)}</h3></div></div>
    ${n.d ? `<p>${esc(bd(n.d))}</p>` : ''}${how ? `<p class="how"><span>איך מגיעים</span>${esc(how)}</p>` : ''}
    ${n.def !== undefined ? `<p class="def"><span>ברירת מחדל</span><bdi dir="ltr">${esc(n.def)}</bdi>${n.o && optHe(n.id, n.def) !== n.def ? ' · ' + esc(bd(optHe(n.id, n.def))) : ''}</p>` : ''}${opts}${kids}
    <p class="conf ${c[1]}">מקור: ${c[0]}</p>`;
}

/* ---------- הקשות ---------- */
function setVal(id, v) {
  S.vals[id] = v; select(id);
  if (id === 'ia_pro') S.pro = v === 'On';
  if (id === 'p_prerec' && v !== 'Off') S.vals.p_loop = 'Off';
  if (id === 'p_loop' && v !== 'Off') S.vals.p_prerec = 'Off';
  if (id === 'p_prerec' && v !== 'Off') S.lastPre = v;
  if (id === 'p_live' && v === 'On') S.vals.p_burst = 'Off';
  if (id === 'p_burst' && v !== 'Off') S.vals.p_live = 'Off';
  if (id === 's_lang' && v !== 'English') toast('במצלמה האמיתית הממשק יוחלף לשפה זו', 'Language');
  render();
}
const DANGER = {
  st_fmt_int: ['Format internal storage? All data will be erased.', 'לפרמט את הזיכרון הפנימי? כל הקבצים יימחקו.', 'Format', 'פרמוט'],
  st_fmt_sd: ['Format SD card? All data will be erased.', 'לפרמט את כרטיס הזיכרון? כל הקבצים יימחקו.', 'Format', 'פרמוט'],
  s_reset: ['Restore factory settings?', 'לאפס להגדרות היצרן?', 'Reset', 'איפוס'],
  wf_reset: ['Reset all wireless connections?', 'לאפס את כל החיבורים האלחוטיים?', 'Reset', 'איפוס'],
  pb_del: ['Delete this file?', 'למחוק את הקובץ?', 'Delete', 'מחיקה'],
  tc_reset: ['Reset timecode?', 'לאפס את קוד הזמן?', 'Reset', 'איפוס'],
};
function doAction(k) {
  const n = N[k]; if (!n && !DANGER[k]) return;
  if (DANGER[k]) {
    const [en, he, oe, oh] = DANGER[k];
    return confirmBox(en, he, oe, oh, () => {
      if (k === 'st_fmt_int' || k === 'st_fmt_sd') { S.used[k === 'st_fmt_int' ? 'Internal Storage' : 'microSD Card'] = 0; S.marks = []; S.clip = null; render(); }
      toast(k === 'pb_del' ? 'הקובץ נמחק (הדמיה בלבד)' : 'בוצע (הדמיה בלבד)', 'Done');
    });
  }
  if (k === 'mic_tx1' || k === 'mic_tx2' || k === 's_buds') return toast('מחפשת מכשירים לצימוד…', 'Searching…');
  if (k === 'cu_save') return go('savecur');
  if (k.startsWith('cu_c')) { home(); return toast('הופעל מצב ' + n.en, n.en); }
  if (k === 's_horizon') return toast('מכיילת את האופק… הניחו את המצלמה על משטח ישר', 'Calibrating…');
  if (k === 'in_logs') return toast('היומנים נשמרו לכרטיס הזיכרון', 'Logs exported');
  if (k === 's_usb') return toast('מצב USB הופעל. חברו את הכבל מחדש', 'USB Mode');
  toast(n.he, n.en);
}
function poke() { if (snapOff) { clearTimeout(snapOff); snapOff = null; } }
function onTap(e) {
  poke();
  if (S.dark) { S.dark = false; return render(); }
  if (S.scrLock) return;
  const sb = e.target.closest('.scrub');
  if (sb && !swiping && S.screen === 'playback') { const r = sb.getBoundingClientRect(); S.pbPos = Math.max(0, Math.min(100, Math.round((e.clientX - r.left) / r.width * 100))); return render(); }
  const b = e.target.closest('button'); if (!b || swiping || b.disabled) return;
  const d = b.dataset;
  if (d.modal !== undefined) {
    if (d.modal === '0' && S.modal && S.modal.en.startsWith('Generating') && S.clip && S.clip.slow) S.clip.slow.pop();
    const fn = S.modal && S.modal.fn; S.modal = null; render(); if (d.modal === '1' && fn) fn(); return;
  }
  if (d.sel) select(d.sel);
  if (d.back) return back();
  if (d.go) {
    clearTimeout(qsBack);
    if (S.vals.cc_lock === 'On' && S.screen === 'live') return;
    if (S.rec && S.screen === 'live') return toast('לא זמין בזמן הקלטה', 'Unavailable while recording');
    if (d.go === 'modes') S.modePick = curPick();
    return go(d.go);
  }
  if (d.zoom) { const o = N.lv_zoom.o.map(x => x[0]); S.vals.lv_zoom = o[(o.indexOf(val('lv_zoom')) + 1) % o.length]; return render(); }
  if (d.mode) {
    if (d.mode === S.modePick) { commitMode(d.mode); S.modePick = null; select(S.mode); return home(); }
    S.modePick = d.mode; select(selOf(d.mode)); return render();
  }
  if (d.set) return setVal(d.set, d.v);
  if (d.home) return home();
  if (d.pk) { if (d.pk === 'aperture') { S.vals.aperture = d.v; select(d.v); return render(); } if (d.pk === 'iso_rng') { S.vals.iso_rng = d.v; select('ia_iso'); return render(); } return setVal(d.pk, d.v); }
  if (d.pkreset) { S.vals.ia_texture = '0'; S.vals.ia_nr = '0'; toast('התאמות התמונה אופסו', 'Reset'); return render(); }
  if (d.iatab) { S.iaTab = d.iatab; return render(); }
  if (d.ia) {
    const k = d.ia, map = { ia_exp: 'exposure', ia_wb: 'wb', ia_color: 'color', ia_aperture: 'aperture', ia_imgadj: 'imgadj', ia_ev: 'exposure' };
    if (map[k]) return go('pick', map[k]);
    if (N[k] && N[k].type === 'toggle') return setVal(k, val(k) === 'On' ? 'Off' : 'On');
    if (N[k] && N[k].o) return go('opts', k);
    return;
  }
  if (d.tileopt === 'p_eisfov' || d.tileopt === 'p_neisfov') { select(d.tileopt); return go('pick', d.tileopt === 'p_eisfov' ? 'eisfov' : 'neisfov'); }
  if (d.tileopt) { const n = N[d.tileopt]; if (!n) return; if ((n.kids || []).length) return go(d.tileopt); if (n.type === 'toggle') return setVal(d.tileopt, val(d.tileopt) === 'On' ? 'Off' : 'On'); return go('opts', d.tileopt); }
  if (d.stor) { setVal('st_loc', d.stor); return toast('הקבצים יישמרו ל' + (d.stor === 'microSD Card' ? 'כרטיס הזיכרון' : 'זיכרון הפנימי'), d.stor); }
  if (d.pick) { setVal(d.pick, d.v); return back(); }
  if (d.tile) {
    const n = N[d.tile]; if (!n) return;
    if (n.type === 'toggle') { setVal(d.tile, val(d.tile) === 'On' ? 'Off' : 'On'); toast(`${n.he}: ${val(d.tile) === 'On' ? 'פועל' : 'כבוי'}`, `${n.en}: ${val(d.tile) === 'On' ? 'On' : 'Off'}`); if (d.tile === 'cc_lock' && val('cc_lock') === 'On') home(); return; }
    return go(d.tile);
  }
  if (d.row) {
    const k = d.row, n = N[k]; if (!n) return;
    if (k.startsWith('ap_')) { S.vals.aperture = k; if (k === 'ap_auto') return go('opts', 'ap_auto'); toast(n.he, n.en); return render(); }
    if (n.type === 'toggle') return setVal(k, val(k) === 'On' ? 'Off' : 'On');
    if (n.kids.length) return go(k);
    if (n.o) return go('opts', k);
    if (n.type === 'action') return doAction(k);
    return toast(n.he, n.en);
  }
  if (d.act === 'cu_new') { S.customCount = Math.min(5, (S.customCount || 0) + 1); toast(`ההגדרות נשמרו כמצב מותאם Video ${S.customCount}`, `Saved as Video ${S.customCount}`); return back(); }
  if (d.act === 'cu_del') return confirmBox('Delete custom modes?', 'למחוק את המצבים המותאמים?', 'Delete', 'מחיקה', () => { S.customCount = 0; S.custom = 0; toast('המצבים המותאמים נמחקו', 'Deleted'); });
  if (d.act) {
    if (d.act === 'batt') return toast('סוללה 100% · עד 240 דקות (1080p/24fps, מסכים כבויים)', 'Battery 100%');
    if (d.act === 'pinfo') return toast('בישראל החשמל 50Hz: 25/50/100fps מונעים הבהובים מתאורה', 'Anti-flicker');
    if (d.act === 'pb_del') return doAction('pb_del');
    if (d.act === 'pb_hl') { const p = S.pbPos ?? 18; if (!(S.marks || []).includes(p)) S.marks = [...(S.marks || []), p]; render(); return toast('סומן רגע שיא', 'Highlight marked'); }
    if (d.act === 'pb_slow') {
      const c = S.clip || {}, p = S.pbPos ?? 18, t = p / 100 * (c.dur || 0);
      if (c.photo || c.mode !== 'm_video') return toast('הילוך איטי במיוחד זמין רק לסרטוני וידאו', 'Video footage only');
      if (c.ar !== '16:9' || !['4K', '2.7K', '1080p'].includes(c.res) || c.fps < 100) return toast('נדרש סרטון 4K/2.7K/1080p ביחס 16:9 ב-100fps ומעלה', 'Requires 16:9 ≥100fps');
      if (c.dur <= 3 || t < 1.5 || t > c.dur - 2) return toast('לא זמין ב-1.5 השניות הראשונות וב-2 האחרונות', 'Not available at this point');
      if (c.slow.length >= 6) return toast('אפשר עד 6 קטעים לסרטון', 'Max 6 clips per video');
      c.slow.push(p);
      return confirmBox('Generating super slow-motion (1080p)…', 'יוצרת הילוך איטי במיוחד (1080p)…', 'Preview', 'תצוגה מקדימה', () => toast('תצוגה מקדימה של ההילוך האיטי', 'Preview'));
    }
    const n = N[d.act]; return n ? toast(n.he, n.en) : undefined;
  }
  if (d.qs) { clearTimeout(qsBack); S.qsPick = d.qs; qsApply(d.qs); }
}

/* ---------- החלקות ---------- */
let sx, sy, swiping = false, swWheel = null, lpT;
function swipe(dir) {
  if (!S.on) return;
  poke();
  if (S.scrLock) { if (dir === 'up') { S.scrLock = false; return render(); } return; }
  const s = S.screen;
  if (S.modal) return;
  if (S.dark) { S.dark = false; return render(); }
  if (S.vals.cc_lock === 'On' && s === 'live') { if (dir !== 'up') return toast('החלקה למעלה משחררת', 'Swipe up to unlock'); S.vals.cc_lock = 'Off'; toast('המסך שוחרר', 'Screen unlocked'); return render(); }
  if (S.rec && s === 'live') return toast('לא זמין בזמן הקלטה', 'Unavailable while recording');
  if (dir === 'down') { if (s === 'live') { S.ccPage = 0; select('cc'); return go('cc'); } if (s === 'params') return home(); }
  if (dir === 'up') {
    if (s === 'live') { select(S.mode); return go('params'); }
    if (s === 'modes') { if (S.modePick) commitMode(S.modePick); S.modePick = null; select(S.mode); return home(); }
    if (s === 'cc') return home();
  }
  if (dir === 'left' || dir === 'right') {
    if (s === 'live') { S.modePick = curPick(); select('modes'); return go('modes'); }
    if (s === 'modes') { const WL = WM(), i = WL.indexOf(S.modePick); const j = Math.min(WL.length - 1, Math.max(0, i + (dir === 'left' ? 1 : -1))); S.modePick = WL[j]; select(selOf(WL[j])); return render(); }
    if (s === 'cc') { S.ccPage = dir === 'left' ? 1 : 0; if (S.ccPage) select('storage'); return render(); }
    if (s === 'playback' && dir === 'left') return home();
  }
}
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
    if (S.dark || S.scrLock || (S.vals.cc_lock === 'On' && s === 'live')) return (D.kind = 'tap');
    if (S.rec && s === 'live') return (D.kind = 'tap');
    if (s === 'live' && !h && dy > 0) { S.ccPage = 0; D.kind = 'open'; D.dir = 'down'; D.node = layer(scrCC()); tf(D.node, 0, -H()); return; }
    if (s === 'live' && !h && dy < 0) { D.kind = 'open'; D.dir = 'up'; D.node = layer(scrParams()); tf(D.node, 0, H()); return; }
    if (s === 'live' && h) { S.modePick = curPick(); D.kind = 'fade'; D.dir = dx < 0 ? 'left' : 'right'; D.node = layer(scrModes()); D.node.style.opacity = 0; return; }
    if (s === 'cc' && !h && dy < 0) { D.kind = 'close'; D.dir = 'up'; D.node = $('#ui'); return; }
    if (s === 'params' && !h && dy > 0) { D.kind = 'close'; D.dir = 'down'; D.node = $('#ui'); return; }
    if (s === 'modes' && h) { D.kind = 'modes'; D.node = $('#ui .mtrack'); return; }
    if (s === 'modes' && !h && dy < 0) { D.kind = 'close'; D.dir = 'up'; D.node = $('#ui'); return; }
    if (s === 'cc' && h) { D.kind = 'page'; D.node = $('#ui .cc'); return; }
    if (s === 'playback' && h && dx < 0) {
      const r = el.getBoundingClientRect();
      if (D.x - r.left > r.width * .85) { D.kind = 'close'; D.dir = 'left'; D.node = $('#ui'); return; }
      toast('הקובץ הבא (הדמיה)', 'Next file'); return (D.kind = 'none');
    }
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
    const n = D.node, k = D.kind, dir = D.dir, wid = D.id;
    const done = fn => setTimeout(() => { if (n && n.classList.contains('draglayer')) n.remove(); else if (n) { n.style.transform = ''; n.style.transition = ''; } fn && fn(); }, 200);
    if (k === 'wheel') { const step = Math.round(-dx / (W() * .16)); if (step) stepWheel(wid, step); else centerWheels(); return; }
    if (k === 'open') {
      const ok = dir === 'down' ? dy > H() * .28 : -dy > H() * .28;
      tf(n, 0, ok ? 0 : (dir === 'down' ? -H() : H()), true);
      return done(() => { if (ok) { if (dir === 'down') { select('cc'); go('cc'); } else { select(S.mode); go('params'); } } });
    }
    if (k === 'fade') {
      const ok = Math.abs(dx) > W() * .12; n.style.transition = 'opacity .2s'; n.style.opacity = ok ? 1 : 0;
      return done(() => { if (ok) { select('modes'); go('modes'); } });
    }
    if (k === 'close') {
      const dist = dir === 'left' ? -dx : dir === 'up' ? -dy : dy, size = dir === 'left' ? W() : H();
      const ok = dist > size * .25;
      tf(n, dir === 'left' ? (ok ? -W() : 0) : 0, dir === 'up' ? (ok ? -H() : 0) : dir === 'down' ? (ok ? H() : 0) : 0, true);
      return done(() => { if (ok) { if (S.screen === 'modes') { if (S.modePick) commitMode(S.modePick); S.modePick = null; select(S.mode); } home(); } });
    }
    if (k === 'modes') {
      const WL = WM(), step = Math.round(-dx / (W() * .26)), i = WL.indexOf(S.modePick), j = Math.max(0, Math.min(WL.length - 1, i + step));
      S.modePick = WL[j]; select(selOf(WL[j])); return render();
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
    poke();
    D ={ x: e.clientX, y: e.clientY, target: e.target, kind: null };
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
  el.addEventListener('pointercancel', e => { if (D && D.kind && D.kind !== 'tap') end(0, 0); D = null; swiping = false; clearTimeout(lpT); });
  el.addEventListener('dragstart', e => e.preventDefault());
}

/* ---------- לחצנים פיזיים ---------- */
let qsT, qsLong = false, qsBack, snapOff, qsTap = 0, qsSingle, diveT, diveHeld = false;
const QS_ITEMS = () => [
  ...(val('qs_screen') === 'On' ? ['screen'] : []),
  ...['m_video', 'm_photo', 'm_slow', 'm_tl', 'm_hyper', 'm_night', 'm_track'].filter(m => val('qs_m_' + m.slice(2)) === 'On'),
  ...(val('qs_m_custom') === 'On' ? ['custom'] : []),
  ...(val('qs_m_play') === 'On' ? ['play'] : []),
];
const QS_LABEL = { screen: ['Screen Switch', 'החלפת מסך'], custom: ['C1', 'מצב מותאם 1'], play: ['Playback', 'גלריה'] };
const qsLabel = k => N[k] ? [N[k].en, N[k].he] : QS_LABEL[k];
function recTime() { const t = S.rec ? Math.floor((Date.now() - S.recStart) / 1000) : 0; return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; }
function endClip() {
  const dur = Math.max(1, (Date.now() - S.recStart) / 1000);
  S.clip = { mode: S.mode, res: resOf(), ar: String(val('p_res')).split('/')[1], fps: parseInt(val('p_fps')) || 30, dur, slow: [] };
  S.marks = (S.recMarks || []).map(ms => Math.min(100, Math.round(ms / 1000 / dur * 100))); S.recMarks = [];
}
function flash() { const f = $('#flash'); if (!f) return; f.hidden = false; setTimeout(() => f.hidden = true, 140); }
function shutter() {
  select('btn_shutter'); clearTimeout(snapOff); snapOff = null;
  if (S.dive) { S.dive = false; return toast('יציאה ממצב צלילה', 'Shutter button restored'); }
  if (!S.on) {
    S.on = true; S.stack = []; S.screen = 'live'; S.snap = true;
    const sm = String(val('s_snap') || '');
    if (sm === 'Video') S.mode = 'm_video'; else if (sm === 'Photo') S.mode = 'm_photo'; else if (sm === 'Hyperlapse') S.mode = 'm_hyper';
    else if (sm.startsWith('C')) toast('SnapShot: מצב מותאם', 'SnapShot C1');
    if (S.mode === 'm_photo') { render(); flash(); S.clip = { photo: true }; S.snap = false; snapOff = setTimeout(() => { S.on = false; render(); }, 3000); return toast('SnapShot: צולמה תמונה, כיבוי בעוד 3 שניות', 'SnapShot'); }
    S.rec = true; S.recStart = Date.now(); S.recMarks = []; S.scrOffDone = false; toast('SnapShot: המצלמה נדלקה ומקליטה', 'SnapShot'); return render();
  }
  S.dark = false; S.modal = null;
  if (S.screen !== 'live') { S.stack = []; S.screen = 'live'; }
  if (S.mode === 'm_photo') {
    const cd = parseFloat(val('p_countdown')) || 0;
    const snapP = () => { flash(); S.clip = { photo: true }; toast(val('p_burst') && val('p_burst') !== 'Off' ? 'צילום רציף: 30 תמונות' : 'צולמה תמונה', 'Photo taken'); };
    if (cd) {
      if (S.cdT) { clearTimeout(S.cdT); S.cdT = null; S.cdLeft = 0; toast('הטיימר בוטל', 'Countdown cancelled'); return render(); }
      toast(`טיימר ${cd === 1 ? 'שנייה אחת' : cd === 0.5 ? 'חצי שנייה' : cd + ' שניות'}…`, 'Countdown');
      S.cdLeft = Math.ceil(cd);
      const tick = () => {
        if (!S.on || S.mode !== 'm_photo') { S.cdT = null; S.cdLeft = 0; return render(); }
        if (--S.cdLeft <= 0) { S.cdT = null; S.cdLeft = 0; snapP(); return render(); }
        render(); S.cdT = setTimeout(tick, 1000);
      };
      S.cdT = setTimeout(tick, cd < 1 ? cd * 1000 : 1000);
    } else snapP();
    return render();
  }
  if (S.rec) { endClip(); S.rec = false; } else { S.rec = true; S.recStart = Date.now(); S.recMarks = []; S.scrOffDone = false; }
  if (!S.rec && S.snap) {
    S.snap = false; toast('SnapShot: המצלמה תיכבה בעוד 3 שניות', 'Auto power off in 3s');
    snapOff = setTimeout(() => { snapOff = null; if (!S.rec) { S.on = false; render(); } }, 3000);
  }
  render();
}
function qsDown() {
  qsLong = false;
  qsT = setTimeout(() => {
    poke(); qsLong = true; if (S.rec) endClip();
    S.on = !S.on; S.rec = false; S.snap = false; S.dark = false; S.dive = false; S.scrLock = false;
    clearTimeout(S.cdT); S.cdT = null; S.cdLeft = 0;
    select('btn_qs');
    if (S.on) { S.boot = true; home(); setTimeout(() => { S.boot = false; render(); }, 1400); }
    else { home(); toast('המצלמה כובתה', 'Power off'); }
  }, 700);
}
function qsApply(k) {
  if (!k) return home();
  if (k === 'screen') { S.screen = 'live'; S.stack = []; flip(true); return; }
  if (k === 'play') { S.stack = [['live']]; S.screen = 'playback'; return render(); }
  if (k === 'custom') { home(); return toast('הופעל מצב מותאם C1', 'C1'); }
  S.mode = k; home();
}
function openQS() {
  const list = QS_ITEMS();
  if (!list.length) return toast('לא נבחרו מצבים להחלפה המהירה', 'No Quick Switch modes selected');
  S.qsPick = list.includes(S.mode) ? S.mode : null;
  S.stack = [['live']]; S.screen = 'qspage'; render();
  clearTimeout(qsBack); qsBack = setTimeout(() => { if (S.screen === 'qspage' && S.qsPick) qsApply(S.qsPick); }, 2500);
}
function qsUp() {
  clearTimeout(qsT); if (qsLong || !S.on) return; select('btn_qs'); poke();
  if (S.dark) { S.dark = false; return render(); }
  if (S.dive) { // מצב צלילה: לחיצה אחת מצלמת/מקליטה, לחיצה כפולה פותחת את דף ההחלפה המהירה
    if (qsTap && Date.now() - qsTap < 350) { clearTimeout(qsSingle); qsTap = 0; return openQS(); }
    qsTap = Date.now(); qsSingle = setTimeout(() => { qsTap = 0; const d = S.dive; S.dive = false; shutter(); S.dive = d; }, 350); return;
  }
  if (S.rec) {
    if (!['m_video', 'm_slow', 'm_portrait'].includes(S.mode)) return;
    (S.recMarks = S.recMarks || []).push(Date.now() - S.recStart); return toast('סומן רגע שיא', 'Highlight marked');
  }
  if (S.screen === 'qspage') {
    const list = QS_ITEMS(); if (!list.length) return home();
    S.qsPick = list[(list.indexOf(S.qsPick) + 1) % list.length];
    const [en] = qsLabel(S.qsPick);
    if (val('qs_prompt') === 'On') toast(`הכרזה קולית: "${en}"`, en);
    render(); clearTimeout(qsBack); qsBack = setTimeout(() => { if (S.screen === 'qspage' && S.qsPick) qsApply(S.qsPick); }, 2500); return;
  }
  if (S.screen !== 'live') return home();
  const f = val('qs_feature');
  if (f === 'Screen Off') { S.dark = true; return render(); }
  if (f === 'Zoom') {
    if (!zoomOk() || !N.lv_zoom) return toast('זום לא זמין במצב הזה', 'Zoom unavailable');
    const o = N.lv_zoom.o.map(x => x[0]); S.vals.lv_zoom = o[(o.indexOf(val('lv_zoom')) + 1) % o.length]; toast('זום ' + val('lv_zoom'), 'Zoom'); return render();
  }
  if (f === 'Lock Screen') { S.vals.cc_lock = 'On'; return render(); }
  if (f === 'Start/End Pre-Rec') {
    if (S.mode !== 'm_video') return toast('הקלטה מוקדמת זמינה רק במצב וידאו', 'Video mode only');
    if (val('p_prerec') !== 'Off') { S.lastPre = val('p_prerec'); S.vals.p_prerec = 'Off'; } else { S.vals.p_prerec = S.lastPre || '5s'; S.vals.p_loop = 'Off'; }
    toast('הקלטה מוקדמת: ' + (val('p_prerec') === 'Off' ? 'כבויה' : 'פועלת'), 'Pre-Rec'); return render();
  }
  openQS();
}
function scrQS() {
  const items = QS_ITEMS().map(k => { const [en, he] = qsLabel(k); return `<button class="qsi ${k === S.qsPick ? 'on' : ''}" data-qs="${k}">${ic(N[k] ? N[k].icon : k === 'screen' ? 'front' : k === 'play' ? 'play' : 'custom')}${lb2(en, he)}</button>`; }).join('');
  return `<div class="qsp"><div class="qshead">${lb2('Quick Switch', 'החלפה מהירה')}<button class="qsedit" data-go="cc_qs" data-sel="cc_qs" aria-label="עריכת ההחלפה המהירה"><span class="dots3">•••</span></button></div><div class="qslist">${items}</div>
  <div class="mhint">${lb2('Press QS to switch', 'לחיצה נוספת על QS עוברת לפריט הבא')}</div></div>`;
}

/* ---------- מפת התפריטים ---------- */
function treeItem(id, depth, seen, ctx) {
  const n = N[id]; if (!n) return '';
  const c = CONF[n.conf] || CONF.h;
  const opts = n.o ? `<div class="topts">${n.o.map(o => `<span><small dir="ltr">${esc(o[0])}</small><b dir="auto">${esc(bd(o[1]))}</b></span>`).join('')}</div>` : '';
  const kidsHtml = n.kids.length && !seen.has(id) ? `<div class="tkids">${n.kids.map(k => treeItem(k, depth + 1, new Set([...seen, id]), id)).join('')}</div>` : '';
  const txt = (n.en + ' ' + n.he + ' ' + (n.d || '') + ' ' + (n.o || []).flat().join(' ')).toLowerCase();
  return `<div class="titem" data-id="${id}" data-t="${esc(txt)}">
    <div class="trow"><span class="tic">${ic(n.icon)}</span><div class="tlb"><small dir="ltr">${esc(n.en)}</small><b>${esc(n.he)}</b></div>${n.conf !== 'h' ? `<span class="tconf ${c[1]}">${c[0]}</span>` : ''}<button class="tshow" data-show="${id}" data-ctx="${ctx || ''}">הצג</button></div>
    ${n.d ? `<p>${esc(bd(n.d))}</p>` : ''}${opts}${kidsHtml}</div>`;
}
function renderTree() {
  $('#tree').innerHTML = ROOTS.map(([title, ids]) => `<section class="tsec"><h3>${esc(title)}</h3>${ids.map(id => treeItem(id, 0, new Set())).join('')}</section>`).join('');
  $('#count').textContent = Object.keys(N).length;
}
function filterTree(q) {
  q = q.trim().toLowerCase();
  document.querySelectorAll('.titem').forEach(el => el.classList.remove('hit', 'hide'));
  if (!q) return;
  const items = [...document.querySelectorAll('.titem')];
  items.forEach(el => el.classList.add('hide'));
  items.filter(el => el.dataset.t.includes(q)).forEach(el => {
    el.classList.add('hit');
    for (let p = el; p && p.classList; p = p.parentElement) if (p.classList.contains('titem')) p.classList.remove('hide');
    el.querySelectorAll('.titem').forEach(k => k.classList.remove('hide'));
  });
}
function showOnCamera(id, ctx) {
  if (!N[id]) return;
  S.on = true; S.stack = []; S.dark = false; S.modal = null; S.scrLock = false;
  const chain = [id]; let x = ctx || PARENT[id]; while (x) { chain.unshift(x); x = PARENT[x]; }
  const wantFront = ['front_screen', 'lens', 'ct_sensor'].includes(id), wantRear = ['rear_screen'].includes(id);
  if ((wantFront && !S.front) || (wantRear && S.front)) flip(true);
  if (chain[0] === 'usb') toast('החלון הזה קופץ כשמחברים את המצלמה למחשב בכבל', 'USB');
  S.screen = 'live';
  const push = k => { S.stack.push([S.screen, S.arg]); S.screen = k; };
  if (MODES.includes(chain[0])) {
    S.mode = chain[0];
    if (chain.length > 1) { S.stack = [['live']]; S.screen = 'params'; chain.slice(1).filter(k => N[k] && (N[k].kids || []).length).forEach(push); if (N[id].o && !(PSPEC[S.mode] || { w: [] }).w.includes(id) && S.screen !== 'params') { S.stack.push([S.screen]); S.screen = 'opts'; S.arg = id; } }
  } else if (chain[0] === 'cc') {
    S.stack = [['live']]; S.screen = 'cc'; S.ccPage = chain.includes('storage') && !chain.includes('cc_settings') ? 1 : 0;
    chain.slice(1).filter(k => N[k] && (N[k].kids || []).length && k !== id).forEach(push);
    if ((N[id].kids || []).length) push(id);
    else if (N[id].o && N[id].type === 'list') { S.stack.push([S.screen, S.arg]); S.screen = 'opts'; S.arg = id; }
  } else if (chain[0] === 'imgaudio') {
    S.stack = [['live']]; S.screen = 'imgaudio';
    if (N[id].pro) { S.pro = true; S.vals.ia_pro = 'On'; }
    if (chain.includes('ia_aperture')) { S.stack.push(['imgaudio']); S.screen = 'aperture'; }
  } else if (chain[0] === 'playback') { S.stack = [['live']]; S.screen = 'playback'; }
  else if (id === 'g_down') { S.stack = [['live']]; S.screen = 'cc'; S.ccPage = 0; }
  else if (id === 'g_up' || id === 'lv_specs') { S.stack = [['live']]; S.screen = 'params'; }
  else if (id === 'g_side' || id === 'lv_mode') { S.stack = [['live']]; S.screen = 'modes'; S.modePick = curPick(); }
  select(id); render();
  $('#cam').scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'center' });
  const hl = document.querySelector(`#screen [data-sel="${id}"],#screen [data-row="${id}"],#screen [data-tile="${id}"],#screen [data-wheel="${id}"]`);
  if (hl) { hl.classList.add('pulse'); hl.scrollIntoView({ block: 'nearest' }); }
}

/* ---------- היפוך המצלמה ומסך מלא ---------- */
function flip(fromQS) {
  S.front = !S.front;
  if (fromQS !== true && val('s_single') === 'On') S.scrLock = true; // תצוגה במסך אחד: מחליקים למעלה כדי לעבור למסך השני
  $('#camRear').hidden = S.front; $('#camFront').hidden = !S.front;
  (S.front ? $('#frontBezel') : $('#rearBezel')).appendChild($('#scrwrap'));
  $('#screen').classList.toggle('sq', S.front);
  $('#flip').querySelector('span').textContent = S.front ? 'היפוך לצד האחורי' : 'היפוך לצד הקדמי';
  select(S.front ? 'front_screen' : 'rear_screen'); render();
}
function immersive(on) {
  document.body.classList.toggle('imm', on); document.body.classList.toggle('noinfo', on);
  $('#imm').querySelector('span').textContent = on ? 'יציאה ממסך מלא' : 'כניסה למצלמה (מסך מלא)';
  try { if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {}); else if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch (e) {}
  $('#screen').focus({ preventScroll: true });
  setTimeout(() => { if (S.screen === 'params') centerWheels(); }, 60);
}
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && document.body.classList.contains('imm')) immersive(false); });

/* ---------- הפעלה ---------- */
function start() {
  const sc = $('#screen');
  sc.addEventListener('click', onTap);
  initSwipe(sc);
  document.querySelectorAll('[data-sw]').forEach(b => b.addEventListener('click', () => swipe(b.dataset.sw)));
  document.querySelectorAll('.btnShutter').forEach(b => {
    b.addEventListener('click', () => { if (diveHeld) { diveHeld = false; return; } shutter(); });
    // לחיצה ארוכה של 5 שניות על לחצן הצילום: מצב צלילה (הלחצן מושבת, QS מצלם/מקליט)
    b.addEventListener('pointerdown', () => { clearTimeout(diveT); diveT = setTimeout(() => { if (!S.on) return; diveHeld = true; S.dive = true; select('btn_shutter'); toast('מצב צלילה: לחצן הצילום מושבת, QS מצלם/מקליט', 'Scuba Diving mode'); }, 5000); });
    b.addEventListener('pointerup', () => clearTimeout(diveT)); b.addEventListener('pointerleave', () => clearTimeout(diveT));
  });
  document.querySelectorAll('.btnQS').forEach(q => {
    q.addEventListener('pointerdown', qsDown); q.addEventListener('pointerup', qsUp); q.addEventListener('pointerleave', () => clearTimeout(qsT));
    q.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); qsUp(); } });
  });
  $('#flip').addEventListener('click', () => flip());
  document.querySelectorAll('[data-info]').forEach(b => b.addEventListener('click', () => select(b.dataset.info)));
  $('#imm').addEventListener('click', () => immersive(!document.body.classList.contains('imm')));
  $('#infoT').addEventListener('click', () => document.body.classList.toggle('noinfo'));
  Feed.mount($('#feed'), () => ({
    mode: S.on ? S.mode : '', eis: S.mode === 'm_night' ? val('p_neis') : isVid() ? val('p_eis') : ['m_slow', 'm_tl'].includes(S.mode) ? 'Off' : 'RockSteady',
    fov: S.mode === 'm_night' ? val('p_nfov') : S.mode === 'm_photo' ? val('p_pfov') : isVid() ? val('p_fov') : 'Wide',
    zoom: val('lv_zoom'), ev: val('ia_ev'), color: val('ia_color'), recovery: val('ia_recovery') === 'On', film: val('ia_film'), wb: S.pro ? val('ia_wb') : 'Auto',
    star: S.vals.aperture === 'ap_star', dim: S.screen !== 'live' || !!S.dark,
  }));
  $('#caps').addEventListener('change', e => { S.captions = e.target.checked; render(); });
  $('#info').addEventListener('click', e => { const b = e.target.closest('[data-jump]'); if (b) showOnCamera(b.dataset.jump, b.dataset.ctx); });
  $('#tree').addEventListener('click', e => { const b = e.target.closest('[data-show]'); if (b) showOnCamera(b.dataset.show, b.dataset.ctx); });
  $('#q').addEventListener('input', e => filterTree(e.target.value));
  document.addEventListener('keydown', e => {
    if (e.target.matches('input')) return;
    const k = { ArrowDown: 'down', ArrowUp: 'up', ArrowLeft: 'right', ArrowRight: 'left' }[e.key];
    if (k && e.target.closest('#cam')) { e.preventDefault(); swipe(k); }
    if (e.key === 'Escape') { if (document.body.classList.contains('imm')) immersive(false); else home(); }
  });
  new ResizeObserver(() => { if (S.screen === 'params') centerWheels(); }).observe(sc);
  setInterval(() => {
    if (!S.rec) return;
    const t = document.querySelector('#ui .ov.rec .num'); if (t) t.textContent = recTime();
    const m = parseInt(val('s_scroff')); // כיבוי מסך בזמן הקלטה
    if (m && !S.dark && !S.scrOffDone && Date.now() - S.recStart >= m * 60000) { S.dark = true; S.scrOffDone = true; render(); }
  }, 1000);
  renderTree(); render(); renderInfo();
}
start();
