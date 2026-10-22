"""Assemble chapter ∅ part 1 from ch0_head.part and ch0_body.part and apply the shared book format."""
import os, sys
SP = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(SP, 'kit')); import kit
rd = lambda f: open(os.path.join(SP, f), encoding='utf-8').read()
html = kit.apply(rd('ch0_head.part') + rd('ch0_body.part'), '∅')
open(os.path.join(SP, 'ch0_lebesgue.html'), 'w', encoding='utf-8').write(html)
print('ok', len(html))
