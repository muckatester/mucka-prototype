# Sourced product photographs

The image manifest in `data/product-images-v1.json` records sourced photographs. The separate `data/legacy-image-review-v1.json` records a visual review of all 849 original image assignments across 690 original image paths. The legacy filename map remains historical source data; the app displays photographs only through identity-bound reviewed records or a user's own photo.

Each new assignment records the source page, original image URL where known, pictured pack, visual inspection, date and SHA-256 of the local asset. The app shows a source link alongside the photo. Existing local assets with manufacturer identity corroboration use the label **Product source**, because their original image provenance is unknown.

Two matching scopes are supported:

- `pack_match`: the photograph matches the named recipe, species, food form and stated catalogue pack size. The barcode remains unverified by this photo check.
- `recipe_match_pack_unverified`: the recipe, species and food form match, but catalogue pack size is absent, rounded or not established from the photograph. The app states the pictured pack and leaves pack size and barcode unverified.

Photos do not establish nutritional adequacy, suitability, clinical approval or ingredient accuracy. Manufacturer and retailer materials can change. A source record does not assert a licence grant. Photos from other markets identify the pictured pack; they do not establish Australian availability or an Australian barcode.

## Current audit — 14 October 2026, after the full 185-listing search

The follow-up search added another **60 photos**, bringing coverage to **957 of 1,082 products: 459 sourced and 498 older assignments**. **125 listings remain without a photo**: 12 need an exact packet photo, 112 need product identity confirmation, and one is a duplicate-review case. Five new photos match the stated catalogue pack; 55 are recipe-only matches with pictured pack/market limitations shown. Thirteen contradictory metadata records were corrected; barcode and ingredient evidence were not inferred. See [the complete search audit](image-hunt-2026-10-14.md) and [remaining worklist](image-gaps-after-hunt-2026-10-14.json).

## Returned review milestone — 14 October 2026

The returned owner review added 51 photos. **897 of 1,082 products display photos: 399 sourced and 498 older assignments; 185 still need a photo.** Nine catalogue records were corrected. [Review outcomes](photo-review-returned-2026-10-14.md) and [current gap list](image-gaps-2026-10-14.json) supersede the older counts below. Different pack sizes and overseas packs retain recipe-only captions; no barcode or ingredient evidence was inferred.

## Earlier audit — 13 October 2026

The 1,082-product catalogue now has **846 displayed photographs**: 348 sourced, identity-bound assignments and 498 approved older assignments. **236 products have no displayed photograph**. The [complete dated gap list](image-gaps-2026-10-13.csv) records every remaining product and why its earlier image is withheld. A local copy is in `Mucka_Review_2026-09-14/Image_Gaps_2026-10-13.csv` beside this repository.

The 244-gap search on 13 October added eight visually checked photos (IDs 64, 259, 291, 381, 567, 643, 1115 and 1137). The remaining 236 are in the private Mucka photo-review PDF: 84 plausible, unapproved candidates and 152 with no usable candidate. Several search results exposed conflicting catalogue pack or product descriptions; these are withheld pending correction. Photos do not verify barcodes or assessment data.

Eight reviewed photos were added for Advance Multi Cat Chicken & Ocean Fish 4kg, Advance Adult Ocean Fish cat 3kg, Black Hawk Grain Free Chicken & Turkey cat 1.2kg, Greenies Original Regular 170g, Greenies Original Teenie 170g, Hill's Science Diet Puppy Small Bites 2kg, Purina ONE Kitten Chicken cat 1.5kg, and Royal Canin Sterilised Adult cat 2kg. The Royal Canin and Hill's pages list the catalogue pack sizes, but their photographed weights are not readable, so they are labelled as recipe matches with packs unverified. The Greenies Teenie photograph shows a Canadian-market pack; Australian sellers corroborate the 170g, 22-treat product, but the photo does not corroborate the Australian barcode.

