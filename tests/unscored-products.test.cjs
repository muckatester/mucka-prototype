const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const {test} = require('node:test');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const baseline = execFileSync('git', ['show', 'fa5b689:index.html'], {cwd: root, encoding: 'utf8', maxBuffer: 10e6});
const productsLiteral = source => source.match(/const products = (\[[\s\S]*?\n\]);/)[1];
function fn(source, name) {
  const match = source.match(new RegExp('^function ' + name + '\\([\\s\\S]*?^}', 'm'));
  assert.ok(match, name);
  return match[0];
}
const settings = html.match(/var SCORE_SETTINGS = \{[\s\S]*?\n};/)[0];
const budget = html.match(/var BUDGET_BRANDS = \[[\s\S]*?\n];/)[0];
function setup(source = html) {
  const elements = new Map();
  const timers = new Map();
  let timerId = 0;
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      style: {}, innerHTML: '', textContent: '', value: '', placeholder: '',
      classList: {contains: () => false}, scrollIntoView() {},
    });
    return elements.get(id);
  }
  const c = vm.createContext({
    document: {getElementById: element, querySelector: () => null, documentElement: {}, body: {}},
    window: {scrollTo() {}},
    setTimeout(cb) { const id = ++timerId; timers.set(id, {cb, repeat: false}); return id; },
    setInterval(cb) { const id = ++timerId; timers.set(id, {cb, repeat: true}); return id; },
    clearTimeout(id) { timers.delete(id); }, clearInterval(id) { timers.delete(id); },
    requestAnimationFrame(cb) { cb(); },
    getProductImage: () => '', productHasImage: () => true,
    renderBuyLinks() {}, showScreen() {}, updateProfile() {},
    getRosetteSVG: () => '', getMatchTags: () => '',
    favourites: [], scannedCount: 0, currentCategoryId: null, homeCategories: [],
    scoreCountTimer: null, scoreArcTimer: null, scoreBarsTimer: null,
    currentPage: 1, currentCategoryPage: 1, perPage: 2000, currentFilter: 'all',
    recFilters: {pet: 'dog', protein: 'any', stage: 'all', diet: 'any', size: 'any'},
  });
  vm.runInContext('var products = '+ productsLiteral(source) + ';' + settings + budget, c);
  const names = ['getRecallSeverity', 'recalculateScore'];
  if (source === html) names.push('hasScoreData', 'getScoreBadge', 'compareProductScores',
    'getScoreClass', 'getScoreColour', 'getStars', 'showProduct', 'renderPage',
    'renderCategoryPage', 'renderFavourites', 'runOverlaySearch', 'applyFilters',
    'getRecommendations', 'renderCategoryGrid');
  for(const name of names) vm.runInContext(fn(source, name), c);
  vm.runInContext('products.forEach(recalculateScore); var filteredProducts = products.slice(); var currentCategoryProducts = products.slice();', c);
  function flushTimers() {
    for (let i=0; timers.size && i<100; i++) {
      for(const [id,t] of [...timers]) {
        if (!timers.has(id)) continue;
        if (!t.repeat) timers.delete(id);
        t.cb();
      }
    }
    assert.equal(timers.size, 0, 'Animations finish');
  }
  return {c, element, flushTimers};
}

test('All 636 missing ingredient records are unscored; existing 444 results stay unchanged', () => {
  const {c} = setup();
  const old = setup(baseline).c;
  assert.equal(c.products.length, 1080);
  assert.equal(c.products.filter(p => p.score === null).length, 636);
  assert.equal(c.products.filter(c.hasScoreData).length, 444);
  for (const p of c.products) {
    if (!p.ingredients?.length) {
      assert.equal(p.score, null);
      assert.equal(p._ingredientScore, null);
      assert.equal(p._credScore, null);
    } else assert.equal(p.score, old.products.find(q => q.id === p.id).score, 'Existing score for ' + p.id);
  }
  const expectedCatalogue = JSON.parse(JSON.stringify(vm.runInNewContext(productsLiteral(baseline))));
  const corrections = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalogue-corrections-2026-09-14.json'), 'utf8'));
  for (const change of corrections.changes) {
    const product = expectedCatalogue.find(p => p.id === change.appId);
    for (const [field, value] of Object.entries(change.before)) assert.deepEqual(product[field], value, 'Recorded original field ' + change.appId + '.' + field);
    Object.assign(product, change.after);
    for (const field of change.removeFields || []) delete product[field];
  }
  assert.deepEqual(JSON.parse(JSON.stringify(vm.runInNewContext(productsLiteral(html)))), expectedCatalogue, 'Only documented catalogue metadata changes');
});

