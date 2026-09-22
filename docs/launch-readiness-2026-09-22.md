# Mucka launch review - 22 September 2026

Decision: continue the information-only preview. Do not merge the draft PR or represent this as a validated scanner or health-rating launch.

## Implemented and checked

- 1,080 catalogue entries; 829 show a reviewed photograph (327 sourced, 502 older reviewed assignments). 251 still have no accepted photo. Correct photo coverage does not verify barcode, recipe ingredients or suitability.
- 13 identity-bound manufacturer evidence records, up from five. Eight new records: 129, 130, 245, 246, 325, 326, 953 and 1017. New source snapshots were collected on 22 September; the original five retain their own check dates.
- Blackdog Carob Drops ID1080 now has a reviewed 1kg photograph. Catalogue size and barcode remain unverified, and the caption reflects that limit.
- Health scores remain paused. Manufacturer adequacy claims are attributed, not presented as independent certification. Unknown and conflicting fields remain explicit.
- Collector barcode text is escaped before HTML rendering in known/unknown result sheets and the queue. A regression test covers hostile text and confirms the original identifier is preserved.
- Main scanner dependency pinned to html5-qrcode 2.3.8, matching Collector.
- All 33 Node tests pass, including evidence identity binding, escaping, withheld claims, photo bindings and responsive image behaviour. Local browser check confirms 13 starter products and a new product's ingredients/source links. No physical camera or packet test was performed.
- 783 original image files have 160px/480px WebP display derivatives: 233,671,936 original bytes versus 4,154,460 thumbnail bytes or 19,767,462 larger display bytes. These are aggregate asset-size comparisons, not measured page-load times.

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
