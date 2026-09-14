# Assessment review preview — 14 September 2026

Mucka's existing numerical scores have not been validated as measures of nutritional quality or suitability for an individual pet. This preview withholds all health scores, stars, ingredient judgements, manufacturer flags and ranked recommendations while the assessment method is reviewed.

## What the preview changes

- All 1,080 products show a neutral **Under review** badge. Product details explain **Assessment under review**.
- Browse, search and favourites list products alphabetically by brand and name, with product ID resolving ties. The former recommendation page offers catalogue browsing and search.
- Existing ingredient names remain visible with an explicit warning that the notes may be incomplete and have not been verified against the full label. Ingredient rating colours and health descriptions are withheld.
- Catalogue species, food form and barcode remain available with a pack-check notice. Life stage, feeding purpose and nutritional adequacy remain **Not verified**. No manufacturer or recall assurance is inferred from an absent record.
- User-entered ingredient text is preserved as escaped, unverified text for the current visit. The heuristic score calculator and simulated photo-generated ingredients are removed. Collector remains available for product captures.
- Daily tips explain app features and verification status instead of making unreviewed nutrition claims.

## Data and scope

The raw catalogue is unchanged from production commit `9f18f9355532cab8187e05118b1a8ac8db61265d`. Historical values remain in the source for traceability; runtime health scores are cleared and public renderers cannot expose them. The six previously documented catalogue corrections are preserved. No researched candidate ingredient lists, new identity guesses or replacement scoring formula are imported.

This is an interim information display, not a validated nutrition assessment or professional endorsement. Existing catalogue identities still need verification. A new assessment specification requires appropriately qualified specialist review before ratings resume.

## Validation

All 11 automated regression tests pass. They cover all 1,080 product detail views, all 54 browse pages, raw catalogue preservation, barcode correction lookups, neutral search and favourites, resistance to injected legacy ratings, escaped user text and inline script compilation. Browser checks cover search, a product with ingredient notes, a product without ingredient notes, favourites, the assessment explanation and Explore at phone and desktop widths.

Physical camera scanning on a phone is still outstanding. The preview must not be described as the production release until it is merged and the deployed site is verified.
