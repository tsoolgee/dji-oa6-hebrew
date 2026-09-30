# כיול לפי דוחות ההשוואה מול איורי המדריך (מסך צילום, פרמטרים, מרכז בקרה, אחסון)
import pathlib, re
R = pathlib.Path(__file__).parent.parent

# ---------- CSS: בלוק כיול שמנצח את הכללים הקודמים ----------
css = (R / 'src/screen.css').read_text(encoding='utf-8')
css = css.split('/* ===== כיול לפי איורי המדריך ===== */')[0].rstrip('\n')
css += r"""

/* ===== כיול לפי איורי המדריך (עמ' 15, 16, 18, 20). מידות ב-cqw = אחוז מרוחב המסך ===== */
/* מסך הצילום */
.ov.p1{left:1.5cqw;top:.6cqw;font-size:5.6cqw;gap:1.6cqw}
.ov.p1 .ic{width:7.4cqw;height:7.4cqw}
.ov.p2{left:1.5cqw;top:51%}
.ov.p2 .ic{width:8cqw;height:8cqw}
.ov.p3{left:1.5cqw;bottom:.4cqw}
.ov.p3 .ic{width:8cqw;height:8cqw}
.ov.p4{right:1.7cqw;top:2.7cqw}
.batt{min-width:5.4cqw;height:4.2cqw;border:.55cqw solid #fff;border-radius:1cqw;padding:0 .4cqw;font-size:3.8cqw;box-shadow:none}
.batt::after{right:-1.3cqw;width:.9cqw;height:2cqw}
.ov.p5{right:1.7cqw;top:51%}
.ov.p5 .ic{width:8.5cqw;height:8.5cqw}
.ov.p6{top:71.7%;font-size:5cqw;right:1.7cqw}
.ov.p7{font-size:6.2cqw;bottom:.6cqw}
.ov.p8{right:1.7cqw;bottom:.8cqw}
.zb{min-width:6.7cqw;height:6.3cqw;border:.35cqw solid #fff;border-radius:1.2cqw;font-size:4.5cqw;padding:0 .4cqw}
.ov.tc{font-size:5cqw}
/* ידיות ונקודות עמוד */
.handle{width:12.4cqw;height:1.15cqw;border-radius:1cqw;background:#333}
.handle.top{top:2.4cqw}.handle.bot{bottom:2.5cqw}
.dots{gap:5.4cqw;padding-bottom:1.85cqw}
.dots i{width:2.7cqw;height:2.7cqw;background:#343131}
.dots i.on{background:#e5e5e5}
/* לוח הפרמטרים */
.params{padding:5.8cqw 4.2cqw 1.8cqw}
.ptiles{grid-template-columns:1fr .735fr 1fr;gap:5.2cqw}
.ptile{background:#17181a;border-radius:1.3cqw;color:#d1d1d1;font-size:4cqw;gap:2.2cqw}
.ptile:hover{background:#202224}
.ptile .ic{width:7.2cqw;height:7.2cqw}
.ptile .sep{width:.5cqw;height:3.4cqw;background:#454648}
.pbody{padding-top:1.4cqw;gap:0;justify-content:flex-start}
.wsec{gap:.4cqw}
.wlab .lb small{font-size:4.3cqw!important;color:#d4d4d4!important}
.wheel{-webkit-mask:linear-gradient(90deg,transparent 5%,#000 10%,#000 90%,transparent 95%);mask:linear-gradient(90deg,transparent 5%,#000 10%,#000 90%,transparent 95%)}
.wtrack{gap:6.9cqw}
.wheel[data-wheel="p_fps"] .wtrack,.wheel[data-wheel="p_nfps"] .wtrack,.wheel[data-wheel="p_trfps"] .wtrack{gap:10.8cqw}
.wv{font-size:8.3cqw;line-height:1.1;padding:0;font-weight:600}
.wdiv{height:.7cqw;margin:2.2cqw 24.4% 1.6cqw;background:linear-gradient(90deg,transparent,#333,transparent)}
.pnote{font-size:5.1cqw;gap:2.9cqw;padding-top:.4cqw}
.pnote b{font-size:2.6cqw}
.pinfo{color:#ccc;right:-1cqw}
/* מרכז הבקרה */
.cc{padding:1.9cqw 4.9cqw 2.5cqw}
.tiles{gap:3.4cqw 3.2cqw;align-items:center;align-content:center;justify-items:center}
.tile{width:20cqw;border-radius:4.8cqw;background:#121313}
.tile:hover{background:#1c1e1e}
.tile .ic{width:12cqw!important;height:12cqw!important}
.tile .ic text{font-family:var(--f-cam);font-weight:800}
.ccell{gap:.4cqw}
/* אחסון */
.cc.stor{padding:1.5cqw 4.7cqw 4.7cqw 4.2cqw}
.sdate{font-size:4.4cqw;letter-spacing:-.01em;padding-bottom:1.6cqw}
.sdate .sp{display:inline-block;width:6.5cqw}
.scards{grid-template-columns:1.17fr 1.17fr 1fr;gap:3cqw}
.scard{border-radius:1.8cqw;border-width:.45cqw;background:#161718}
.scard .shead{padding:2.2cqw 0;font-size:4cqw;line-height:1.1;background:#5d6065;color:rgb(255 255 255/.78);border-radius:1.4cqw 1.4cqw 0 0}
.scard.on .shead{background:var(--ui);color:#111}
.ring{width:20cqw;line-height:1.15;background:radial-gradient(closest-side,#161718 80%,transparent 81%),conic-gradient(#e3e3e3 calc(var(--p) * 360deg),#454648 0)}
.ring .big{font-size:4.8cqw;letter-spacing:-.01em;color:#e3e3e3}
.ring .small{font-size:3cqw;color:rgb(255 255 255/.3);margin-top:.6cqw}
.scard.fmt{font-size:4.4cqw;color:#e3e3e3}
"""
(R / 'src/screen.css').write_text(css, encoding='utf-8')

