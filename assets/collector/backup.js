(function (root) {
  'use strict';
  var fields = {barcode: 80, brand: 120, name: 180, pack: 80, notes: 2000};
  function validateManifest(data) {
    if (!data || data.schemaVersion !== 1 || !Array.isArray(data.captures) || !data.captures.length || data.captures.length > 1000) throw new Error('Choose a Mucka capture backup with up to 1,000 captures.');
    return data.captures.map(function (raw) {
      if (!raw || typeof raw.id !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(raw.id)) throw new Error('The backup contains an invalid capture ID.');
      var record = {id: raw.id, photos: {}, status: raw.status === 'saved' ? 'saved' : 'draft', revision: 0};
      Object.keys(fields).forEach(function (key) { if (typeof raw[key] !== 'string' || raw[key].length > fields[key]) throw new Error('The backup contains invalid product details.'); record[key] = raw[key]; });
      record.reportType = ['missing','wrong','details'].includes(raw.reportType) ? raw.reportType : 'missing';
      if (raw.reportedProduct) {
        var p = raw.reportedProduct;
        if (!p || typeof p !== 'object' || !/^\d{1,12}$/.test(String(p.id))) throw new Error('The reported product reference is invalid.');
        record.reportedProduct = {id:String(p.id)};
        ['brand','name','pack'].forEach(function(key) { if (typeof p[key] !== 'string' || p[key].length > (key==='name'?180:key==='brand'?120:80)) throw new Error('The reported product reference is invalid.'); record.reportedProduct[key]=p[key]; });
      }
      ['createdAt', 'updatedAt'].forEach(function (key) { if (typeof raw[key] !== 'string' || !Number.isFinite(Date.parse(raw[key]))) throw new Error('The backup contains an invalid date.'); record[key] = new Date(raw[key]).toISOString(); });
      if (!raw.photos || typeof raw.photos !== 'object' || Array.isArray(raw.photos)) throw new Error('The backup photo list is invalid.');
      Object.keys(raw.photos).forEach(function (role) {
        var filename = raw.photos[role];
        if (!['front', 'barcode', 'ingredients'].includes(role) || typeof filename !== 'string' || !/^capture-[0-9]{3,4}-[a-zA-Z0-9-]+\/(front|barcode|ingredients)\.jpg$/.test(filename) || !filename.endsWith('/' + role + '.jpg')) throw new Error('The backup contains an unexpected photo path.');
        record.photos[role] = filename;
      });
      return record;
    });
  }
  function boundedBytes(file, limit) {
    return new Promise(function (resolve, reject) {
      if (!file) { reject(new Error('A photo or details file is missing from this backup.')); return; }
      var chunks = [], size = 0, stream = file.internalStream('uint8array');
      stream.on('data', function (chunk) { size += chunk.length; if (size > limit) { stream.pause(); chunks = []; reject(new Error('This backup is too large to restore safely.')); } else chunks.push(chunk); });
      stream.on('error', reject);
      stream.on('end', function () { var result = new Uint8Array(size), offset = 0; chunks.forEach(function (chunk) { result.set(chunk, offset); offset += chunk.length; }); resolve(result); });
      stream.resume();
    });
  }
  root.MuckaCaptureBackup = {validateManifest: validateManifest, boundedBytes: boundedBytes};
})(typeof window !== 'undefined' ? window : globalThis);
