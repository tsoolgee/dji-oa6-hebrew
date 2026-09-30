# סבב כיול שני: 4 דוחות ויזואליים (live, params, cc-storage, body) מתוך ביקורת 10 הסוכנים
import pathlib, re
R = pathlib.Path(__file__).parent.parent

# ---------- screen.css: בלוק כיול 2 בסוף (גובר על הקודמים) ----------
p = R / 'src/screen.css'
css = p.read_text(encoding='utf-8').split('/* ===== כיול 2')[0].rstrip('\n')
css += r"""

/* ===== כיול 2: ביקורת 10 הסוכנים (מדידות מול איורי המדריך, cqw = אחוז מרוחב המסך) ===== */
/* מסך הצילום: #screen בראש כל כלל אייקון כדי לגבור על '#screen .ic' */
.ov.p1{left:1.1cqw;top:1.4cqw;font-size:5.4cqw;gap:1.6cqw}
#screen .ov.p1 .ic{width:7cqw;height:7cqw}
.ov.p1 .num{position:relative;top:-.3cqw}
.ov.p2{left:1.1cqw;top:50.7%}
#screen .ov.p2 .ic{width:7cqw;height:7cqw}
.ov.p3{left:.7cqw;bottom:1cqw}
#screen .ov.p3 .ic{width:8cqw;height:8cqw}
.ov.p4{right:3cqw;top:3cqw}
#screen .batt{width:6.8cqw;min-width:0;height:5.2cqw;border:.45cqw solid #fff;border-radius:1cqw;padding:0;font-size:4.4cqw;letter-spacing:-.02em;box-shadow:none}
#screen .batt::after{right:-1.25cqw;width:.8cqw;height:2.2cqw;border-radius:0 .3cqw .3cqw 0}
.ov.p5{right:1.1cqw;top:50.7%}
#screen .ov.p5 .ic{width:9cqw;height:9cqw}
.ov.p6{top:71.4%;font-size:5cqw;right:2.1cqw}
.ov.p7{font-size:6.2cqw;bottom:0}
.ov.p8{right:2.2cqw;bottom:1.2cqw}
#screen .zb{min-width:6.8cqw;height:6.4cqw;border:.3cqw solid rgb(255 255 255/.8);border-radius:1.4cqw;font-size:4.5cqw;padding:0 .4cqw}
#screen .ov .num{letter-spacing:.035em}
#screen .batt .num{letter-spacing:-.02em}
.ov.tc{font-size:5cqw}
#screen.orig .ov:hover{background:none}

/* לוח הפרמטרים (צילום המסך בעמ' 16) */
.params{padding:5.2cqw 3.2cqw 2.8cqw}
.ptiles{grid-template-columns:1fr .75fr 1fr;gap:3.4cqw}
.ptile{height:8.5cqw;border-radius:1.65cqw;background:#17181a;color:#d1d1d1;font-size:4.5cqw;gap:2.2cqw}
#screen .ptile .ic{width:6cqw;height:6cqw}
#screen .ptile[data-tileopt="p_aspect"] .ic{width:5.5cqw;height:5.5cqw;color:#fff}
.pbody{padding-top:2.6cqw;gap:0;justify-content:flex-start}
.wsec{gap:2cqw}
.wlab .lb small{font-size:4.3cqw!important;color:#ccc!important}
.wdiv{height:.85cqw;width:55cqw;margin:2.1cqw auto 1.6cqw;background:linear-gradient(90deg,transparent,#0b0b0b 10%,#111 19%,#1a1a1a 29%,#212121 36%,#282828 42%,#333 50%,#282828 58%,#212121 64%,#1a1a1a 71%,#111 81%,#0b0b0b 90%,transparent)}
.wtrack{gap:6.2cqw}
.wheel[data-wheel="p_fps"] .wtrack,.wheel[data-wheel="p_nfps"] .wtrack,.wheel[data-wheel="p_trfps"] .wtrack{gap:10.6cqw}
.wheel{-webkit-mask:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
.pnote{font-size:5.25cqw;gap:1.6cqw;padding-top:.4cqw;color:#ccc}
.pinfo{color:#ccc;right:-.75cqw;top:50%;bottom:auto;transform:translateY(-50%)}
#screen .pinfo .ic{width:5.6cqw!important;height:5.6cqw!important}
.params .handle.top{width:10.2cqw;height:1.13cqw;top:1.85cqw;border-radius:.6cqw;background:#333}

/* מרכז הבקרה (עמ' 18) */
.handle{width:13cqw;height:1.5cqw;border-radius:.75cqw;background:#353232}
.handle.bot{bottom:2.2cqw}
.cc{padding:1.9cqw 4.9cqw 0}
.tiles{flex:none;grid-template-columns:repeat(4,20cqw);grid-template-rows:repeat(2,20cqw);gap:3.6cqw 3.4cqw;justify-content:space-between;align-content:start;align-items:start;justify-items:center;padding-top:.3cqw}
.tile{width:20cqw;border-radius:4.7cqw;background:#121313}
.dots{gap:5.6cqw;padding-bottom:1.9cqw}
.dots i{width:2.4cqw;height:2.4cqw;background:#353232}
.dots i.on{background:#fff}
/* כשהתרגום דולק יש תוויות מתחת לאריחים: אריחים קטנים יותר כדי שהכול ייכנס */
#screen:not(.orig) .tiles{grid-template-columns:repeat(4,1fr);grid-template-rows:auto auto;gap:.8cqw 3.2cqw;justify-content:stretch;padding-top:0}
#screen:not(.orig) .tile{width:13.4cqw;border-radius:3.1cqw}

/* אחסון (עמ' 20) */
.cc.stor{padding:1.5cqw 5.1cqw 5.6cqw}
.scards{grid-template-columns:1.13fr 1.19fr 1fr;gap:4cqw}
.scard .shead{padding:2.6cqw 0;font-size:4.4cqw;line-height:1.1;background:#66696e}
.scard.on{border-color:#fdd961}
.scard.on .shead{background:#fdd961;color:#111}
.ring{width:20.5cqw;background:radial-gradient(closest-side,#161718 86%,transparent 87%),conic-gradient(#e3e3e3 calc(var(--p) * 360deg),#454648 0)}
.sdate{color:#d6d6d6}
.sdate .sp{width:5.5cqw}
"""
p.write_text(css, encoding='utf-8')

