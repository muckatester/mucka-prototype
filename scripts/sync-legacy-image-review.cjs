const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/legacy-image-review-v1.json'), 'utf8'));
const ids = new Set();
if (manifest.records.length !== 849) throw new Error('Legacy review must cover all 849 original assignments');
for (const r of manifest.records) {
  if (ids.has(r.appId)) throw new Error('Duplicate legacy review: ' + r.appId);
  ids.add(r.appId);
  if (!['visual_match', 'recipe_match_pack_unverified', 'confirmed_mismatch', 'unreadable'].includes(r.status)) throw new Error('Invalid review: ' + r.appId);
  if (!r.visualChecked || !r.reason || !r.identitySnapshot || !r.checkedDate) throw new Error('Incomplete review: ' + r.appId);
  let current = root;
  for (const segment of r.imagePath.split('/')) {
    if (!segment || ['.', '..'].includes(segment) || !fs.readdirSync(current).includes(segment)) throw new Error('Invalid or incorrectly cased image: ' + r.imagePath);
    current = path.join(current, segment);
  }
  if (crypto.createHash('sha256').update(fs.readFileSync(current)).digest('hex') !== r.imageSha256) throw new Error('Legacy image changed since review: ' + r.appId);
}
const minimal = Object.fromEntries(manifest.records.map(r => [r.appId, {
  identitySnapshot: r.identitySnapshot, imagePath: r.imagePath,
  status: r.status, shownPack: r.shownPack, checkedDate: r.checkedDate,
}]));
const marker = /^var legacyImageReviews = .*;$/m;
if (!marker.test(html)) throw new Error('Missing legacy review marker');
const next = html.replace(marker, 'var legacyImageReviews = ' + JSON.stringify(minimal) + ';');
if (process.argv.includes('--check')) {
  if (next !== html) throw new Error('Embedded legacy image review is out of date');
} else fs.writeFileSync(file, next);
console.log('Checked all ' + ids.size + ' original image assignments.');
