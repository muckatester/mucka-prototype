# Sourced product photographs

The image manifest in `data/product-images-v1.json` records sourced photographs. The separate `data/legacy-image-review-v1.json` records a visual review of all 849 original image assignments across 690 original image paths. The legacy filename map remains historical source data; the app displays photographs only through identity-bound reviewed records or a user's own photo.

Each new assignment records the source page, original image URL where known, pictured pack, visual inspection, date and SHA-256 of the local asset. The app shows a source link alongside the photo. Existing local assets with manufacturer identity corroboration use the label **Product source**, because their original image provenance is unknown.

Two matching scopes are supported:

- `pack_match`: the photograph matches the named recipe, species, food form and stated catalogue pack size. The barcode remains unverified by this photo check.
- `recipe_match_pack_unverified`: the recipe, species and food form match, but catalogue pack size is absent, rounded or not established from the photograph. The app states the pictured pack and leaves pack size and barcode unverified.

Photos do not establish nutritional adequacy, suitability, clinical approval or ingredient accuracy. Manufacturer and retailer materials can change. A source record does not assert a licence grant. Photos from other markets identify the pictured pack; they do not establish Australian availability or an Australian barcode.

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
