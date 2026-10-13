# Mucka saved captures

Testing version 2026.10.13.10 replaces the temporary Collector queue with My captures. A missing barcode opens a prefilled draft directly. The owner can add separate front-of-pack, barcode and ingredient/nutrition photos, plus optional brand, recipe, pack size and notes. A repeated valid barcode, including its zero-padded representation, reopens the existing capture.

Drafts save after edits and each photo. “Saved on this device” appears only after the IndexedDB transaction commits. Photos are stored as JPEG Blobs at up to 2,200 pixels on the longest edge, with no location metadata copied from the source. Saved captures and drafts can be reopened, edited, exported or individually deleted. Closing the editor waits for pending writes; leaving with uncommitted changes prompts the browser's unsaved-work warning where supported.

Captures live in this browser and origin on this device. They are not uploaded, submitted, synced between browsers/devices or imported into the product catalogue automatically. Browser data clearing, private browsing and browser storage eviction can still remove them. A best-effort persistent-storage request is made after Save capture; it is not a guarantee of retention. There is no account or cloud backup. Camera access starts only when the owner presses Scan.

ZIP export contains a versioned JSON manifest, plain-text product details and labelled JPEG files. It leaves the collection intact. After preparing the file, a separate Share button uses native file sharing when supported; Download backup is always offered. The same ZIP can restore missing captures on another browser/device. Import validates metadata, filenames and size limits and commits all new records in one transaction. Existing IDs or barcodes are kept rather than overwritten. JSZip 3.10.1 is served locally with its licence.

Storage failures remain visible, retain the current working draft and offer retry or backup export. Concurrent edits from an older tab are rejected instead of overwriting the newer version. Unsupported image formats produce an explicit error; HEIC conversion depends on the browser's image decoder. Manual barcode entry remains available if the scanner library or camera cannot load. The page itself is not an offline-installed app; reopening without a network connection is not guaranteed.

## Validation

- 50 Node tests pass, including transaction acknowledgement, quota failure, concurrent-write protection, barcode parity and backup metadata validation.
- 16 isolated Chrome browser scenarios pass at phone dimensions. They cover the main-app handoff, photo and text persistence, browser restart, repeated scans, ZIP contents, quota recovery, stale-tab backup, photo removal, unavailable scanner, cancelled camera startup, 320/390/768-pixel layouts, deletion, ZIP restoration and duplicates, malformed backups, and export with unavailable storage.
- Editor and collection screenshots were visually reviewed. Barcode maps remain synchronized at 474 supported associations. The photos and catalogue assignments are unchanged by this release.
- Real iPhone camera capture, Safari image decoding, native sharing and OS storage behaviour still need an owner field check. The automated camera test simulates lifecycle events; it is not a real packet scan.

## Owner check

Open the testing app showing 2026.10.13.10. Scan an unrecognised packet, choose Add photos of this product, add its front and printed-barcode photos, then wait for Saved on this device. Close and reopen the same browser and open My captures from the profile. Confirm the record and photos are present. Export it to Files or share the ZIP back for review. Keep a backup before clearing browser data.
