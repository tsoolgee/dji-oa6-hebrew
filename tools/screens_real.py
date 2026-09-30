# מסכים לפי 18 צילומי המסך האמיתיים של אקשן 6 (Roman Fox): בוררי ערך, לוח תמונה/שמע, הגדרות, בורר מצבים
import pathlib, re
R = pathlib.Path(__file__).parent.parent
p = R / 'src/app.js'
s = p.read_text(encoding='utf-8')

def replace_func(name, new):
    """מחליף פונקציה שלמה (עד הסוגר המאוזן) בקוד חדש"""
    global s
    i = s.index('function ' + name + '(')
    j = s.index('{', i); depth = 0; k = j
    while True:
        c = s[k]
        if c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: break
        k += 1
    s = s[:i] + new.strip('\n') + s[k + 1:]

def rep(a, b):
    global s
    assert a in s, 'MISSING ' + a[:80]
    s = s.replace(a, b, 1)

# ---------- בורר מצבים (צילום s33) ----------
replace_func('scrModes', r"""
function scrModes() {
  const idx = Math.max(0, MODES.indexOf(S.modePick ?? S.mode)); S.modePick = MODES[idx];
  const id = MODES[idx], n = N[id];
  const spec = specsLine().split('/'), title = `${n.en}+${spec[0]}${spec.length > 2 ? '' : ''}${isVid() && id === S.mode ? '/' + (String(val('p_res')).split('/')[1] || '') : ''}`;
  const chips = [];
  if (['m_video', 'm_portrait', 'm_night'].includes(id)) chips.push(EIS_SHORT[val(id === 'm_night' ? 'p_neis' : 'p_eis')]);
  if (String(val('ia_color')).startsWith('D-Log')) chips.push('D-Log M');
  const items = MODES.map((m, i) => { const d = i - idx; if (Math.abs(d) > 2) return ''; return `<button class="mbig ${d === 0 ? 'on' : ''}" data-mode="${m}" style="--d:${d}">${ic3d(N[m].icon)}</button>`; }).join('');
  return `<div class="modes">
    <div class="mtitle num">${esc(title)}</div>
    <div class="mchips">${chips.map(c => `<span class="mchip num">${esc(c)}</span>`).join('')}</div>
    <div class="mtrack">${items}</div>
    ${S.captions ? `<div class="mcap">${lb2(n.en, n.he)}</div>` : ''}
    <div class="handle bot"></div></div>`;
}
/* אייקון "תלת-ממדי" של מצב צילום: מילוי מדורג לבן-אפור כמו בבורר המקורי */
function ic3d(name) {
  const body = ICS[name] || ICS.video;
  return `<svg class="ic3" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9c0c6"/></linearGradient></defs><g fill="url(#g3)">${body}</g></svg>`;
}
""")

