# -*- coding: utf-8 -*-
# בונה dist/action6-offline.html: קובץ אחד שעובד בלי אינטרנט ובלי שרת.
# הגופנים (רק עברית ולטינית) והתמונה מוטמעים בתוכו.
import re, base64, pathlib, urllib.request
R = pathlib.Path(__file__).resolve().parent.parent
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'}
get = lambda u: urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60).read()

html = (R / 'dist/index.html').read_text(encoding='utf-8')

# גופנים: מורידים את ה-CSS של Google Fonts, משאירים רק בלוקים של עברית ולטינית ומטמיעים כל woff2
link = re.search(r'<link rel="stylesheet" href="(https://fonts\.googleapis\.com/css2\?[^"]+)">', html)
css = get(link.group(1).replace('&amp;', '&')).decode()
blocks = re.findall(r'/\* ([\w-]+) \*/\s*(@font-face\s*\{[^}]*\})', css)
keep = [b for sub, b in blocks if sub in ('latin', 'hebrew')]
cache = {}
def inline(m):
    u = m.group(1)
    if u not in cache: cache[u] = 'data:font/woff2;base64,' + base64.b64encode(get(u)).decode()
    return f'url({cache[u]})'
fonts = '\n'.join(re.sub(r'url\((https://[^)]+)\)', inline, b) for b in keep)
html = html.replace(link.group(0), f'<style>\n{fonts}\n</style>')
html = re.sub(r'<link rel="preconnect"[^>]*>\n?', '', html)

# התמונה מתוך המאגר המקומי
img = 'data:image/webp;base64,' + base64.b64encode((R / 'images/camera-front.webp').read_bytes()).decode()
html = re.sub(r'https://cdn\.jsdelivr\.net/gh/tsoolgee/dji-oa6-hebrew@main/images/camera-front\.webp', img, html)

left = [u for u in re.findall(r'https?://[^"\'\s)]+', html) if 'w3.org' not in u]
assert not left, left
out = R / 'dist/action6-offline.html'
out.write_text(html, encoding='utf-8')
print(f'ok {out.name}: {len(html) // 1024} KB, {len(cache)} font files')
