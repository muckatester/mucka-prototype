const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const productsLiteral = source => source.match(/const products = (\[[\s\S]*?\n\]);/)[1];
function fn(name) {
  const match = html.match(new RegExp('^function ' + name + '\\([\\s\\S]*?^}', 'm'));
  assert.ok(match, 'Function exists: ' + name);
  return match[0];
}
function setup(options = {}) {
  const elements = new Map(), timers = new Map(), alerts = [];
  const stored = new Map();
  const storage = options.storage || {getItem: key => stored.has(key) ? stored.get(key) : null, setItem: (key, value) => stored.set(key, value)};
  let timerId = 0, activeScreen = 'home';
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      style: {}, innerHTML: '', textContent: '', value: '', placeholder: '',
      attributes: {}, setAttribute(name, value) { this.attributes[name] = value; },
      classList: {contains: name => name === 'active' && id === 'screen-' + activeScreen, add() {}, remove() {}},
      scrollIntoView() {},
    });
    return elements.get(id);
  }
  const c = vm.createContext({
    document: {getElementById: element, querySelector: () => null, querySelectorAll: () => [], documentElement: {}, body: {}},
    window: {scrollTo() {}, localStorage: storage}, alert: message => alerts.push(message),
    setTimeout(callback) { const id = ++timerId; timers.set(id, {callback, repeat: false}); return id; },
    setInterval(callback) { const id = ++timerId; timers.set(id, {callback, repeat: true}); return id; },
    clearTimeout: id => timers.delete(id), clearInterval: id => timers.delete(id),
    requestAnimationFrame(callback) { callback(); },
    renderBuyLinks() {}, showScreen(name) { activeScreen = name; }, updateProfile() {},
    catIcons: {}, productImageMap: {}, favourites: [], scannedCount: 0, viewedCount: 0,
    favouritesStorageKey: 'mucka.favourites.v1', favouritesStorageIssue: '',
    currentCategoryId: null, currentCategoryPage: 1,
    scoreCountTimer: null, scoreArcTimer: null, scoreBarsTimer: null,
    currentPage: 1, currentFilter: 'all',
  });
  vm.runInContext('var products = ' + productsLiteral(html) + ';' +
    html.match(/var starterCatalogue = [\s\S]*?;\n/)[0] + html.match(/var homeCategories = \[[\s\S]*?\n];/)[0] + html.match(/var perPage = \d+;/)[0], c);
  for (const name of ['recalculateScore', 'hasScoreData', 'getScoreBadge', 'compareProductScores',
    'escapeHtml', 'getProductEvidence', 'getEvidenceLinks', 'getEvidenceFieldHtml', 'getProductFactsHtml', 'getEvidenceSummaryHtml', 'getIngredientListHtml', 'getFoodSVGIcon', 'adjustColor', 'getProductPlaceholder',
    'getProductImage', 'productHasImage', 'showProduct', 'renderPage', 'renderCategoryPage',
    'renderFavourites', 'runOverlaySearch', 'applyFilters', 'getRecommendations', 'renderCategoryGrid',
    'handleCategoryClick', 'gotoCategoryPage', 'scoreNewProduct', 'isSaveableFavourite', 'loadFavourites', 'saveFavourites', 'getFavouriteStorageMessage', 'updateFavouriteButton', 'handleFavouriteStorageChange', 'toggleFav', 'updateProfile']) vm.runInContext(fn(name), c);
  vm.runInContext('products.forEach(recalculateScore); var filteredProducts = products.slice(); var currentCategoryProducts = products.slice();', c);
  c.favourites = c.loadFavourites();
  return {c, element, elements, timers, alerts, storage, screen: () => activeScreen};
}
module.exports = {root, html, productsLiteral, fn, setup};
