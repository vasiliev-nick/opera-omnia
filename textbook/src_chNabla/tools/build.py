"""Assemble chapter ∇ (geometry of shape) from src/ and apply the shared book kit."""
import os, re, sys
RELS = {r'\le', r'\ge', r'\to', r'\ne', r'\subset', r'\approx', r'\leqslant', r'\geqslant'}


def brk(tex):
    # Allow a line break after each top-level relation of a long inline formula, as TeX does in running text.
    if len(tex) < 25:
        return tex
    out = []; i = 0; d = 0; n = len(tex)

    def tail_ok(j):
        return tex[j:].strip(' .,;:') != ''
    while i < n:
        if tex[i] == '\\':
            m = re.match(r'\\([A-Za-z]+|.)', tex[i:]); t = m.group(0); out.append(t); i += len(t)
            if d == 0 and t in RELS and tail_ok(i):
                out.append('{}$<wbr>$')
            continue
        if tex.startswith('&lt;', i) or tex.startswith('&gt;', i):
            out.append(tex[i:i + 4]); i += 4
            if d == 0 and tail_ok(i):
                out.append('{}$<wbr>$')
            continue
        c = tex[i]; out.append(c); i += 1
        if c == '{':
            d += 1
        elif c == '}':
            d -= 1
        elif c == '=' and d == 0 and tail_ok(i):
            out.append('{}$<wbr>$')
    return ''.join(out)


def wrap_inline(html):
    parts = re.split(r'(\$\$.*?\$\$)', html, flags=re.S)
    for k in range(0, len(parts), 2):
        out = []; pos = 0; t = parts[k]
        for m in re.finditer(r'\$([^$]+)\$', t):
            out.append(t[pos:m.start()]); f = '$' + brk(m.group(1)) + '$'; pos = m.end()
            # Keep punctuation on the line of the formula it follows.
            q = re.match(r'[,.;:!?)»]+', t[pos:])
            if q:
                i = f.rfind('<wbr>'); i = i + 5 if i >= 0 else 0
                f = f[:i] + '<span class="nw">' + f[i:] + q.group(0) + '</span>'; pos += len(q.group(0))
            out.append(f)
        out.append(t[pos:]); parts[k] = ''.join(out)
    return ''.join(parts)


SP = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
NB = os.path.join(SP, 'nb'); SRC = os.path.join(NB, 'src')
rd = lambda p: open(p, encoding='utf-8').read()
BODY = ['b0_gloss.html'] + ['b%d.html' % i for i in range(1, 9)]
FIGS = sorted(f for f in os.listdir(SRC) if f.startswith('s_f') and f.endswith('.html'))
body = wrap_inline(''.join(rd(os.path.join(SRC, f)) for f in BODY if os.path.exists(os.path.join(SRC, f))))
lines = rd(os.path.join(SP, 'fin', 'scripts.html')).split('\n')
helper = '\n'.join(lines[0:39]) + '\n'
tail = '\n'.join(lines[418:472]) + '\n'
scripts = helper + rd(os.path.join(SRC, 's_help.html')) + rd(os.path.join(SRC, 's_3d.html')) + ''.join(rd(os.path.join(SRC, f)) for f in FIGS) + tail
head = rd(os.path.join(SRC, 'head.part'))
sys.path.insert(0, os.path.join(SP, 'kit')); import kit
html = head + body + scripts
# Figures carry placeholders 'Рис. ∇.@key' in the sources; number them in the order of their captions
# (before the kit, so that the cross-reference cards see the real numbers).
order = re.findall(r'<figcaption>\s*Рис\.\s*∇\.@(\w+)\.', html)
dup = sorted({k for k in order if order.count(k) > 1})
num = {k: str(i + 1) for i, k in enumerate(order)}
miss = sorted({k for k in re.findall(r'∇\.@(\w+)', html) if k not in num})
html = re.sub(r'∇\.@(\w+)', lambda m: '∇.' + num.get(m.group(1), '@' + m.group(1)), html)
html = kit.apply(html, '∇')
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(NB, 'ch_nabla.html')
open(out, 'w', encoding='utf-8').write(html)
print('ok', len(body), len(scripts), len(html), FIGS)
print('figures', ' '.join('%s=%s' % (k, num[k]) for k in order))
if dup or miss:
    print('FIGURE LABELS: duplicate', dup, 'unresolved', miss)
