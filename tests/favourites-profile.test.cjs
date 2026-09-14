const {test} = require('node:test');
const assert = require('node:assert/strict');
const {setup, html, fn} = require('./assessment-test-helpers.cjs');
const vm = require('node:vm');
const key = 'mucka.favourites.v1';

test('Adding and removing a catalogue favourite survives a new visit', () => {
  const first = setup();
  first.c.showProduct(960);
  first.c.toggleFav();
  assert.equal(first.element('detailFavBtn').attributes['aria-pressed'], 'true');
  assert.equal(first.element('statFavs').textContent, 1);
  assert.match(first.element('favouriteFeedback').textContent, /Saved in this browser/);
  const second = setup({storage:first.storage});
  second.c.renderFavourites();
  assert.match(second.element('favList').innerHTML, /showProduct\(960\)/);
  second.c.showProduct(960);
  assert.equal(second.element('detailFavBtn').attributes['aria-label'], 'Remove from favourites');
  second.c.toggleFav();
  const third = setup({storage:first.storage});
  third.c.renderFavourites();
  assert.equal(third.element('favList').innerHTML, '');
  assert.equal(third.element('favEmpty').style.display, 'block');
});

test('Invalid stored data cannot break browsing or introduce unknown products', () => {
  for (const raw of ['{bad', 'null', '[]', '{"version":2,"ids":[960]}', '{"version":1,"ids":"960"}']) {
    const storage = {getItem:() => raw, setItem() {}};
    const {c, element} = setup({storage});
    assert.equal(c.favourites.length, 0);
    c.showProduct(960);
    c.updateProfile();
    assert.match(element('profileStorageStatus').textContent, /could not be read/);
  }
  const {c} = setup({storage:{getItem:() => JSON.stringify({version:1,ids:[960,960,728,'960',-1,999999,null]}), setItem() {}}});
  assert.deepEqual(Array.from(c.favourites), [960,728]);
  assert.equal(c.favouritesStorageIssue, 'filtered');
});

test('Blocked storage keeps the app usable and never claims a durable save', () => {
  const {c, element} = setup({storage:{getItem() {throw new Error('Blocked');}, setItem() {throw new Error('Quota');}}});
  c.showProduct(727);
  c.toggleFav();
  c.renderFavourites();
  assert.match(element('favList').innerHTML, /showProduct\(727\)/);
  assert.match(element('favouriteFeedback').textContent, /this visit only/);
  assert.match(element('profileStorageStatus').textContent, /could not save or read/);
  c.toggleFav();
  assert.match(element('favouriteFeedback').textContent, /Removed for this visit only/);
  assert.equal(element('statFavs').textContent, 0);
});

test('Temporary user entries stay temporary and cannot become a different saved product', () => {
  const {c, element, storage} = setup();
  element('addName').value = 'Temporary meal';
  element('addIngredients').value = 'User supplied ingredients';
  element('addType').value = 'dog';
  c.scoreNewProduct();
  const temporary = c.products[c.products.length - 1];
  c.showProduct(temporary.id);
  c.toggleFav();
  assert.match(element('favouriteFeedback').textContent, /temporary product/);
  assert.deepEqual(JSON.parse(storage.getItem(key)).ids, []);
  assert.equal(setup({storage}).c.favourites.length, 0);
});

test('Changes in another tab refresh favourites, heart state and profile count', () => {
  const {c, element, storage} = setup();
  c.showProduct(960);
  storage.setItem(key, JSON.stringify({version:1,ids:[960,728]}));
  c.handleFavouriteStorageChange({key:'unrelated'});
  assert.equal(c.favourites.length, 0);
  c.handleFavouriteStorageChange({key});
  assert.equal(element('detailFavBtn').attributes['aria-pressed'], 'true');
  assert.equal(element('statFavs').textContent, 2);
  assert.match(element('favList').innerHTML, /showProduct\(728\)/);
  storage.setItem(key, JSON.stringify({version:1,ids:[]}));
  c.handleFavouriteStorageChange({key:null});
  assert.equal(element('detailFavBtn').attributes['aria-pressed'], 'false');
  assert.equal(element('statFavs').textContent, 0);
});

test('Profile describes actual browser state instead of demonstration account details', () => {
  const profile = html.split('<!-- PROFILE SCREEN -->')[1].split('<!-- EXPLORE SCREEN -->')[0];
  assert.doesNotMatch(profile, /Tex|Dog #|Membership Tiers|4\.99|9\.99|statScanned/);
  assert.match(profile, /Viewed this visit/);
  assert.match(profile, /Pet profiles, accounts and memberships are not available yet/);
  const {c, element} = setup();
  c.showProduct(727);
  c.showProduct(960);
  c.updateProfile();
  assert.equal(element('statViewed').textContent, 2);
  assert.equal(c.scannedCount, 0, 'Opening product details is not a camera scan');
  assert.match(element('profileStorageStatus').textContent, /do not sync across devices/);
});

test('A saved product returns to favourites using the detail back button', () => {
  const {c, element, screen} = setup();
  vm.runInContext(fn('goBackToCategory'), c);
  c.showScreen('favourites');
  c.showProduct(960);
  assert.equal(element('detailBackLabel').textContent, 'Favourites');
  c.goBackToCategory();
  assert.equal(screen(), 'favourites');
});
