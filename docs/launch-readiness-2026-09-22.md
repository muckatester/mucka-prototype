# Mucka launch review

## Current update 13 October 2026 round two

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
5. Document privacy and data retention for the intended release. Favourites are local; Collector queue data is in memory and can be lost on reload. Provide a clear persistence/export experience before relying on Collector for field work.
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
