# Mucka assessment rules — version 1.0

Effective 14 September 2026. Status: operational rules for a product-information pilot. Clinical review remains pending. These rules do not establish a validated health score or professional endorsement.

## What Mucka will say

Mucka records what can be supported about a specific product and shows where that information came from. A checked ingredient list or barcode is not proof of nutritional quality, safety or suitability for a particular pet. Health ratings and ranked recommendations remain paused.

Every fact has its own status. There is no whole-product “verified healthy” status. The starter-set label means its identity and selected facts have been checked against online manufacturer sources; unresolved facts remain visible as unknown.

| Status | Meaning | Display rule |
|---|---|---|
| Source checked | The cited source supports this specific fact for the matched product | Show the fact, attribution, source and check date |
| Unknown | Evidence was not checked, not found, unreadable or insufficient | Explain the particular gap; do not substitute a guess or a negative finding |
| Conflict | Relevant sources disagree, or a barcode and recipe identify different products | Explain the conflict and withhold the disputed value from active matching/import |
| Not applicable | A documented reason makes a field inapplicable | Record the reason; never use this state merely because evidence is missing |

## 1. Match the product before attaching facts

Record catalogue ID, brand, recipe, species, food form, Australian market context, pack size and barcode scope. A single can, a tray and an outer multipack are different trade items. Do not copy the barcode of one to another.

The strongest online identity evidence is a legible barcode on a manufacturer pack image that also establishes the relevant recipe and size. A barcode in an official product-image filename is a weaker website association; record that distinction explicitly. A checksum, retailer search snippet, same brand, similar name or visually similar pack cannot alone establish identity.

Retain older names as provenance. Do not assume an overseas recipe, reformulation or renamed product is equivalent. A confirmed wrong barcode association is removed from all active lookup paths, with its old value and evidence retained in the correction log. Do not invent a replacement barcode or rename a conflicting record to fit it.

Attach published starter evidence to an exact catalogue identity snapshot. If that snapshot changes, withhold the evidence until rechecked. Online verification never counts as a physical camera test.

## 2. Store ingredients as label information

Preserve the full sourced ingredient text, punctuation, subingredients and optional wording such as “and/or.” Record whether it came from a physical pack, a legible manufacturer pack image, a manufacturer webpage or a retailer. Never label webpage text as a physical-pack transcription.

Do not score ingredient names, infer ingredient quantities from their position, award bonuses for fashionable ingredients, penalise grains/by-products/budget brands, or infer digestibility from a list. A captured list is not an allergy-clearance or contamination test. Earlier short ingredient notes remain explicitly unverified and are not silently merged with a new full list.

## 3. Separate feeding purpose, life stage and adequacy

- Record the source's stated species and life stage. Do not infer adult, growth or all-life-stage suitability from a generic product name.
- Record feeding use independently from adequacy: main food, complementary/supplementary food, treat, or unknown, supported by the source's intended-use wording. A treat can also carry a complete-and-balanced adequacy claim; preserve both facts rather than forcing them into mutually exclusive categories. Therapeutic positioning is another separate field. Calorie content or ingredient list cannot resolve these fields on their own.
- Preserve the exact adequacy statement and its source. Show it as a manufacturer or label claim, not independent certification.
- Distinguish nutrient-profile formulation, feeding-test substantiation, product-family substantiation, and a generic complete-and-balanced claim with no stated method. AAFCO terminology describes the cited framework; it does not by itself establish Australian legal compliance or AAFCO product approval.
- No located feeding-trial statement means that method is unknown. It is not proof of inadequacy. A missing adequacy record must not be turned into “supplementary feeding only.”
- Treats, supplements and therapeutic diets are not ranked alongside complete diets. Mucka does not select a treatment diet or assess individual medical suitability under these rules.

## 4. Preserve measurement context

For energy or nutrients, record value, unit, denominator, basis, stated method and source. Keep predicted/calculated energy distinct from measured energy, and typical composition distinct from guaranteed minima/maxima. Do not combine nutrient values from single-pack and multipack pages when the sources disagree.

In version 1, display source-reported energy only when its unit and denominator are explicit, retaining the stated method and flagging an unstated basis. Do not silently infer as-fed, dry matter, metabolizable energy or measured energy. Withhold normalized/comparative energy if the required basis is missing. Retain other panels as source evidence where the as-fed/dry-matter basis is unstated; do not compute derived comparisons. No feeding portions, deficiency/excess conclusions or nutritional ranking are produced from these values.

## 5. Keep company and recall evidence separate

Manufacturer expertise, research, quality control and recall events need their own dated sources and clearly identified scope. A parent company's general claim is not automatically evidence for every subsidiary, factory or product. Unchecked recall history displays “Not checked,” never “No recalls.” Record verified events by affected product, market, batch, date and source before describing them.

Do not publish “WSAVA approved/compliant” badges, convert company reputation into points or imply an endorsement. Manufacturer statements remain attributed statements.

## 6. Publication and review gates

1. Match the intended product and record source/check date and evidence type.
2. Check every published field against its evidence. Conflicting or unsupported fields stay withheld; valid independent fields may still be shown with their limits.
3. Keep raw source observations and historic corrections separate from public display text. Validate the structured data and its binding to the app catalogue.
4. Test known, unknown, conflicting and changed-identity examples; ensure no label import activates a rating. Check the result at phone width and in the hosted preview.
5. Recheck affected sources before the next data release and when a label change or discrepancy is reported. A check date is a record of observation, not a guarantee that a recipe remains current.
6. Before any future clinical assessment, health rating or personalised dietary recommendation, obtain a documented review from an appropriately qualified veterinary nutrition specialist. Record reviewer identity/credentials, exact version, scope, date, limitations, decisions and resulting changes. Feedback received is not automatically endorsement.

## Starter pilot and its limits

Start with five selected records: My Dog 727 and 728, Pedigree 764 and 768, and Whiskas 960. Selection is based on traceable source identity, not nutritional superiority or a representative sample of all food types. Record 765 remains outside the set because its lamb name conflicts with a beef-product barcode. Add dry foods, treats, supplements and therapeutic products only when their identity and evidence are established; do not force a category quota with uncertain matches.

Acceptance means source-backed facts display accurately and unknowns remain unknown. It does not mean every field is complete. Physical scanning is deferred at Tex's request and is not part of the completed evidence checks.

## Primary guidance

WSAVA's food-selection questions cover nutritional adequacy and manufacturer evidence; its ingredient guidance explains why ingredient names alone are insufficient for quality conclusions. These inform the evidence model, without creating a validated numerical formula. [WSAVA selecting pet foods](https://wsava.org/wp-content/uploads/2021/04/Selecting-a-pet-food-for-your-pet-updated-2021_WSAVA-Global-Nutrition-Toolkit.pdf), [WSAVA nutrition questions and myths](https://wsava.org/wp-content/uploads/2020/01/Frequently-Asked-Questions-and-Myths.pdf).

AAFCO explains the meaning of nutritional-adequacy statements and different substantiation approaches. Store the actual statement for the intended product and market. [AAFCO reading labels](https://www.aafco.org/consumers/understanding-pet-food/reading-labels/).

WSAVA does not approve or endorse individual pet foods. [WSAVA Global Nutrition Committee](https://wsava.org/committees/global-nutrition-committee/).

### Starter expansion - 22 September 2026

The original five-record pilot has expanded to 13 identity-bound records. Eight additional Australian manufacturer pages supply attributed ingredient and product details; this does not change the assessment rules or reactivate health scores. See `launch-readiness-2026-09-22.md` for validation and outstanding launch work.