# ---------- בוררי ערך עם שני גלגלים אנכיים (צילומים s36, s39, s45, s46, s47, s48) ----------
PICKERS = r"""
/* ---------- בוררי ערך (צילומי מסך אמיתיים s36/s39/s45/s46/s47/s48) ---------- */
const dispV = (id, v) => String(v).replace('-bit', 'bit').replace('Standard (Dewarp)', 'Standard (Dewarp)');
const APL = { ap_auto: 'Auto', ap_large: 'Large Aperture (f/2.0)', ap_fixed: 'Fixed (f/2.8)', ap_star: 'Starburst (f/4.0)' };
const APD = { ap_auto: 'Variable aperture that automatically adjusts to shooting conditions. Maximizes aperture in low light', ap_fixed: 'Fixed f/2.8 aperture, like classic action cameras. Minimum focus distance is 35 cm', ap_star: 'Fixed aperture f/4.0 with minimum focus distance of 20 cm to capture six-point starburst effect', ap_large: 'Fixed f/2.0 aperture for maximum light' };
const PICK = {
  eisfov: () => ({ sel: 'p_eisfov', handle: 1, L: { id: 'p_eis' }, R: { id: 'p_fov' }, desc: val('p_fov') === 'Standard (Dewarp)' ? 'Equivalent focal length (15 mm)' : '' }),
  neisfov: () => ({ sel: 'p_neisfov', handle: 1, L: { id: 'p_neis' }, R: { id: 'p_nfov' } }),
  aperture: () => ({ sel: 'ia_aperture', handle: 1, title: 'Variable Aperture', he: 'צמצם משתנה',
    L: { list: apertureAvail(S.mode).map(k => [k, APL[k], N[k] ? N[k].he : '']), cur: S.vals.aperture, key: 'aperture' },
    R: S.vals.aperture === 'ap_auto' ? { id: 'ap_auto', fmt: v => v.replace(/\.0/g, '').replace('–', '-') } : null, desc: APD[S.vals.aperture] }),
  color: () => ({ sel: 'ia_color', topL: 'Color', topR: 'Color Recovery', L: { id: 'ia_color' }, R: { id: 'ia_recovery', list: [['Off', 'Off', 'כבוי'], ['On', 'On', 'פועל']] }, check: 1 }),
  imgadj: () => ({ sel: 'ia_texture', topL: 'Texture', topR: 'Noise Reduction', L: { id: 'ia_texture' }, R: { id: 'ia_nr' }, reset: 1, check: 1 }),
  wb: () => ({ sel: 'ia_wb', L: { id: 'ia_wb', skip: 'Auto', fmt: v => v, dim: val('ia_wb') === 'Auto' }, box: { id: 'ia_wb', label: 'M', text: 'AWB', on: val('ia_wb') === 'Auto', set: 'Auto' }, check: 1 }),
  exposure: () => ({ sel: 'ia_exp', topL: `S ${val('ia_shutter') === 'Auto' ? '1/' + (parseInt(val('p_fps')) || 30) : val('ia_shutter')}`, topLc: 'sel', topR: `${String(val('ia_iso')).replace(/^Auto.*/, '12800')} ISO`, topRbadge: val('ia_exp') !== 'M' ? 'A' : '',
    L: { id: 'ia_ev', fmt: v => (v === '0' ? '+0.0' : v.length === 2 ? v + '.0' : v) + 'EV' }, R: { id: 'ia_iso' }, box: { id: 'ia_exp', label: 'M', text: val('ia_exp') === 'M' ? 'M' : 'Auto', on: val('ia_exp') !== 'M', set: val('ia_exp') === 'M' ? 'Auto' : 'M' }, check: 1 }),
};
function vwheel(side, w) {
  let list = w.list || (N[w.id].o || []).filter(o => !disabled(w.id).includes(o[0])).map(o => [o[0], o[0], o[1]]);
  if (w.skip) list = list.filter(o => o[0] !== w.skip);
  const cur = w.cur ?? val(w.id), i = Math.max(0, list.findIndex(o => o[0] === cur));
  const f = w.fmt || (v => dispV(w.id, v));
  const rows = [-2, -1, 0, 1, 2].map(d => { const o = list[i + d]; if (!o) return '<span class="vv empty"></span>';
    return `<button class="vv d${Math.abs(d)} ${d === 0 && !w.dim ? 'on' : ''}" data-pk="${w.key || w.id}" data-v="${esc(o[0])}"><span class="num">${esc(f(o[1]))}</span>${d === 0 && S.captions && o[2] && o[2] !== o[1] ? `<i class="vcap">${esc(bd(o[2]))}</i>` : ''}</button>`; }).join('');
  return `<div class="vwheel ${side}" data-vw="${w.key || w.id}">${rows}</div>`;
}
function scrPick(key) {
  const P = PICK[key](), grid = ['Grid', 'Grid & Diagonals'].includes(val('s_grid'));
  return `<div class="pick">${grid ? '<div class="gridov"></div>' : ''}
    ${P.handle ? '<div class="handle top"></div>' : ''}
    <button class="pk-back" data-back="1" aria-label="חזרה">${ic('back')}</button>
    ${P.title ? `<div class="pk-title">${lb2(P.title, P.he || '')}</div>` : ''}
    ${P.topL ? `<div class="pk-tl num ${P.topLc || ''}">${esc(P.topL)}</div>` : ''}
    ${P.topR ? `<div class="pk-tr num ${P.box ? 'withbox' : ''}">${esc(P.topR)}${P.topRbadge ? `<span class="pk-a">${P.topRbadge}</span>` : ''}</div>` : ''}
    ${vwheel('L', P.L)}${P.R ? vwheel('R', P.R) : ''}
    ${P.box ? `<div class="pk-box"><span class="pk-m num">${P.box.label}</span><button class="pk-mode ${P.box.on ? 'on' : ''}" data-pk="${P.box.id}" data-v="${esc(P.box.set)}"><span class="num">${esc(P.box.text)}</span></button></div>` : ''}
    ${P.reset ? `<button class="pk-reset" data-pkreset="${key}" aria-label="איפוס">${ic('reset')}</button>` : ''}
    ${P.check ? `<button class="pk-ok" data-back="1" aria-label="אישור">✓</button>` : ''}
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
  return `<div class="list"><div class="lhead"><button class="bk" data-back="1" aria-label="חזרה">${ic('back')}</button>${lb2('Save Current Settings', 'שמירת ההגדרות הנוכחיות')}<button class="bk" data-act="cu_del" aria-label="מחיקה">${ic('trash')}</button></div>
    <div class="savecur"><button class="sc-i" data-act="cu_new" data-sel="cu_save">${ic3d('video')}<span class="mbadge num">${(S.customCount || 0) + 1}</span></button>
    <button class="sc-i" data-act="cu_new" data-sel="cu_save">${ic3d('custom')}</button><div class="sc-cap">${lb2('Custom', 'מצב מותאם')}</div></div></div>`;
}
"""
rep("/* ---------- מרכז הבקרה (עמ' 18) ואחסון (עמ' 20) ---------- */", PICKERS + "\n/* ---------- מרכז הבקרה (עמ' 18) ואחסון (עמ' 20) ---------- */")

