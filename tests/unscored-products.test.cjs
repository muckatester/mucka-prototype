const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const {test} = require('node:test');
const {root, html, productsLiteral, fn, setup} = require('./assessment-test-helpers.cjs');
const baseline = execFileSync('git', ['show', 'fa5b689:index.html'], {cwd: root, encoding: 'utf8', maxBuffer: 10e6});

test('Raw catalogue preserves all 1,080 records and only the documented metadata corrections', () => {
  const expected = JSON.parse(JSON.stringify(vm.runInNewContext(productsLiteral(baseline))));
  const corrections = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalogue-corrections-2026-09-14.json'), 'utf8'));
  for (const change of corrections.changes) {
    const product = expected.find(p => p.id === change.appId);
    for (const [field, value] of Object.entries(change.before)) assert.deepEqual(product[field], value);
    Object.assign(product, change.after);
    for (const field of change.removeFields || []) delete product[field];
  }
  const actual = JSON.parse(JSON.stringify(vm.runInNewContext(productsLiteral(html))));
  assert.equal(actual.length, 1080);
  assert.deepEqual(actual, expected);
});

test('Every runtime score and subscore is withheld, including records with ingredient data', () => {
  const {c} = setup();
  assert.equal(c.products.filter(p => p.ingredients?.length).length, 444);
  for (const p of c.products) {
    assert.equal(p.score, null, 'Score withheld for ' + p.id);
    assert.equal(p._ingredientScore, null);
    assert.equal(p._credScore, null);
    assert.equal(c.hasScoreData(p), false);
  }
});

test('All 1,080 detail views show neutral assessment and facts without ratings or health flags', () => {
  const {c, element, timers} = setup();
  for (const p of c.products) {
    c.showProduct(p.id);
    assert.equal(element('assessmentStatus').textContent, 'Assessment under review');
    assert.match(element('catalogueFacts').innerHTML, /Nutritional adequacy/);
    const evidence = c.getProductEvidence(p);
    assert.match(element('catalogueFacts').innerHTML, evidence ? /Unknown/ : /Not verified/);
    assert.match(element('credList').innerHTML, evidence ? /have not been checked/ : /need sourced evidence/);
    assert.doesNotMatch(element('credList').innerHTML, /(?:>Yes<|>No<|\bpts\b|cred-check|cred-cross)/);
    const ingredients = element('ingredientList').innerHTML;
    assert.match(ingredients, evidence ? /Full ingredient text from the cited manufacturer source/ : p.ingredients?.length ? /not yet been verified/ : /not been added/);
    assert.doesNotMatch(ingredients, /ingredient-(?:good|ok|bad)|\brating[=:]|\bpts\b/);
  }
  assert.equal(timers.size, 0, 'Opening details schedules no score animations');
  for (const id of ['scoreValue', 'stars', 'subScoreBars', 'scoreArc', 'scoreTier']) {
    assert.doesNotMatch(html, new RegExp('id="' + id + '"'), 'Old public rating element removed: ' + id);
  }
});

test('Wrong Dine barcode stays removed and four corrected wet products resolve through both lookup paths', () => {
  const {c, element} = setup();
  vm.runInContext(html.match(/var BARCODE_MAP = \{[\s\S]*?\n};/)[0] + fn('findProductByBarcode'), c);
  assert.equal(c.BARCODE_MAP['9334214018362'], undefined);
  assert.equal(c.products.some(p => p.barcode === '9334214018362'), false);
  assert.equal(c.findProductByBarcode('9334214018362'), null);
  for (const id of [727, 764, 768, 960]) {
    const p = c.products.find(p => p.id === id);
    assert.equal(c.findProductByBarcode(p.barcode).id, id);
    delete c.BARCODE_MAP[p.barcode];
    assert.equal(c.findProductByBarcode(p.barcode).id, id);
    assert.equal(p.foodType, 'wet');
  }
  c.showProduct(488);
  assert.match(element('assessmentNotice').textContent, /barcode mismatch/);
  c.showProduct(1094);
  assert.match(element('assessmentNotice').textContent, /Health ratings are paused/);
  assert.doesNotMatch(element('assessmentNotice').textContent, /barcode mismatch|Placeholder score/);
});