# ---------- אייקונים: נתיבים חדשים לפי האיורים ----------
ic = (R / 'src/icons.js').read_text(encoding='utf-8')
NEW = {
  'store': r"""'<path fill-rule="evenodd" d="M3.5 8h11.2a5 5 0 0 0 7.3 6.1V18a2 2 0 0 1-2 2h-16.5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"/><path fill-rule="evenodd" d="M18.5 3.2a5.2 5.2 0 1 1 0 10.4 5.2 5.2 0 0 1 0-10.4zm0 1.9a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zm0 1.5a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6z"/>'""",
  'play': r"""'<path fill-rule="evenodd" d="M5 4.8h14a2.6 2.6 0 0 1 2.6 2.6v9.2a2.6 2.6 0 0 1-2.6 2.6H5a2.6 2.6 0 0 1-2.6-2.6V7.4A2.6 2.6 0 0 1 5 4.8zm5.2 3.4v7.6l6.4-3.8z"/>'""",
  'video': r"""'<rect x="2" y="5.6" width="13" height="12.8" rx="2.4"/><path d="M17 10.6 21.4 7.6q.6-.4.6.3v8.2q0 .7-.6.3L17 13.4z"/>'""",
  'sliders': r"""'<path d="M2.5 8h10.4v1.7H2.5zM19 8h2.5v1.7H19zM2.5 14.3h2.4V16H2.5zM11.2 14.3h10.3V16H11.2z"/><circle cx="15.7" cy="8.85" r="2.2"/><circle cx="7.6" cy="15.15" r="2.2"/>'""",
  'autorot': r"""'<rect x="3" y="3" width="8.5" height="18" rx="2" fill="#454648" stroke="currentColor" stroke-width="2"/><path d="M12.5 12.5h5.5a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2h-5.5" fill="#454648" stroke="currentColor" stroke-width="2"/><path d="M13.5 4.5a6.5 6.5 0 0 1 6 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".45"/>'""",
  'lock': r"""'<path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/><path fill-rule="evenodd" d="M4.6 10.5h14.8a1.8 1.8 0 0 1 1.8 1.8v7.4a1.8 1.8 0 0 1-1.8 1.8H4.6a1.8 1.8 0 0 1-1.8-1.8v-7.4a1.8 1.8 0 0 1 1.8-1.8zm6.5 3.3v4.4h1.8v-4.4z"/>'""",
  'orient': r"""'<path d="M4.2 11A8 8 0 0 1 19.6 8.4M19.8 13A8 8 0 0 1 4.4 15.6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M1.2 9.9h6L4.2 14.2zM22.8 14.1h-6l3-4.3z"/><rect x="8.2" y="8.2" width="7.6" height="7.6" rx="1.6" fill="none" stroke="currentColor" stroke-width="2"/>'""",
  'hand': r"""'<g transform="translate(-1.5 2.2) rotate(-20 11 13)"><rect x="6.2" y="4.5" width="2.6" height="10.5" rx="1.3"/><rect x="9.2" y="1.5" width="2.6" height="13" rx="1.3"/><rect x="12.2" y="2.2" width="2.6" height="12.4" rx="1.3"/><rect x="15.2" y="4.8" width="2.5" height="10" rx="1.25"/><path d="M6.2 12.5h11.5V16a6 6 0 0 1-6 6h-.7c-2 0-3.4-.8-4.6-2.3l-3-4a1.4 1.4 0 0 1 2.2-1.7l.6.8z"/><path d="M17.5 12.8c1.8-.4 3.2.6 3 2.2l-.9 2.6c-.4 1.1-1.3 1.5-2.3 1.1z"/></g><path d="M17.8 3.4a4.2 4.2 0 0 1 3.9 3.9M18.6 .4a7 7 0 0 1 6.4 6.4" fill="none" stroke="#9a9a9a" stroke-width="2.2" stroke-linecap="round"/>'""",
  'voice': r"""'<path fill-rule="evenodd" d="M12.5 3.5h6.7a2.8 2.8 0 0 1 2.8 2.8v11.4a2.8 2.8 0 0 1-2.8 2.8h-7.4v-3.3l2.6-1.1-2.6-1.3-.9-.2 2.5-2.8-3.4-.2V6.3a2.8 2.8 0 0 1 2.5-2.8zm2.4 3.4a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z"/><path d="M8.2 10.2a3.2 3.2 0 0 0 0 4.6M5 8.1a6.3 6.3 0 0 0 0 8.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'""",
  'front': r"""'<path d="M4.4 2.6h15.2a1.4 1.4 0 0 1 1.4 1.4v1.5H3V4a1.4 1.4 0 0 1 1.4-1.4z" opacity=".6"/><path d="M3 18.5h18V20a1.4 1.4 0 0 1-1.4 1.4H4.4A1.4 1.4 0 0 1 3 20z" opacity=".6"/><path fill-rule="evenodd" d="M4.6 6.8h14.8A1.6 1.6 0 0 1 21 8.4v7.2a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 15.6V8.4a1.6 1.6 0 0 1 1.6-1.6zm1.6 8.2h11.6l-3.2-3-1.4 1.3-2.9-3.2z"/>'""",
  'gear': r"""'<path fill-rule="evenodd" stroke="currentColor" stroke-width="1" stroke-linejoin="round" d="M12 2.6 20.8 7.3v9.4L12 21.4 3.2 16.7V7.3zm0 5.4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>'""",
  'custom': r"""'<circle cx="9.3" cy="6.8" r="4.2"/><path d="M1.8 20.8c.6-4.6 3.6-7.3 7.7-7.3 1.6 0 3 .4 4.2 1.1a6.4 6.4 0 0 0-1.1 6.2z"/><path fill-rule="evenodd" d="M18.2 11.6a5.6 5.6 0 1 1 0 11.2 5.6 5.6 0 0 1 0-11.2zm-.95 2.4v2.25h-2.25v1.9h2.25v2.25h1.9v-2.25h2.25v-1.9h-2.25V14z"/>'""",
  'qs': r"""'<rect x="2" y="3" width="20" height="18" rx="2.8"/><text x="12" y="16.6" text-anchor="middle" font-size="12" font-weight="800" fill="#121313" font-family="Saira Extra Condensed, Barlow Condensed, Arial Narrow, sans-serif">QS</text>'""",
  'info': r"""'<path fill-rule="evenodd" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM11 10.5h2V17h-2zm0-3.5h2v2h-2z"/>'""",
}
for k, v in NEW.items():
    ic, n = re.subn(r"(\n  " + k + r": )'(?:[^'\\]|\\.)*',", lambda m: m.group(1) + v + ',', ic, count=1)
    assert n == 1, k
