/* Mucka capture workflow. No capture is sent to a server by this page. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var store, records = [], current = null, dirty = false, changeNumber = 0, savePromise = null, saveTimer;
  var photosBusy = 0, initialized = false, previewUrls = [], listUrls = [], exportUrl, exportFile, exporting = false;
  var scanner = null, scannerTask = null, scannerEpoch = 0, scanned = false, toastTimer;
  var roles = ['front', 'barcode', 'ingredients'];
  var fields = ['barcode', 'brand', 'name', 'pack', 'notes'];
  function fieldId(field) { return 'capture' + field[0].toUpperCase() + field.slice(1); }
  function keyFor(code) { return code.trim() ? (normalizeGtin(code) || 'raw:' + code.trim()) : null; }
  function newRecord(barcode) {
    return {id: crypto.randomUUID(), barcode: barcode || '', brand: '', name: '', pack: '', notes: '', photos: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'draft', revision: 0};
  }
  function useful(record) { return fields.some(function (f) { return !!record[f].trim(); }) || roles.some(function (r) { return !!record.photos[r]; }); }
  function snapshot(record) { return Object.assign({}, record, {photos: Object.assign({}, record.photos)}); }
  function toast(message) { clearTimeout(toastTimer); $('toast').textContent = message; $('toast').classList.add('visible'); toastTimer = setTimeout(function () { $('toast').classList.remove('visible'); }, 3500); }
  function status(message, failed) { $('saveStatus').textContent = message; $('saveStatus').parentElement.classList.toggle('failed', !!failed); }
  function showError(error) {
    var message = error && error.message || 'Storage is unavailable.';
    if (error && error.name === 'QuotaExceededError') message = 'This browser has run out of storage. Export your captures, then free some space and try again.';
    if (error && error.name === 'ConstraintError') message = 'That barcode is already in your collection. Keep this draft open and export it before changing the barcode, or reopen the existing capture.';
    $('storageErrorText').textContent = message + ' Keep this page open until you have saved or exported your work.';
    $('storageError').hidden = false; status('Not saved — please retry or export a backup', true);
  }
  function clearError() { $('storageError').hidden = true; }
  function updateBarcodeHint() {
    var code = $('captureBarcode').value.trim(), hint = $('barcodeHint');
    hint.classList.toggle('warning', !!code && !normalizeGtin(code));
    hint.textContent = !code ? 'No barcode handy? You can still save photos and details.' : !normalizeGtin(code) ? 'These digits do not pass the barcode check. Keep the number as printed and add a photo for review.' : isKnownBarcode(code) ? 'This barcode has a catalogue match. You can still capture the packet to report a problem.' : 'No confirmed catalogue match yet. A clear photo of the printed barcode will help.';
  }
  function markDirty() {
    if (!current) return;
    dirty = true; changeNumber++; status('Saving changes…');
    clearTimeout(saveTimer); saveTimer = setTimeout(function () { persist(); }, 300);
  }
  async function persist() {
    clearTimeout(saveTimer);
    if (savePromise) { await savePromise; if (dirty && !$('storageError').hidden) return false; return dirty ? persist() : true; }
    if (!current || !dirty) return true;
    if (!current.revision && !useful(current)) { dirty = false; status('Add something to start your draft'); return true; }
    if (!store) { showError(new Error('Local storage is unavailable in this browser. You can still export a backup.')); return false; }
    var record = snapshot(current), revision = current.revision, generation = changeNumber;
    var key = keyFor(record.barcode); if (key) record.matchKey = key; else delete record.matchKey;
    record.updatedAt = new Date().toISOString();
    status('Saving changes…');
    savePromise = store.put(record, revision).then(function (saved) {
      if (current && current.id === saved.id) { current.revision = saved.revision; current.updatedAt = saved.updatedAt; history.replaceState(null, '', location.pathname + '?capture=' + encodeURIComponent(saved.id)); }
      records = records.filter(function (r) { return r.id !== saved.id; }).concat([saved]);
      dirty = generation !== changeNumber; clearError();
      status(dirty ? 'Saving changes…' : 'Saved on this device');
      $('draftBadge').textContent = current.status === 'saved' ? 'Saved capture' : 'Draft';
      $('deleteCapture').hidden = false;
      return true;
    }).catch(function (e) { showError(e); return false; });
    var ok = await savePromise; savePromise = null;
    if (ok && dirty) return persist();
    return ok;
  }
  function revoke(urls) { urls.forEach(function (url) { URL.revokeObjectURL(url); }); urls.length = 0; }
  function showEditor() {
    $('collectionView').hidden = true; $('editorView').hidden = false;
    fields.forEach(function (f) { $(fieldId(f)).value = current[f] || ''; });
    $('editorTitle').textContent = current.revision ? 'Your product capture' : 'Add a product';
    $('draftBadge').textContent = current.status === 'saved' ? 'Saved capture' : 'Draft';
    $('deleteCapture').hidden = !current.revision;
    status(current.revision ? 'Saved on this device' : 'Add something to start your draft');
    updateBarcodeHint(); renderPhotos(); window.scrollTo(0, 0); $('editorTitle').focus();
  }
  async function startCapture(code) {
    if (!initialized) return;
    if (photosBusy) { toast('Please wait for the photo to finish.'); return; }
    if (!(await persist())) return;
    if (store) { try { records = await store.list(); } catch (e) { showError(e); return; } }
    var key = keyFor(code || ''), existing = key && records.find(function (r) { return r.matchKey === key; });
    current = existing ? snapshot(existing) : newRecord(code); dirty = false; if (store) clearError();
    showEditor();
    if (existing) toast('Already collected — opening your saved capture.');
    else if (code) { markDirty(); await persist(); }
  }
  async function openCapture(id) {
    if (photosBusy || !(await persist())) return;
    try { if (store) records = await store.list(); } catch (e) { showError(e); return; }
    var record = records.find(function (r) { return r.id === id; });
    if (!record) { toast('This capture was removed in another tab.'); return collection(); }
    current = snapshot(record); dirty = false; history.replaceState(null, '', location.pathname + '?capture=' + encodeURIComponent(record.id)); showEditor();
  }
  function renderPhotos() {
    revoke(previewUrls);
    roles.forEach(function (role) {
      var preview = $(role + 'Preview'), blob = current.photos[role], slot = preview.closest('.photo-slot');
      preview.replaceChildren();
      if (blob) { var img = document.createElement('img'); var url = URL.createObjectURL(blob); previewUrls.push(url); img.src = url; img.alt = role === 'front' ? 'Your front of pack photo' : role === 'barcode' ? 'Your printed barcode photo' : 'Your ingredients and nutrition photo'; preview.append(img); }
      else { var icon = document.createElement('span'); icon.textContent = role === 'front' ? '▤' : role === 'barcode' ? '▥' : '≡'; icon.setAttribute('aria-hidden', 'true'); preview.append(icon); }
      slot.querySelector('.photo-label').textContent = blob ? 'Change photo' : 'Add photo';
      slot.querySelector('.remove-photo').hidden = !blob;
    });
  }
  async function compressPhoto(file) {
    if (file.size > 35 * 1024 * 1024) throw new Error('That photo is too large. Choose a photo smaller than 35 MB.');
    if (file.type && !file.type.startsWith('image/')) throw new Error('Please choose a photo.');
    var url = URL.createObjectURL(file);
    try {
      var image = await new Promise(function (resolve, reject) { var img = new Image(); img.onload = function () { resolve(img); }; img.onerror = function () { reject(new Error('This photo format could not be opened. Try a JPEG, PNG, or a new camera photo.')); }; img.src = url; });
      var scale = Math.min(1, 2200 / Math.max(image.naturalWidth, image.naturalHeight));
      var canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(image.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      var ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      return await new Promise(function (resolve, reject) { canvas.toBlob(function (blob) { if (blob) resolve(blob); else reject(new Error('Could not prepare this photo. Please try again.')); }, 'image/jpeg', 0.9); });
    } finally { URL.revokeObjectURL(url); }
  }
  async function addPhoto(role, input) {
    var file = input.files[0]; input.value = ''; if (!file || !current) return;
    var id = current.id; photosBusy++; $('photoStatus').textContent = 'Preparing your photo…'; setBusy(true);
    try {
      var photo = await compressPhoto(file); if (!current || current.id !== id) return;
      current.photos[role] = photo; renderPhotos(); markDirty();
      var ok = await persist(); $('photoStatus').textContent = ok ? 'Photo saved on this device.' : 'Photo added, but not saved yet. Retry saving or export a backup.';
    } catch (e) { $('photoStatus').textContent = e.message; }
    finally { photosBusy--; setBusy(photosBusy > 0); }
  }
  function setBusy(busy) {
    ['saveCapture', 'backToCollection', 'deleteCapture', 'exportCurrent', 'scanEditor'].forEach(function (id) { $(id).disabled = busy; });
    roles.forEach(function (r) { $(r + 'Input').disabled = busy; });
  }
  async function collection() {
    if (photosBusy) { toast('Please wait for the photo to finish.'); return; }
    if (!(await persist())) return;
    try { if (store) records = await store.list(); } catch (e) { showError(e); return; }
    current = null; dirty = false; revoke(previewUrls); $('editorView').hidden = true; $('collectionView').hidden = false;
    history.replaceState(null, '', location.pathname); renderCollection(); window.scrollTo(0, 0); $('collectionTitle').focus();
  }
  function renderCollection() {
    revoke(listUrls); var list = $('captureList'); list.replaceChildren();
    $('captureCount').textContent = records.length; $('emptyCollection').hidden = records.length > 0; $('exportAll').disabled = !records.length;
    records.slice().sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); }).forEach(function (record) {
      var button = document.createElement('button'); button.className = 'capture-card';
      var image = record.photos.front || record.photos.barcode, thumb;
      if (image) { thumb = document.createElement('img'); var url = URL.createObjectURL(image); listUrls.push(url); thumb.src = url; thumb.alt = ''; thumb.className = 'thumb'; }
      else { thumb = document.createElement('span'); thumb.className = 'thumb placeholder'; thumb.textContent = '▤'; thumb.setAttribute('aria-hidden', 'true'); }
      var summary = document.createElement('div'); summary.className = 'summary';
      var title = document.createElement('strong'); title.textContent = [record.brand, record.name].filter(Boolean).join(' · ') || 'Product details to add';
      var barcode = document.createElement('p'); barcode.textContent = [record.barcode || 'No barcode yet', record.pack].filter(Boolean).join(' · ');
      var state = document.createElement('p'); state.className = 'status-line'; var count = roles.filter(function (r) { return record.photos[r]; }).length;
      state.textContent = (record.status === 'draft' ? 'Draft' : 'Saved') + ' · ' + count + (count === 1 ? ' photo' : ' photos') + ' · ' + new Date(record.updatedAt).toLocaleDateString('en-AU', {day: 'numeric', month: 'short'});
      summary.append(title, barcode, state); var arrow = document.createElement('span'); arrow.className = 'chevron'; arrow.textContent = '›'; arrow.setAttribute('aria-hidden', 'true'); button.append(thumb, summary, arrow);
      button.addEventListener('click', function () { openCapture(record.id); }); list.append(button);
    });
  }
  async function saveCapture(event) {
    event.preventDefault(); if (!current || photosBusy) return;
    if (!useful(current)) { toast('Add a barcode, a photo or some product details first.'); return; }
    $('saveCapture').disabled = true;
    try {
      current.status = 'saved'; markDirty();
      if (await persist()) { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {}); await collection(); toast('Capture saved. Add another whenever you’re ready.'); }
    } finally { $('saveCapture').disabled = false; }
  }
  async function deleteCapture() {
    if (!current || photosBusy || !(await persist())) return;
    if (!confirm('Delete this capture and its photos from this device? Export a backup first if you need to keep them.')) return;
    try { if (!store) throw new Error('Storage is unavailable.'); await store.remove(current.id, current.revision); records = records.filter(function (r) { return r.id !== current.id; }); current = null; dirty = false; await collection(); toast('Capture deleted.'); }
    catch (e) { showError(e); }
  }
  async function prepareExport(single, allowUnsaved) {
    if (exporting || photosBusy) { toast('Please wait for the current photo or export to finish.'); return; }
    if (!allowUnsaved && !(await persist())) return;
    var items;
    try {
      if (store) records = await store.list();
      items = single && current ? [snapshot(current)] : records.map(snapshot);
      if (allowUnsaved && current && useful(current)) items = items.filter(function (r) { return r.id !== current.id; }).concat([snapshot(current)]);
    } catch (e) { items = records.filter(function (r) { return !current || r.id !== current.id; }).map(snapshot); if (current && useful(current)) items.push(snapshot(current)); }
    if (!items.length) { toast('No captures to export yet.'); return; }
    exporting = true; $('exportReady').hidden = true; $('exportStatus').textContent = 'Preparing ' + items.length + (items.length === 1 ? ' capture…' : ' captures…'); $('exportDialog').showModal();
    try {
      if (typeof JSZip === 'undefined') throw new Error('The export helper could not load. Refresh this page and try again. Your captures stay saved here.');
      var zip = new JSZip(), exportedAt = new Date().toISOString(), manifest = [];
      items.forEach(function (record, index) {
        var folder = 'capture-' + String(index + 1).padStart(3, '0') + '-' + record.id;
        var metadata = Object.assign({}, record, {photos: {}});
        roles.forEach(function (r) { if (record.photos[r]) { var filename = folder + '/' + r + '.jpg'; zip.file(filename, record.photos[r]); metadata.photos[r] = filename; } });
        manifest.push(metadata); zip.file(folder + '/details.json', JSON.stringify(metadata, null, 2));
        zip.file(folder + '/details.txt', 'MUCKA PRODUCT CAPTURE\nBarcode: ' + record.barcode + '\nBrand: ' + record.brand + '\nProduct: ' + record.name + '\nPack: ' + record.pack + '\nNotes: ' + record.notes + '\nStatus: ' + record.status + '\nCaptured: ' + record.createdAt + '\nUpdated: ' + record.updatedAt + '\nPhotos: ' + Object.keys(metadata.photos).join(', ') + '\nUnverified owner capture for review.');
      });
      zip.file('mucka-captures.json', JSON.stringify({schemaVersion: 1, appVersion: '2026.10.13.10', exportedAt: exportedAt, captures: manifest}, null, 2));
      zip.file('READ-ME.txt', 'Mucka captures\nShare this ZIP with the Mucka reviewer. Each folder contains the product details and labelled packet photos. These are unverified captures, not approved catalogue records. Keep a copy outside the browser as a backup.');
      var blob = await zip.generateAsync({type: 'blob', compression: 'STORE'}), name = 'Mucka-captures-' + exportedAt.slice(0, 10) + '.zip';
      if (exportUrl) URL.revokeObjectURL(exportUrl); exportUrl = URL.createObjectURL(blob); exportFile = new File([blob], name, {type: 'application/zip'});
      $('downloadExport').href = exportUrl; $('downloadExport').download = name;
      var canShare = false; try { canShare = !!navigator.canShare && navigator.canShare({files: [exportFile]}); } catch (e) {}
      $('shareExport').hidden = !canShare; $('exportReady').hidden = false; $('exportStatus').textContent = items.length + (items.length === 1 ? ' capture ready' : ' captures ready') + ' · ' + (blob.size / 1024 / 1024).toFixed(1) + ' MB';
    } catch (e) { $('exportStatus').textContent = e.message || 'Export failed. Please try again. Your captures have not been deleted.'; }
    finally { exporting = false; }
  }
  async function restoreBackup(input) {
    var file = input.files[0]; input.value = ''; if (!file) return;
    if (!store) { showError(new Error('Local storage must be available before restoring a backup.')); return; }
    $('importStatus').textContent = 'Checking your backup…'; input.disabled = true;
    try {
      if (file.size > 100 * 1024 * 1024) throw new Error('Please use a backup smaller than 100 MB.');
      if (typeof JSZip === 'undefined') throw new Error('The backup helper could not load. Refresh this page and try again.');
      var zip = await JSZip.loadAsync(file);
      var manifestBytes = await MuckaCaptureBackup.boundedBytes(zip.file('mucka-captures.json'), 5 * 1024 * 1024);
      var restored = MuckaCaptureBackup.validateManifest(JSON.parse(new TextDecoder().decode(manifestBytes))), total = 0;
      for (var record of restored) {
        var key = keyFor(record.barcode); if (key) record.matchKey = key;
        for (var role of Object.keys(record.photos)) {
          var bytes = await MuckaCaptureBackup.boundedBytes(zip.file(record.photos[role]), 12 * 1024 * 1024);
          total += bytes.length; if (total > 160 * 1024 * 1024) throw new Error('This backup contains too many photos to restore at once.');
          if (bytes[0] !== 255 || bytes[1] !== 216 || bytes[2] !== 255) throw new Error('A photo in this backup is not a valid JPEG.');
          record.photos[role] = new Blob([bytes], {type: 'image/jpeg'});
        }
      }
      var result = await store.importRecords(restored); records = await store.list(); renderCollection(); clearError();
      $('importStatus').textContent = result.added + (result.added === 1 ? ' capture restored.' : ' captures restored.') + (result.skipped ? ' ' + result.skipped + ' already here; existing captures were kept.' : '');
    } catch (e) { $('importStatus').textContent = 'Backup not restored: ' + (e.message || 'Please try again.'); }
    finally { input.disabled = false; }
  }
  async function closeScanner() {
    scannerEpoch++; if ($('scannerDialog').open) $('scannerDialog').close();
    if (scannerTask) { try { await scannerTask; } catch (e) {} }
    var old = scanner; scanner = null;
    if (old) { try { await old.stop(); } catch (e) {} try { old.clear(); } catch (e) {} }
  }
  async function openScanner() {
    if (photosBusy || !(await persist())) return;
    await closeScanner(); var epoch = ++scannerEpoch; scanned = false; $('cameraStatus').textContent = 'Starting camera…'; $('scannerDialog').showModal();
    if (typeof Html5Qrcode === 'undefined') { $('cameraStatus').textContent = 'Camera scanning could not load. You can enter the barcode digits instead.'; return; }
    try {
      scanner = new Html5Qrcode('qr-reader');
      scannerTask = scanner.start({facingMode: 'environment'}, {fps: 10, qrbox: {width: 240, height: 140}}, function (value, result) {
        if (epoch !== scannerEpoch || scanned) return;
        var barcode = getScannedGtinText(value, result); if (!barcode) return; scanned = true;
        setTimeout(async function () { await closeScanner(); if (current) { current.barcode = barcode; $('captureBarcode').value = barcode; updateBarcodeHint(); markDirty(); await persist(); } else await startCapture(barcode); }, 0);
      }, function () {});
      await scannerTask; if (epoch === scannerEpoch) $('cameraStatus').textContent = 'Point the camera at the packet barcode.';
    } catch (e) { if (epoch === scannerEpoch) $('cameraStatus').textContent = 'Camera unavailable. Allow camera access in your browser settings, or enter the digits below the barcode instead.'; }
    finally { scannerTask = null; }
  }
  async function init() {
    fields.forEach(function (f) { $(fieldId(f)).addEventListener('input', function () { if (!current) return; current[f] = this.value; if (f === 'barcode') updateBarcodeHint(); markDirty(); }); });
    roles.forEach(function (role) { $(role + 'Input').addEventListener('change', function () { addPhoto(role, this); }); });
    document.querySelectorAll('[data-remove]').forEach(function (button) { button.addEventListener('click', function () { if (photosBusy) return; delete current.photos[this.dataset.remove]; renderPhotos(); markDirty(); }); });
    $('importBackup').onchange = function () { restoreBackup(this); };
    $('newCapture').onclick = function () { startCapture(''); }; $('scanNew').onclick = openScanner; $('scanEditor').onclick = openScanner;
    $('backToCollection').onclick = collection; $('captureForm').onsubmit = saveCapture; $('deleteCapture').onclick = deleteCapture;
    $('exportAll').onclick = function () { prepareExport(false); }; $('exportCurrent').onclick = function () { prepareExport(true); }; $('backupUnsaved').onclick = function () { prepareExport(false, true); };
    $('retrySave').onclick = async function () { try { if (!store) store = await MuckaCaptureStore.open(); clearError(); if (current) { dirty = true; await persist(); } else { records = await store.list(); renderCollection(); } } catch (e) { showError(e); } };
    $('closeExport').onclick = function () { $('exportDialog').close(); };
    $('shareExport').onclick = async function () { try { await navigator.share({files: [exportFile], title: 'Mucka product captures'}); } catch (e) { if (e.name !== 'AbortError') $('exportStatus').textContent = 'Sharing did not finish. Use Download backup to save the file instead.'; } };
    $('closeScanner').onclick = closeScanner; $('scannerDialog').addEventListener('cancel', function (e) { e.preventDefault(); closeScanner(); });
    $('useManual').onclick = async function () { await closeScanner(); if (!current) await startCapture(''); $('captureBarcode').focus(); };
    document.querySelectorAll('a[href="index.html"]').forEach(function (link) { link.addEventListener('click', async function (e) { e.preventDefault(); if (photosBusy) { toast('Please wait for the photo to finish.'); return; } if (await persist()) location.href = 'index.html'; }); });
    window.addEventListener('beforeunload', function (e) { if (dirty || savePromise || photosBusy) { e.preventDefault(); e.returnValue = ''; } });
    document.addEventListener('visibilitychange', function () { if (document.hidden) { persist(); closeScanner(); } });
    try { store = await MuckaCaptureStore.open(); records = await store.list(); } catch (e) { showError(e); }
    initialized = true; $('collectionLoading').hidden = true; renderCollection();
    var params = new URLSearchParams(location.search), barcode = params.get('barcode');
    if (params.has('capture')) await openCapture(params.get('capture'));
    else if (barcode || params.has('new')) await startCapture((barcode || '').slice(0, 80).trim());
  }
  init();
})();
