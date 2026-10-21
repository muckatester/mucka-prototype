(function() {
  'use strict';
  var config=window.MuckaBeta, script=document.currentScript;
  if (!config || !config.origin || location.origin===config.origin || /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || location.protocol==='file:') return;
  var base=new URL('../',script.src), relative=location.pathname.startsWith(base.pathname)?location.pathname.slice(base.pathname.length):'index.html';
  var target=new URL(relative || 'index.html',config.origin+'/');target.search=location.search;target.hash=location.hash;
  location.replace(new URL('beta-move.html?next='+encodeURIComponent(target.href),base).href);
})();
