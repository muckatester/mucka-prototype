/* Captures are stored locally as structured records with photo Blobs. */
(function (root) {
  'use strict';
  function openStore() {
    return new Promise(function (resolve, reject) {
      if (!root.indexedDB) { reject(new Error('This browser does not offer local capture storage.')); return; }
      var request = root.indexedDB.open('mucka-captures', 1);
      request.onupgradeneeded = function () {
        var store = request.result.createObjectStore('captures', {keyPath: 'id'});
        store.createIndex('matchKey', 'matchKey', {unique: true});
      };
      request.onerror = function () { reject(request.error); };
      request.onblocked = function () { reject(new Error('Close other Mucka tabs and try again.')); };
      request.onsuccess = function () {
        var db = request.result;
        db.onversionchange = function () { db.close(); };
        resolve({
          list: function () {
            return new Promise(function (yes, no) {
              var tx = db.transaction('captures', 'readonly');
              var req = tx.objectStore('captures').getAll();
              tx.oncomplete = function () { yes(req.result); };
              tx.onabort = tx.onerror = function () { no(tx.error || req.error); };
            });
          },
          put: function (record, expectedRevision) {
            return new Promise(function (yes, no) {
              var tx = db.transaction('captures', 'readwrite'), reason;
              var store = tx.objectStore('captures'), req = store.get(record.id);
              req.onsuccess = function () {
                var existing = req.result;
                if ((existing ? existing.revision : 0) !== expectedRevision) {
                  reason = new Error('This capture changed in another tab. Export your current draft, then reopen the collection.');
                  reason.name = 'CaptureConflictError'; tx.abort(); return;
                }
                record.revision = expectedRevision + 1;
                store.put(record);
              };
              tx.oncomplete = function () { yes(record); };
              tx.onabort = tx.onerror = function () { no(reason || tx.error || new Error('Capture could not be saved.')); };
            });
          },
          importRecords: function (records) {
            return new Promise(function (yes, no) {
              var tx = db.transaction('captures', 'readwrite');
              var store = tx.objectStore('captures'), request = store.getAll(), added = 0, skipped = 0;
              request.onsuccess = function () {
                var ids = new Set(request.result.map(function (r) { return r.id; }));
                var keys = new Set(request.result.map(function (r) { return r.matchKey; }).filter(Boolean));
                records.forEach(function (record) {
                  if (ids.has(record.id) || (record.matchKey && keys.has(record.matchKey))) { skipped++; return; }
                  ids.add(record.id); if (record.matchKey) keys.add(record.matchKey);
                  record.revision = 1; store.add(record); added++;
                });
              };
              tx.oncomplete = function () { yes({added: added, skipped: skipped}); };
              tx.onabort = tx.onerror = function () { no(tx.error || new Error('Import failed. No captures were added.')); };
            });
          },
          remove: function (id, revision) {
            return new Promise(function (yes, no) {
              var tx = db.transaction('captures', 'readwrite'), reason;
              var store = tx.objectStore('captures'), req = store.get(id);
              req.onsuccess = function () {
                if (req.result && req.result.revision !== revision) {
                  reason = new Error('This capture changed in another tab. Reopen it before deleting.'); tx.abort(); return;
                }
                store.delete(id);
              };
              tx.oncomplete = function () { yes(); };
              tx.onabort = tx.onerror = function () { no(reason || tx.error || new Error('Capture could not be deleted.')); };
            });
          }
        });
      };
    });
  }
  root.MuckaCaptureStore = {open: openStore};
})(typeof window !== 'undefined' ? window : globalThis);
