"""Build display-only WebP copies; source photographs remain byte-for-byte unchanged."""
from pathlib import Path
import hashlib,json
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parent.parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
sources=json.loads((ROOT/'data/product-images-v1.json').read_text())['records']
legacy=json.loads((ROOT/'data/legacy-image-review-v1.json').read_text())['records']
paths={r['localPath']:r['sha256'] for r in sources}
for r in legacy:
 if r['status'] in ('visual_match','recipe_match_pack_unverified'):
  paths.setdefault(r['imagePath'],r['imageSha256'])
dest=ROOT/'assets/product-images/display';dest.mkdir(exist_ok=True)
manifest_path=ROOT/'data/product-image-display-v1.json'
cached={r['sourcePath']:r for r in json.loads(manifest_path.read_text())['records']} if manifest_path.exists() else {}
records=[]
for name,expected in sorted(paths.items()):
 source=ROOT/name;source_hash=sha(source)
 assert source_hash==expected,name+' source changed'
 previous=cached.get(name)
 if previous and previous['sourceSha256']==source_hash and all((ROOT/v['path']).exists() and sha(ROOT/v['path'])==v['sha256'] for v in previous['variants']):
  records.append(previous)
  continue
 with Image.open(source) as original:
  oriented=ImageOps.exif_transpose(original);variants=[]
  for bound in (160,480):
   image=oriented.copy();image.thumbnail((bound,bound),Image.Resampling.LANCZOS)
   if image.mode not in ('RGB','RGBA'):image=image.convert('RGBA' if 'transparency' in image.info else 'RGB')
   target=dest/(source_hash[:24]+'-'+str(bound)+'.webp')
   temporary=target.with_suffix('.tmp')
   image.save(temporary,'WEBP',quality=86,method=4)
   temporary.replace(target)
   variants.append(dict(path=str(target.relative_to(ROOT)),width=image.width,height=image.height,sha256=sha(target),bytes=target.stat().st_size,bound=bound))
  records.append(dict(sourcePath=name,sourceSha256=source_hash,sourceBytes=source.stat().st_size,variants=variants))
 assert sha(source)==source_hash
manifest=dict(version=1,scope='Display derivatives only. Originals and product identity checks are retained.',records=records)
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(dict(sourceFiles=len(records),originalBytes=sum(r['sourceBytes'] for r in records),smallDisplayBytes=sum(r['variants'][0]['bytes'] for r in records),largeDisplayBytes=sum(r['variants'][1]['bytes'] for r in records))))