# ---------- כותרת רשימה: "<" משמאל, כותרת במרכז, "✕" מימין (צילומים s40–s42, s49, s51) ----------
replace_func('head', r"""
function head(id) { return `<div class="lhead"><button class="bk" data-back="1" aria-label="חזרה">${ic('back')}</button>${lbl(id)}<button class="bk" data-home="1" aria-label="סגירה">${ic('close')}</button></div>`; }
""")

# ---------- ניתוב ----------
rep("""  else if (s === 'aperture') h = scrList('ia_aperture');""", """  else if (s === 'aperture') h = scrPick('aperture');
  else if (s === 'pick') h = scrPick(S.arg);
  else if (s === 'imgaudio') h = scrImg();
  else if (s === 'savecur') h = scrSaveCur();""")
rep("""const SCR_NAME = { qspage: 'דף ההחלפה המהירה',""", """const SCR_NAME = { pick: 'בורר ערך', savecur: 'שמירת ההגדרות הנוכחיות', qspage: 'דף ההחלפה המהירה',""")

# ---------- הקשות חדשות ----------
rep("""  if (d.set) return setVal(d.set, d.v);""", """  if (d.set) return setVal(d.set, d.v);
  if (d.home) return home();
  if (d.pk) { if (d.pk === 'aperture') { S.vals.aperture = d.v; select(d.v); return render(); } return setVal(d.pk, d.v); }
  if (d.pkreset) { S.vals.ia_texture = '0'; S.vals.ia_nr = '0'; toast('התאמות התמונה אופסו', 'Reset'); return render(); }
  if (d.iatab) { S.iaTab = d.iatab; return render(); }
  if (d.ia) {
    const k = d.ia, map = { ia_exp: 'exposure', ia_wb: 'wb', ia_color: 'color', ia_aperture: 'aperture', ia_imgadj: 'imgadj', ia_ev: 'exposure' };
    if (map[k]) return go('pick', map[k]);
    if (N[k] && N[k].type === 'toggle') return setVal(k, val(k) === 'On' ? 'Off' : 'On');
    if (N[k] && N[k].o) return go('opts', k);
    return;
  }""")
