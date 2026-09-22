const test = require('node:test');
const assert = require('node:assert/strict');
const {setup} = require('./assessment-test-helpers.cjs');

test('food labelled for both species appears in the appropriate dog and cat browse filters', () => {
  const {c, element} = setup();
  const shared = {...c.products[0],id:999999,brand:'Test',name:'Shared wet food',petType:'both',foodType:'wet',type:'Wet'};
  c.products.push(shared);
  for (const category of ['dog-wet','cat-wet']) {
    assert.equal(c.homeCategories.find(x=>x.id===category).match(shared),true);
  }
  for (const category of ['dog-kibble','cat-kibble','dog-treats','cat-treats']) {
    assert.equal(c.homeCategories.find(x=>x.id===category).match(shared),false);
  }
  element('searchInput').value = 'Shared wet food';
  for (const filter of ['dog','cat']) {
    c.currentFilter = filter;
    c.applyFilters();
    assert.deepEqual(Array.from(c.filteredProducts,p=>p.id),[shared.id]);
  }
  assert.match(c.getProductFactsHtml(shared),/Dog and cat/);
});

test('corrected raw cat foods and feline supplements remain available by category', () => {
  const {c} = setup();
  const category = c.homeCategories.find(x=>x.id==='cat-specialty');
  for (const id of [1086, 1087, 526, 852]) {
    assert.equal(category.match(c.products.find(p=>p.id===id)), true, 'Cat specialty '+id);
  }
  assert.equal(c.homeCategories.find(x=>x.id==='dog-specialty').match(c.products.find(p=>p.id===920)),true);
  assert.equal(category.match({petType:'dog',foodType:'raw'}),false);
  assert.equal(category.match({petType:'cat',foodType:'dry'}),false);
});
