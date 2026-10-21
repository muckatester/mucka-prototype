# Starter catalogue data format

Version 1.0.0 stores evidence independently of the historical scored ingredient objects. Its canonical app file is `data/starter-catalogue-v1.json`; run `node scripts/sync-starter-catalogue.cjs` after editing it. The generated copy inside `index.html` allows the static app to work without an extra data request. Regression tests require the copies to match.

Each record has an `appId`, an exact `catalogueIdentity` snapshot, online check date, identity-evidence description, sources and fields. `physicalScanPerformed` and `clinicallyValidated` remain false. These flags describe what was done; they are not inferred from source completeness.

The binding snapshot contains brand, name, barcode, species, food form and displayed pack/type. If any of these differ from the active product, the app withholds the starter evidence until the identity is rechecked. A conflicting record is not admitted merely because its ID is present.

Every source has a stable local ID, URL, label, evidence type, check date and observation describing what was actually inspected. Distinguish a manufacturer's published pack image, page text, nutrient image and a barcode in an image identifier. Preserve each source's scope and access limits.

Each fact contains `status`, `value`, `sourceIds` and `note`. Status is `source_checked`, `unknown`, `conflict` or `not_applicable`. A source-checked fact requires a nonempty string and resolvable evidence IDs. Other states require a null value and explanatory note. Conflicting observations can remain in the private research record; the disputed active value is withheld. Unknown must never be encoded as false or zero.

Required facts are species, food form, pack size, barcode scope, life stage, feeding use, adequacy statement, adequacy method, energy, therapeutic positioning and ingredients. Feeding use and adequacy are separate: a treat may have an adequacy claim. Values retain source attribution; adequacy is never presented as independent certification.

Energy is displayed as source-reported text with explicit units, denominator and known/unknown method and basis. This format has no normalized nutrient comparisons, feeding calculations or rating field. Manufacturer expertise, quality controls, recall history and individual suitability remain outside the checked pilot fields and are explicitly not checked/assessed in the UI.

Run the regression suite with `node --test tests/*.test.cjs`. It covers exact data embedding, field/source requirements, all catalogue records, source display, unknown/conflict handling, identity changes, escaping and all active barcode lookup paths affected by corrections. These checks validate application behaviour and evidence structure; they do not independently validate a food's nutritional performance.
