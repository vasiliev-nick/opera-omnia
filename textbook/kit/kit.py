"""Apply the shared book format (textbook/FORMAT.md) to an assembled chapter page: warm light theme, contents and theme circles, § in headings."""
import os, re
KIT = os.path.dirname(os.path.abspath(__file__))
rd = lambda f: open(os.path.join(KIT, f), encoding='utf-8').read()
OLD_LIGHT = ['--paper:#fbfbf8; --ink:#1d2030; --muted:#5d6277; --rule:#d9dbe4;',
             '--ether:#4b3fb8; --ether-soft:#ecebfa; --warm:#a3542f; --warm-soft:#f8ede5;']
NEW_LIGHT = ['--paper:#f5eee0; --ink:#3b3027; --muted:#7a6b5a; --rule:#ddd0ba;',
             '--ether:#4f42a6; --ether-soft:#e9e1e6; --warm:#a3542f; --warm-soft:#f0e0cc;']
INIT = '<script>try{var t=localStorage.getItem("book-theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);}catch(e){}</script>\n'
OLD_GLOSS = re.compile(r"<script>\n\(function\(\)\{\n  /\* Glossary: opens on hover.*?\}\)\(\);\n</script>\n", re.S)


def apply(html, sym):
    for o, n in zip(OLD_LIGHT, NEW_LIGHT):
        html = html.replace(o, n, 1)
    if 'Book controls (FORMAT.md)' not in html:
        i = html.index('</style>')
        html = html[:i] + rd('controls.css') + html[i:]
    if 'book-theme' not in html:
        m = re.search(r'<meta name="viewport"[^>]*>\n', html) or re.search(r'</title>\n', html)
        html = html[:m.end()] + INIT + html[m.end():]
    if 'gloss navm' not in html:
        i = html.index('<nav class="gloss"')
        html = html[:i] + rd('nav.html') + html[i:]
    if 'nlist' in html and "localStorage.setItem('book-theme'" not in html:
        html, k = OLD_GLOSS.subn(lambda m: rd('tail.html'), html, count=1)
        assert k == 1, 'old glossary script not found'
    # Technical proofs (class "tech") start folded, like solutions.
    html = html.replace("if(sol){p.classList.add('folded');body.inert=true;}\n    lbl.setAttribute('aria-expanded',sol?'false':'true');",
                        "var f0=sol||p.classList.contains('tech');\n    if(f0){p.classList.add('folded');body.inert=true;}\n    lbl.setAttribute('aria-expanded',f0?'false':'true');", 1)
    # Figure captions start folded after their first sentence (Nick, 2026-10-23).
    if 'cap-tog' not in html:
        i = html.rfind('</article>')
        i = i + len('</article>') if i >= 0 else html.rindex('</body>')
        html = html[:i] + '\n' + rd('capfold.html').rstrip('\n') + html[i:]
    html = re.sub(r'<h2([^>]*)>(?=%s\.)' % re.escape(sym), r'<h2\1>§', html)
    html = re.sub(r'(<li><a href="#[^"]+">)(?=%s\.\d)' % re.escape(sym), r'\1§', html)
    return html
