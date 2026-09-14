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
  c.showProduct(960);
  // An existing catalogue image still keeps its original verification limits.
  c.productImageMap[c.currentProduct.brand + ' - ' + c.currentProduct.name] = 'legacy.jpg';
  c.showProduct(960);
  assert.match(element('detailProductImage').innerHTML, /pack configuration has not been verified/);
});