(R / 'src/icons.js').write_text(ic, encoding='utf-8')

# ---------- app.js ----------
a = (R / 'src/app.js').read_text(encoding='utf-8')
def rep(x, y):
    global a
    assert x in a, 'MISSING ' + x[:70]
    a = a.replace(x, y, 1)
rep("""<span class="num">${apertureLabel()}</span>${S.vals.aperture === 'ap_auto' ? '<sup>A</sup>' : ''}""", """<span class="num">${apertureLabel()}</span>""")
rep("""  return `<div class="wsec"><div class="wlab">${lbl(id)}</div>""", """  const isFps = /fps$/.test(id);
  return `<div class="wsec">${isFps ? (S.captions ? `<div class="wlab caponly">${cap(N[id].he)}</div>` : '') : `<div class="wlab">${lbl(id)}</div>`}""")
rep("""  const note = isVid() || S.mode === 'm_night' ? `<div class="pnote"><span class="num">50Hz Anti-flicker Recommended: 25/50/100</span>""",
    """  const fpsNow = parseInt(val(isVid() ? 'p_fps' : 'p_nfps')) || 30, recFps = fpsNow <= 25 ? 25 : fpsNow <= 60 ? 50 : 100;
  const note = isVid() || S.mode === 'm_night' ? `<div class="pnote"><span class="num">50Hz Anti-flicker Recommended:</span><span class="num">${recFps}</span>""")
