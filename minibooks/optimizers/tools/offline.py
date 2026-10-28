"""Make a copy of the book that opens without internet: fonts and MathJax are embedded into the page.
Usage: python3 offline.py <book_file.html> <tex-svg.js> <fonts_inline.css> <out.html>
fonts_inline.css holds the @font-face rules of the Google Fonts stylesheet with the woff2 files as data: URLs."""
import re, sys

page, mj, fonts, out = sys.argv[1:5]
html = open(page, encoding='utf-8').read()
html = re.sub(r'<link rel="preconnect"[^>]*>\s*', '', html)
html = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^>]*>', lambda m: '<style>\n' + open(fonts, encoding='utf-8').read() + '\n</style>', html)
js = open(mj, encoding='utf-8').read().replace('</script', '<\\/script')
n = 0
def put(m):
    global n
    n += 1
    return '<script>\n' + js + '\n</script>'
html = re.sub(r'<script src="https://cdnjs\.cloudflare\.com/ajax/libs/mathjax/[^"]*"></script>', put, html)
if n != 1 or 'fonts.googleapis' in html or 'cdnjs.cloudflare' in html:
    sys.exit('offline: an external resource is left')
open(out, 'w', encoding='utf-8').write(html)
print('ok', out, len(html))
