"""Collect the numbered items (statements, exercises, questions, figures, sections) of all built chapter pages into kit/xref_index.json.
kit.apply embeds the items that a page mentions but does not hold, so that a click on such a mention can show the item and open its page.
Run after building the pages; rebuild the pages afterwards (two passes when a statement text changes).
Figures get a thumbnail from kit/thumbs (made by kit/xref_thumbs.cjs) and the first sentence of the caption as a title."""
import json, os, re, sys
KIT = os.path.dirname(os.path.abspath(__file__))
SP = os.path.dirname(KIT)
# key, built page, published artifact, file name in textbook/, name shown on the card
PAGES = [
    ('p1', 'ch0_lebesgue.html', 'https://claude.ai/artifact/GhdKLnYYYp4XEAV3AEZdWu', 'ch0_part1_lebesgue.html', 'глава ∅, часть 1'),
    ('p2', 'p2/ch0p2.html', 'https://claude.ai/artifact/3ZgbjUtid9jhJmE82rvcbx', 'ch0_part2_limits.html', 'глава ∅, часть 2'),
    ('p3', 'p3/ch0p3.html', 'https://claude.ai/artifact/KrtzyBg1TSog8xqn48wGRf', 'ch0_part3_fubini.html', 'глава ∅, часть 3'),
    ('nb', 'nb/ch_nabla.html', 'https://claude.ai/artifact/7a1oxXoUjTKVLavKTv5Mdw', 'ch1_nabla_geometry.html', 'глава ∇'),
    ('ang', 'ang/ch_angle.html', 'https://claude.ai/artifact/1pmxEMvV5FRoAiBCqd8rVS', 'ch1b_random_variables_as_vectors.html', 'глава ∠'),
    ('n1', 'n1/ch_n_part1.html', 'https://claude.ai/artifact/6fDRAqCpQNqHudJgqvxAs5', 'ch2_part1_gaussian_vectors.html', 'глава 𝒩, часть 1'),
]
SYM = '[∅∇𝒩∠⊥]'
LBL = re.compile(r'^(Определение|Лемма|Теорема|Предложение|Следствие|Факт|Утверждение|Упражнение|Вопрос)\s+(%s\.\d+)' % SYM)
FIG = re.compile(r'^\s*Рис\.\s*(%s\.\d+)\.\s*' % SYM)


def block(s, i):
    """the end of the <div …> element that starts at i (divs balanced)"""
    d = 0
    for m in re.compile(r'<div\b|</div>').finditer(s, i):
        d += 1 if m.group(0) == '<div' else -1
        if d == 0:
            return m.end()
    return len(s)


def items(html):
    out = {}
    for m in re.finditer(r'<div class="(stmt|ex)"><span class="lbl">(.*?)</span>', html, re.S):
        lab = m.group(2).strip()
        t = LBL.match(re.sub(r'<[^>]+>', '', lab))
        if not t:
            continue
        kind = 'ex' if t.group(1) == 'Упражнение' else 'q' if t.group(1) == 'Вопрос' else 'st'
        end = block(html, m.start())
        body = html[m.end():end - len('</div>')]
        body = re.sub(r'<figure\b.*?</figure>', '', body, flags=re.S)
        out.setdefault(kind + ':' + t.group(2), {'lab': lab, 'html': body.strip()})
    for m in re.finditer(r'<figcaption>(.*?)</figcaption>', html, re.S):
        cap = m.group(1)
        t = FIG.match(cap)
        if t:
            rest = cap[t.end():].strip()
            j = first_sentence(rest)
            it = {'lab': 'Рисунок ' + t.group(1), 'html': '<p>' + rest + '</p>', 'title': rest[:j].strip() if j > 0 else rest}
            th = thumb(t.group(1))
            if th:
                it['img'] = th
            out.setdefault('fig:' + t.group(1), it)
    # sections: the heading and the opening paragraph, which says what the section is about
    for m in re.finditer(r'<h2[^>]*>\s*§?\s*(%s\.\d+)\.\s*(.*?)</h2>' % SYM, html, re.S):
        nxt = re.search(r'<p\b[^>]*>(.*?)</p>', html[m.end():m.end() + 20000], re.S)
        out.setdefault('sec:' + m.group(1), {'lab': '§' + m.group(1) + '. ' + m.group(2).strip(), 'html': '<p>' + nxt.group(1) + '</p>' if nxt else ''})
    return out