rep("""    return `<div class="cc"><div class="dots"><i></i><i class="on"></i></div>
      <div class="sdate num">${d.getFullYear()}.${p2(d.getMonth() + 1)}.${p2(d.getDate())}&nbsp;&nbsp;&nbsp;${p2(d.getHours())}:${p2(d.getMinutes())}</div>""",
    """    return `<div class="cc stor"><div class="dots"><i></i><i class="on"></i></div>
      <div class="sdate num">${d.getFullYear()}.${p2(d.getMonth() + 1)}.${p2(d.getDate())}<span class="sp"></span>${p2(d.getHours())}:${p2(d.getMinutes())}</div>""")
(R / 'src/app.js').write_text(a, encoding='utf-8')

# ---------- גופן צר יותר, צהוב לפי צילום המסך ----------
t = (R / 'src/template.html').read_text(encoding='utf-8')
t = t.replace('family=Barlow+Condensed:wght@500;600;700&', 'family=Saira+Extra+Condensed:wght@500;600;700;800&family=Barlow+Condensed:wght@500;600;700&')
t = t.replace('--f-cam:"Barlow Condensed","Arial Narrow",system-ui,sans-serif;', '--f-cam:"Saira Extra Condensed","Barlow Condensed","Arial Narrow",system-ui,sans-serif;')
t = t.replace('--ui:#ffd23f;', '--ui:#ffcc00;')
t = t.replace('.wlab .lb b{font-size:2.6cqw!important;', '.wlab.caponly{position:relative;height:3cqw}.wlab .cap{position:static}\n.wlab .lb b{font-size:2.6cqw!important;')
(R / 'src/template.html').write_text(t, encoding='utf-8')
print('ok')
