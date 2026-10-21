# Barcode research round two on 13 October 2026

Version **2026.10.13.3** adds **43** supported matches across **20 brands**, bringing enabled lookup coverage from **415 to 458 of 1,082 products**. **624** listings still have missing or withheld barcode evidence. Six successful physical scans remain owner-reported; this batch adds online source checks only.

## What changed

15 missing codes filled, 20 incorrect codes replaced and 8 existing codes supported by exact-pack evidence. Recipe, species, food form, life stage and pack size were reviewed individually. Previously unspecified packs are now explicit. Advance Ocean Fish's existing code identifies 3kg, correcting the unsupported 1.5kg label.

The search screened 6,946 Petbarn product URLs and 7,122 additional public listings from Just For Pets, Petzyo and vet-n-pet DIRECT. Captured product pages, structured variant records and source hashes are retained in the local research folder. Australian Acana manufacturer pages were also checked but did not publish GTINs. Blocked or throttled sources were not bypassed.

## Evidence that remains withheld

The previous Pro Plan Sensitive Chicken single-pouch/carton conflict remains unresolved. Petzyo's public data repeats some codes across different pack sizes and repeats a Fang code across two flavours; those ambiguous codes were rejected. Several catalogue entries duplicate already verified products. Candidate similarity and checksum validity alone do not enable lookup.

Full remaining worklist: `Remaining_Worklist.json` in the local round-two research folder. It records candidate URLs and distinguishes missing candidates from failed exact-match review. It is not proof that every product lacks public barcode evidence.

## Validation

44 automated tests pass, including all enabled lookups, padded GTIN handling, app/Collector agreement, evidence identity binding, prior conflicts and source-capture hashes. Four manifest synchronization checks pass. New codes have not yet been physically scanned.

## Accepted source associations

