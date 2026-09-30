import sys, io
P = r'C:/Users/USER/Documents/CLAOD/dji-oa6-hebrew/src/data.js'
def apply(pairs):
    s = io.open(P, encoding='utf-8').read()
    n = 0
    for old, new in pairs:
        c = s.count(old)
        if c != 1:
            print('SKIP (count=%d): %s' % (c, old[:70])); continue
        s = s.replace(old, new); n += 1
    io.open(P, 'w', encoding='utf-8', newline='').write(s)
    print('applied', n, 'of', len(pairs))
def setline(nid, newline):
    s = io.open(P, encoding='utf-8').read()
    key = "node('%s'," % nid
    assert s.count(key) == 1, nid
    i = s.index(key); j = s.index('\n', i)
    s = s[:i] + newline + s[j:]
    io.open(P, 'w', encoding='utf-8', newline='').write(s)
    print('set', nid)
