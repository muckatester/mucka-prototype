# Assessment review preview — 14 September 2026

Mucka's existing numerical scores have not been validated as measures of nutritional quality or suitability for an individual pet. This preview withholds all health scores, stars, ingredient judgements, manufacturer flags and ranked recommendations while the assessment method is reviewed.

## What the preview changes

- All 1,080 products show a neutral **Under review** badge. Product details explain **Assessment under review**.
- Browse, search and favourites list products alphabetically by brand and name, with product ID resolving ties. The former recommendation page offers catalogue browsing and search.
- Existing ingredient names remain visible with an explicit warning that the notes may be incomplete and have not been verified against the full label. Ingredient rating colours and health descriptions are withheld.
- A **Starter catalogue** opens five records with full ingredient text and individually sourced facts. Unknowns and source conflicts remain explicit; each record explains its identity evidence and check date. Other catalogue records retain their verification notices. No manufacturer or recall assurance is inferred from an absent record.
- User-entered ingredient text is preserved as escaped, unverified text for the current visit. The heuristic score calculator and simulated photo-generated ingredients are removed. Collector remains available for product captures.
- Daily tips explain app features and verification status instead of making unreviewed nutrition claims.

## Data and scope

The raw catalogue retains the six production corrections and adds two source-backed corrections: My Dog 728 is wet food in the manufacturer-associated 24 × 100 g configuration, and the conflicting beef-product barcode is removed from lamb record 765. Both that barcode and the previously removed wrong barcode for 488 are excluded from Collector's known-code list. Exact changes and sources are in the correction log.

Historical scores remain in the source for traceability; runtime health scores are cleared and public renderers cannot expose them. The five new full ingredient lists are separate evidence records, bound to exact catalogue identities. The My Dog 728 energy value is withheld because manufacturer sources disagree. Three barcode matches rely on official image identifiers; only 728 and 960 had legible printed barcodes inspected online. Existing catalogue photos have not been verified for pack configuration.

See [assessment rules v1](assessment-rules-v1.md) and the [starter data format](starter-data-format.md). These operational evidence rules are complete for this pilot; clinical review remains pending. The five wet foods were selected by traceable source identity, not nutritional superiority or representative coverage.

This is an interim information display, not a validated nutrition assessment or professional endorsement. Existing catalogue identities still need verification. A new assessment specification requires appropriately qualified specialist review before ratings resume.

## Validation

All 16 automated regression tests pass. They cover all 1,080 product detail views, all 54 browse pages, documented raw catalogue changes, barcode correction lookups, neutral search and favourites, resistance to injected legacy ratings, escaped user text and inline script compilation. Starter checks cover exact data embedding, field/source validation, changed-identity withholding, unknown/conflict display and unsafe-link rejection. Phone-width browser checks confirm the starter list, sourced facts, full ingredients and conflicting energy display without horizontal overflow. Earlier preview checks cover search, legacy ingredient notes, favourites, the assessment explanation and Explore at phone and desktop widths.

Physical camera scanning on a phone is deferred at Tex's request. Online source checks do not complete that test. The preview must not be described as the production release until it is merged and the deployed site is verified.
