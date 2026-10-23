"""Collect the numbered items (statements, exercises, questions, figures) of all built chapter pages into kit/xref_index.json.
kit.apply embeds the items that a page mentions but does not hold, so that a click on such a mention can show the item and open its page.
Run after building the pages; rebuild the pages afterwards (two passes when a statement text changes)."""
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
            out.setdefault('fig:' + t.group(1), {'lab': 'Рисунок ' + t.group(1), 'html': '<p>' + cap[t.end():].strip() + '</p>'})
    return out


def main():
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