test('Search, browse and favourites retain product access and neutral badges', () => {
  const {c, element} = setup();
  for (const id of [332, 580]) {
    const p = c.products.find(p => p.id === id);
    c.filteredProducts = c.currentCategoryProducts = [p]; c.favourites = [id];
    c.renderPage(); c.renderCategoryPage(); c.renderFavourites();
    for (const target of ['productList', 'categoryProductList', 'favList']) {
      assert.match(element(target).innerHTML, /Under review/);
      assert.ok(element(target).innerHTML.includes('showProduct(' + id + ')'));
      assert.doesNotMatch(element(target).innerHTML, /score-(?:green|amber|red)|\/100/);
    }
    element('soInput').value = p.name;
    c.runOverlaySearch();
    assert.match(element('soResults').innerHTML, /Under review/);
    assert.ok(element('soResults').innerHTML.includes('showProduct(' + id + ')'));
  }
  c.renderCategoryGrid();
  assert.equal(element('soInput').placeholder, 'Search 1080 products...');
  assert.equal(element('searchInput').placeholder, 'Search 1080 products...');
});

test('Injected scores, ingredient ratings and manufacturer flags cannot reactivate public judgements', () => {
  const {c, element} = setup();
  const p = c.products[0];
  p.score = 100; p._ingredientScore = 85; p._credScore = 15;
  p.ingredients = [{name: '<img src=x onerror=alert(1)> Chicken', rating: 'SECRET_RATING', desc: 'SECRET_HEALTH_CLAIM'}];
  p.cred = [{name: 'SECRET_MANUFACTURER_FLAG', value: true, points: 15}];
  assert.equal(c.hasScoreData(p), false);
  assert.equal(c.getScoreBadge(p), '<span class="assessment-badge">Under review</span>');
  c.showProduct(p.id);
  const detail = element('ingredientList').innerHTML + element('credList').innerHTML;
  assert.match(detail, /&lt;img/);
  assert.doesNotMatch(detail, /<img|SECRET_|\/85|\/15|\/100/);
  c.getRecommendations();
  assert.match(element('recResults').innerHTML, /Recommendations are paused/);
  assert.doesNotMatch(element('recResults').innerHTML, /rec-card|showProduct\(/);
  c.currentFilter = 'top'; c.applyFilters();
  assert.equal(c.filteredProducts.length, 0);
  c.recalculateScore(p);
  assert.equal(p.score, null); assert.equal(p._ingredientScore, null); assert.equal(p._credScore, null);
});

test('User entry preserves ingredient text without assigning heuristic scores or HTML', () => {
  const {c, element} = setup();
  const raw = 'Chicken, fish oil, salt\n<svg onload=alert(1)> & oats';
  element('addName').value = '<b>Trial food</b>';
  element('addBrand').value = 'A & B';
  element('addType').value = 'dog';
  element('addIngredients').value = raw;
  c.scoreNewProduct();
  const p = c.products[c.products.length - 1];
  assert.equal(c.products.length, 1081);
  assert.equal(p._userIngredientText, raw);
  assert.equal(p.ingredients.length, 0);
  assert.equal(p.score, null); assert.equal(p._ingredientScore, null); assert.equal(p._credScore, null);
  assert.equal(p.foodType, '');
  assert.equal(p.needsReview, true);
  assert.match(element('addResult').innerHTML, /Added for this visit/);
  assert.doesNotMatch(element('addResult').innerHTML, /<b>|\/100/);
  c.showProduct(p.id);
  assert.match(element('ingredientList').innerHTML, /You supplied this text/);
  assert.match(element('ingredientList').innerHTML, /&lt;svg/);
  assert.doesNotMatch(element('ingredientList').innerHTML, /<svg/);
  const photoAction = element('detailProductImage').innerHTML.match(/onclick="(openMuckaCollector\([^\"]*\))"/);
  assert.ok(photoAction, 'Missing-photo detail offers a working Collector handoff');
  let collectorOpened = false;
  c.openMuckaCollector = barcode => { collectorOpened = true; assert.equal(barcode, p.barcode); };
  vm.runInContext(photoAction[1], c);
  assert.equal(collectorOpened, true);
  assert.doesNotMatch(html, /function simulatePhoto\s*\(|onclick="simulatePhoto\(/);
});

test('Inline scripts compile', () => {
  for (const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
});
