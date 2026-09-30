# -*- coding: utf-8 -*-
# החלת ממצאי סבב האימות האחרון (verify2) מול צילומי המסך האמיתיים
import re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent / 'src'
def sub(f, a, b, cnt=1):
    p = R / f; s = p.read_text(encoding='utf-8')
    if s.count(a) < 1: raise SystemExit(f'לא נמצא ב-{f}: {a[:80]}')
    s = s.replace(a, b) if cnt == 0 else s.replace(a, b, cnt)
    p.write_text(s, encoding='utf-8')

# ---------- app.js: בוררי ערך ----------
sub('app.js', "  if (w.skip) list = list.filter(o => o[0] !== w.skip);\n",
    "  if (w.skip) list = list.filter(o => o[0] !== w.skip);\n  if (w.rev) list = [...list].reverse();\n")
sub('app.js', """const rows = [-2, -1, 0, 1, 2].map(d => { const o = list[i + d]; if (!o) return '<span class="vv empty"></span>';""",
    """const rows = [-2, -1, 0, 1, 2].map(d => { const o = list[i + d]; if (!o || (w.dim && d !== 0)) return '<span class="vv empty"></span>';""")
sub('app.js', "R: { id: 'p_fov' }, desc:", "R: { id: 'p_fov', rev: 1 }, desc:")
sub('app.js', "R: { id: 'p_nfov' } }", "R: { id: 'p_nfov', rev: 1 } }")
sub('app.js', "L: { id: 'ia_texture' }, R: { id: 'ia_nr' }", "L: { id: 'ia_texture', rev: 1 }, R: { id: 'ia_nr', rev: 1 }")
sub('app.js', "'100~12800', '100~25600'].map", "'100~12800'].map")
sub('app.js', "adjusts to shooting conditions. Maximizes", "adjusts to shooting conditions.\\nMaximizes")
# בלי PRO אין מצב ידני: רק פיצוי חשיפה
sub('app.js', "R: val('ia_exp') === 'M' ? { id: 'ia_iso'", "R: !S.pro ? null : val('ia_exp') === 'M' ? { id: 'ia_iso'")
sub('app.js', "box: { id: 'ia_exp', label: 'M'", "box: !S.pro ? null : { id: 'ia_exp', label: 'M'")
sub('app.js', "topR: `${val('ia_exp')", "topR: !S.pro ? '' : `${val('ia_exp')")
sub('app.js', '<button class="pk-ok" data-back="1" aria-label="אישור">✓</button>', """<button class="pk-ok" data-back="1" aria-label="אישור">${ic('check')}</button>""")
sub('app.js', """'<span class="chk">✓</span>'""", """'<span class="chk">' + ic('check') + '</span>'""", 0)

# ---------- app.js: בורר מצבים כולל מצבים מותאמים ----------
sub('app.js', "function scrModes() {\n  const idx = Math.max(0, MODES.indexOf(S.modePick ?? S.mode)); S.modePick = MODES[idx];\n  const id = MODES[idx], n = N[id];",
"""/* מצבים מותאמים (Video 1..5) יושבים בתחילת הגלגל, כמו בצילום s33 */
const WM = () => [...Array.from({ length: S.customCount || 0 }, (_, i) => 'cu' + (i + 1)), ...MODES];
const curPick = () => S.custom && S.custom <= (S.customCount || 0) ? 'cu' + S.custom : S.mode;
const selOf = m => /^cu/.test(m) ? 'm_video' : m;
function commitMode(m) { if (/^cu/.test(m)) { S.mode = 'm_video'; S.custom = +m.slice(2); } else { S.mode = m; S.custom = 0; } }
function scrModes() {
  const WL = WM(), idx = Math.max(0, WL.indexOf(S.modePick ?? curPick())); S.modePick = WL[idx];
  const cu = /^cu/.test(WL[idx]) ? +WL[idx].slice(2) : 0, id = cu ? 'm_video' : WL[idx], n = N[id];""")