| App ID | Product | Exact pack | Barcode | Source |
| --- | --- | --- | --- | --- |
| 329 | Greenies Original Petite | 170g | 642863102929 | [Source](https://www.petbarn.com.au/p/greenies-original-dog-treat-petite) |
| 331 | Greenies Original Large | 170g | 642863102943 | [Source](https://www.petbarn.com.au/p/greenies-original-dog-treat-l) |
| 330 | Greenies Original Regular | 170g | 642863102936 | [Source](https://www.petbarn.com.au/p/greenies-original-dog-treat-regular) |
| 21 | Advance Retriever Adult Chicken with Rice | 13kg | 9334214064659 | [Source](https://www.petbarn.com.au/p/advance-retriever-chicken-adult-dog-food-13kg) |
| 343 | Love Em Liver Treats | 200g | 9325242000535 | [Source](https://www.petbarn.com.au/p/love-em-air-dried-beef-liver-dog-treat) |
| 408 | Billy & Margot Adult Salmon | 1.8kg | 810339020965 | [Source](https://www.petbarn.com.au/p/billy-margot-salmon-superfood-adult-dog-food) |
| 412 | Billy & Margot Puppy Salmon | 1.8kg | 810339022457 | [Source](https://www.petbarn.com.au/p/billy-margot-salmon-superfood-puppy-food) |
| 1036 | Advance Adult Casserole with Chicken | 12 x 400g | 9334214029672 | [Source](https://www.petbarn.com.au/p/advance-adult-dog-all-breed-casserole-with-chicken-12x400g) |
| 1015 | Advance Adult Casserole with Chicken Trays | 12 x 100g | 9334214061535 | [Source](https://www.petbarn.com.au/p/advance-chicken-casserole-adult-dog-food-100gx12) |
| 1067 | Black Hawk Adult all breeds Healthy Benefits Dental | 2kg | 9312239047802 | [Source](https://www.petbarn.com.au/p/black-hawk-healthy-benefits-dental-adt-dog-food) |
| 1068 | Black Hawk Adult Healthy Benefits Hairball Chicken Cat | 4kg | 9312239052271 | [Source](https://www.petbarn.com.au/p/black-hawk-healthy-benefits-hairball-chck-adult-cat-food) |
| 1074 | Black Hawk Beef Jerky Sticks | 100g | 9312239048755 | [Source](https://www.petbarn.com.au/p/black-hawk-dog-treats-beef-jerky-sticks-100g) |
| 1078 | Black Hawk Original Kitten Chicken | 4kg | 9312239052219 | [Source](https://www.petbarn.com.au/p/black-hawk-original-chicken-kitten-food) |
| 488 | Purina Pro Plan Kitten Chicken | 3.5kg | 9300605132474 | [Source](https://www.petbarn.com.au/p/pro-plan-chicken-kitten-food) |
| 550 | Hill's Prescription Diet a/d Urgent Care Recovery | 24 x 156g | 052742567013 | [Source](https://www.petbarn.com.au/p/hills-prescription-diet-a-d-urgent-care-adult-dog-cat-wet-food-156gx24) |
| 622 | Leaps & Bounds Adult Chicken & Rosemary Dry Cat Food | 7kg | 9345740076481 | [Source](https://www.petbarn.com.au/p/leaps-bounds-chicken-rosemary-cat-food) |
| 623 | Leaps & Bounds Adult Ocean Fish & Thyme Dry Cat Food | 3.2kg | 9345740080211 | [Source](https://www.petbarn.com.au/p/leaps-bounds-ocean-fish-thyme-cat-food) |
| 645 | Leaps & Bounds Kitten Chicken Dry Cat Food | 3.2kg | 9345740080235 | [Source](https://www.petbarn.com.au/p/leaps-bounds-chicken-rosemary-kitten-food) |
| 647 | Leaps & Bounds Puppy Chicken & Rice Dry | 15kg | 9345740051976 | [Source](https://www.petbarn.com.au/p/leaps-bounds-chicken-with-rice-puppy-food) |
| 670 | Leaps & Bounds Chicken, Salmon & Sweet Potato Dog Roll | 2kg | 9345740078409 | [Source](https://www.petbarn.com.au/p/leaps-bounds-chicken-salmon-sweet-potato-dog-roll-2kg) |
| 710 | Leaps & Bounds Sensitive Skin & Stomach Ocean Fish Dog Food | 3.2kg | 9345740102265 | [Source](https://www.petbarn.com.au/p/leaps-bounds-sensitive-skin-ocean-fish-dog-food) |
| 829 | Prime100 SPD Puppy Fresh Roll Chicken & Brown Rice | 1kg | 9340710003030 | [Source](https://www.petbarn.com.au/p/prime100-roll-chicken-brown-rice-puppy-food) |
| 843 | Supercoat Adult Healthy Weight Chicken | 2.6kg | 9300605147348 | [Source](https://www.petbarn.com.au/p/supercoat-smartblend-hlthy-wght-chicken-adult-dog-food) |
| 851 | Purina Pro Plan FortiFlora Canine Probiotic | 30 x 1g | 038100119315 | [Source](https://www.petbarn.com.au/p/pro-plan-fortiflora-dog-probiotic-supplement-1g-30pk) |
| 855 | Purina Pro Plan Kitten Salmon in Gravy | 12 x 85g | 9300605131552 | [Source](https://www.petbarn.com.au/p/pro-plan-salmon-kitten-pouch-85gx12) |
| 860 | Royal Canin Appetite Control Adult | 12 x 85g | 9003579014899 | [Source](https://www.petbarn.com.au/p/royal-canin-appetite-control-gravy-adult-cat-food-pch-85gx12) |
| 908 | Taste of the Wild Southwest Canyon with Wild Boar | 2kg | 074198612499 | [Source](https://www.petbarn.com.au/p/taste-of-the-wild-southwest-canyon-adult-dog-food) |
| 917 | Temptations Tantalising Turkey Flavour | 85g | 8853301001120 | [Source](https://www.petbarn.com.au/p/temptations-tantalising-turkey-cat-treat-85g) |
| 930 | VitaPet Jerhigh Chicken Tenders | 200g | 9312239029143 | [Source](https://www.petbarn.com.au/p/vitapet-jerhigh-chicken-tenders-dog-treat-200g) |
| 932 | VitaPet Jerhigh Milky Sticks | 400g | 9312239029860 | [Source](https://www.petbarn.com.au/p/vitapet-jer-high-milky-sticks-for-puppies-dogs-400g) |
| 1098 | Advance Adult Chicken & Salmon with Rice | 12 x 410g | 9334214029702 | [Source](https://www.petbarn.com.au/p/advance-adult-chicken-salmon-and-rice-dog-food-410gx12) |
| 1142 | Leaps & Bounds Grain Free Puppy Lamb & Vegetable | 12kg | 9345740052072 | [Source](https://www.petbarn.com.au/p/leaps-bounds-grain-free-lamb-puppy-food) |
| 1143 | Leaps & Bounds Kitten Chicken Dry Cat Food | 7kg | 9345740125165 | [Source](https://www.petbarn.com.au/p/leaps-bounds-chicken-rosemary-kitten-food) |
| 1158 | Supercoat Large Breed Puppy Chicken | 18kg | 9300605147591 | [Source](https://www.petbarn.com.au/p/supercoat-chicken-large-puppy-food-18kg) |
| 61 | Hill's Science Diet Puppy Small Bites | 2kg | 052742713908 | [Source](https://www.justforpets.com.au/products/hills-science-diet-puppy-small-bites-dry-dog-food) |
| 211 | Advance Adult Ocean Fish | 3kg | 9310022567308 | [Source](https://www.justforpets.com.au/products/advance-adult-dry-cat-food-ocean-fish-with-rice) |
| 130 | Black Hawk Grain Free Adult Lamb Wet | 100g | 9338362001832 | [Source](https://www.justforpets.com.au/products/black-hawk-grain-free-adult-lamb-wet-dog-food) |
| 1043 | Advance Healthy Weight Adult Chicken | 2kg | 9334214045689 | [Source](https://www.justforpets.com.au/products/advance-healthy-weight-adult-dry-cat-food-chicken-with-rice-2kg-bag) |
| 774 | Petzyo Kibble That Counts — Chicken & Turkey with Superfood Extras | 2.5kg | 9361300000086 | [Source](https://petzyo.com.au/products/2-5kg-of-kibble-that-counts-chicken-turkey-with-superfood-extras) |
| 772 | Fang Dental Sticks — Fang Rollin' for Roo | 200g (5 sticks) | 9349592339411 | [Source](https://petzyo.com.au/products/fang-rollin-for-roo-dental-sticks) |
| 133 | Ziwi Peak Chicken Wet Dog Food | 170g | 9421016596744 | [Source](https://www.vetnpetdirect.com.au/products/ziwi-peak-free-range-chicken) |
| 27 | Meals for Mutts Single Protein Kangaroo | 2.5kg | 735850548722 | [Source](https://www.vetnpetdirect.com.au/products/mfm-single-protein-kangaroo) |
| 223 | Ivory Coat Grain Free Kitten Chicken | 2kg | 9348601004708 | [Source](https://www.petbarn.com.au/p/ivory-coat-chicken-kitten-food-2kg) |
