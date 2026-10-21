/* Packet reports contain no credentials and never change the public catalogue. */
(function(root) {
  'use strict';
  var VERSION = '2026.10.22.1';
  var MAX_BYTES = 7 * 1024 * 1024;
  var roles = ['front', 'barcode', 'ingredients'];
  function validate(record) {
    if (!record || !record.barcode || !record.barcode.trim()) throw new Error('Add the digits printed below the barcode.');
    if (!record.photos || !record.photos.front || !record.photos.barcode) throw new Error('Add both the front-of-pack photo and the printed-barcode photo.');
    var total = 0;
    roles.forEach(function(role) {
      var photo = record.photos[role];
      if (!photo) return;
      if (!(photo instanceof Blob) || photo.type !== 'image/jpeg' || !photo.size) throw new Error('Please add a fresh packet photo before sending.');
      total += photo.size;
    });
    if (total > MAX_BYTES) throw new Error('These photos are too large to send together. Retake them or choose smaller photos; your draft is safe.');
  }
  async function prepare(record) {
    validate(record);
    var details = {
      schemaVersion: 1, appVersion: VERSION, captureId: record.id,
      reportType: ['missing', 'wrong', 'details'].includes(record.reportType) ? record.reportType : 'missing',
      barcode: record.barcode, brand: record.brand || '', name: record.name || '', pack: record.pack || '', notes: record.notes || '',
      reportedProduct: record.reportedProduct || null
    };
    var bytes = await new Blob([JSON.stringify(details), ...roles.map(function(role) { return record.photos[role] || ''; })]).arrayBuffer();
    var hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))).map(function(x) { return x.toString(16).padStart(2,'0'); }).join('');
    var reference = 'MU-' + record.id.slice(0,8).toUpperCase() + '-' + hash.slice(0,12).toUpperCase();
    var body = new FormData();
    var fields = {
      'form-name': 'mucka-packet-review', 'bot-field': '', reference: reference,
      'app-version': VERSION, 'capture-id': record.id, 'report-type': details.reportType,
      barcode: details.barcode, brand: details.brand, product: details.name, pack: details.pack, notes: details.notes,
      'reported-product': JSON.stringify(details.reportedProduct),
      'consent': 'Packet photos and product details shared with Mucka for catalogue review; not a public post.',
      'subject': 'Mucka packet review ' + reference
    };
    Object.keys(fields).forEach(function(key) { body.append(key, fields[key]); });
    roles.forEach(function(role) { if (record.photos[role]) body.append(role+'-photo',record.photos[role],role+'.jpg'); });
    return {fingerprint: hash, reference: reference, body: body};
  }
  async function send(prepared) {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new Error('You are offline. Your draft is saved here; reconnect and try again.');
    var controller = new AbortController(), timer = setTimeout(function() { controller.abort(); }, 35000);
    try {
      var response = await fetch('capture-intake.html', {method:'POST', body:prepared.body, signal:controller.signal, credentials:'same-origin'});
      if (!response.ok) throw new Error('The upload was not accepted. Your draft is safe. Please try again.');
      if (response.url && typeof location !== 'undefined' && new URL(response.url).origin !== location.origin) throw new Error('The upload reached a sign-in or unexpected page. Your draft is safe; please use the current beta link.');
      var html = await response.text();
      if (!/<title>\s*(?:Thank you!|Mucka report submitted)\s*<\/title>/i.test(html)) throw new Error('The server did not confirm a packet submission. Your draft is safe. Keep the reference and try again.');
      return {reference:prepared.reference, fingerprint:prepared.fingerprint, sentAt:new Date().toISOString(), appVersion:VERSION};
    } catch(e) {
      if (e.name === 'AbortError') throw new Error('We could not confirm the upload in time. Keep this reference and retry; we can identify repeated reports.');
      if (e instanceof TypeError) throw new Error('Connection interrupted. We could not confirm the upload. Your photos are still here; please retry.');
      throw e;
    } finally { clearTimeout(timer); }
  }
  root.MuckaCaptureSubmission={validate:validate,prepare:prepare,send:send,version:VERSION};
})(typeof window !== 'undefined' ? window : globalThis);
