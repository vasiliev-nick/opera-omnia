"""Library page (index.html): every book of the collection on one page, with a search over numbered items.

python3 textbook/kit/hub.py OUT.html [MINIBOOK.html]
Reads xref_index.json (main textbook items and page URLs), the cross-entropy minibook page and the covers in kit/covers/ (made by hub_covers.cjs)."""
import base64, html, json, os, re, sys

KIT = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
MB = sys.argv[2] if len(sys.argv) > 2 else os.path.join(KIT, '..', '..', 'minibooks', 'cross_entropy', 'cross_entropy.html')
rd = lambda p: open(p, encoding='utf-8').read()
X = json.loads(rd(os.path.join(KIT, 'xref_index.json')))

# Page addresses: claude.ai pages, and file paths relative to index.html in the repository root.
PAGES = {k: {'url': v['url'], 'file': 'textbook/' + v['file']} for k, v in X['pages'].items()}
PAGES['mb'] = {'url': 'https://claude.ai/artifact/7JUQRANXVdiuqgyDMfaSdh', 'file': 'minibooks/cross_entropy/cross_entropy_file.html'}
SHORT = {'p1': '∅, часть 1', 'p2': '∅, часть 2', 'p3': '∅, часть 3', 'nb': 'глава ∇', 'ang': 'глава ∠', 'n1': '𝒩, часть 1', 'mb': 'кросс-энтропия'}
for k in PAGES:
    PAGES[k]['short'] = SHORT[k]

MAIN = [
    {'sym': '∅', 'title': 'Мера и интеграл Лебега',
     'desc': 'Язык, на котором написана теория вероятностей: что значит измерить множество и проинтегрировать функцию, когда под знаком интеграла можно переходить к пределу и как ожидание превращается в обычный интеграл с плотностью.',
     'parts': [('p1', 'Часть 1 из 3', 'Мера и интеграл Лебега', 'Мера Лебега, измеримые функции, интеграл, теорема о монотонной сходимости.'),
               ('p2', 'Часть 2 из 3', 'Предельный переход под знаком интеграла', 'Лемма Фату, теорема Лебега о мажорированной сходимости, дифференцирование под интегралом, пространства L¹ и L².'),
               ('p3', 'Часть 3 из 3', 'Образ меры, плотности и теорема Фубини', 'Распределения и плотности, произведение мер, независимость, послойное интегрирование.')]},
    {'sym': '∇', 'title': 'Геометрия формы', 'sub': 'кривизна, которую чувствует палец',
     'desc': 'Как измерить, насколько изогнута граница предмета, как найти кривизну фигуры, заданной уравнением, и почему от кривизны зависит, удержит ли палец предмет от поворота.',
     'parts': [('nb', 'Глава целиком', 'Кривые, кривизна и функция расстояния', 'Длина дуги, кривизна, неявно заданные кривые, функция расстояния со знаком, кривизна по маленькому кусочку границы. Рядом с плоскими выводами — их трёхмерные аналоги.')]},
    {'sym': '∠', 'title': 'Случайные величины как векторы',
     'desc': 'Среднее, дисперсия, ковариация и корреляция — это проекция, длина, скалярное произведение и угол. Геометрия, которой потом говорит глава о гауссовских процессах.',
     'parts': [('ang', 'Глава целиком', 'От трёх исходов до отрезка', 'Три исхода в пространстве, неравные вероятности, счётное и несчётное число исходов, случайная функция как кривая и прогноз как проекция.')]},
    {'sym': '𝒩', 'it': True, 'title': 'Гауссовские процессы', 'sub': 'как машина сомневается в форме',
     'desc': 'Случайные функции, у которых любой конечный набор значений распределён нормально. С их помощью неизвестную форму описывают вместе с неуверенностью в ней.',
     'parts': [('n1', 'Часть 1 из 4', 'Гауссовские векторы', 'Нормальный закон и характеристические функции, гауссовский вектор, некоррелированность и независимость, условное распределение.')],
     'soon': [('Части 2–4', 'Случайные функции, ядра и вычисления с ними.')]},
    {'sym': '⊥', 'title': 'Захват', 'desc': 'При каком условии пальцы удерживают предмет и как это зависит от его формы.', 'soon': [('Глава впереди', 'Будет написана после главы о гауссовских процессах.')], 'later': True},
]
MINI = [
    {'sym': 'H', 'it': True, 'title': 'Кросс-энтропия', 'sub': 'удивление, информация и расстояние между распределениями',
     'desc': 'Почему классификаторы почти всегда учат на кросс-энтропии. Нужны только начала теории вероятностей на конечных множествах, анализа и линейной алгебры.',
     'parts': [('mb', 'Мини-учебник', 'Кросс-энтропия', 'Правдоподобие, информация и удивление, энтропия, неравенство Гиббса, расхождение Кульбака–Лейблера, функция потерь классификатора.')]},
]
COVER = {'p1': 'p1', 'p2': 'p2', 'p3': 'p3', 'nb': 'nb', 'ang': 'ang', 'n1': 'n1', 'mb': 'mb'}
ALT = {'p1': 'Интеграл Лебега: множества, где функция выше уровня', 'p2': 'Тор и градиент функции на сфере', 'p3': 'Плотность пары величин и её частные плотности',
       'nb': 'Овалы Кассини и функция расстояния', 'ang': 'Случайные величины как векторы в пространстве', 'n1': 'Гауссовское облако вокруг формы', 'mb': 'Расхождение Кульбака–Лейблера на треугольнике распределений'}


