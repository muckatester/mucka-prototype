const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {root, setup} = require('./assessment-test-helpers.cjs');

test('sourced image assignments retain reviewed asset hashes and embedded data', () => {
  execFileSync(process.execPath, [path.join(root, 'scripts/sync-product-images.cjs'), '--check']);
  const {c} = setup();
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/product-images-v1.json')));
  for (const record of manifest.records) {
    const product = c.products.find(p => p.id === record.appId);
    assert.ok(product, 'Catalogue ID ' + record.appId);
    assert.equal(c.getSourcedProductImage(product)?.localPath, record.localPath);
    assert.equal(c.productHasImage(product), true);
    assert.ok(c.getProductImage(product).includes(record.localPath));
  }
});

test('a sourced photograph is withheld when its bound product identity changes', () => {
  const {c} = setup();
  const original = c.products.find(p => p.id === 727);
  for (const key of ['id', 'name', 'brand', 'barcode', 'type', 'petType', 'foodType']) {
    const changed = {...original, [key]: key === 'id' ? 999999 : 'different identity'};
    assert.equal(c.getSourcedProductImage(changed), null, key);
    assert.equal(c.productHasImage(changed), false, key);
  }
  const temporary = {...original, _userIngredientText: 'Temporary entry'};
  assert.equal(c.getSourcedProductImage(temporary), null);
});

test('photo captions distinguish matched packs from recipes with unknown pack identity', () => {
  const {c, element} = setup();
  c.showProduct(728);
  assert.match(element('detailProductImage').innerHTML, /Pack shown: 24 x 100g trays/);
  assert.match(element('detailProductImage').innerHTML, /Recipe and pack size matched/);
  assert.doesNotMatch(element('detailProductImage').innerHTML, /pack configuration has not been verified/);
  assert.doesNotMatch(element('sourceEvidence').innerHTML, /Catalogue photos have not been verified/);
  assert.match(element('sourceEvidence').innerHTML, /matching scope are shown/);
  c.showProduct(1146);
  assert.match(element('detailProductImage').innerHTML, /catalogue pack size and barcode are unverified/);
  assert.match(element('detailProductImage').innerHTML, /Photo source/);
});

test('all original image assignments have a complete visual review and unchanged assets', () => {
  execFileSync(process.execPath, [path.join(root, 'scripts/sync-legacy-image-review.cjs'), '--check']);
  const {c, element} = setup();
  const records = JSON.parse(fs.readFileSync(path.join(root, 'data/legacy-image-review-v1.json'))).records;
  for (const record of records) {
    const p = c.products.find(p => p.id === record.appId);
    assert.ok(p);
    c.showProduct(p.id);
    const available = ['visual_match', 'recipe_match_pack_unverified'].includes(record.status) &&
      Object.entries(record.identitySnapshot).every(([key,value]) => (p[key] || null) === (value || null));
    assert.equal(!!c.getLegacyProductImage(p), available, 'Legacy photo ' + p.id);
    if (!available && !c.getSourcedProductImage(p)) {
      assert.equal(c.productHasImage(p), false);
      assert.doesNotMatch(element('detailProductImage').innerHTML, /<img /);
      assert.match(element('detailProductImage').innerHTML, /older photo is withheld/);
    } else if (!c.getSourcedProductImage(p)) {
      assert.match(element('detailProductImage').innerHTML, /Original photo source and barcode have not been verified/);
    }
  }
});

test('a wrong, unreadable or identity-changed old photo never reappears through filename fallback', () => {
  const {c} = setup();
  const p = c.products.find(p => c.getLegacyProductImage(p));
  assert.ok(p);
  const record = c.legacyImageReviews[p.id];
  c.productImageMap[p.brand + ' - ' + p.name] = record.imagePath;
  for (const status of ['confirmed_mismatch', 'unreadable']) {
    record.status = status;
    assert.equal(c.productHasImage(p), false);
    assert.doesNotMatch(c.getProductImage(p), /<img /);
  }
  record.status = 'visual_match';
  for (const key of ['id', 'brand', 'name', 'petType', 'foodType', 'type', 'barcode']) {
    const changed = {...p, [key]: key === 'id' ? 999999 : 'other identity'};
    assert.equal(c.productHasImage(changed), false, key);
  }
  assert.equal(c.productHasImage({...p, _userIngredientText:'Temporary recipe'}), false);
  assert.equal(c.productHasImage({...p, _userPhoto:'data:image/png;base64,user-photo'}), true);
});
