# Mucka launch review - 22 September 2026

## Current field-test update — 12 October 2026

The preview catalogue now has 1,082 products and the testing build is 2026.10.12.2. There are 311 source-supported barcode lookups, 337 products with no recorded barcode, 388 recorded codes withheld from lookup, and 46 malformed or incomplete values. Eight of the withheld codes have known conflicts. Barcode coverage is still partial.

The user has physically scanned the Leaps & Bounds Beef and Chicken bags and reports that each opened the correct product. Advance Adult Lamb & Rice 20kg, Black Hawk Original Lamb & Rice 20kg and Hypro Chicken & Duck 20kg now have exact-pack retailer evidence and matching app product images; those physical scans still need a short retest. Billie's Bowl Aussie Beef 20kg has its pack size and photo corrected, but its unsupported barcode has been removed. Its printed code must be checked from the bag already on hand before lookup can be enabled.

All 42 automated checks pass, including scanner lookup, catalogue/image identity binding and both user-reported successful scans. Netlify deployed commit `6205fe6cbb05b8c811367b22f9683b28a8640730` successfully to Preview 2. Hosted checks confirm version 2026.10.12.2, 1,082 listings, and the correct images, packs and source-backed barcodes on the three corrected product pages. Camera access is blocked in this browser check; phone-camera testing for the three newly corrected codes still needs to happen with the bags. Use [the version-pinned testing link](https://deploy-preview-2--mucka-prototype.netlify.app/?v=2026.10.12.2) to avoid an old phone-cached copy. Public production is unchanged; PR 2 remains a draft.

Current counts: 311 source-supported barcode associations; 337 products with no barcode; 388 withheld associations (eight conflicts included); 46 invalid or incomplete codes. Photos display for 831 products (331 sourced and 500 reviewed older assignments); 251 need an accepted photo. These figures are coverage counts, not a claim that all barcodes work.

The focused source notes and field retest instructions are in [barcode-field-fix-2026-10-12.md](barcode-field-fix-2026-10-12.md). The September worklist remains the record for the rest of the catalogue.

Decision: continue the information-only preview. Do not merge the draft PR or represent this as a validated scanner or health-rating launch.

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