def plain(h):
    """Text of an item for the search: tags and line-break helpers removed, formulas kept."""
    h = h.replace('{}$<wbr>$', '').replace('<wbr>', '')
    t = re.sub(r'<[^>]+>', ' ', h)
    t = html.unescape(t)
    return re.sub(r'\s+', ' ', t).strip()


def snip(t, n=150):
    """A short beginning of the text that never cuts a formula in half."""
    if len(t) <= n:
        return t
    out, inside = [], False
    for i, ch in enumerate(t):
        if ch == '$':
            inside = not inside
        out.append(ch)
        if i >= n and not inside and ch in ' ,.;':
            break
    return ''.join(out).rstrip(' ,.;') + '…'


# Items of the main textbook from the cross-reference index.
items = []
for k, v in X['items'].items():
    kind = k.split(':')[0]
    txt = plain(v.get('html', ''))
    it = {'key': k, 'k': kind, 'p': v.get('p'), 'lab': v['lab'], 'text': txt[:600]}
    if kind == 'fig':
        it['title'] = re.sub(r'\.$', '', plain(v.get('title') or '') or v['lab'])
    elif kind != 'sec':
        it['snip'] = snip(txt)
    if it['p']:
        items.append(it)

# Items of the minibook, read from its page.
mb = rd(MB)
LBL = re.compile(r'<div class="(stmt|ex)"><span class="lbl">((Определение|Лемма|Теорема|Предложение|Следствие|Упражнение|Вопрос)\s+(\d+)[^<]*)</span>(.*?)(?=<div class="(?:stmt|ex|proof)"|<figure|<h[23]|</section>)', re.S)
for m in LBL.finditer(mb):
    word, num = m.group(3), m.group(4)
    kind = 'ex' if word == 'Упражнение' else 'q' if word == 'Вопрос' else 'st'
    txt = plain(m.group(5))
    items.append({'key': kind + ':' + num, 'k': kind, 'p': 'mb', 'lab': plain(m.group(2)), 'text': txt[:600], 'snip': snip(txt)})
for m in re.finditer(r'<h2[^>]*>§(\d+)\.\s*(.*?)</h2>(.*?)(?=<h2|$)', mb, re.S):
    p1 = re.search(r'<p>(.*?)</p>', m.group(3), re.S)
    items.append({'key': 'sec:' + m.group(1), 'k': 'sec', 'p': 'mb', 'lab': '§' + m.group(1) + '. ' + plain(m.group(2)), 'text': plain(p1.group(1))[:600] if p1 else ''})
for m in re.finditer(r'<figcaption>Рис\.\s*(\d+)\.\s*(.*?)</figcaption>', mb, re.S):
    cap = plain(m.group(2))
    first = re.split(r'(?<=[.!?])\s', cap, maxsplit=1)[0].rstrip('.')
    items.append({'key': 'fig:' + m.group(1), 'k': 'fig', 'p': 'mb', 'lab': 'Рисунок ' + m.group(1), 'title': first, 'text': cap[:600]})

ORDER = ['p1', 'p2', 'p3', 'nb', 'ang', 'n1', 'mb']
KO = {'sec': 0, 'st': 1, 'ex': 2, 'q': 3, 'fig': 4}
num = lambda key: [int(x) for x in re.findall(r'\d+', key)] or [0]
items.sort(key=lambda it: (ORDER.index(it['p']), KO[it['k']], num(it['key'])))
for i, it in enumerate(items):
    it['o'] = i


