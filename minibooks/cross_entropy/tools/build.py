"""Assemble the cross-entropy mini-book: number statements, figures, exercises and questions, add line breaks in long inline formulas, write cross_entropy.html."""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'cross_entropy.html')
BODY = ['b0_gloss.html'] + ['b%d.html' % i for i in range(1, 12)]
SCRIPTS = ['s_helpers.html', 's_figs1.html', 's_figs0.html', 's_figs2.html', 's_figs3.html', 's_figs4.html', 's_tail.html']
rd = lambda f: open(os.path.join(SRC, f), encoding='utf-8').read()

# Numbering. {{Kind:key}} defines the next number of its counter and prints "Kind N";
# {{#key}} prints N, {{@key}} prints "Kind N".
STMT = ['Определение', 'Лемма', 'Теорема', 'Предложение', 'Следствие']
COUNTER = {k: 'stmt' for k in STMT}
COUNTER.update({'Рис': 'fig', 'Упражнение': 'ex', 'Вопрос': 'q'})
SHOW = {'Рис': 'Рис.'}
ABBR = {'Определение': 'Опр.', 'Теорема': 'Теор.', 'Предложение': 'Предл.', 'Следствие': 'Следств.', 'Упражнение': 'Упр.'}


def number(html):
    cnt, num, kind = {}, {}, {}
    for m in re.finditer(r'\{\{(%s):(\w+)\}\}' % '|'.join(COUNTER), html):
        k, key = m.group(1), m.group(2)
        if key in num:
            sys.exit('duplicate key ' + key)
        c = COUNTER[k]
        cnt[c] = cnt.get(c, 0) + 1
        num[key], kind[key] = cnt[c], k
    html = re.sub(r'\{\{(%s):(\w+)\}\}' % '|'.join(COUNTER), lambda m: '%s %d' % (SHOW.get(m.group(1), m.group(1)), num[m.group(2)]), html)
    def ref(m):
        key = m.group(2)
        if key not in num:
            sys.exit('unknown ref ' + key)
        if m.group(1) == '~':
            return '%s %d' % (ABBR.get(kind[key], kind[key]), num[key])
        return str(num[key]) if m.group(1) == '#' else '%s %d' % (kind[key], num[key])
    html = re.sub(r'\{\{([#@~])(\w+)\}\}', ref, html)
    left = re.findall(r'\{\{[^}]*\}\}', html)
    if left:
        sys.exit('unresolved ' + str(left[:5]))
    return html, num, kind


RELS = {r'\le', r'\ge', r'\to', r'\ne', r'\subset', r'\approx', r'\lt', r'\gt', r'\leq', r'\geq', r'\mapsto'}


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
        c = tex[i]; out.append(c); i += 1
        if c in '{[':
            d += 1
        elif c in '}]':
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


body, num, kind = number(''.join(rd(f) for f in BODY))
body = wrap_inline(body)
scripts = ''.join(rd(f) for f in SCRIPTS)
html = rd('head.part') + body + scripts
open(OUT, 'w', encoding='utf-8').write(html)
# A copy to hand out as a single file: a doctype for standards mode and an explicit encoding for opening from disk.
open(OUT.replace('.html', '_file.html'), 'w', encoding='utf-8').write('<!doctype html>\n<html lang="ru">\n<meta charset="utf-8">\n' + html + '\n</html>\n')
print('ok', OUT, len(html), 'statements', sum(1 for k in kind.values() if k in STMT), 'figures', sum(1 for k in kind.values() if k == 'Рис'))
