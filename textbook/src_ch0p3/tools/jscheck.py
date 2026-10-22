import re,os,subprocess,sys
SP=os.getcwd();html=open('p3/ch0p3.html',encoding='utf-8').read()
blocks=re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>',html,re.S)
d=os.path.join(SP,'p3','tools','js');os.makedirs(d,exist_ok=True)
bad=0
for i,b in enumerate(blocks):
    p=os.path.join(d,'s%02d.js'%i);open(p,'w',encoding='utf-8').write(b)
    r=subprocess.run(['node','--check',p],capture_output=True,text=True)
    if r.returncode:bad+=1;print(p,r.stderr[:400])
print(len(blocks),'blocks,',bad,'failed')