test('Wrong Dine barcode cannot resolve to the Pro Plan record through either lookup path', () => {
  const {c, element} = setup();
  vm.runInContext(html.match(/var BARCODE_MAP = \{[\s\S]*?\n};/)[0] + fn(html, 'findProductByBarcode'), c);
  const disputedBarcode = '9334214018362';
  assert.equal(c.BARCODE_MAP[disputedBarcode], undefined);
  assert.equal(c.products.some(p => p.barcode === disputedBarcode), false);
  assert.equal(c.findProductByBarcode(disputedBarcode), null);
  for (const id of [727, 764, 768, 960]) {
    const p = c.products.find(p => p.id === id);
    assert.equal(c.findProductByBarcode(p.barcode).id, id);
    delete c.BARCODE_MAP[p.barcode];
    assert.equal(c.findProductByBarcode(p.barcode).id, id, 'Direct product fallback ' + id);
    assert.equal(p.foodType, 'wet');
    assert.equal(c.hasScoreData(p), false);
  }
  c.showProduct(488);
  assert.equal(element('scoreTier').textContent, 'Not scored');
  assert.match(element('scoreReviewNotice').textContent, /barcode mismatch/);
  c.showProduct(727);
  assert.doesNotMatch(element('scoreReviewNotice').textContent, /barcode mismatch/);
  c.showProduct(1094);
  assert.equal(element('scoreReviewNotice').textContent, "We still need to check this product's ingredients and scoring information.");
  assert.doesNotMatch(element('scoreReviewNotice').textContent, /Placeholder score/);
});

test('Unscored detail has no rating, stars, fabricated trust flags or crash for missing ingredients', () => {
  const {c, element, flushTimers} = setup();
  for (const p of c.products) {
    c.showProduct(p.id);
    if (!c.hasScoreData(p)) {
      assert.equal(element('scoreTier').textContent, 'Not scored');
      assert.equal(element('scoreValue').textContent, '—');
      assert.equal(element('stars').innerHTML, '');
      assert.equal(element('subScoreBars').style.display, 'none');
      assert.equal(element('scoreScaleLabel').style.display, 'none');
      assert.match(element('ingredientList').innerHTML, /not been added/);
      assert.match(element('credList').innerHTML, /needs review/);
      assert.doesNotMatch(element('credList').innerHTML, /Yes|No|pts/);
    }
  }
  flushTimers();
});

test('Switching quickly between scored and unscored details cancels the previous animation', () => {
  const {c, element, flushTimers} = setup();
  const scored = c.products.find(c.hasScoreData);
  const unscored = c.products.find(p => !c.hasScoreData(p));
  c.showProduct(scored.id);
  c.showProduct(unscored.id);
  flushTimers();
  assert.equal(element('scoreValue').textContent, '—');
  assert.equal(element('ingredientBar').style.width, '0%');
  c.showProduct(scored.id);
  flushTimers();
  assert.equal(element('scoreValue').textContent, scored.score);
  assert.equal(element('scoreScaleLabel').style.display, '');
  assert.equal(element('scoreReviewNotice').style.display, 'none');
});

test('Search, category, and favourites show Not scored and keep products accessible', () => {
  const {c, element} = setup();
  const p = c.products.find(p => p.id === 580);
  c.filteredProducts = c.currentCategoryProducts = [p];
  c.favourites = [p.id];
  c.renderPage(); c.renderCategoryPage(); c.renderFavourites();
  for(const id of ['productList', 'categoryProductList', 'favList']) {
    assert.match(element(id).innerHTML, /Not scored/);
    assert.match(element(id).innerHTML, /showProduct\(580\)/);
  }
  element('soInput').value = p.name;
  c.runOverlaySearch();
  assert.match(element('soResults').innerHTML, /Not scored/);
  assert.match(element('soResults').innerHTML, /showProduct\(580\)/);
  element('searchInput').value = 'unmatched-keyword';
  assert.doesNotThrow(() => c.applyFilters());
});

test('A placeholder cannot enter recommendations or top filters even with a high stored number', () => {
  const {c, element} = setup();
  const p = c.products.find(p => !c.hasScoreData(p));
  p.score = 100;
  c.products = [p];
  c.getRecommendations();
  assert.doesNotMatch(element('recResults').innerHTML, /class="rec-card"/);
  c.currentFilter = 'top';
  c.applyFilters();
  assert.equal(c.filteredProducts.length, 0);
  assert.match(c.getScoreBadge(p), /Not scored/);
});

test('Zero subscores remain zero and scored records sort before unscored records', () => {
  const {c, element} = setup();
  const p = c.products.find(c.hasScoreData);
  p._ingredientScore = 0; p._credScore = 0;
  c.showProduct(p.id);
  assert.equal(element('ingredientScoreLabel').textContent, 'Ingredient Quality: 0/85');
  assert.equal(element('credScoreLabel').textContent, 'Manufacturer Trust: 0/15');
  const unscored = c.products.find(p => !c.hasScoreData(p));
  assert.deepEqual([unscored, p].sort(c.compareProductScores), [p, unscored]);
  c.renderCategoryGrid();
  assert.equal(element('soInput').placeholder, 'Search 1080 products...');
  assert.equal(element('searchInput').placeholder, 'Search 1080 products...');
});

test('Inline scripts compile', () => {
  for (const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    new vm.Script(match[1]);
  }
});
