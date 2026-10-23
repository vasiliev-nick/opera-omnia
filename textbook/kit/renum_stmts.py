"""Shift the numbers of the statements of chapter ∅ from FROM on by +1 in all chapter sources (a new numbered statement is inserted at FROM).
Figure and exercise numbers share the prefix ∅. but have their own sequences, so a token is renumbered only when it is not in a list after «рис.», «упражнение» or «вопрос».
Usage: python3 kit/renum_stmts.py FROM [--apply]"""
import re, sys, glob, os
SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FROM = int(sys.argv[1]); APPLY = '--apply' in sys.argv
FILES = [f for d in ['p2/src', 'p3/src', 'n1/src', 'ang/src', 'nb/src'] for f in glob.glob(os.path.join(SP, d, '*.html')) + glob.glob(os.path.join(SP, d, '*.part'))]
FILES += [os.path.join(SP, f) for f in ['ch0_body.part', 'ch0_head.part']]
NUM = r'∅\.\d+(?:\s*\([а-яё]\))*(?:\s*\([а-яё]\)\s*(?:,|и)\s*\([а-яё]\))*'
SEP = r'\s*(?:,|и|или|–|—|-|&nbsp;)\s*'
# Sections (§∅.7, §∅.13–∅.18), short labels (Упр., Вопр.), English comments (Fig.) and index keys (fig:, sec:, ex:, q:) keep their numbers too.
OTHER = re.compile(r'(?:[Рр]ис(?:\.|ун\w*)|[Уу]пражнени\w*|[Уу]пр\.|[Вв]опрос\w*|[Вв]опр\.|Fig\.|Exercise|§§?|\b(?:fig|sec|ex|q):)\s*(?:<[^>]+>\s*)*(' + NUM + r'(?:' + SEP + NUM + r')*)')
TOK = re.compile(r'∅\.(\d+)')
# Section numbers in headings and in the contents list of a part («<h2>∅.14. Плотности», «<a href="#a14">∅.14. …»).
HEAD = re.compile(r'(?:<h[23][^>]*>|<a href="#a\d+">)\s*(∅\.\d+)\.')
# The opening paragraph of an «Упражнения и вопросы» section lists exercises by bare numbers in brackets: «(∅.14 и ∅.16)».
EXSEC = re.compile(r'<h2[^>]*>[^<]*Упражнения и вопросы</h2>\s*<p>(.*?)</p>', re.S)
BARE = re.compile(r'\((∅\.\d+(?:\s*(?:и|,)\s*∅\.\d+)*)\)')
total = 0
for f in sorted(FILES):
    s = open(f, encoding='utf-8').read()
    skip = set()
    for m in OTHER.finditer(s):
        for t in TOK.finditer(m.group(1)):
            skip.add(m.start(1) + t.start())
    for m in HEAD.finditer(s):
        skip.add(m.start(1))
    for m in EXSEC.finditer(s):
        for b in BARE.finditer(m.group(1)):
            for t in TOK.finditer(b.group(1)):
                skip.add(m.start(1) + b.start(1) + t.start())
    out, last, n = [], 0, 0
    for t in TOK.finditer(s):
        k = int(t.group(1))
        if k < FROM or t.start() in skip:
            if k >= FROM: print('  keep', os.path.relpath(f, SP), repr(s[max(0, t.start() - 30):t.end()]))
            continue
        out.append(s[last:t.start()]); out.append('∅.%d' % (k + 1)); last = t.end(); n += 1
    out.append(s[last:])
    if n:
        total += n; print(os.path.relpath(f, SP), n)
        if APPLY: open(f, 'w', encoding='utf-8').write(''.join(out))
print('total', total, 'applied' if APPLY else 'dry run')