sub('app.js', "title = `${n.en}+${spec[0]}", "title = `${n.en}${cu ? ' ' + cu : ''}+${spec[0]}")
sub('app.js', """  const items = MODES.map((m, i) => { const d = i - idx; if (Math.abs(d) > 2) return ''; const sz = d === 0 ? 19 : Math.abs(d) === 1 ? 11 : 8, x = d === 0 ? 0 : Math.sign(d) * (Math.abs(d) === 1 ? 21 : 36);
    return `<button class="mbig ${d === 0 ? 'on' : ''}" data-mode="${m}" style="transform:translate(calc(-50% + ${x}cqw),-50%);opacity:${d === 0 ? 1 : Math.abs(d) === 1 ? .9 : .35}"><span style="--sz:${sz}cqw">${ic3d(N[m].icon)}</span></button>`; }).join('');""",
"""  const items = WL.map((m, i) => { const d = i - idx; if (Math.abs(d) > 2) return ''; const sz = d === 0 ? 21.5 : Math.abs(d) === 1 ? 14.5 : 10, x = d === 0 ? 0 : Math.sign(d) * (Math.abs(d) === 1 ? 23.6 : 39), k = /^cu/.test(m) ? m.slice(2) : '';
    return `<button class="mbig ${d === 0 ? 'on' : ''}" data-mode="${m}" style="--sz:${sz}cqw;transform:translate(calc(-50% + ${x}cqw),-50%);opacity:${d === 0 ? 1 : Math.abs(d) === 1 ? .9 : .2}"><span style="display:block">${ic3d(k ? 'video' : N[m].icon)}</span>${k ? `<span class="mbadge num">${k}</span>` : ''}</button>`; }).join('');""")
sub('app.js', "if (d.go === 'modes') S.modePick = S.mode;", "if (d.go === 'modes') S.modePick = curPick();")
sub('app.js', "if (d.mode === S.modePick) { S.mode = d.mode; S.modePick = null; select(d.mode); return home(); }\n    S.modePick = d.mode; select(d.mode); return render();",
    "if (d.mode === S.modePick) { commitMode(d.mode); S.modePick = null; select(S.mode); return home(); }\n    S.modePick = d.mode; select(selOf(d.mode)); return render();")
sub('app.js', "if (S.modePick) S.mode = S.modePick; S.modePick = null;", "if (S.modePick) commitMode(S.modePick); S.modePick = null;", 0)
sub('app.js', "if (s === 'live') { S.modePick = S.mode; select('modes'); return go('modes'); }", "if (s === 'live') { S.modePick = curPick(); select('modes'); return go('modes'); }")
sub('app.js', "if (s === 'modes') { const i = MODES.indexOf(S.modePick); const j = Math.min(MODES.length - 1, Math.max(0, i + (dir === 'left' ? 1 : -1))); S.modePick = MODES[j]; select(MODES[j]); return render(); }",
    "if (s === 'modes') { const WL = WM(), i = WL.indexOf(S.modePick); const j = Math.min(WL.length - 1, Math.max(0, i + (dir === 'left' ? 1 : -1))); S.modePick = WL[j]; select(selOf(WL[j])); return render(); }")
sub('app.js', "const step = Math.round(-dx / (W() * .26)), i = MODES.indexOf(S.modePick), j = Math.max(0, Math.min(MODES.length - 1, i + step));\n      S.modePick = MODES[j]; select(MODES[j]); return render();",
    "const WL = WM(), step = Math.round(-dx / (W() * .26)), i = WL.indexOf(S.modePick), j = Math.max(0, Math.min(WL.length - 1, i + step));\n      S.modePick = WL[j]; select(selOf(WL[j])); return render();")
