# Returned product photo review — 14 October 2026

Testing version **2026.10.14.1** applies the returned 119-page review PDF. All 236 product decisions were recovered: 57 approved, 23 marked wrong, 155 needing a pack photo and one back-of-bag note. The first five product pages use PDF annotations; later pages contain flattened marks and notes, so annotation-only extraction misses most decisions.

**51 photos added; 897 of 1,082 products now display a photo; 185 still need one.** Of the 57 approvals, 49 were applied and eight remain held for a conflicting variant or duplicate identity. Two entries marked wrong solely because of catalogue descriptions were corrected and their matching photos added (#731 My Dog wet tray and #293 Pro Plan kitten wet pouches). Nine catalogue records were corrected in total. No barcode, ingredient list or score was verified by the photo review; all 474 supported barcode lookups are preserved.

Every added source image has a source URL, original hash, identity binding and smaller WebP copies. Eleven are pack matches; 40 are recipe matches with explicit pictured-pack captions. Different weights, cartons, multipacks and overseas packaging are disclosed instead of being treated as exact Australian pack matches. The original returned PDF is archived privately, outside the public repository.

## Still held despite approval

- #1050 Balanced Life: photo is rehydratable air-dried Lamb, not the Enhanced kibble range. [Range distinction](https://www.luckypet.com.au/brand/balanced-life/).
- #301 Felix: chicken-only pouch versus unspecified Kitten Menus.
- #518 Felix: Meat Selections versus Mixed Selection; assortment needs confirmation.
- #713 Leaps & Bounds: Tuna & Salmon versus Tuna; exact recipe and GTIN need confirmation.
- #321 Orijen: Regional Red photo versus generic cat treats/toppers entry.
- #80 Pro Plan: US Shredded Blend versus unspecified Australian Large Breed Adult Chicken.
- #189 SavourLife: probable duplicate of #188, with conflicting historical protein data. IDs retained to preserve saved records.
- #940 Wellness: pictured Turkey with Chicken versus catalogue Turkey, Chicken & Herring.

Other rejected candidates remain withheld. The remaining worklist includes all rejected photos, missing pack photos and these held approvals. No need to re-mark the returned PDF. Matching replacement photos or manufacturer product records can resolve the remaining items.

## Validation

All 50 existing automated tests pass, including every supported barcode lookup and identity-bound photo checks. An isolated Chrome session at 390px width opened all 51 added photos and confirmed successful WebP loads, correct pack captions, no horizontal overflow and no uncaught page errors. Original image hashes and display derivatives were validated. Real phone camera capture remains a separate owner check.

[All review decisions and precise catalogue corrections](../data/photo-review-2026-10-14.json) · [Remaining 185 photo gaps](image-gaps-2026-10-14.json)
