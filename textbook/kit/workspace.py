"""Rebuild the main textbook straight from this repository.

The chapter build scripts were written for a working folder with the layout
    SP/kit, SP/fin/scripts.html, SP/ch0_head.part + SP/ch0_body.part + SP/build_p1.py (∅ part 1),
    SP/p2, SP/p3 (∅ parts 2, 3), SP/nb (∇), SP/ang (∠), SP/n1 (𝒩 part 1).
This script makes such a folder out of symbolic links into textbook/, so the sources are edited in place,
runs the builds and copies the finished pages back to textbook/*.html.

    python3 textbook/kit/workspace.py            # build every chapter, index cross-references, build again
    python3 textbook/kit/workspace.py nb ang     # build only these chapters (one pass, no reindexing)
    python3 textbook/kit/workspace.py --link     # only make the working folder (textbook/_work)

The check scripts (*.cjs, Node.js + Playwright) load MathJax from <working folder>/mj, kit/chk.cjs from textbook/mj:
    npm install --prefix textbook/_work/mj mathjax@3     (this script links textbook/mj to it)
and run with the working folder as the current directory, e.g. cd textbook/_work && node kit/chk.cjs nb/ch_nabla.html shots/nb

Chapter keys: p1 p2 p3 nb ang n1. A full build takes two passes because a page embeds the text of the
statements of other pages that it mentions (kit/xref_index.json)."""
import os, shutil, subprocess, sys

KIT = os.path.dirname(os.path.realpath(__file__))
TB = os.path.dirname(KIT)
WS = os.path.join(TB, '_work')
# key: source folder in textbook/, build script inside the working folder, page it writes, page in textbook/
CHAPTERS = [
    ('p1', 'src_ch0p1', 'build_p1.py', 'ch0_lebesgue.html', 'ch0_part1_lebesgue.html'),
    ('p2', 'src_ch0p2', 'p2/tools/build.py', 'p2/ch0p2.html', 'ch0_part2_limits.html'),
    ('p3', 'src_ch0p3', 'p3/tools/build.py', 'p3/ch0p3.html', 'ch0_part3_fubini.html'),
    ('nb', 'src_chNabla', 'nb/tools/build.py', 'nb/ch_nabla.html', 'ch1_nabla_geometry.html'),
    ('ang', 'src_chAngle', 'ang/tools/build.py', 'ang/ch_angle.html', 'ch1b_random_variables_as_vectors.html'),
    ('n1', 'src_chNp1', 'n1/tools/build.py', 'n1/ch_n_part1.html', 'ch2_part1_gaussian_vectors.html'),
]


def link(src, dst):
    if os.path.islink(dst) or os.path.isfile(dst):
        os.remove(dst)
    os.symlink(os.path.relpath(src, os.path.dirname(dst)), dst)


def make():
    os.makedirs(os.path.join(WS, 'fin'), exist_ok=True)
    link(KIT, os.path.join(WS, 'kit'))
    link(os.path.join(KIT, 'fin_scripts.html'), os.path.join(WS, 'fin', 'scripts.html'))
    if not os.path.lexists(os.path.join(TB, 'mj')):
        link(os.path.join(WS, 'mj'), os.path.join(TB, 'mj'))
    for key, src, *_ in CHAPTERS:
        if key == 'p1':
            for f in ('ch0_head.part', 'ch0_body.part', 'build_p1.py'):
                link(os.path.join(TB, src, f), os.path.join(WS, f))
        else:
            link(os.path.join(TB, src), os.path.join(WS, key))


def build(keys):
    for key, src, script, out, page in CHAPTERS:
        if key not in keys:
            continue
        subprocess.run([sys.executable, os.path.join(WS, script)], check=True)
        shutil.copyfile(os.path.join(WS, out), os.path.join(TB, page))
        print('built', page)


if __name__ == '__main__':
    args = sys.argv[1:]
    make()
    if args == ['--link']:
        sys.exit()
    every = [c[0] for c in CHAPTERS]
    if args:
        build([a for a in args if a in every])
    else:
        build(every)
        subprocess.run([sys.executable, os.path.join(WS, 'kit', 'xref_index.py')], check=True)
        build(every)
