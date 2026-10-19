# Mucka launch review

## Current checkpoint — 20 October 2026

Testing version **2026.10.20.1** fixes the main scanner's camera-start cancellation race and adds manual barcode lookup with check-digit validation. Missing camera code, denied permission, absent cameras and busy cameras give recoverable messages. A close/reopen waits for the previous camera to settle; stale callbacks cannot open a product. Escape closes the overlay, keyboard focus stays inside it and returns to Scan, and leaving/hiding the page releases the camera. The same packet can be scanned again immediately. Manual and camera input share the existing exact-product evidence lookup; the unused historical barcode alias map has been removed. Main app and My captures display the same release number.

Validation: 50 automated Node tests, eight main-scanner browser scenarios and 16 saved-capture browser scenarios passed. Browser camera events are simulated; real iPhone permission, camera, native sharing and storage behaviour still need a physical device check. The scanner fallback was visually reviewed at phone width and checked at 320, 390 and 768 pixels. Script: `scripts/test-main-scanner-browser.cjs` (Playwright via NODE_PATH). Prepared for the existing draft PR's testing deployment, not a consumer health-rating launch.

Recounted from the current app: **1,082 products; 967 displayed photos; 115 photo gaps; 474 supported barcode matches; 608 unresolved barcode cases; 13 products with identity-bound starter evidence.** No barcode, photo or scoring coverage was added by the scanner fix.

### Work we can complete without supplier replies

1. Resolve the 115 remaining image/identity cases against the dated worklist, prioritising duplicates, nonexistent pack descriptions and recipe/species conflicts. Do not force a photograph or barcode onto an uncertain listing.
2. Complete accessibility and device checks for search, product details, favourites and captures, including keyboard/screen-reader navigation, small screens, failed images and network interruptions. The scanner checks are one part of this work, not full certification.
3. Expand source-backed label facts from current manufacturer information while keeping company claims separate from exact-recipe evidence. Do not turn a missing supplier answer into a low nutrition score.
4. Define a release catalogue of sufficiently supported products and clearly label remaining research entries. Launch readiness should be measured by reliable behaviour and evidence, not a promise that all 1,082 provisional listings will become verified.
5. Finalise public-facing data/privacy information and confirm image-use rights before broader release. Captures currently save only in the same browser/site, with ZIP backup rather than cloud sync.

### Short owner phone check once the release is live

- Confirm version **2026.10.20.1** on Home and My captures.
- Scan one known bag; cancel and immediately reopen Scan, then scan the same bag again. Confirm the recipe and pack size.
- Type **9392596027556** into the scanner form: it should open Billie's Bowl Adult with Aussie Beef, 20kg. This checks lookup separately from camera reading.
- For an unmatched packet, save its front and barcode photographs, reopen the same browser, then export a ZIP to Files. Send any failure with the displayed version and a screenshot; there is no request to buy or scan a shopful of products.

### Supplier position

SavourLife case 25614 is with quality control; Mars case 10605377 is under review. Neither has supplied the requested nutrition evidence. GS1 confirms the trial has no payment obligation or automatic paid conversion, but requires known GTINs and therefore does not discover unknown barcodes by name. Post-trial rights and query counting remain incomplete. No signup or payment. See the outreach queue for exact message IDs and dates.

The sections below are historical checkpoints and retain their original counts.

## Current testing position — 13 October 2026

