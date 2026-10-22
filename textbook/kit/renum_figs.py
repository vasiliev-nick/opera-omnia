"""Renumber figures of chapter ∅ across its three parts in document order; new figures carry placeholders 'Рис. ∅.@key'."""
import os, re, sys
SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P1 = ['ch0_body.part']
P2 = ['p2/src/' + f for f in ['b0_gloss.html', 'b7.html', 'b8.html', 'b9.html', 'b10.html', 'b11.html', 'b12.html', 's_new.html', 's_fig2.html']]
P3 = ['p3/src/' + f for f in ['b0_gloss.html', 'b13.html', 'b14.html', 'b15.html', 'b16.html', 'b17.html', 'b18.html', 's_new.html']]
FILES = P1 + P2 + P3
rd = lambda f: open(os.path.join(SP, f), encoding='utf-8').read()
CAP = re.compile(r'<figcaption>\s*Рис\.\s*∅\.(\d+|@\w+)\.')
order = []
for f in FILES:
    order += CAP.findall(rd(f))
if len(set(order)) != len(order):
    sys.exit('duplicate figure labels: %s' % order)
new = {lab: str(i + 1) for i, lab in enumerate(order)}
REF = re.compile(r'([Рр]ис(?:\.|ун[а-яё]*)\s*)((?:∅\.(?:\d+|@\w+)(?:\s*(?:,|–|—|-|и|или)\s*)?)+)')
NUM = re.compile(r'∅\.(\d+|@\w+)')
bad = []
def fix(m):
    def one(n):
        lab = n.group(1)
        if lab not in new:
            bad.append(lab); return n.group(0)
        return '∅.' + new[lab]
    return m.group(1) + NUM.sub(one, m.group(2))
dry = '--dry' in sys.argv
changed = {}
for f in FILES:
    s = rd(f); t = REF.sub(fix, s)
    left = re.findall(r'∅\.@\w+', t)
    if left:
        bad += left
    if t != s:
        changed[f] = sum(1 for a, b in zip(re.findall(REF, s), re.findall(REF, t)) if a != b)
        if not dry:
            open(os.path.join(SP, f), 'w', encoding='utf-8').write(t)
moves = {k: v for k, v in new.items() if k != v}
print('figures', len(order), 'moved', moves)
print('changed refs', changed)
if bad:
    sys.exit('unresolved labels: %s' % sorted(set(bad)))
