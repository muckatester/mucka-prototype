# Mucka beta

The single current beta is **https://mucka-beta.netlify.app/**. Testing version **2026.10.22.1**.

This GitHub repository holds the app source, catalogue evidence, regression tests and deployment builder. Packet submissions and personal pet records do not belong in this public repository.

## Current behaviour

- Browse 1,080 active catalogue products. There are 474 supported barcode associations, 606 unresolved cases, 975 displayed photos and 105 remaining photo or identity gaps. Supported does not mean every pack has had a physical scan test.
- Product screens contain no legacy numerical scores or unsupported ingredient lists. Thirteen exact-identity manufacturer ingredient records remain available with sources. Historical prototype values are quarantined in `data/quarantined-prototype-2026-10-22.json`, which is never loaded by the app or included in the public deployment build.
- Missing barcodes open a prefilled capture. The product screen also has a wrong-product/details report action that preserves the scanned digits and the product the app opened. The actual packet's details remain separate from that reported match.
- Send for review requires the printed digits, two labelled packet photos and explicit sharing consent. It submits through Netlify Forms, shows a reference after an accepted submission response, and retains drafts and failed attempts for retry. Reports do not automatically alter the catalogue.
- Older app addresses lead to this beta. A recovery page offers local pet, capture and favourite backups before moving if records exist at an older origin. No old data is silently erased or uploaded.

## Owner review inbox

Sign in to the existing Mucka Netlify account and open **mucka-beta → Forms → mucka-packet-review**. Review both **Verified submissions** and **Spam submissions**, refreshing the dashboard if its list is stale. Netlify's verified label means spam moderation only; it does not verify a barcode or approve a catalogue change.

Email notifications go to **muckatester@gmail.com**. A spam-filtered report may need manual recovery before an email is sent. A live synthetic delivery test was found in Spam, its reference and both uploaded images were inspected, then its spam classification was corrected and the resulting email was read in Gmail. Keep test reports out of the catalogue.

For a real report, check the front, readable digits, exact recipe, species and pack size. Match an existing App ID where supported; retain uncertainty and conflicting evidence. Record the decision and source separately, test the proposed association, then publish it. A submitted photo alone is not permission to publish an image or invent a nutrition rating.

## Local data and previews

Pet records and capture drafts stay in the browser on that device, with backup and restore controls. Only the explicit packet-report Send action uploads packet photos. Records are not automatically synced or backed up to an account. The AI studio and specials screens are labelled demonstrations; there is no billing, live image generation, retailer monitoring or live specials email service.

## Deployment

Build from the intended GitHub revision with the bundled Python runtime:

```sh
python3 scripts/build-beta.py /absolute/path/outside/the/repository/publish
```

The builder produces a publish folder, ZIP and SHA-256 manifest. It excludes audits, private correspondence, tests and capture data. It serves the small verified display copies locally and generates redirects for original photos to an immutable commit in this public GitHub repository. Original bytes and identity bindings remain unchanged. Both browser-style and fully encoded punctuation in photo paths are covered.

Deploy the ZIP to the **existing mucka-beta project**, never create another beta project for an update. Verify the displayed version, scripts, original-photo viewer and intake after deployment. This release uses an authenticated manual deployment; automatic GitHub-to-Netlify deployment is not yet connected. The source and hosting release must be kept in step.

## Checks and field testing

Run `node --test tests/*.test.cjs` and the browser scripts in `scripts/` with Playwright available. Live submission tests require an explicit opt-in and use conspicuous non-personal test cards. Local intake simulation is separate from a verified live receipt and from a physical camera test.

Before inviting friends, rehearse the intended real bags on an iPhone and Android where relevant. Verify known, unknown and wrong matches; two-photo sending; the owner receiving the same reference; restart recovery; and a reviewed correction appearing after an update. Nutrition scoring requires separate evidence and methodological review.
