# בונה את הדף הסופי: מטמיע נתונים, אייקונים וקוד בקובץ HTML אחד; התמונות בכתובת חיצונית
import json, re, pathlib
R = pathlib.Path(__file__).parent
# התמונות מאוחסנות במאגר GitHub ומוגשות דרך jsDelivr, לא מוטמעות בקובץ
IMG = 'https://cdn.jsdelivr.net/gh/tsoolgee/dji-oa6-hebrew@main/images/'
t = (R/'src/template.html').read_text(encoding='utf-8').replace('{{SCREENCSS}}', (R/'src/screen.css').read_text(encoding='utf-8'))
js = '\n'.join((R/'src'/f).read_text(encoding='utf-8') for f in ['icons.js', 'data.js', 'feed.js', 'app.js'])
svg = lambda p: f'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{p}</svg>'
# בטלפון: טקסט המסך גדל פי --k בלי לשנות את הפריסה
t = re.sub(r'font-size:([0-9.]+)cqw', lambda m: f'font-size:calc({m.group(1)}cqw * var(--k))', t)
t = (t.replace('{{PHOTO}}', IMG + 'camera-front.webp')
      .replace('{{I_DOWN}}', svg('<path d="M12 4v15"/><path d="m6 13 6 6 6-6"/>'))
      .replace('{{I_UP}}', svg('<path d="M12 20V5"/><path d="m6 11 6-6 6 6"/>'))
      .replace('{{I_SIDE}}', svg('<path d="M3 12h18"/><path d="m7 8-4 4 4 4"/><path d="m17 8 4 4-4 4"/>'))
      .replace('{{I_SEARCH}}', svg('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>'))
      .replace('{{I_FLIP}}', svg('<path d="M4 7h13l-3-3M20 17H7l3 3"/>'))
      .replace('{{I_FULL}}', svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'))
      .replace('{{I_INFO}}', svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'))
      .replace('{{JS}}', js))
(R/'dist').mkdir(exist_ok=True)
(R/'dist/artifact.html').write_text(t, encoding='utf-8')
full = '<!doctype html>\n<html lang="he" dir="rtl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n' + t + '\n</body>\n</html>\n'
(R/'dist/index.html').write_text(full, encoding='utf-8')
print('ok', len(full)//1024, 'KB')
