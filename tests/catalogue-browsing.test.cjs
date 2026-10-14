const vm = require('node:vm');
const assert = require('node:assert/strict');
const {test} = require('node:test');
const {setup: createSetup} = require('./assessment-test-helpers.cjs');
function setup() { const state = createSetup(); return {...state, products: state.c.products}; }

function renderedIds(element) {
  return [...element('categoryProductList').innerHTML.matchAll(/onclick="showProduct\((\d+)\)"/g)]
    .map(match => Number(match[1]));
}

test('Home offers All products and its actual handler opens all catalogue records', () => {
  const {c, products, element, screen} = setup();
  c.renderCategoryGrid();
  const button = element('categoryGrid').innerHTML.match(/<button\b[^>]*onclick="([^"]*all-products[^\"]*)"[^>]*>[\s\S]*?<\/button>/);
  assert.ok(button, 'The home grid exposes the All products action');
  assert.match(button[0], />All products</);
  assert.match(button[0], />1082 products</);
  vm.runInContext(button[1], c);
  assert.equal(screen(), 'category');
  assert.equal(c.currentCategoryId, 'all-products');
  assert.equal(element('categoryTitle').textContent, 'All products');
  assert.equal(element('categoryProductCount').textContent, 'Showing 1082 products');
  assert.equal(c.currentCategoryProducts.length, products.length);
  assert.equal(c.perPage, 20);
  assert.equal(renderedIds(element).length, 20);
});

test('Next traverses every catalogue page, covering every ID once in brand/name/ID order', () => {
  const {c, products, element} = setup();
  c.handleCategoryClick('all-products');
  const visited = [];
  const pageCount = Math.ceil(products.length / c.perPage);
  for (let page = 1; page <= pageCount; page++) {
    assert.equal(c.currentCategoryPage, page);
    const ids = renderedIds(element);
    assert.equal(ids.length, page === pageCount ? products.length - (pageCount - 1) * c.perPage : c.perPage, 'Cards on page ' + page);
    visited.push(...ids);
    const pagination = element('categoryPagination').innerHTML;
    assert.ok(pagination.includes('Page ' + page + ' of ' + pageCount));
    assert.equal(pagination.includes('&laquo; Prev'), page > 1);
    const next = pagination.match(/onclick="([^"]+)"[^>]*>Next &raquo;<\/button>/);
    if (page < pageCount) {
      assert.ok(next, 'Next is available on page ' + page);
      vm.runInContext(next[1], c);
    } else assert.equal(next, null, 'The final page has no Next action');
  }
  assert.equal(visited.length, 1082);
  assert.equal(new Set(visited).size, 1082, 'No record occurs twice');
  assert.deepEqual([...visited].sort((a, b) => a - b), Array.from(products, p => p.id).sort((a, b) => a - b));
  const expected = Array.from(products).sort((a, b) =>
    (a.brand || '').localeCompare(b.brand || '', 'en-AU', {sensitivity: 'base'}) ||
    (a.name || '').localeCompare(b.name || '', 'en-AU', {sensitivity: 'base'}) || a.id - b.id);
  assert.deepEqual(visited, expected.map(p => p.id), 'Alphabetical ordering spans every page boundary');
  assert.ok(products.every(p => !c.hasScoreData(p)), 'No old rating affects ordering');
  const tied = [{id: 9, brand: 'Same', name: 'Food', score: 100}, {id: 2, brand: 'same', name: 'food', score: 1}];
  assert.deepEqual(tied.sort(c.compareProductScores).map(p => p.id), [2, 9], 'ID breaks case-insensitive name ties, not score');
  const previous = element('categoryPagination').innerHTML.match(/onclick="([^"]+)"[^>]*>&laquo; Prev<\/button>/);
  assert.ok(previous);
  vm.runInContext(previous[1], c);
  assert.equal(c.currentCategoryPage, pageCount - 1);
  assert.deepEqual(renderedIds(element), visited.slice((pageCount - 2) * 20, (pageCount - 1) * 20));
});

test('Previously omitted products are reachable as cards and open the correct detail', () => {
  const {c, products, element, screen} = setup();
  for (const id of [1094, 311, 1056]) {
    c.handleCategoryClick('all-products');
    const position = c.currentCategoryProducts.findIndex(p => p.id === id);
    assert.ok(position >= 0, 'All products includes ' + id);
    c.gotoCategoryPage(Math.floor(position / c.perPage) + 1);
    assert.ok(renderedIds(element).includes(id), 'A visible card can open ' + id);
    const action = element('categoryProductList').innerHTML.match(new RegExp('onclick="(showProduct\\(' + id + '\\))"'));
    assert.ok(action);
    assert.doesNotThrow(() => { vm.runInContext(action[1], c); });
    const product = products.find(p => p.id === id);
    assert.equal(screen(), 'detail');
    assert.equal(c.currentProduct.id, id);
    assert.equal(element('detailTitle').textContent, product.brand);
    assert.equal(element('detailBrand').textContent, product.name + ' · ' + product.type);
    assert.equal(element('detailBackLabel').textContent, 'All products');
    assert.equal(c.detailCameFromCategory, true);
  }
});
