# Barcode field-test fixes — 12 October 2026

This update prepares the four bags from the user's photograph for a focused retest. The two Leaps & Bounds bags have already been physically scanned by the user and each resolved to the correct recipe. Their retailer-backed records now retain that user-reported scan result.

| Product and pack | App action | Evidence / field result |
| --- | --- | --- |
| Leaps & Bounds Essentials Adult Beef, 18kg | Retained GTIN `9345740131340`; recorded successful user-reported physical scan | [Petbarn exact 18kg listing](https://www.petbarn.com.au/p/leaps-bounds-beef-adult-dog-food-18kg) |
| Leaps & Bounds Essentials Adult Large Breed Chicken, 18kg | Retained GTIN `9345740126209`; recorded successful user-reported physical scan | [Petbarn exact 18kg listing](https://www.petbarn.com.au/p/leaps-bounds-chicken-lg-brd-adult-dog-food-18kg) |
| Advance All Breeds Adult Lamb & Rice, 20kg | Replaced the catalogue's incorrect puppy wet-food GTIN with `9334214150352`; made the 20kg pack explicit | [Habitat Pets exact 20kg listing](https://www.habitatpets.com.au/products/advance-all-breed-lamb-and-rice-adult-dog-dry-food-20kg) |
| Black Hawk Original Adult Lamb & Rice, 20kg | Kept the supported 3kg item intact; added a distinct 20kg item with GTIN `9338362000910` and the matching 20kg pack image | [Pet City exact 20kg listing](https://www.petcity.com.au/product/blackhawk-dog-adult-lamb-rice-20kg) |
| Hypro Premium Adult Grain Free Chicken & Duck, 20kg | Added the missing item with GTIN `9343053001237` and a matching pack image | [PetZoo exact 20kg listing](https://www.petzoo.com.au/hypro-premium-adult-grain-free-dog-food-chicken-du~970134); [Kmart pack image](https://assets.kmart.com.au/transform/b9be2779-4e94-47db-acd7-dbb3a0779088/110020320-1?io=transform%3Aextend%2Cwidth%3A1100%2Cheight%3A1375&quality=90) |
| Billie's Bowl Adult Aussie Beef, 20kg | Corrected the pack size and matched the 20kg photo; removed the unsupported GTIN candidate `9392596027556` from the product record pending the bag's printed code | [Petstock recipe and 20kg listing](https://www.petstock.com.au/products/billies-bowl-adult-with-real-aussie-beef-dry-dog-food). Retailer page does not publish the GTIN. |

The barcode evidence records for the three newly sourced associations use `captureSha256` as a digest of this local observation log, not a hash of the retailer's webpage. Retailer pages remain the linked primary evidence; no physical scan is claimed for those three codes until the user retests the actual bags.

## Retest needed

After the testing preview is updated, scan the Advance, Black Hawk 20kg and Hypro bags once each. Confirm that the app shows the matching recipe and pack size. For Billie's Bowl, photograph the barcode and its digits on the existing 20kg bag; no shop visit is needed. The app currently withholds that unverified code instead of risking a wrong product match.

These fixes target the reported bags. The rest of the catalogue still needs a source-by-source barcode audit and is not certified by these field tests.