# ---------- icons.js: 9 אייקונים לפי האיורים ----------
p = R / 'src/icons.js'
ic = p.read_text(encoding='utf-8')
NEW = {
  'store': r"""'<path fill-rule="evenodd" d="M3.2 4.3h17.6a2.2 2.2 0 0 1 2.2 2.2v11a2.2 2.2 0 0 1-2.2 2.2H3.2A2.2 2.2 0 0 1 1 17.5v-11a2.2 2.2 0 0 1 2.2-2.2zM17.9 3a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8z"/><path fill-rule="evenodd" d="M17.9 3.9a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 1.9a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2zm0 1.8a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6z"/>'""",
  'play': r"""'<path fill-rule="evenodd" d="M2.8 3.75h18.4a1.8 1.8 0 0 1 1.8 1.8v12.9a1.8 1.8 0 0 1-1.8 1.8H2.8A1.8 1.8 0 0 1 1 18.45V5.55a1.8 1.8 0 0 1 1.8-1.8zm6.6 4.35v7.8l7-3.9z"/>'""",
  'sliders': r"""'<path d="M3 7.45h11.8v1.6H3zM18.5 7.45H21v1.6h-2.5zM3 14.95h6.8v1.6H3zM13.5 14.95H21v1.6h-7.5z"/><circle cx="14.8" cy="8.25" r="2.6"/><circle cx="9.8" cy="15.75" r="2.6"/>'""",
  'video': r"""'<rect x="2" y="5.5" width="13.5" height="13" rx="2.2"/><path d="M17.3 9.7 21.2 7.1q1.3-.8 1.3.7v8.4q0 1.5-1.3.7l-3.9-2.6z"/>'""",
  'autorot': r"""'<rect x="3.3" y="4" width="9.4" height="16.5" rx="2" fill="#454545" stroke="currentColor" stroke-width="1.8"/><path d="M13.6 11.6h5.3a2 2 0 0 1 2 2v4.9a2 2 0 0 1-2 2h-6.2z" fill="#454545"/><path d="M18.9 11.6a2 2 0 0 1 2 2v4.9a2 2 0 0 1-2 2h-6.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M13.6 11.6h5.3" stroke="currentColor" stroke-width="1.8" opacity=".4"/><path d="M15 3.4a6.5 6.5 0 0 1 5.6 4.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".64"/>'""",
  'info': r"""'<path fill-rule="evenodd" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2.6a7.4 7.4 0 1 0 0 14.8 7.4 7.4 0 0 0 0-14.8zM10.7 9.8h2.6v7h-2.6zm0-3h2.6v2.2h-2.6z"/>'""",
  'lock': r"""'<path d="M8.3 10.6V7.8a3.7 3.7 0 0 1 7.4 0v2.8" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/><path fill-rule="evenodd" d="M6.2 10.6h11.6a1.6 1.6 0 0 1 1.6 1.6v7.6a1.6 1.6 0 0 1-1.6 1.6H6.2a1.6 1.6 0 0 1-1.6-1.6v-7.6a1.6 1.6 0 0 1 1.6-1.6zm5.8 3.3a.85.85 0 0 0-.85.85v2.5a.85.85 0 0 0 1.7 0v-2.5a.85.85 0 0 0-.85-.85z"/>'""",
  'orient': r"""'<rect x="8.6" y="8.6" width="6.8" height="6.8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M20.6 10.2A8.8 8.8 0 0 0 4.3 8.6M3.4 13.8a8.8 8.8 0 0 0 16.3 1.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M1.7 7.4 7 8.1l-3.3 4.1zM22.3 16.6 17 15.9l3.3-4.1z"/>'""",
  'qs': r"""'<rect x="2.4" y="4.2" width="19.2" height="16.4" rx="2.4"/><text x="12" y="17.9" text-anchor="middle" font-size="14" font-weight="800" letter-spacing="-.2" fill="#121313" font-family="Saira Extra Condensed, Barlow Condensed, Arial Narrow, sans-serif">QS</text>'""",
  'voice': r"""'<path fill-rule="evenodd" d="M12.4 3.8h6.4a2.6 2.6 0 0 1 2.6 2.6v12.3h-7.2v-2.9h-2.1a1 1 0 0 1-1-1v-2.1l-1.6-.6a.6.6 0 0 1-.3-.9l1.9-2.4V6.4a2.6 2.6 0 0 1 1.3-2.6zm2.4 3.6a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z"/><path d="M6.4 9.3a3.8 3.8 0 0 0 0 5.4M3.6 7.2a7 7 0 0 0 0 9.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'""",
  'gear': r"""'<path fill-rule="evenodd" stroke="currentColor" stroke-width="1" stroke-linejoin="round" d="M12 2.9 20.1 7.6v8.8L12 21.1l-8.1-4.7V7.6zm0 5.5a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2z"/>'""",
  'front': r"""'<rect x="3" y="4.4" width="18" height="1.8" rx=".9" opacity=".55"/><rect x="3" y="17.8" width="18" height="1.8" rx=".9" opacity=".55"/><path fill-rule="evenodd" d="M4.5 7.1h15A1.5 1.5 0 0 1 21 8.6v6.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 15.4V8.6a1.5 1.5 0 0 1 1.5-1.5zm3 8.4h10l-3.3-4.6-2.4 3.1-1.5-1.6z"/>'""",
}
for k, v in NEW.items():
    ic, n = re.subn(r"(\n  " + k + r": )'(?:[^'\\]|\\.)*',", lambda m: m.group(1) + v + ',', ic, count=1)
    assert n == 1, k
