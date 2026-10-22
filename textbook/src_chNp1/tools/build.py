"""Assemble part 1 of chapter 𝒩 (Gaussian vectors) from src/ and apply the shared book kit."""
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
N1 = os.path.join(SP, 'n1'); SRC = os.path.join(N1, 'src')
rd = lambda p: open(p, encoding='utf-8').read()
body = wrap_inline(''.join(rd(os.path.join(SRC, f)) for f in
                           ['b0_gloss.html', 'b1.html', 'b2.html', 'b3.html', 'b4.html', 'b5.html', 'b6.html', 'b7.html']))
lines = rd(os.path.join(SP, 'fin', 'scripts.html')).split('\n')
helper = '\n'.join(lines[0:39]) + '\n'
tail = '\n'.join(lines[418:472]) + '\n'
scripts = helper + rd(os.path.join(SRC, 's_help.html')) + rd(os.path.join(SRC, 's_figs.html')) + tail
head = rd(os.path.join(SRC, 'head.part'))
sys.path.insert(0, os.path.join(SP, 'kit')); import kit
html = kit.apply(head + body + scripts, '𝒩')
open(os.path.join(N1, 'ch_n_part1.html'), 'w', encoding='utf-8').write(html)
print('ok', len(body), len(scripts), len(html))
