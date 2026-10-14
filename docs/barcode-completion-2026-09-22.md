# Barcode verification progress — 22 September 2026

Full barcode coverage is not complete. The preview now requires source evidence before a barcode can open a product. All 1,080 catalogue listings remain available by name.

## Current coverage

| Status | Products |
| --- | ---: |
| Manufacturer association checked online | 101 |
| Retailer association checked online or corroborated by saved pack image | 202 |
| Earlier qualified source association | 5 |
| Format-valid but product association unverified | 382 |
| Invalid check digit | 31 |
| Incomplete length | 15 |
| Conflicting product or pack evidence | 8 |
| Missing barcode | 336 |
| Total | 1,080 |

308 listings support barcode lookup. 744 have a recorded code, of which 436 are withheld. No normalized duplicate groups remain. Physical packet and camera testing has not been performed. These counts replace the earlier format-only lookup totals: passing a checksum is not proof that the code belongs to the product.

## Completed work

This round reviewed 307 product records. The 280 barcode changes comprise 133 additions, 133 corrections and 14 removals of demonstrably wrong associations. Other reviewed records gained source evidence or explicit pack descriptions without changing their barcode. Manufacturer or retailer errors and individual-versus-carton conflicts are retained as unresolved evidence, not accepted automatically.

All 40 automated checks pass. The lookup, Collector and evidence manifests agree. The checks cover invalid digits, equivalent UPC/EAN forms, stale identities, duplicates, unsupported matches, all 1,080 retained records, source bindings and assessment neutrality. Saved-image decoding checked 1,176 image assignments with no decoding errors and found 11 hits. Internal Lyka identifiers are not assumed to be retail GTINs. A Fancy Feast carton barcode was rejected for a single-can listing.

The master workbook receives exactly 280 barcode-cell edits. All 835 embedded photographs and all unrelated workbook package members are preserved. The companion worklist holds pack qualifications because the original workbook has no pack or verification-status column. A recorded workbook code alone does not mean lookup is enabled.

## Remaining work

Every unresolved listing is in Barcode_Worklist.json, with its status and next action. Among the 336 missing codes, 188 lack a stated pack size. Supplier or manufacturer GTIN exports must identify recipe, species, market, pack weight and unit count. Printed pack evidence is needed where listings disagree. Duplicate catalogue identities and retired sizes need reconciliation before assigning codes. Do not manufacture identifiers, repair check digits by calculation, or delete products to claim coverage.

Review is still required for 772 listings before complete barcode coverage can be claimed. Further online research may resolve some; the available sources do not establish a valid exact-pack barcode for all of them. Supplier data has been requested from the owner. No messages have been sent to suppliers.

Health ratings remain paused, with 13 source-checked ingredient records. Photo coverage remains 829 displayed and 251 missing. Physical packet testing remains deferred at the owner's request. PR 2 stays draft and main is unchanged.

## Records

All_Applied_Changes.json preserves before/after values and sources. Workbook_Changes.json contains the 280 barcode-cell edits. sources/ holds public source captures. Barcode_Worklist.json contains all 1,080 current records. Master_List_Change_Audit.json verifies workbook preservation. Preview_Record.json records publication verification.