# אריח ימני בלוח הפרמטרים וערך הצמצם במסך הצילום פותחים את הבוררים
rep("""  if (d.tileopt) {""", """  if (d.tileopt === 'p_eisfov' || d.tileopt === 'p_neisfov') { select(d.tileopt); return go('pick', d.tileopt === 'p_eisfov' ? 'eisfov' : 'neisfov'); }
  if (d.tileopt) {""")
p.write_text(s, encoding='utf-8')

# ---------- נתונים: התוויות האמיתיות מהמסך ----------
d = R / 'src/data.js'
t = d.read_text(encoding='utf-8')
for a, b in [
    ("node('s_mic', { en: 'Wireless Microphone',", "node('s_mic', { en: 'Wireless Mic',"),
    ("node('s_sound', { en: 'Sound',", "node('s_sound', { en: 'Sounds',"),
    ("node('s_grid', { en: 'Reference Line',", "node('s_grid', { en: 'Grid',"),
    ("node('s_scroff', { en: 'Screen Off When Recording',", "node('s_scroff', { en: 'Scrn Off When Rec',"),
    ("node('s_single', { en: 'Single Screen Preview',", "node('s_single', { en: 'Single Screen Preview (Scrn Off When Locked)',"),
    ("node('ia_wind', { en: 'Wind Reduction',", "node('ia_wind', { en: 'Wind Noise Reduction',"),
]:
    if a in t: t = t.replace(a, b, 1)
    else: print('skip data:', a[:50])
if "node('s_timer'" not in t:
    t = t.replace("node('s_aod',", "node('s_timer', { en: 'Timer Shooting', he: 'צילום מתוזמן', icon: 'timer', type: 'action', conf: 'm', d: 'פריט בתפריט ההגדרות של אקשן 6 (נראה בצילומי מסך של המצלמה). האפשרויות שבתוכו לא תועדו במקורות.' });\nnode('s_aod',", 1)
    t = re.sub(r"(const SET = \[[^\]]*?'s_backup', )", r"\1's_timer', ", t, count=1)
d.write_text(t, encoding='utf-8')

# ---------- אייקון סגירה ----------
i = R / 'src/icons.js'
u = i.read_text(encoding='utf-8')
if "  close:" not in u:
    u = u.replace("  back: '<path d=\"m15 5-7 7 7 7\"/>',", "  back: '<path d=\"m15 5-7 7 7 7\"/>',\n  close: '<path d=\"M6 6l12 12M18 6 6 18\"/>',", 1)
i.write_text(u, encoding='utf-8')
print('ok')

# ---------- מסך שמירת מצב מותאם במקום חלון אישור ----------
s = p.read_text(encoding='utf-8')
a = "  if (k === 'cu_save') return confirmBox('Save current settings as a custom mode?', 'לשמור את ההגדרות הנוכחיות כמצב מותאם?', 'Save', 'שמירה', () => toast('נשמר כ-C1', 'Saved to C1'));"
assert a in s
s = s.replace(a, "  if (k === 'cu_save') return go('savecur');", 1)
a = "  if (d.act) {"
s = s.replace(a, """  if (d.act === 'cu_new') { S.customCount = Math.min(5, (S.customCount || 0) + 1); toast(`ההגדרות נשמרו כמצב C${S.customCount}`, `Saved as C${S.customCount}`); return back(); }
  if (d.act === 'cu_del') return confirmBox('Delete custom modes?', 'למחוק את המצבים המותאמים?', 'Delete', 'מחיקה', () => { S.customCount = 0; toast('המצבים המותאמים נמחקו', 'Deleted'); });
  if (d.act) {""", 1)
p.write_text(s, encoding='utf-8')
print('ok2')