Several tempting online images are for a different pack or recipe. Examples checked and withheld: Supercoat Adult Chicken 2.8kg against catalogue listings of 800g and 7.5kg, Advance Oodles Puppy Turkey & Rice 2.5kg or 13kg against 3kg, and My Dog Classic Loaf with Gourmet Beef 12 × 100g against the catalogue's less specific “Gourmet Beef Adult” identity. Snappy Tom Naturals product names also require an Australian-market identity check. These need catalogue/source reconciliation before a photo can be safely attached. No image assignment is evidence that its barcode scans to the product.

## Updating the app

Add a reviewed record to the manifest, then run `node scripts/sync-product-images.cjs`. This embeds the runtime subset in the single-file app, retaining GitHub Pages compatibility. Use `--check` to verify that the embedded data is current. The script rejects duplicate IDs, missing evidence, unsupported match states, incorrect path case and changed asset hashes.

The runtime binds each photograph to the app ID and exact brand, name, species, food form, type/pack and barcode fields. If those fields change, the sourced assignment is withheld until it is reviewed again. User-provided temporary entries do not inherit source evidence.

Run `node --test tests/*.test.cjs` after an update. The image tests check every manifest assignment, identity-change guards and the visible distinction between matched packs and recipe-only photos.

## Older image review

The legacy review compares each local photograph with every listing to which it was assigned. It records the visible wording, pictured pack where legible, catalogue identity snapshot, result, reason and SHA-256. It is a visual check of the existing asset, not manufacturer verification or recovery of the original image source.

- `visual_match`: the visible product details and stated pack agree.
- `recipe_match_pack_unverified`: the recipe, species and food form agree, but pack configuration cannot be confirmed.
- `confirmed_mismatch`: the photograph conflicts with the listing's recipe, species, food form or stated pack.
- `unreadable`: the image does not provide enough readable identity information.

Mismatched and unreadable photographs are withheld. If a reviewed identity changes, that old photo also stays withheld until rechecked. The product remains searchable and displays a placeholder with a short explanation. No filename fallback can restore an unreviewed or rejected photo.

Run `node scripts/sync-legacy-image-review.cjs` to embed the reviewed runtime data, or add `--check` to verify it. The script requires all 849 original assignments, unique IDs, recognised states, exact path case and unchanged image hashes. Original observations are retained in the dated project review folder, including any subsequent metadata correction and re-evaluation.

The completed original-photo audit is in `Mucka_Review_2026-09-14/Catalogue_Photo_Review_2026-09-14`. The current audit and remaining worklist are in `Mucka_Review_2026-09-14/Photo_Batch_25_2026-09-14`. The earlier sourced-photo milestone remains in `Image_Sourcing_2026-09-14`, and the original 849-assigned / 231-missing audit is retained as a historical baseline.

## Next 25 photo review — 14 September 2026

All 25 selected Ziwi, Pedigree and Supercoat listings were checked. 20 exact recipe/species/form/pack photos were added; 5 remain held for insufficient matching evidence. The current catalogue displays 604 photographs across 1,080 listings, with 476 missing or withheld assignments. The per-listing outcomes and source URLs are recorded in `data/photo-batch-25-2026-09-14.json`.

Three wrong-pack barcode associations (IDs 83, 333 and 315) were cleared before their photos were bound to the corrected catalogue identity. No replacement codes were inferred. Five other Ziwi code differences and a retailer-reported Supercoat Puppy pack discrepancy remain unresolved. Existing image files and prior audits remain historical evidence.

## 250 product photo review 15 September 2026

All 250 selected listings received a separate source check and outcome. 121 photos were added after recipe, species, food-form and pack review; 129 remain held with source-specific reasons. Current display totals are 725 of 1,080 listings, with 355 still missing or withholding a photo. Exact pack matches and recipe-only matches retain separate captions identifying the pictured pack and source.

65 catalogue records were corrected, including 25 demonstrably incorrect barcode associations removed from the catalogue, scanner and Collector. No replacement barcode was inferred. The per-listing outcomes and source evidence are in `data/photo-batch-250-2026-09-15.json`; the current full audit and remaining worklist are in `Mucka_Review_2026-09-14/Photo_Batch_250_2026-09-15`. Prior audit files remain dated evidence. Photos do not verify barcode identity, current Australian availability, ingredients, nutritional adequacy or clinical suitability.
