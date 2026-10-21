"""Build the public beta from this GitHub checkout; exclude audits and private reports."""
import argparse,hashlib,json,shutil,zipfile,subprocess
from urllib.parse import quote
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser();parser.add_argument('output');args=parser.parse_args()
out=Path(args.output).resolve();out.mkdir(parents=True,exist_ok=True)
if out==ROOT or ROOT in out.parents:raise SystemExit('Choose a build folder outside the source checkout.')
manifest=json.loads((ROOT/'data/product-image-display-v1.json').read_text())
selected={p.relative_to(ROOT).as_posix() for p in ROOT.glob('*.html')}
for p in (ROOT/'assets').rglob('*'):
    if p.is_file() and '.DS_Store'!=p.name and 'product-images' not in p.parts:selected.add(p.relative_to(ROOT).as_posix())
original_commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
redirects=[]
for record in manifest['records']:
    original=ROOT/record['sourcePath']
    if hashlib.sha256(original.read_bytes()).hexdigest()!=record['sourceSha256']:raise SystemExit('Original image changed: '+record['sourcePath'])
    # Keep originals byte-for-byte in GitHub. The beta serves the small verified
    # display copies locally and redirects original-photo requests to this commit.
    encoded=quote('/'+record['sourcePath'],safe='/')
    browser_path=quote('/'+record['sourcePath'],safe="/!'()*;:@&=+$,[]~")
    for source_path in dict.fromkeys([encoded,browser_path]):
        redirects.append(source_path+' https://raw.githubusercontent.com/muckatester/mucka-prototype/'+original_commit+encoded+' 302')
    selected.update(v['path'] for v in record['variants'])
rows=[]
for name in sorted(selected):
    source=ROOT/name
    if not source.is_file():raise SystemExit('Missing public asset: '+name)
    if source.stat().st_size>10*1024*1024:raise SystemExit('Public display asset exceeds hosting limit: '+name)
    dest=out/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source,dest)
    rows.append({'path':name,'bytes':source.stat().st_size,'sha256':hashlib.sha256(source.read_bytes()).hexdigest()})
(out/'_redirects').write_text('\n'.join(redirects)+'\n')
shutil.copyfile(ROOT/'_headers',out/'_headers')
for name in ['_redirects','_headers']:
    selected.add(name);source=out/name;rows.append({'path':name,'bytes':source.stat().st_size,'sha256':hashlib.sha256(source.read_bytes()).hexdigest()})
# No stale file can silently survive into a later build.
for p in out.rglob('*'):
    if p.is_file() and p.relative_to(out).as_posix() not in selected:p.unlink()
zip_path=out.with_suffix('.zip')
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=4) as z:
    for row in rows:z.write(out/row['path'],row['path'])
record={'version':'2026.10.22.1','originalImageCommit':original_commit,'fileCount':len(rows),'publishBytes':sum(r['bytes'] for r in rows),'zipBytes':zip_path.stat().st_size,'files':rows}
out.with_name(out.name+'-manifest.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({k:v for k,v in record.items() if k!='files'}))