# יד: קשתות אפורות, יד קטנה ומוטה יותר
ic, n = re.subn(r'<g transform="translate\(-1\.5 2\.2\) rotate\(-20 11 13\)">', '<g transform="translate(1.2 1.6) scale(.86) rotate(-24 12 13)">', ic, count=1)
assert n == 1, 'hand g'
ic = ic.replace('stroke="#9a9a9a" stroke-width="2.2"', 'stroke="#8a8a8a" stroke-width="1.8"', 1)
# הפלוס של "מצב מותאם" עבה יותר
ic = ic.replace('m-.95 2.4v2.25h-2.25v1.9h2.25v2.25h1.9v-2.25h2.25v-1.9h-2.25V14z', 'm-.95 2.5v2.15H15v1.9h2.25v2.15h1.9v-2.15H21v-1.9h-2.05V14.1z', 1)
p.write_text(ic, encoding='utf-8')

# ---------- template.html: גוף המצלמה לפי שרטוט עמ' 6 ----------
p = R / 'src/template.html'
t = p.read_text(encoding='utf-8')
def rep(a, b):
    global t
    assert a in t, 'MISSING ' + a[:70]
    t = t.replace(a, b, 1)
rep('<span class="battline"></span><span class="djilogo">dji</span><span class="brand">OSMO ACTION</span>', '')
rep('<i></i><span dir="ltr">f/2.0-4.0 · 155°</span></button>', '<i></i></button>')
rep('<span class="flogo">OSMO ACTION</span>', '<span class="fmic"></span><span class="flogo">ACTION</span><span class="fsix">6</span>')
t = t.split('/* ===== גוף המצלמה: כיול 2')[0] if '/* ===== גוף המצלמה: כיול 2' in t else t
BODY = r"""
/* ===== גוף המצלמה: כיול 2 לפי שרטוט עמ' 6 (אחוז מרוחב/גובה הגוף) ===== */
.cam{border-radius:7% / 10.8%;padding:6% 4.5%}
.cam::after{border-radius:6.3% / 9.7%}
.bezel{padding:7.8% 8.2%;border-radius:4% / 6.3%}
.sh{left:58%;width:18%}
.shf{left:24%;width:18%}
.qsr{left:-1.7%;top:17%;width:2.6%;height:31%}
.qsf{right:-1.7%;top:17%;width:2.6%;height:31%}
.hwlab.s{left:62%}
.cam.front{padding:0;container-type:inline-size}
.fbez{left:5%;top:6.5%;width:44%}
.bezel.sqb{padding:10%;border-radius:8%}
.lens{left:48.5%;top:12.5%;height:71%;z-index:2}
.ctsens{left:37.5%;top:79.5%;width:11%;height:9.5%;aspect-ratio:auto;border-radius:999px}
.fmic{position:absolute;left:34.5%;top:84%;width:1.6%;aspect-ratio:1;border-radius:50%;background:#000}
.flogo{left:6%;bottom:11%;font-family:var(--f-cam);font-size:6.4cqw;font-weight:800;letter-spacing:.02em;color:rgb(255 255 255/.7)}
.fsix{position:absolute;left:83%;bottom:6%;font-family:var(--f-display);font-weight:800;font-size:8cqw;line-height:1;color:rgb(255 255 255/.7)}
@media (max-width:600px){.cam{padding:6% 4.5%}.bezel{padding:7.8% 8.2%}}
"""
rep('\n/* פקדי החלקה */', BODY + '\n/* פקדי החלקה */')
rep('.cam{padding:3% 3.2%}.bezel{padding:2.2% 2%}', '.cam{padding:6% 4.5%}.bezel{padding:7.8% 8.2%}')
p.write_text(t, encoding='utf-8')
print('ok')
