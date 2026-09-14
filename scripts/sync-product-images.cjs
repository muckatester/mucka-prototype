const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/product-images-v1.json'), 'utf8'));
const records = manifest.records;
const ids = new Set();
for (const r of records) {
  if (ids.has(r.appId)) throw new Error('Duplicate image ID: ' + r.appId);
  ids.add(r.appId);
  if (!['pack_match', 'recipe_match_pack_unverified'].includes(r.matchStatus)) throw new Error('Unresolved image: ' + r.appId);
  if (!r.visualChecked || !r.shownPack || !r.identityEvidence || !/^https:\/\//.test(r.sourcePage)) throw new Error('Missing evidence: ' + r.appId);
  let current = root;
  for (const segment of r.localPath.split('/')) {
    if (!segment || ['.', '..'].includes(segment) || !fs.readdirSync(current).includes(segment)) throw new Error('Invalid or incorrectly cased image: ' + r.localPath);
    current = path.join(current, segment);
  }
  if (crypto.createHash('sha256').update(fs.readFileSync(current)).digest('hex') !== r.sha256) throw new Error('Image changed since review: ' + r.appId);
}
const minimal = Object.fromEntries(records.map(r => [r.appId, {
  identity: r.identity, localPath: r.localPath, shownPack: r.shownPack,
  sourcePage: r.sourcePage, sourceKind: r.sourceKind,
  matchStatus: r.matchStatus, checkedDate: r.checkedDate,
}]));
const generated = 'var sourcedProductImages = ' + JSON.stringify(minimal) + ';';
const marker = /^var sourcedProductImages = .*;$/m;
if (!marker.test(html)) throw new Error('Missing image-data marker');
const next = html.replace(marker, generated);
if (process.argv.includes('--check')) {
  if (next !== html) throw new Error('Embedded image data is out of date');
} else fs.writeFileSync(file, next);
console.log('Checked ' + records.length + ' sourced image assignments.');