SAFE = {'∅': '0', '∇': 'nabla', '∠': 'ang', '𝒩': 'N', '⊥': 'perp'}


def thumb(num):
    """the names of the light and dark thumbnails of a figure, if kit/xref_thumbs.cjs has made them"""
    b = SAFE.get(num[0], num[0]) + num[1:]
    names = {t: 'thumbs/%s_%s.webp' % (b, t) for t in ('light', 'dark')}
    return names if all(os.path.exists(os.path.join(KIT, n)) for n in names.values()) else None


AB = re.compile(r'(?:^|[\s(«>;])(рис|т|е|см|гл|п|ср|напр|др|им|стр|ок|упр|разд|ч|вып|ед)$', re.I)


def first_sentence(s):
    """where the first sentence of a caption ends: outside formulas and open elements, not after abbreviations (as kit/capfold.html cuts)"""
    i, math, depth = 0, 0, 0
    while i < len(s):
        c = s[i]
        if math:
            if c == '\\':
                i += 1
            elif c == '$':
                if math == 2:
                    if s[i + 1:i + 2] == '$':
                        math = 0; i += 1
                else:
                    math = 0
            i += 1; continue
        if c == '<':
            k = s.find('>', i)
            if k < 0:
                return -1
            t = s[i:k + 1]
            if t[1:2] == '/':
                depth -= 1
            elif not re.match(r'<(wbr|br|img|hr|input)\b', t, re.I) and not t.endswith('/>'):
                depth += 1
            i = k + 1; continue
        if c == '$':
            math = 2 if s[i + 1:i + 2] == '$' else 1
            i += 2 if math == 2 else 1; continue
        if c in '.!?' and not (c == '.' and AB.search(s[max(0, i - 9):i])):
            j, d = i + 1, depth
            while True:
                mm = re.match(r'</[a-z0-9]+>', s[j:], re.I)
                if not mm:
                    break
                j += len(mm.group(0)); d -= 1
            sp = re.match(r'(?:\s|&nbsp;)+', s[j:])
            if d == 0 and sp and re.match(r'(?:[А-ЯЁA-Z«(\d$]|<(?!/))', s[j + len(sp.group(0)):]):
                return j
        i += 1
    return -1


def webp():
    """kit/xref_thumbs.cjs leaves PNG screenshots in kit/thumbs; keep them as small WebP pictures, at most 480 px wide"""
    import glob
    try:
        from PIL import Image
    except ImportError:
        return
    for f in glob.glob(os.path.join(KIT, 'thumbs', '*.png')):
        im = Image.open(f).convert('RGB')
        w, h = im.size
        W = min(480, w)
        im.resize((W, round(h * W / w)), Image.LANCZOS).save(f[:-4] + '.webp', 'WEBP', quality=72, method=6)
        os.remove(f)


def main():
    webp()
    idx = {'pages': {}, 'items': {}}
    for key, built, url, fname, name in PAGES:
        p = os.path.join(SP, built)
        if not os.path.exists(p):
            print('missing', built); continue
        idx['pages'][key] = {'url': url, 'file': fname, 'name': name}
        for k, v in items(open(p, encoding='utf-8').read()).items():
            v['p'] = key
            idx['items'].setdefault(k, v)
    json.dump(idx, open(os.path.join(KIT, 'xref_index.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print('items', len(idx['items']), 'pages', list(idx['pages']))


if __name__ == '__main__':
    main()
