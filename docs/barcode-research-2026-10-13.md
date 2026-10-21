# Barcode research update 13 October 2026

Testing build **2026.10.13.2** adds **103 source-supported exact-pack associations across 24 brands**, increasing enabled lookup from **312 to 415**. This includes 36 previously missing codes, 48 replaced codes, and 19 existing codes newly supported by sources. Six other confirmed wrong associations were removed. No physical scan was performed during online research.

The catalogue still contains **1,082 products**. **306 have no barcode** and **361 recorded codes remain withheld**: 316 unverified associations, eight known conflicts, 26 invalid check digits and 11 incomplete codes. No normalized duplicate identifiers remain. Six earlier successful physical scans are recorded as owner reports.

[Open the testing app](https://deploy-preview-2--mucka-prototype.netlify.app/?v=2026.10.13.2). Confirm **Testing version 2026.10.13.2** on the homepage. Production and the main branch are unchanged; PR 2 remains draft.

## Search and acceptance

Candidate discovery searched 18,501 public listings from Petso, Woonona Petfoods, Habitat Pets and Vets Love Pets. Captures include 77 listing pages, 648 product-data pages and the manufacturer-branded April 2026 ADVANCE packaging transition PDF. These discovery totals do not mean every listing was verified. Retailer throttling and unavailable pages were left unresolved; no access restrictions were bypassed.

A candidate was accepted only after recipe, species, life stage, food form and exact pack were reviewed. Explicit barcode fields and the ADVANCE APN column support 100 retailer and three manufacturer associations. Checks reject invalid digits and normalized duplicates. Neither a valid check digit nor a retailer SKU alone establishes a match. No digits were guessed or repaired. Previously unspecified packs are now explicit sourced variants, with changes recorded individually.

Duplicate listings whose code already belongs to an enabled catalogue product remain unresolved; a second conflicting lookup was not introduced. Ambiguous veterinary variants, recipe substitutions, single units versus cartons and conflicting pack sizes remain withheld.

## Verification and files

All **43 automated tests pass**, including every supported lookup, Collector parity, exact identity binding, carton indicators, the six owner-tested bags and rejection of unsupported codes. Source extracts are hash-bound to the evidence manifest. Raw captures remain in the local research folder.

The Dine Tuna & Prawn result now uses a visually checked 4 x 12g photo in place of the older tuna-only image. Photos display for 831 products: 332 sourced and 499 reviewed older assignments; 251 photo gaps remain. A changed pack does not silently inherit an exact photo-pack claim.

The master workbook update changes 90 cells, preserves 1,082 product rows and all 835 embedded historical photos, and retains unrelated package data and styles. Its older photos remain source material; the app manifests determine accepted current images. The project document and start-here trackers are updated.

## Field testing

There is no need to repeat the successful six-bag home test. Test a few newly supported packs when available, checking recipe, weight and picture after each scan. For a failure or wrong result, retain photos of the front label and the printed barcode with all digits visible. Software lookup tests cannot certify every printed packet or iPhone camera condition.

## Changes and sources

| App ID | Product | Pack | Barcode | Source |
| --- | --- | --- | --- | --- |
| 207 | Advance Multi Cat Chicken & Ocean Fish | 4kg | 9334214065229 | [Product evidence](https://woononapetfoods.com.au/products/advance-dry-cat-food-multi-cat-chicken-salmon-500g) |
| 362 | Dine Creamy Treats Mixed Seafood | 8 x 4 x 12g | 29334214046833 | [Product evidence](https://woononapetfoods.com.au/products/dine-creamy-treats-mixed-seafood8-x-4-x-12g) |
| 360 | Dine Creamy Treats Tuna & Salmon | 4 x 12g | 9334214038759 | [Product evidence](https://woononapetfoods.com.au/products/dine-creamy-treats-tuna-salmon-4x12g) |
| 361 | Dine Creamy Treats Chicken | 4 x 12g | 9334214038810 | [Product evidence](https://woononapetfoods.com.au/products/dine-creamy-treats-chick-12g-x-4) |
| 95 | Optimum Adult Large Breed Chicken | 15kg | 9334214027319 | [Product evidence](https://woononapetfoods.com.au/products/optimum-adult-large-breed-15kg-chick-rice-veg) |
| 79 | Purina Pro Plan Small & Mini Adult Chicken | 2.5kg | 9300605149519 | [Product evidence](https://vetslovepets.com.au/products/purina-pro-plan-adult-small-mini-chicken-formula-dry-dog-food) |
| 83 | Pedigree Adult Beef & Vegetables | 3kg | 9310022160905 | [Product evidence](https://woononapetfoods.com.au/products/pedigree-mince-veg-3kg) |
| 82 | Pedigree Adult Real Beef | 3kg | 9310022161308 | [Product evidence](https://woononapetfoods.com.au/products/pedigree-beef-3kg) |
| 94 | Optimum Adult Small Breed Chicken | 3kg | 9334214019482 | [Product evidence](https://woononapetfoods.com.au/products/optimum-adult-small-breed-3kg) |
| 69 | Royal Canin Mini Puppy | 2kg | 3182550793001 | [Product evidence](https://woononapetfoods.com.au/products/royal-canin-dry-dog-food-mini-puppy-800g) |
| 98 | Optimum Oral Care Chicken | 3kg | 9334214060729 | [Product evidence](https://woononapetfoods.com.au/products/optimum-dry-dog-food-adult-dental-care-with-chicken-3kg) |
| 337 | Schmackos Strapz Variety Pack | 500g | 9334214041889 | [Product evidence](https://woononapetfoods.com.au/products/schmackos-strapz-500g-variety-pack) |
| 1000 | Advance Adult Medium Breed Chicken & Rice | 3kg | 9310022566004 | [Product evidence](https://vetslovepets.com.au/products/advance-adult-dog-total-wellbeing-chicken) |
| 65 | Hill's Science Diet Perfect Weight | 1.81kg | 052742297200 | [Product evidence](https://woononapetfoods.com.au/products/hills-science-diet-canine-perfect-weight-1-8kg) |
| 295 | Purina Pro Plan Urinary Care Chicken | 12 x 85g | 9300605131576 | [Product evidence](https://www.petso.com.au/products/pro-plan-urinary-care-tender-pieces-with-chicken-in-gravy-adult-wet-cat-food-85g-x-12) |
| 291 | Advance Kitten Lamb in Gravy | 85g | 9334214044415 | [Product evidence](https://woononapetfoods.com.au/products/advance-wet-kitten-food-lamb-gravy-85g) |
| 268 | Fancy Feast Grilled in Gravy Tuna Feast | 85g | 050000836123 | [Product evidence](https://woononapetfoods.com.au/products/fancy-feast-grilled-tuna-in-gravy-85g) |
| 267 | Fancy Feast Classic Paté Beef & Chicken Feast | 85g | 8850124099228 | [Product evidence](https://woononapetfoods.com.au/products/fancy-feast-classic-pate-beef-and-chicken-feast-85g) |
| 153 | Hill's Science Diet Adult Chicken & Barley Entrée | 370g | 052742703701 | [Product evidence](https://woononapetfoods.com.au/products/hills-science-diet-canine-adult-cans-chickbarl-370g) |
| 154 | Hill's Science Diet Puppy Chicken & Barley Entrée | 370g | 052742703602 | [Product evidence](https://woononapetfoods.com.au/products/hills-science-diet-canine-puppy-can-370g-x-1-chick-barley) |
| 38 | Orijen Puppy | 2kg | 064992101459 | [Product evidence](https://www.petso.com.au/products/orijen-puppy-biologically-appropriate-dry-dog-food) |
| 39 | Orijen Senior | 2kg | 064992104450 | [Product evidence](https://www.petso.com.au/products/orijen-senior-biologically-appropriate-dry-dog-food) |
| 37 | Orijen Six Fish | 2kg | 064992106454 | [Product evidence](https://www.petso.com.au/products/orijen-six-fish-biologically-appropriate-dry-dog-food) |
| 129 | Black Hawk Grain Free Adult Chicken Wet | 100g | 9338362001818 | [Product evidence](https://woononapetfoods.com.au/products/black-hawk-dog-grain-free-100g-chicken) |
| 33 | Savourlife Grain Free Adult Chicken | 2.5kg | 9347810000501 | [Product evidence](https://woononapetfoods.com.au/products/savour-life-grain-free-adult-chicken-2-5kg) |
| 326 | Savourlife Australian Kangaroo Training Treats | 165g | 9347810000167 | [Product evidence](https://vetslovepets.com.au/products/savourlife-australian-kangaroo-training-treats-165g) |
| 325 | Savourlife Australian Chicken Training Treats | 165g | 9347810000174 | [Product evidence](https://woononapetfoods.com.au/products/savour-life-chicken-training-treats-165g) |
| 17 | Absolute Holistic Raw Stew — Chicken & Shellfish | 80g | 671875797311 | [Product evidence](https://www.petso.com.au/products/absolute-holistic-raw-stew-chicken-shell-fish-wet-canned-cat-dog-food) |
| 18 | Absolute Holistic Raw Stew — Chicken & Fish Roe | 80g | 671875797328 | [Product evidence](https://www.petso.com.au/products/absolute-holistic-raw-stew-chicken-fish-roe-wet-canned-cat-dog-food) |
| 997 | Advance Active Adult Chicken with Rice | 13kg | 9334214046068 | [Product evidence](https://vetslovepets.com.au/products/advance-active-adult-dry-dog-food-chicken-with-rice) |
| 1003 | Advance Adult Medium Breed Chicken With Rice | 15kg | 9310022528507 | [Product evidence](https://vetslovepets.com.au/products/advance-adult-dog-total-wellbeing-chicken) |
| 1038 | Advance Adult Large Breed Chicken With Rice | 15kg | 9334214008219 | [Product evidence](https://woononapetfoods.com.au/products/advance-adult-large-breed-15kg-chicken) |
| 1012 | Advance Healthy Weight Small Breed Adult | 2.5kg | 9334214024356 | [Product evidence](https://woononapetfoods.com.au/products/advance-weight-control-2-5kg-small-and-toy-breed) |
| 1069 | Black Hawk Healthy Benefits Indoor Cat | 2kg | 9312239052233 | [Product evidence](https://woononapetfoods.com.au/products/black-hawk-healthy-benefits-dry-cat-food-indoor-chicken-2kg) |
| 495 | Fancy Feast Adult Dry Beef, Salmon & Cheese | 450g | 9300605025523 | [Product evidence](https://woononapetfoods.com.au/products/fancy-feast-dry-beef-salmn-cheese) |
| 504 | Fancy Feast Gravy Lovers Poultry & Beef | 24 x 85g | 050000580064 | [Product evidence](https://woononapetfoods.com.au/products/fancy-feast-gravy-lovers-poultry-beef-variety-24x85g) |
| 517 | Felix Doubly Delicious Fish Selection | 12 x 85g | 9300605145634 | [Product evidence](https://woononapetfoods.com.au/products/felix-double-delicious-fish-selection-in-jelly12x85g) |
| 548 | Greenies Dog Dental Treats Original Large | 340g | 642863041105 | [Product evidence](https://woononapetfoods.com.au/products/greenies-large-340g-8-pack) |
| 549 | Greenies Dog Dental Treats Original Teenie | 170g | 642863102912 | [Product evidence](https://vetslovepets.com.au/products/greenies-original-treat-pack-teenie-170g) |
| 593 | Hill's Science Diet Perfect Weight | 11.34kg | 052742060545 | [Product evidence](https://woononapetfoods.com.au/products/hills-science-diet-canine-perfect-weight-1-8kg) |
| 605 | Ivory Coat Grain Free Kitten Chicken & Ocean Fish in Jelly | 85g | 9348601003497 | [Product evidence](https://woononapetfoods.com.au/products/ivory-coat-kitten-chicken-ocean-fish-in-jelly-85g) |
| 760 | Optimum Kitten Salmon in Jelly Pouch | 85g | 9334214053400 | [Product evidence](https://woononapetfoods.com.au/products/optimum-cat-kitten-healthy-development-chucks-in-jelly-salmon-85g) |
| 761 | Optimum Mature Salmon in Jelly Pouch | 85g | 9334214053462 | [Product evidence](https://woononapetfoods.com.au/products/optimum-cat-mature-chunks-in-jelly-salmon-85g) |
| 762 | Orijen Fit & Trim | 2kg | 064992107451 | [Product evidence](https://www.petso.com.au/products/orijen-fit-trim-biologically-appropriate-dry-dog-food) |
| 800 | Prime100 SPD Air Dried Beef & Carrot | 600g | 9340710002736 | [Product evidence](https://woononapetfoods.com.au/products/prime-100-air-dried-beef-and-carrot) |
| 805 | Prime100 SPD Air Dried Turkey & Flaxseed | 600g | 9340710002804 | [Product evidence](https://www.petso.com.au/products/prime100-spd-air-dried-turkey-flaxseed-dog-food) |
| 807 | Prime100 SPD Air Dried Wild Boar & Pumpkin | 600g | 9340710002842 | [Product evidence](https://www.petso.com.au/products/prime100-spd-air-dried-wild-boar-pumpkin-dog-food) |
| 818 | Prime100 SPD Fresh Roll Venison & Sweet Potato | 2kg | 9340710002880 | [Product evidence](https://www.petso.com.au/products/prime100-spd-venison-sweet-potato-fresh-roll-dog-food-2kg) |
| 820 | Prime100 SPD Prime Cut Beef Treats | 100g | 9340710002712 | [Product evidence](https://woononapetfoods.com.au/products/prime-100-beef-cut-treats-100g) |
| 827 | Prime100 SPD Prime Cut Wild Boar Treats | 100g | 9340710002873 | [Product evidence](https://vetslovepets.com.au/products/prime100-spd-prime-cut-wild-boar-dog-treats) |
| 831 | Prime100 SPD Slow Cooked Beef & Carrot | 354g | 9340710002644 | [Product evidence](https://woononapetfoods.com.au/products/prime-100-spd-slow-cooked-beef-and-carrot-354g) |
| 840 | Prime100 SPD Slow Cooked Venison & Sweet Potato | 354g | 9340710002934 | [Product evidence](https://www.petso.com.au/products/prime100-spd-slow-cooked-venison-sweet-potato-dog-food) |
| 858 | Purina Pro Plan Medium Puppy Chicken | 3kg | 9300605149687 | [Product evidence](https://vetslovepets.com.au/products/purina-pro-plan-puppy-medium-formula-with-colostrum-dry-dog-food) |
| 861 | Royal Canin Breed Health - Chihuahua Adult | 1.5kg | 3182550728102 | [Product evidence](https://vetslovepets.com.au/products/royal-canin-chihuahua-adult-1-5kg) |
| 871 | Royal Canin Persian Kitten | 2kg | 3182550721219 | [Product evidence](https://www.petso.com.au/products/royal-canin-persian-kitten-dry-cat-food-2kg) |
| 873 | Royal Canin Veterinary Calm | 4kg | 3182550765398 | [Product evidence](https://vetslovepets.com.au/products/royal-canin-vet-diet-canine-calm-4kg) |
| 898 | Schmackos Chomp n Chew Beef | 1 large chew | 9334214025506 | [Product evidence](https://woononapetfoods.com.au/products/schmackos-chomp-n-chew-large-x-1) |
| 899 | Schmackos Stix Beef | 500g | 9334214020518 | [Product evidence](https://woononapetfoods.com.au/products/schmackos-stix-500g-beef) |
| 900 | Schmackos Strapz Liver | 200g | 9334214054506 | [Product evidence](https://woononapetfoods.com.au/products/schmackos-strapz-200g-liver) |
| 970 | Whiskas Kitten Mixed Favourites in Jelly | 12 x 85g | 9334214053486 | [Product evidence](https://woononapetfoods.com.au/products/whiskas-kitten-mixed-favourtites-in-jelly-85g) |
| 1100 | Advance Adult Ocean Fish | 4kg | 9334214065069 | [Product evidence](https://woononapetfoods.com.au/products/advance-dry-cat-food-adult-ocean-fish-2kg) |
| 1101 | Optimum Adult Small Breed Chicken | 15kg | 9334214027333 | [Product evidence](https://woononapetfoods.com.au/products/optimum-adult-small-breed-3kg) |
| 1102 | Advance Adult Small Breed Chicken With Rice | 3kg | 9334214045931 | [Product evidence](https://vetslovepets.com.au/products/advance-adult-dog-toy-small-breed-chicken-dry-dog-food) |
| 1103 | Advance Healthy Weight Adult Medium Breed Chicken With Rice | 2.5kg | 9310022566509 | [Product evidence](https://vetslovepets.com.au/products/advance-weight-control-all-breed-chicken) |
| 1105 | Advance Mature Medium Breed Chicken & Rice | 15kg | 9334214046112 | [Product evidence](https://woononapetfoods.com.au/products/advance-mature-15kg) |
| 1112 | Black Hawk Original Adult Ocean Fish | 2kg | 9312239052141 | [Product evidence](https://woononapetfoods.com.au/products/black-hawk-dry-food-cat-adult-ocean-fish-2kg) |
| 1116 | Dine Creamy Treats Tuna & Prawn | 4 x 12g | 9334214046815 | [Product evidence](https://woononapetfoods.com.au/products/dine-creamy-treats-tuna-prawn-4x12g) |
| 1118 | Felix Doubly Delicious Meat Selection in Jelly | 12 x 85g | 9300605118218 | [Product evidence](https://woononapetfoods.com.au/products/felix-double-deliciousmeat-selection-in-jelly12x85g) |
| 1125 | Greenies Feline Dental Treats Oven Roasted Chicken | 130g | 642863111310 | [Product evidence](https://vetslovepets.com.au/products/greenies-feline-dental-cat-treat-oven-roasted-chicken-flavour-60g) |
| 1145 | My Dog Classic Loaf Chicken & Turkey | 400g | 9310022067105 | [Product evidence](https://woononapetfoods.com.au/products/my-dog-400g-chick-turkey) |
| 1146 | My Dog Classic Loaf Tender Chicken | 6 x 100g | 9334214006550 | [Product evidence](https://woononapetfoods.com.au/products/my-dog-6-x-100g-chic-supreme) |
| 1161 | Purina Pro Plan Medium Puppy Chicken | 15kg | 9300605149649 | [Product evidence](https://vetslovepets.com.au/products/purina-pro-plan-puppy-medium-formula-with-colostrum-dry-dog-food) |
| 1166 | Purina Pro Plan Small & Mini Adult Chicken | 7kg | 9300605149557 | [Product evidence](https://vetslovepets.com.au/products/purina-pro-plan-adult-small-mini-chicken-formula-dry-dog-food) |
| 335 | Schmackos Strapz Beef | 1kg | 9310022195402 | [Product evidence](https://woononapetfoods.com.au/products/schmackos-strapz-1kg-beef) |
| 312 | Ziwi Peak Air-Dried Chicken Cat | 400g | 9421016594849 | [Product evidence](https://www.petso.com.au/products/ziwi-peak-free-range-chicken-recipe-air-dried-cat-food) |
| 339 | Blackdog Beef Liver | 150g | 9319993800575 | [Product evidence](https://woononapetfoods.com.au/products/beef-liver-150g-blackdog) |
| 338 | Blackdog Duck Jerky | 1kg | 9319993801299 | [Product evidence](https://woononapetfoods.com.au/products/duck-jerky-120g) |
| 68 | Royal Canin Maxi Adult | 4kg | 3182550402224 | [Product evidence](https://www.petso.com.au/products/royal-canin-maxi-adult-dry-dog-food-4kg) |
| 226 | Purina Pro Plan Senior 7+ Salmon & Tuna | 1.5kg | 9300605133099 | [Product evidence](https://vetslovepets.com.au/products/purina-pro-plan-adult-7-salmon-tuna-formula-dry-cat-food) |
| 155 | Royal Canin Mini Adult Wet Pouch | 85g | 9003579008256 | [Product evidence](https://www.petso.com.au/products/royal-canin-mini-adult-wet-dog-food-85g-x-12) |
| 286 | Royal Canin Kitten in Gravy Pouch | 85g | 9003579308943 | [Product evidence](https://www.petso.com.au/products/royal-canin-kitten-gravy-wet-cat-food-85g-x-12) |
| 285 | Royal Canin Instinctive Adult Gravy Pouch | 85g | 9003579308936 | [Product evidence](https://www.petso.com.au/products/royal-canin-instinctive-gravy-adult-wet-cat-food-85g-x-12) |
| 156 | Royal Canin Medium Adult Wet Pouch | 140g | 9003579008379 | [Product evidence](https://www.petso.com.au/products/royal-canin-medium-adult-wet-dog-food-140g-x-10) |
| 135 | Ziwi Peak Mackerel & Lamb Wet Dog Food | 170g | 9421016596720 | [Product evidence](https://www.petso.com.au/products/ziwi-peak-mackerel-lamb-recipe-grain-free-dog-food) |
| 1016 | Ivory Coat Grain Free Large Breed Puppy Lamb | 2kg | 9348601001578 | [Product evidence](https://www.petso.com.au/products/ivory-coat-grain-free-lamb-puppy-large-breed-dog-food-2kg) |
| 36 | Orijen Tundra | 2kg | 064992108458 | [Product evidence](https://www.petso.com.au/products/orijen-tundra-biologically-appropriate-dry-dog-food) |
| 134 | Ziwi Peak Lamb Wet Dog Food | 170g | 9421016596645 | [Product evidence](https://www.petso.com.au/products/ziwi-peak-lamb-recipe-dog-food) |
| 132 | Ziwi Peak Beef Wet Dog Food | 170g | 9421016596669 | [Product evidence](https://www.petso.com.au/products/ziwi-peak-beef-recipe-grain-free-dog-food) |
| 136 | Ziwi Peak Venison Wet Dog Food | 170g | 9421016596683 | [Product evidence](https://www.petso.com.au/products/ziwi-peak-venison-recipe-grain-free-dog-food) |
| 51 | Taste of the Wild High Prairie Grain-Free | 2kg | 074198612277 | [Product evidence](https://www.petso.com.au/products/taste-of-the-wild-high-prairie-bison-canine-formula-grain-free-dog-food) |
| 277 | Applaws Tuna Fillet with Prawn in Broth | 70g | 5060122497879 | [Product evidence](https://www.petso.com.au/products/applaws-tuna-fillet-with-prawn-adult-canned-wet-cat-food-70g) |
| 52 | Taste of the Wild Pacific Stream Grain-Free | 2kg | 074198612239 | [Product evidence](https://www.petso.com.au/products/taste-of-the-wild-pacific-stream-canine) |
| 278 | Applaws Tuna With Mackerel in Jelly | 70g | 5060333430283 | [Product evidence](https://www.petso.com.au/products/applaws-tuna-and-mackerel-70g) |
| 54 | Taste of the Wild Sierra Mountain Grain-Free | 2kg | 074198612345 | [Product evidence](https://www.petso.com.au/products/taste-of-the-wild-sierra-mountain-canine) |
| 763 | Orijen Puppy Large Breed | 10.6kg | 064992102258 | [Product evidence](https://www.petso.com.au/products/orijen-puppy-large-breed-biologically-appropriate-dry-dog-food-10-6kg) |
| 853 | Purina Pro Plan Kitten Chicken & Liver Entrée | 85g | 038100026903 | [Product evidence](https://www.petso.com.au/products/pro-plan-chicken-liver-entree-kitten-wet-cat-food) |
| 1165 | Purina Pro Plan Small & Mini Puppy Chicken | 2.5kg | 9300605149229 | [Product evidence](https://vetslovepets.com.au/products/purina-pro-plan-puppy-small-toy-breed-chicken-dry-dog-food-7kg) |
| 1167 | Royal Canin Breed Health - Poodle Adult | 1.5kg | 3182550743174 | [Product evidence](https://vetslovepets.com.au/products/royal-canin-poodle-adult) |
| 1172 | Taste of the Wild High Prairie Puppy Grain-Free | 2kg | 074198612413 | [Product evidence](https://www.petso.com.au/products/taste-of-the-wild-high-prairie-grain-free-dog-food-for-puppy) |
| 1173 | Taste of the Wild Pacific Stream Puppy Grain-Free | 2kg | 074198612451 | [Product evidence](https://www.petso.com.au/products/taste-of-the-wild-pacific-stream-grain-free-dog-food-for-puppy) |
| 995 | Advance Small Breed Puppy Rehydratable | 3kg | 9334214002743 | [Product evidence](https://d347awuzx0kdse.cloudfront.net/westernpet/content-file/ADV%20Dry%20Dog%20Reno%20TP%20Codes.pdf?v=7464fab65b16fbbd1989480cdf15ddd96f8f9b08) |
| 996 | Advance Puppy Medium Breed Lamb with Rice | 3kg | 9334214150710 | [Product evidence](https://d347awuzx0kdse.cloudfront.net/westernpet/content-file/ADV%20Dry%20Dog%20Reno%20TP%20Codes.pdf?v=7464fab65b16fbbd1989480cdf15ddd96f8f9b08) |
| 1001 | Advance Puppy Large Breed Lamb with Rice | 15kg | 9334214150796 | [Product evidence](https://d347awuzx0kdse.cloudfront.net/westernpet/content-file/ADV%20Dry%20Dog%20Reno%20TP%20Codes.pdf?v=7464fab65b16fbbd1989480cdf15ddd96f8f9b08) |
