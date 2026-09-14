const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {test} = require('node:test');
const {root, html, setup, fn} = require('./assessment-test-helpers.cjs');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/starter-catalogue-v1.json'), 'utf8'));

test('The published starter data is source-backed, identity-bound and exactly matches the app', () => {
  const {c} = setup();
  assert.deepEqual(JSON.parse(JSON.stringify(c.starterCatalogue)), data);
  assert.equal(data.schemaVersion, '1.0.0');
  assert.deepEqual(data.records.map(r => r.appId), [727, 728, 764, 768, 960]);
  for (const record of data.records) {
    assert.equal(record.physicalScanPerformed, false);
    assert.equal(record.clinicallyValidated, false);
    assert.match(record.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(record.identityEvidence.note);
    const p = c.products.find(p => p.id === record.appId);
    assert.ok(c.getProductEvidence(p), 'Identity matches for ' + p.id);
    assert.ok(record.sources.length);
    assert.equal(new Set(record.sources.map(s => s.id)).size, record.sources.length);
    for (const source of record.sources) {
      assert.equal(new URL(source.url).protocol, 'https:');
      assert.ok(source.label && source.kind && source.checkedAt && source.observation);
    }
    for (const key of ['species', 'foodForm', 'packSize', 'barcode', 'lifeStage', 'feedingPurpose', 'adequacyStatement', 'adequacyMethod', 'energy', 'therapeuticUse', 'ingredients']) {
      const field = record.fields[key];
      assert.ok(field, 'Required field ' + key + ' for ' + p.id);
      assert.ok(['source_checked', 'unknown', 'conflict', 'not_applicable'].includes(field.status));
      if (field.status === 'source_checked') {
        assert.ok(typeof field.value === 'string' && field.value.trim());
        assert.ok(field.sourceIds.length);
        for (const id of field.sourceIds) assert.ok(record.sources.some(s => s.id === id));
      } else {
        assert.equal(field.value, null);
        assert.ok(field.note);
      }
    }
    assert.equal(p.score, null);
    assert.equal(c.hasScoreData(p), false);
  }
});

test('Starter browse opens only the selected records and shows sources without activating ratings', () => {
  const {c, element} = setup();
  c.handleCategoryClick('starter-catalogue');
  assert.deepEqual(Array.from(c.currentCategoryProducts, p => p.id).sort((a,b)=>a-b), [727,728,764,768,960]);
  assert.equal(element('categoryProductCount').textContent, 'Showing 5 products');
  for (const p of c.currentCategoryProducts) {
    c.showProduct(p.id);
    assert.equal(element('assessmentStatus').textContent, 'Assessment under review');
    assert.equal(element('catalogueDetailsTitle').textContent, 'Source-checked details');
    assert.match(element('catalogueFacts').innerHTML, /Manufacturer source/);
    assert.match(element('sourceEvidence').innerHTML, /Sources checked online/);
    assert.match(element('sourceEvidence').innerHTML, /not a health rating/);
    assert.doesNotMatch(element('ingredientList').innerHTML, /ingredient-(?:good|bad|ok)|\/100/);
    assert.doesNotMatch(element('credList').innerHTML, /WSAVA approved|No recalls|cred-check/);
  }
});

test('A changed recipe, barcode or pack cannot inherit previously checked evidence', () => {
  const {c, element} = setup();
  for (const key of ['name','brand','barcode','petType','foodType','type']) {
    const p = c.products.find(p => p.id === 960), old = p[key];
    p[key] = 'changed identity';
    assert.equal(c.getProductEvidence(p), null, key);
    c.showProduct(p.id);
    assert.equal(element('catalogueDetailsTitle').textContent, 'Catalogue details');
    assert.equal(element('sourceEvidence').innerHTML, '');
    assert.match(element('ingredientList').innerHTML, /not been added/);
    p[key] = old;
  }
});

test('Unknown and conflicting claims stay withheld and untrusted source text stays escaped', () => {
  const {c, element} = setup();
  const p = c.products.find(p => p.id === 960), r = c.getProductEvidence(p);
  r.fields.adequacyStatement = {status:'unknown', value:'SECRET_UNSUPPORTED_ADEQUACY', note:'Statement not located.', sourceIds:[]};
  r.fields.ingredients = {status:'conflict', value:'SECRET_CONFLICTING_INGREDIENTS', note:'Two recipes disagree.', sourceIds:[]};
  r.fields.lifeStage = {status:'source_checked', value:'<svg onload=alert(1)> adult', note:'Source qualification: <img src=x onerror=alert(1)>', sourceIds:[r.sources[0].id]};
  c.showProduct(p.id);
  assert.doesNotMatch(element('catalogueFacts').innerHTML, /SECRET_|<svg/);
  assert.match(element('catalogueFacts').innerHTML, /&lt;svg/);
  assert.match(element('catalogueFacts').innerHTML, /Source qualification: &lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(element('catalogueFacts').innerHTML, /<img/);
  assert.doesNotMatch(element('ingredientList').innerHTML, /SECRET_|Chicken/);
  assert.match(element('ingredientList').innerHTML, /sources conflict/);
  r.sources[0].url = 'javascript:alert(1)';
  assert.equal(c.getEvidenceLinks(r, [r.sources[0].id]), '');
});

test('Confirmed conflicting barcodes cannot match in either scanner or Collector', () => {
  const {c} = setup();
  vm.runInContext(html.match(/var BARCODE_MAP = \{[\s\S]*?\n};/)[0] + fn('findProductByBarcode'), c);
  const collector = fs.readFileSync(path.join(root, 'mucka-collector.html'), 'utf8');
  vm.runInContext(collector.match(/var KNOWN_BARCODES = new Set\(\[[\s\S]*?\]\);/)[0], c);
  const corrections = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalogue-corrections-2026-09-14.json')));
  for (const {barcode: code} of corrections.collectorBarcodeRemovals) {
    assert.equal(c.findProductByBarcode(code), null);
    assert.equal(c.KNOWN_BARCODES.has(code), false);
  }
  const corrected = c.products.find(p => p.id === 728);
  assert.equal(corrected.foodType, 'wet');
  assert.equal(corrected.type, 'Wet · 24 x 100g');
  assert.equal(c.findProductByBarcode('9334214054964').id, 728);
  const disputed = c.products.find(p => p.id === 765);
  assert.equal(disputed.name, 'Adult Lamb & Gravy Casserole');
  assert.equal(disputed.barcode, undefined);
  assert.match(disputed.identityNotice, /beef/i);
});