[Testing build 2026.10.13.10](https://deploy-preview-2--mucka-prototype.netlify.app/?v=2026.10.13.10) contains 1,082 catalogue products, 474 source-supported barcode lookups and 846 displayed product photographs. The [current image gap list](image-gaps-2026-10-13.csv) has 236 missing or withheld photos. GS1 has received the provisional candidate-GTIN CSV; its reply is still needed to validate those associations and decide on licensed data access. The remaining 608 barcode cases and 236 image cases are separate worklists. Online image review does not prove that a barcode scans to the pictured pack.

The app remains an information/testing preview. The product assessment method and ingredients are still under review, so prior numerical scores remain labelled as unvalidated history. A broad consumer launch should wait for source-backed product identities, image rights where needed, and field scan checks of representative current packs. All 50 automated checks and 16 isolated browser capture scenarios pass for this build; PR 2 remains draft and the public main branch has not changed.

My captures now provides saved drafts, separate packet/barcode/ingredient photos, duplicate-scan recovery and ZIP export/restoration. Storage is local to this browser/device, with visible failure handling. See [capture behaviour, privacy and validation](collector-captures-2026-10-13.md). Real iPhone photo capture and native sharing remain to be checked.

## Earlier update 13 October 2026 round two

Testing version **2026.10.13.3** enables **458** exact-pack barcode associations. This round adds **43** across **20 brands**. **624** listings remain unresolved (291 missing and 333 withheld). All **44 automated tests** and four synchronization checks pass. Existing source conflicts remain withheld. No new physical scans were performed.

[Round-two research and sources](barcode-research-round2-2026-10-13.md). Continue the information preview and targeted pack tests. Full coverage and broader launch readiness remain incomplete.

## Earlier update 13 October 2026

Testing version 2026.10.13.2 has 1,082 products and 415 source-supported barcode matches. This round adds 103 exact-pack online associations across 24 brands and removes six wrong associations. 306 barcodes are missing; 361 recorded codes remain withheld (316 unverified, eight conflicts and 37 malformed/incomplete). No normalized duplicates remain.

The owner reports six successful physical scans: both Leaps & Bounds bags, Advance Lamb & Rice 20kg, Black Hawk Lamb & Rice 20kg, Hypro Chicken & Duck 20kg, and Billie’s Bowl Aussie Beef 20kg. New online matches are not physical scan confirmations.

All 43 automated checks pass. Photos display for 831 products (332 sourced, 499 reviewed older assignments); 251 gaps remain. Starter catalogue evidence still covers 13 selected records. The old scores appear only as unvalidated detail-page history; health rankings and recommendations remain paused.

[Current research and sources](barcode-research-2026-10-13.md) and [testing preview](https://deploy-preview-2--mucka-prototype.netlify.app/?v=2026.10.13.2).

Decision: continue the information preview and targeted pack tests. Full barcode coverage and broader launch readiness are not complete. Production remains unchanged and PR 2 remains a draft.

## Implemented and checked

- At the 22 September baseline, 1,080 catalogue entries had 829 displayed photos (327 sourced and 502 older reviewed assignments). The current 12 October photo and catalogue counts are above.
- 13 identity-bound manufacturer evidence records, up from five. Eight new records: 129, 130, 245, 246, 325, 326, 953 and 1017. New source snapshots were collected on 22 September; the original five retain their own check dates.
- Blackdog Carob Drops ID1080 now has a reviewed 1kg photograph. Catalogue size and barcode remain unverified, and the caption reflects that limit.
- Health scores remain paused. Manufacturer adequacy claims are attributed, not presented as independent certification. Unknown and conflicting fields remain explicit.
- Collector barcode text is escaped before HTML rendering in known/unknown result sheets and the queue. A regression test covers hostile text and confirms the original identifier is preserved.
- Main scanner dependency pinned to html5-qrcode 2.3.8, matching Collector.
- At the 22 September baseline, all 33 Node tests passed and 783 original image files had WebP display derivatives. The current 12 October validation and image counts are above; asset-size reductions remain file-size comparisons, not measured page-load times.

## Work still required before a broader launch

1. Resolve catalogue identities and barcode conflicts, prioritising species, veterinary variants and pack sizes. The complete 251-entry worklist is retained in the completion folder. 23 saved candidates are in the owner review PDF. A tick identifies the intended product; it does not establish a barcode or ingredient match.
2. Expand manufacturer evidence beyond the 13 checked records. The other 1,067 entries must continue showing that ingredients have not been added. Recheck evidence when recipes or product identities change.
3. Resume physical iPhone/Android camera and actual packet matching tests when the owner is ready. Cover known/unknown codes, denied camera permission, repeated scans and conflicting packs. These tests remain deliberately deferred.
4. Confirm permission to use product photography for the intended release. The manifest records public source URLs but does not assert a licence grant.
5. Review privacy and data retention for the intended release. Favourites and captures are local. The previous in-memory Collector queue has been replaced with saved drafts and ZIP backup/restore in 2026.10.13.10; cloud sync and guaranteed storage retention are not provided. See the current capture documentation above.
6. Complete manual accessibility and device checks across primary flows. Current automated tests and a browser spot check are not comprehensive accessibility, security or cross-device certification.

## Matching research outcome

- ID1080: retailer URL calls the item Buttons, but the original pack clearly says Blackdog Carob Drops 1kg; recipe match accepted with pack qualification.
- ID1093: manufacturer confirms the Venison/Wild Boar product exists; retailer candidate is an unlabelled tray of raw food. It cannot visually identify the recipe and is withheld.
- ID557: manufacturer product page found; original pack image requests failed (404/403). No substitute veterinary variant accepted.
- ID1049: older Balanced Life Enhanced Kangaroo sources did not yield an exact accessible product image.
- IDs207 and216: catalogue weights differ from the manufacturer options found. No silent pack-size replacement.
- ID534: inconsistent life-stage wording in the source; ingredient evidence was not promoted.
- Remaining historical research is retained with its original dates. This review does not claim every unresolved entry was freshly researched.

## Owner review

Mucka_Photo_Review.pdf contains 23 unpublished candidates with Correct / Incorrect / Unsure choices, notes and clickable source links. Mark the intended product and any corrected pack size; use Unsure freely. Return the saved PDF for reconciliation.

The full research, original source snapshots, ingredient expansion audit, remaining worklist and fillable-form QA are in Mucka_Review_2026-09-14/Catalogue_Completion_2026-09-22. Main remains unchanged; work is for draft PR #2 and its Netlify preview.

The user asked to see historical scores again. They are visible on product detail pages as “Legacy prototype score — unvalidated.” This is display-only; health-rating badges, ranking and recommendations remain paused pending method review. The number must not be presented as a validated nutrition or health assessment.
