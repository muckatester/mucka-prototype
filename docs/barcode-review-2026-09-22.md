# Barcode review 22 September 2026

Barcode coverage is incomplete. This remains an information preview, not a validated scanner launch.

| Catalogue status | Products |
| --- | ---: |
| Manufacturer exact-pack barcode checked online | 9 |
| Retailer exact-pack barcode checked online | 3 |
| Earlier qualified source association | 5 |
| Format-valid number, product association unverified | 540 |
| Disputed association withheld from lookup | 6 |
| Invalid check digit withheld | 46 |
| Incomplete 11-digit value withheld | 16 |
| No barcode recorded | 455 |
| Total | 1,080 |

625 listings have a recorded value; 557 are enabled for software lookup. No normalized duplicates were found. No physical scans have been tested. Passing a check digit does not prove the recipe, species, market or pack identity.

This pass added eight missing codes and corrected three existing ones. It also confirmed one existing Black Hawk code against retailer evidence. Exact before/after values and source URLs are in the catalogue correction log. `data/barcode-evidence-v1.json` binds nine manufacturer checks, three retailer checks and six conflicts to the relevant identities. Existing starter evidence retains its original qualifications and dates.

Invalid, incomplete, disputed and ambiguous codes do not open a product. The app and Collector use validated GTIN normalization so equivalent leading-zero representations match. UPC-E expansion requires the camera library's explicit symbology metadata. No missing digits, check digits or pack sizes are invented. Product detail pages explain verification status and link sources. The Collector labels an association as a catalogue match requiring a pack check.

Of the 455 missing codes, 273 listings lack a stated pack size. Determine exact Australian recipe, species and pack before sourcing each code. For multi-packs, distinguish the individual unit from the outer pack. Black Hawk 100g tray candidates remain unassigned where retailer and distributor packaging levels are ambiguous. Public barcode aggregation alone does not establish manufacturer verification.

All 38 automated tests pass, including every recorded code, invalid digits, normalized duplicates, stale aliases, evidence identity changes and UPC-E metadata handling. Browser review checked the visible manufacturer source label and denied-camera state. Physical packet and device testing remains deferred. Health ratings remain paused; draft PR 2 remains unmerged.

Reproduce: run `node scripts/audit-barcodes.cjs /path/to/worklist.json`, `node scripts/sync-barcodes.cjs --check`, and `node --test tests/*.test.cjs`. The dated local review folder contains downloaded manufacturer evidence, retailer observation captures, the complete worklist and master-workbook changes.

Technical references: [GS1 check-digit calculation](https://www.gs1.org/services/how-calculate-check-digit-manually), [GS1 GTIN representation](https://www.gs1.org/edi-xml/technical-user-guide/Item_Numbers), and [ZXing UPC-E expansion](https://github.com/zxing/zxing/blob/master/core/src/main/java/com/google/zxing/oned/UPCEReader.java).
