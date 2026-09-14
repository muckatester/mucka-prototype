const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {test} = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function extract(pattern, label) {
  const match = html.match(pattern);
  assert.ok(match, 'Source contains ' + label);
  return match[0];
}

function setup() {
  const elements = new Map();
  const timers = new Map();
  let timerId = 0;
  let activeScreen = 'home';
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      innerHTML: '', textContent: '', placeholder: '', style: {},
      classList: {contains: name => name === 'active' && id === 'screen-' + activeScreen},
    });
    return elements.get(id);
  }
  const c = vm.createContext({
    document: {getElementById: element, querySelector: () => null, documentElement: {}, body: {}},
    window: {scrollTo() {}},
    requestAnimationFrame(callback) { callback(); },
    setTimeout(callback) { const id = ++timerId; timers.set(id, {callback, repeat: false}); return id; },
    setInterval(callback) { const id = ++timerId; timers.set(id, {callback, repeat: true}); return id; },
    clearTimeout(id) { timers.delete(id); },
    clearInterval(id) { timers.delete(id); },
    showScreen(name) { activeScreen = name; },
    renderBuyLinks() {},
    catIcons: {}, productImageMap: {}, favourites: [], scannedCount: 0,
    currentCategoryId: null, currentCategoryPage: 1, currentCategoryProducts: [],
    scoreCountTimer: null, scoreArcTimer: null, scoreBarsTimer: null,
  });
  for (const [pattern, label] of [
    [/const products = \[[\s\S]*?\n\];/, 'products'],
    [/var SCORE_SETTINGS = \{[\s\S]*?\n};/, 'score settings'],
    [/var BUDGET_BRANDS = \[[\s\S]*?\n];/, 'budget brands'],
    [/var homeCategories = \[[\s\S]*?\n];/, 'real home categories'],
    [/var perPage = \d+;/, 'real page size'],
  ]) vm.runInContext(extract(pattern, label), c);
  for (const name of [
    'getRecallSeverity', 'recalculateScore', 'hasScoreData', 'getScoreBadge',
    'compareProductScores', 'getScoreClass', 'getScoreColour', 'getStars',
    'getFoodSVGIcon', 'adjustColor', 'getProductPlaceholder', 'getProductImage',
    'productHasImage', 'renderCategoryGrid', 'handleCategoryClick',
    'renderCategoryPage', 'gotoCategoryPage', 'showProduct',
  ]) {
    vm.runInContext(extract(new RegExp('^function ' + name + '\\([\\s\\S]*?^}', 'm'), name), c);
  }
  vm.runInContext('products.forEach(recalculateScore);', c);
  const products = vm.runInContext('products', c);
  function flushTimers() {
    for (let i = 0; timers.size && i < 100; i++) {
      for (const [id, timer] of [...timers]) {
        if (!timers.has(id)) continue;
        if (!timer.repeat) timers.delete(id);
        timer.callback();
      }
    }
    assert.equal(timers.size, 0, 'Detail animations finish without errors');
  }
  return {c, products, element, flushTimers, screen: () => activeScreen};
}

function renderedIds(element) {
  return [...element('categoryProductList').innerHTML.matchAll(/onclick="showProduct\((\d+)\)"/g)]
    .map(match => Number(match[1]));
}

test('Home offers All products and its actual handler opens all 1,080 records', () => {
  const {c, products, element, screen} = setup();
  c.renderCategoryGrid();
  const button = element('categoryGrid').innerHTML.match(/<button\b[^>]*onclick="([^"]*all-products[^\"]*)"[^>]*>[\s\S]*?<\/button>/);
  assert.ok(button, 'The home grid exposes the All products action');
  assert.match(button[0], />All products</);
  assert.match(button[0], />1080 products</);
  vm.runInContext(button[1], c);
  assert.equal(screen(), 'category');
  assert.equal(c.currentCategoryId, 'all-products');
  assert.equal(element('categoryTitle').textContent, 'All products');
  assert.equal(element('categoryProductCount').textContent, 'Showing 1080 products');
  assert.equal(c.currentCategoryProducts.length, products.length);
  assert.equal(c.perPage, 20);
  assert.equal(renderedIds(element).length, 20);
});

test('Next traverses exactly 54 pages, covering every ID once with scored products first', () => {
  const {c, products, element} = setup();
  c.handleCategoryClick('all-products');
  const visited = [];
  for (let page = 1; page <= 54; page++) {
    assert.equal(c.currentCategoryPage, page);
    const ids = renderedIds(element);
    assert.equal(ids.length, 20, 'Twenty cards on page ' + page);
    visited.push(...ids);
    const pagination = element('categoryPagination').innerHTML;
    assert.ok(pagination.includes('Page ' + page + ' of 54'));
    assert.equal(pagination.includes('&laquo; Prev'), page > 1);
    const next = pagination.match(/onclick="([^"]+)"[^>]*>Next &raquo;<\/button>/);
    if (page < 54) {
      assert.ok(next, 'Next is available on page ' + page);
      vm.runInContext(next[1], c);
    } else assert.equal(next, null, 'The final page has no Next action');
  }
  assert.equal(visited.length, 1080);
  assert.equal(new Set(visited).size, 1080, 'No record occurs twice');
  assert.deepEqual([...visited].sort((a, b) => a - b), Array.from(products, p => p.id).sort((a, b) => a - b));
  const byId = new Map(Array.from(products, p => [p.id, p]));
  assert.equal(visited.filter(id => c.hasScoreData(byId.get(id))).length, 444);
  assert.equal(visited.filter(id => !c.hasScoreData(byId.get(id))).length, 636);
  assert.ok(visited.slice(0, 444).every(id => c.hasScoreData(byId.get(id))));
  assert.ok(visited.slice(444).every(id => !c.hasScoreData(byId.get(id))));
  for (let i = 1; i < 444; i++) {
    assert.ok(byId.get(visited[i - 1]).score >= byId.get(visited[i]).score, 'Scores descend through page boundaries');
  }
  const previous = element('categoryPagination').innerHTML.match(/onclick="([^"]+)"[^>]*>&laquo; Prev<\/button>/);
  assert.ok(previous);
  vm.runInContext(previous[1], c);
  assert.equal(c.currentCategoryPage, 53);
  assert.deepEqual(renderedIds(element), visited.slice(1040, 1060));
});

test('Previously omitted products are reachable as cards and open the correct detail', () => {
  const {c, products, element, flushTimers, screen} = setup();
  for (const id of [1094, 311, 1056]) {
    c.handleCategoryClick('all-products');
    const position = c.currentCategoryProducts.findIndex(p => p.id === id);
    assert.ok(position >= 0, 'All products includes ' + id);
    c.gotoCategoryPage(Math.floor(position / c.perPage) + 1);
    assert.ok(renderedIds(element).includes(id), 'A visible card can open ' + id);
    const action = element('categoryProductList').innerHTML.match(new RegExp('onclick="(showProduct\\(' + id + '\\))"'));
    assert.ok(action);
    assert.doesNotThrow(() => { vm.runInContext(action[1], c); flushTimers(); });
    const product = products.find(p => p.id === id);
    assert.equal(screen(), 'detail');
    assert.equal(c.currentProduct.id, id);
    assert.equal(element('detailTitle').textContent, product.brand);
    assert.equal(element('detailBrand').textContent, product.name + ' · ' + product.type);
    assert.equal(element('detailBackLabel').textContent, 'All products');
    assert.equal(c.detailCameFromCategory, true);
  }
});