sub('app.js', "if (s === 'live' && h) { S.modePick = S.mode;", "if (s === 'live' && h) { S.modePick = curPick();")
sub('app.js', "S.screen = 'modes'; S.modePick = S.mode; }", "S.screen = 'modes'; S.modePick = curPick(); }")
sub('app.js', "toast(`ההגדרות נשמרו כמצב C${S.customCount}`, `Saved as C${S.customCount}`)", "toast(`ההגדרות נשמרו כמצב מותאם Video ${S.customCount}`, `Saved as Video ${S.customCount}`)")
sub('app.js', "() => { S.customCount = 0; toast(", "() => { S.customCount = 0; S.custom = 0; toast(")
# אייקון "מותאם" תלת-ממדי (צילום s43)
sub('app.js', "function ic3d(name) {\n",
"""function ic3d(name) {
  if (name === 'custom') return '<svg class="ic3" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="g3c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#b9c0c6"/></linearGradient><clipPath id="c3c"><circle cx="11" cy="11" r="10"/></clipPath></defs><circle cx="11" cy="11" r="10" fill="url(#g3c)"/><g clip-path="url(#c3c)" fill="#3d5a73"><circle cx="11" cy="8.4" r="3.7"/><path d="M3.2 21.5c.9-4.8 4-7.4 7.8-7.4s6.9 2.6 7.8 7.4z"/></g><circle cx="18" cy="17.8" r="3.9" fill="#1b1e21" stroke="#e8e2d4" stroke-width=".6"/><path d="M18 15.8v4M16 17.8h4" stroke="#f0b35a" stroke-width="1.1" stroke-linecap="round"/></svg>';
""")
sub('app.js', """data-act="cu_del" aria-label="מחיקה">${ic('trash')}""", """data-act="cu_del" aria-label="מחיקה">${ic('trashO')}""")

# ---------- app.js: לוח פרמטרים ----------
sub('app.js', """.join('')}</div></div></div>`;
}
function scrParams() {""", """.join('')}</div></div>${isFps && /^\\d/.test(cur) ? '<div class="wunit num">fps</div>' : ''}</div>`;
}
function scrParams() {""")
sub('app.js', "    [...tr.children].forEach(c => { const l = c.offsetLeft + x; c.style.visibility = l >= 0 && l + c.offsetWidth <= w.clientWidth ? '' : 'hidden'; });\n", "")
sub('app.js', "    // כמו בצילום המסך המקורי: ערך שלא נכנס במלואו לא מוצג\n", "")
# הערת הבהוב רק כשהקצב לא מתאים ל-50Hz (בצילום s44 עם 25fps אין הערה)
sub('app.js', "const note = isVid() || S.mode === 'm_night' ?", "const note = (isVid() || S.mode === 'm_night') && fpsNow % 25 !== 0 ?")

# ---------- app.js: SnapShot עם מצבים מותאמים (s35) ----------
sub('app.js', "function scrOpts(id) {\n", """function scrOpts(id) {
  if (id === 's_snap' && S.customCount) {
    const sp = specsLine().split('/'), sub2 = `+${sp[0]}/${String(val('p_res')).split('/')[1] || '16:9'}`;
    const rows = Array.from({ length: S.customCount }, (_, i) => { const c = `Video ${i + 1}`;
      return `<button class="row ${c === val(id) ? 'on' : ''}" data-pick="${id}" data-v="${c}"><span class="cui">${ic('video')}<i class="cnum num">${i + 1}</i></span>${lb2(c + sub2, 'מצב מותאם ' + (i + 1))}${c === val(id) ? '<span class="chk">' + ic('check') + '</span>' : ''}</button>`; }).join('');
    return `<div class="list">${head(id)}<div class="lbody"><div class="lsec">${lb2('Custom Modes', 'מצבים מותאמים')}</div>${rows}</div></div>`;
  }
""")

# ---------- data.js ----------
sub('data.js', "const SET = ['s_snap', 's_mic', 's_buds', 's_wifi', 's_depth', 's_backup', 's_timer', 's_tc', 's_hl', 's_scroff', 's_aod', 's_single', 's_autooff', 's_bitrate', 's_grid', 's_horizon', 's_sound', 's_usb', 'storage', 's_lang', 's_info', 's_reset'];",
    "const SET = ['s_snap', 's_single', 's_mic', 's_buds', 's_wifi', 's_depth', 's_scroff', 's_backup', 's_timer', 's_tc', 's_hl', 's_aod', 's_autooff', 's_bitrate', 's_sound', 's_grid', 's_horizon', 's_usb', 'storage', 's_lang', 's_info', 's_reset'];")