def ru(n, one, few, many):
    n10, n100 = n % 10, n % 100
    w = one if n10 == 1 and n100 != 11 else few if 2 <= n10 <= 4 and not 12 <= n100 <= 14 else many
    return '%d %s' % (n, w)


def stats(p):
    got = {k: [it for it in items if it['p'] == p and it['k'] == k] for k in KO}
    def rng(k):
        ns = [it['key'].split(':', 1)[1] for it in got[k]]
        return (ns[0], ns[-1]) if ns else None
    out = []
    st, fg, ex = rng('st'), rng('fig'), rng('ex')
    if got['sec']:
        a, b = got['sec'][0]['lab'].split('.')[0:2], got['sec'][-1]['lab']
        s0 = re.match(r'§(\S+?)\.\s', got['sec'][0]['lab'] + ' ').group(1)
        s1 = re.match(r'§(\S+?)\.\s', got['sec'][-1]['lab'] + ' ').group(1)
        out.append('§%s–%s' % (s0, s1.split('.')[-1] if '.' in s1 else s1))
    if st:
        out.append('утверждения %s–%s' % (st[0], st[1].split('.')[-1] if '.' in st[1] else st[1]))
    if fg:
        out.append('%s' % ru(len(got['fig']), 'рисунок', 'рисунка', 'рисунков'))
    if ex:
        out.append('%s' % ru(len(got['ex']), 'упражнение', 'упражнения', 'упражнений'))
    return out


def img(key):
    def uri(t):
        return 'data:image/webp;base64,' + base64.b64encode(open(os.path.join(KIT, 'covers', '%s_%s.webp' % (key, t)), 'rb').read()).decode()
    alt = html.escape(ALT[key])
    return '<span class="cv"><img class="lt" src="%s" alt="%s"><img class="dk" src="%s" alt="%s"></span>' % (uri('light'), alt, uri('dark'), alt)


def block(ch):
    sub = '<i>%s</i>' % ch['sub'] if ch.get('sub') else ''
    parts = []
    for p, pn, pt, pd in ch.get('parts', []):
        pr = ''.join('<span>%s</span>' % x for x in stats(p))
        parts.append('<a class="part" data-p="%s" href="%s" target="_blank" rel="noopener">%s<span class="pi"><span class="pn">%s</span><span class="pt">%s</span><span class="pd">%s</span><span class="pr">%s</span></span></a>'
                     % (p, PAGES[p]['url'], img(COVER[p]), pn, pt, pd, pr))
    for pt, pd in ch.get('soon', []):
        tag = 'впереди' if ch.get('later') else 'пишется'
        parts.append('<div class="part soon"><span class="pi"><span class="tag">%s</span><span class="pt">%s</span><span class="pd">%s</span></span></div>' % (tag, pt, pd))
    cls = 'ch soon' if not ch.get('parts') else 'ch'
    eyebrow = 'Глава %s' % ch['sym'] if ch in MAIN else 'Мини-учебник'
    return ('<li class="%s"><span class="med%s" aria-hidden="true">%s</span><div class="body"><div class="about"><span class="eyebrow">%s</span><h3>%s%s</h3><p>%s</p></div><div class="parts">%s</div></div></li>'
            % (cls, ' it' if ch.get('it') else '', ch['sym'], eyebrow, ch['title'], sub, ch['desc'], ''.join(parts)))


tot = lambda k: sum(1 for it in items if it['k'] == k)
books = sum(len(c.get('parts', [])) for c in MAIN + MINI)
tally = ['<span><b>%d</b> %s</span>' % (n, w) for n, w in [
    (len([c for c in MAIN if c.get('parts')]), 'главы основного учебника'), (len(MINI), 'мини-учебник'),
    (tot('st'), 'утверждений'), (tot('fig'), 'рисунков'), (tot('ex'), 'упражнений')]]
chips = ''.join('<button type="button">%s</button>' % w for w in ['Фубини', 'плотность', 'кривизна', 'гауссовский вектор', 'энтропия'])

data = json.dumps({'pages': PAGES, 'items': items}, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')
page = (rd(os.path.join(KIT, 'hub_template.html'))
        .replace('%%TALLY%%', ''.join(tally)).replace('%%CHIPS%%', chips)
        .replace('%%MAIN%%', '\n'.join(block(c) for c in MAIN)).replace('%%MINI%%', '\n'.join(block(c) for c in MINI))
        .replace('%%DATA%%', data))
open(OUT, 'w', encoding='utf-8').write(page)
print('hub', OUT, len(page), 'items', len(items))
