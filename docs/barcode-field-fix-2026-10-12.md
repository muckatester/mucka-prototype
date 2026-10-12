# Barcode field-test fixes — 12 October 2026

This update records the user's field results and pack-photo evidence. The Leaps & Bounds beef and chicken, Advance lamb and rice, Black Hawk lamb and rice, and Hypro chicken and duck bags have each opened the correct recipe in the app, according to the user. Billie's Bowl is matched from the owner-provided barcode photo; its app-camera scan still needs a field test.

| Product and pack | App action | Evidence / field result |
| --- | --- | --- |
| Leaps & Bounds Essentials Adult Beef, 18kg | Retained GTIN `9345740131340`; recorded successful user-reported physical scan | [Petbarn exact 18kg listing](https://www.petbarn.com.au/p/leaps-bounds-beef-adult-dog-food-18kg) |
| Leaps & Bounds Essentials Adult Large Breed Chicken, 18kg | Retained GTIN `9345740126209`; recorded successful user-reported physical scan | [Petbarn exact 18kg listing](https://www.petbarn.com.au/p/leaps-bounds-chicken-lg-brd-adult-dog-food-18kg) |
| Advance All Breeds Adult Lamb & Rice, 20kg | Corrected the catalogue code and 20kg pack; user reports successful physical app scan to the correct product | [Habitat Pets exact 20kg listing](https://www.habitatpets.com.au/products/advance-all-breed-lamb-and-rice-adult-dog-dry-food-20kg) |
| Black Hawk Original Adult Lamb & Rice, 20kg | Kept the supported 3kg item intact; added a distinct 20kg item with GTIN `9338362000910` and matching pack image; user reports a successful physical app scan | [Pet City exact 20kg listing](https://www.petcity.com.au/product/blackhawk-dog-adult-lamb-rice-20kg) |
| Hypro Premium Adult Grain Free Chicken & Duck, 20kg | Added the missing item with GTIN `9343053001237` and matching pack image; user reports a successful physical app scan | [PetZoo exact 20kg listing](https://www.petzoo.com.au/hypro-premium-adult-grain-free-dog-food-chicken-du~970134); [Kmart pack image](https://assets.kmart.com.au/transform/b9be2779-4e94-47db-acd7-dbb3a0779088/110020320-1?io=transform%3Aextend%2Cwidth%3A1100%2Cheight%3A1375&quality=90) |
| Billie's Bowl Adult Aussie Beef, 20kg | Corrected the pack size and matched the 20kg photo; the owner-provided label photo shows printed EAN-13 `9392596027556`, now linked to this product. The app-camera scan is still pending | [Petstock recipe and 20kg listing](https://www.petstock.com.au/products/billies-bowl-adult-with-real-aussie-beef-dry-dog-food). Retailer page does not publish the GTIN. |

The three successful scans above are user-reported physical app tests. Billie's printed code comes from the owner-provided label photo (recorded by its SHA-256 digest; the image itself is not copied into the public repository). The code's check digit is valid, but the camera scan remains unconfirmed.

## Retest needed

The updated preview will be verified at version 2026.10.12.3. Use [this version-pinned testing link](https://deploy-preview-2--mucka-prototype.netlify.app/?v=2026.10.12.3) after the new preview finishes deploying.

The next field check is Billie's Bowl: scan the existing 20kg bag and confirm the app opens Adult with Aussie Beef, 20kg. No shop visit is needed. The three other corrected bags have already been reported as successful.

These fixes target the reported bags. The rest of the catalogue still needs a source-by-source barcode audit and is not certified by these field tests.

The earlier numerical scores are visible again on each product detail page under “Legacy prototype score — unvalidated.” The old method received concerns during review; this display is for inspection only. Under-review badges, rankings and recommendations remain paused.
