"""Verify identical originals share existing display bytes across new source paths."""
from pathlib import Path
import tempfile,json,shutil,subprocess,sys,hashlib
from PIL import Image
root=Path(__file__).resolve().parent.parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
with tempfile.TemporaryDirectory() as tmp:
 b=Path(tmp);(b/'scripts').mkdir();(b/'data').mkdir();(b/'assets/product-images').mkdir(parents=True)
 shutil.copyfile(root/'scripts/build-responsive-images.py',b/'scripts/build-responsive-images.py')
 first=b/'assets/a.png';second=b/'assets/b.png';Image.new('RGB',(20,20),'blue').save(first);shutil.copyfile(first,second)
 digest=sha(first);variants=[]
 for size in [160,480]:
  p=b/'assets'/f'old-{size}.webp';Image.new('RGB',(20,20),'blue').save(p,'WEBP',quality=35)
  variants.append(dict(path=str(p.relative_to(b)),width=20,height=20,sha256=sha(p),bytes=p.stat().st_size,bound=size))
 records=[dict(appId=i,localPath=f'assets/{name}.png',sha256=digest) for i,name in enumerate(['a','b'])]
 (b/'data/product-images-v1.json').write_text(json.dumps({'records':records}))
 (b/'data/legacy-image-review-v1.json').write_text(json.dumps({'records':[]}))
 (b/'data/product-image-display-v1.json').write_text(json.dumps({'records':[dict(sourcePath='assets/a.png',sourceSha256=digest,sourceBytes=first.stat().st_size,variants=variants)]}))
 subprocess.run([sys.executable,str(b/'scripts/build-responsive-images.py')],check=True,capture_output=True)
 result=json.loads((b/'data/product-image-display-v1.json').read_text())['records']
 assert len(result)==2
 assert all(r['variants']==variants for r in result)
 assert all(sha(b/v['path'])==v['sha256'] for v in variants)
 print('PASS identical originals reuse verified display bytes without overwriting another record')