p = R / 'data.js'; s = p.read_text(encoding='utf-8')
for nid in ('s_scroff', 's_autooff'):
    line = re.search(r"node\('%s'.*\n" % nid, s).group(0)
    s = s.replace(line, re.sub(r"'(\d+)min'", r"'\1 min'", line))
for nid, old, new in [('s_scroff', 'screen', 'moon'), ('s_snap', 'rec', 'snap'), ('s_mic', 'mic', 'micbox'), ('s_backup', 'mic', 'backup'),
                      ('s_bitrate', 'bars', 'bitrate'), ('s_single', 'front', 'single'), ('s_grid', 'gridline', 'gridfill')]:
    line = re.search(r"node\('%s'.*\n" % nid, s).group(0)
    assert f"icon: '{old}'" in line, nid
    s = s.replace(line, line.replace(f"icon: '{old}'", f"icon: '{new}'", 1))
p.write_text(s, encoding='utf-8')

# ---------- icons.js ----------
sub('icons.js', """  reset: '<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 3.5V8h4.5"/>',""",
"""  reset: '<path d="M20 12a8 8 0 1 1-2.5-5.8"/><path d="M20 3.5V8h-4.5"/>',
  check: '<path d="M5.5 12.5l4.3 4.3L18.5 8"/>',
  trashO: '<path d="M4 6.5h16M9.5 6.5V4h5v2.5M6.5 6.5l1 14h9l1-14"/><path d="M9.8 10.5v6.5M12 10.5v6.5M14.2 10.5v6.5"/>',
  bitrate: '<path d="M3 15c2-5 4-5 6 0s4 5 6 0 4-5 6 0"/><path d="M3 9c2-5 4-5 6 0s4 5 6 0 4-5 6 0"/>',""")
sub('icons.js', """  aperture: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5 15 12M20.5 12l-8 3M16.3 19.4 9 13.5M7.7 19.4 9 10.5M3.5 12 12 9"/>',\n""", "")
sub('icons.js', """  info: '<path fill-rule="evenodd\"""",
"""  aperture: '<circle cx="12" cy="12" r="9.5"/><path d="M12 2.5 15 12M21.5 12l-9 3M16.8 20.3 9 13.5M7.2 20.3 9 10.5M2.5 12 12 9" fill="none" stroke="#0a1418" stroke-width="1.4"/>',
  snap: '<path fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19zm0 1.8a7.7 7.7 0 1 0 0 15.4 7.7 7.7 0 0 0 0-15.4zm0 2.2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 1.8a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4z"/>',
  micbox: '<rect x="2.5" y="5" width="19" height="14" rx="3"/><text x="12" y="15" text-anchor="middle" font-size="6.6" font-weight="800" font-family="Arial,sans-serif" fill="#1d4560">MIC</text><circle cx="6" cy="8" r=".7" fill="#1d4560"/><circle cx="8" cy="8" r=".7" fill="#1d4560"/>',
  single: '<rect x="2.5" y="7" width="13" height="13" rx="2.2" opacity=".6"/><rect x="8.5" y="3" width="13" height="13" rx="2.2"/><path d="M17.8 7.2a3 3 0 1 0 2 4.6 2.4 2.4 0 0 1-2-4.6z" fill="#1d4560"/>',
  backup: '<rect x="2.5" y="7" width="13" height="13" rx="2.2" opacity=".6"/><rect x="8.5" y="3" width="13" height="13" rx="2.2"/><path d="M16.8 5.8v6.3a1.9 1.9 0 1 1-1.2-1.8V7.4l3-.8v1.5z" fill="#1d4560"/>',
  gridfill: '<rect x="2.5" y="2.5" width="19" height="19" rx="2.5"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="#1d4560" stroke-width="1.3"/>',
  info: '<path fill-rule="evenodd\"""")
print('ok')
