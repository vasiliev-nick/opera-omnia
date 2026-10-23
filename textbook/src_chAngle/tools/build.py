import os,re
RELS={r'\le',r'\ge',r'\to',r'\ne',r'\subset',r'\approx',r'\leqslant',r'\geqslant'}
def brk(tex):
    # Allow a line break after each top-level relation of a long inline formula, as TeX does in running text.
    if len(tex)<25:return tex
    out=[];i=0;d=0;n=len(tex)
    def tail_ok(j):
        return tex[j:].strip(' .,;:')!=''
    while i<n:
        if tex[i]=='\\':
            m=re.match(r'\\([A-Za-z]+|.)',tex[i:]);t=m.group(0);out.append(t);i+=len(t)
            if d==0 and t in RELS and tail_ok(i):out.append('{}$<wbr>$')
            continue
        if tex.startswith('&lt;',i) or tex.startswith('&gt;',i):
            out.append(tex[i:i+4]);i+=4
            if d==0 and tail_ok(i):out.append('{}$<wbr>$')
            continue
        c=tex[i];out.append(c);i+=1
        if c=='{':d+=1
        elif c=='}':d-=1
        elif c=='=' and d==0 and tail_ok(i):out.append('{}$<wbr>$')
    return ''.join(out)
def wrap_inline(html):
    parts=re.split(r'(\$\$.*?\$\$)',html,flags=re.S)
    for k in range(0,len(parts),2):
        out=[];pos=0;t=parts[k]
        for m in re.finditer(r'\$([^$]+)\$',t):
            out.append(t[pos:m.start()]);f='$'+brk(m.group(1))+'$';pos=m.end()
            # Keep punctuation on the line of the formula it follows.
            q=re.match(r'[,.;:!?)»]+',t[pos:])
            if q:
                i=f.rfind('<wbr>');i=i+5 if i>=0 else 0
                f=f[:i]+'<span class="nw">'+f[i:]+q.group(0)+'</span>';pos+=len(q.group(0))
            out.append(f)
        out.append(t[pos:]);parts[k]=''.join(out)
    return ''.join(parts)
SP=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P2=os.path.join(SP,'ang');SRC=os.path.join(P2,'src')
rd=lambda p:open(p,encoding='utf-8').read()
BODY=['b0_gloss.html']+sorted((os.path.basename(f) for f in __import__('glob').glob(os.path.join(SRC,'b[1-9]*.html'))),key=lambda f:int(re.findall(r'\d+',f)[0]))
body=wrap_inline(''.join(rd(os.path.join(SRC,f)) for f in BODY))
lines=rd(os.path.join(SP,'fin','scripts.html')).split('\n')
helper='\n'.join(lines[0:39])+'\n'
tail='\n'.join(lines[418:472])+'\n'
import glob
FIGS=['s_help.html','s_3d.html']+sorted(os.path.basename(f) for f in glob.glob(os.path.join(SRC,'s_fig_*.html')))
scripts=helper+''.join(rd(os.path.join(SRC,f)) for f in FIGS)+tail
head=rd(os.path.join(SRC,'head.part'))
open(os.path.join(P2,'body.part'),'w',encoding='utf-8').write(body)
open(os.path.join(P2,'scripts.part'),'w',encoding='utf-8').write(scripts)
import sys;sys.path.insert(0,os.path.join(SP,'kit'));import kit
open(os.path.join(P2,'ch_angle.html'),'w',encoding='utf-8').write(kit.apply(head+body+scripts,'∠'))
print('ok',len(body),len(scripts))
