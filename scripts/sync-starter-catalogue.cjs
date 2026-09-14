// Keep the single-file app usable without a separate runtime fetch.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/starter-catalogue-v1.json'), 'utf8'));
const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8');
const pattern = /var starterCatalogue = [\s\S]*?;\n/;
if (!pattern.test(html)) throw new Error('Starter catalogue marker not found');
const replacement = 'var starterCatalogue = ' + JSON.stringify(data, null, 2).replace(/</g, '\\u003c') + ';\n';
const updated = html.replace(pattern, () => replacement);
if (process.argv.includes('--check')) {
  if (updated !== html) throw new Error('Embedded starter catalogue is out of date');
  console.log('Starter catalogue is synchronized.');
} else {
  fs.writeFileSync(file, updated);
  console.log('Embedded ' + data.records.length + ' starter records.');
}
