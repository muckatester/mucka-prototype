# Sourced product photographs

The image manifest in `data/product-images-v1.json` adds source-recorded photographs to listings that previously had no image assignment. It preserves the legacy image map and does not validate the identities of those older pictures.

Each new assignment records the source page, original image URL where known, pictured pack, visual inspection, date and SHA-256 of the local asset. The app shows a source link alongside the photo. Existing local assets with manufacturer identity corroboration use the label **Product source**, because their original image provenance is unknown.

Two matching scopes are supported:

- `pack_match`: the photograph matches the named recipe, species, food form and stated catalogue pack size. The barcode remains unverified by this photo check.
- `recipe_match_pack_unverified`: the recipe, species and food form match, but catalogue pack size is absent, rounded or not established from the photograph. The app states the pictured pack and leaves pack size and barcode unverified.

Photos do not establish nutritional adequacy, suitability, clinical approval or ingredient accuracy. Manufacturer and retailer materials can change. A source record does not assert a licence grant. Photos from other markets identify the pictured pack; they do not establish Australian availability or an Australian barcode.

## Updating the app

Add a reviewed record to the manifest, then run `node scripts/sync-product-images.cjs`. This embeds the runtime subset in the single-file app, retaining GitHub Pages compatibility. Use `--check` to verify that the embedded data is current. The script rejects duplicate IDs, missing evidence, unsupported match states, incorrect path case and changed asset hashes.

The runtime binds each photograph to the app ID and exact brand, name, species, food form, type/pack and barcode fields. If those fields change, the sourced assignment is withheld until it is reviewed again. User-provided temporary entries do not inherit source evidence.

Run `node --test tests/*.test.cjs` after an update. The image tests check every manifest assignment, identity-change guards and the visible distinction between matched packs and recipe-only photos.

The dated source research, complete availability audit and remaining identity/source worklist are kept in the project review folder, `Mucka_Review_2026-09-14/Image_Sourcing_2026-09-14`. The original 849-assigned / 231-missing audit is retained as a historical baseline.
