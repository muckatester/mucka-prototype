# Mucka launch review

## Reliability and photo follow-up — 20 October 2026

Testing release **2026.10.20.6** fixes keyboard operation of product rows across browse, search and favourites; Search, the assessment explanation and photo viewer now contain focus, close on Escape and restore their trigger, with the background inactive and scroll lock restored. Returning from a searched product retains the query and results; returning to a category retains the page, scroll and product focus, including re-rendered favourites. Broad searches announce the 60-result limit. Pack photographs have an explicit View pack photo control. Unsupported product IDs no longer clear the current product. These are targeted checks, not an accessibility certification or a claim that native browser Back has been implemented as app navigation.

Two older photographs were accepted after reading their labels: **Optimum Indoor Chicken #244** (pictured 2kg; this catalogue entry's pack remains unknown) and **Ivory Coat Grain Free Reduced Fat Turkey #1027** (explicit Senior Reduced Fat and 2kg front). Both have source/evidence records and small WebP display copies. The older Swaggle Optimum URL now redirects to Purina ONE; that target was excluded. Current counts: **1,080 active products, 975 displayed photos, 105 remaining photo/identity gaps, 474 supported barcode lookups, 606 unresolved barcode cases.** No product identity, barcode association, nutrition claim or rating was changed. The full 107-case triage list was reread, followed by focused searches; this is not a claim of new exhaustive internet research for every remaining case.

Local validation: **68 Node checks, ten reliability browser scenarios, eight simulated scanner scenarios and 16 capture browser scenarios**. New photo pages fit 320, 390, 768 and 1100 pixels and load their identity-bound images. Main phone camera and native Files/Calendar behaviour remain the owner's test. Photo sources are public references, not a licence grant. See `docs/image-gaps-2026-10-20.json` for the current remaining list; source snapshots, rejected candidates, screenshots and the master Word/Excel updates are saved in `/Users/stuart-minion/Documents/Mucka/Mucka_Review_2026-09-14/Reliability_Photos_2026-10-20/`. The Word master and workbook preserve dated history and archived originals. The ten reliability scenarios also passed on the live preview, and all 19 changed files were verified: HTML version labels and inline scripts match; other bytes match. Runtime commit `52a91b0d71a76eac3378b0e1f0e41ad5a0284c76`. Release_Record.json in that folder records the source and limits.

## Specials alerts preview — 20 October 2026

Testing release **2026.10.20.5** adds `mucka-specials.html`, linked from Home, Profile, My pets and the original Plus plan dialog. It is a browser-local interactive prototype with four existing exact catalogue foods, two sample watches, delivered-price targets, free-membership opt-in, pause/resume/remove, postcode and roundup preferences, sample price-drop controls and an unsent email preview. Prices, stores, stock and delivery are invented and labelled throughout. No retailer feed, email service, actual savings history, checkout or subscription is active.

Targets compare a single exact bag including known delivery. Unknown shipping, unavailable stock, excluded membership prices and paused watches cannot generate a qualifying preview. Fictional shipping exists only for postcode 3799; other postcodes hold alerts rather than assume free delivery. The interface describes the difference from the owner's target, not savings against an invented previous price. No food scores, barcode associations, catalogue photos or pet-record data were changed. Invalid saved specials data is preserved until an explicit reset; unavailable storage is reported as temporary. Reset affects only the separate specials demo key.

The owner prefers a 12-month plan. The old Plus concept's monthly/annual price quote has been replaced by an annual concept with price and inclusions still to be tested. A limited portrait allowance is a proposal, not a live entitlement. A$29.99/year was used only for arithmetic: 100,000 downloads at 1%, 3%, 5% and 10% paid conversion yield 1,000 / 3,000 / 5,000 / 10,000 buyers and A$29,990 / A$89,970 / A$149,950 / A$299,900 gross first-year sales. 100,000 paying customers would yield A$2,999,000 gross, not profit. Exclude no costs from a profit calculation: marketing, taxes, payment/store fees, refunds, supplier data, email, generation including retries, support and storage all matter. At an assumed A$2/install, buying 100,000 installs costs A$200,000; 3% conversion cannot recover that from A$29.99 first-year gross sales. These are scenarios, not a Mucka forecast.

[RevenueCat's 2026 sample](https://www.revenuecat.com/state-of-subscription-apps) reports a median 2.1% download-to-paid conversion by day 35 for freemium apps; that is not a pet-app-specific forecast or evidence that changing paywalls causes better results. YouTube winners are not a representative market sample. Recommend testing adult pet owners' willingness to pay, repeat useful alerts and generation costs before a large promotion campaign. Family pet art may be worth testing with parents; child-directed advertising, child accounts and a claim of being safe for children require separate design and privacy/safety assessment. [OAIC's developing Children's Online Privacy Code](https://www.oaic.gov.au/privacy/privacy-registers/privacy-codes/childrens-online-privacy-code) must be assessed for actual applicability; no universal legal-compliance claim is made.

Local validation: **68 Node checks, 12 specials browser scenarios** including 320/390/768/1100 pixel layouts, delivery/member/stock exclusions, persistence, pause/resume, reset isolation, malformed data and storage failure. The 14 real-pet-record, 13 original-Plus and eight simulated-scanner browser scenarios also passed. All 12 specials scenarios passed again on the published preview. Live JS/CSS match byte-for-byte and HTML inline scripts match (Netlify rewrites links and injects its toolbar). Runtime commit `c4674aecd4266da2b9f6b083015ab20300d93d5f`; release evidence is in `/Users/stuart-minion/Documents/Mucka/Mucka_Review_2026-09-14/Specials_Preview_2026-10-20/Release_Record.json`. Browser tests simulate prices; they do not establish a live service, customer demand, physical iPhone behaviour or children's safety. Next owner test: edit a target, simulate a drop, preview the email, then try a different postcode and confirm the alert is held. Real delivery and email require approved retailer access and consent before any paid pilot.

## Specials enquiries sent — 20 October 2026

Owner-authorised enquiries sent from **muckatester@gmail.com to Pet Circle, Petstock and Petbarn**, asking for approved price/stock/promotion feeds, exact product identifiers, delivery costs, commercial app/email permission, charges and affiliate terms. All three were read back and verified in Gmail Sent. No attachments, paid signup or licence acceptance.

Pet Circle has already sent automated acknowledgement/routing to RangeMe, but **no useful data or permission**. Human data-team routing is not confirmed; both handled replies were marked read. Petstock and Petbarn await responses. [Sent evidence and verification](/Users/stuart-minion/Documents/Mucka/Mucka_Review_2026-09-14/Savings_Feasibility_2026-10-20/Retailer_Data_Enquiries_Verified.json). The existing [outreach queue](/Users/stuart-minion/Documents/GitHub/Mucka_Review_2026-09-14/Barcode_Full_624_2026-10-13/Gmail_Outreach_Queue.md) now tracks these threads and their next steps. The app remains 2026.10.20.4.

## Specials feasibility test — 20 October 2026

The owner authorised a comparison of 20 large-bag dry dog foods across Pet Circle, Petstock and Petbarn, then confirmed postcode 3799 for delivery checks. All **60 item prices** were recorded from live browser listings/purchase options or freshly retrieved exact-variant retailer HTML. The sample is purposive (12 Black Hawk, four Advance, four Royal Canin; 10–20kg), not a market or nutritional recommendation. Ordinary single-bag prices are compared with Petbarn membership disclosed; repeat orders, intro offers, multi-buys and non-member reference-price savings are excluded.

**Five products were $12–$19.99 below the next cheapest retailer before delivery. The median best-to-next-best gap was $1; the median highest-to-lowest spread was $5.** Black Hawk High Meat Red Meat 10kg was $108.74 at Pet Circle versus $127 Petbarn member / $169 Petstock Buy Once; its differently named recipe was checked against the descriptions and ingredient lists. Four Advance 15kg bags were $119 at Petbarn versus $131–$139 at Petstock and $138.99 at Pet Circle. These are same-day item-price comparisons, not observed price falls, frequency, guaranteed savings, purchase evidence or validated subscription demand.

**Delivery remains unresolved: zero complete three-retailer delivered comparisons.** Millgrove was used as a selectable suburb within the authorised postcode; Pet Circle resolved a free-fast-delivery header, but no set of 60 cart-specific shipping/stock quotes was completed. Petbarn/Petstock postcode interactions did not yield usable quotes in this session. Generic free-shipping schema must not be treated as postcode evidence. No delivered winner is claimed.

Commercial access is a launch gate: [Pet Circle Usage terms](https://www.petcircle.com.au/terms-of-use) restrict commercial/non-personal reuse and copying without permission. Approved feeds, pricing/stock rights, email/affiliate conditions, update frequency and charges need agreement before a paid service. [Petshack](https://www.petshack.au/) advertises free comparison, and Pet Circle itself displayed a competitor-price comparison; a generic list of specials is weak differentiation. Recommend a small permission-based pilot for exact-food target-price alerts and timely replenishment reminders. A proposed 14-day observation / 10–20-owner trial has not been scheduled or started.

A one-off $4 purchase can be worthwhile after a few useful uses; it cannot be assumed to fund lifetime monitoring. 3,000 one-off $4 purchases = $12,000 once; 3,000 retained $4 monthly subscribers = $12,000 gross/month before operating, acquisition, payment, tax and support costs. Prices and acquisition/retention remain hypotheses. Do not build revenue expectations around forgotten subscriptions. Local pet storage remains unchanged.

The four-page PDF, linked 20-product table, full price observations and source evidence are saved under `/Users/stuart-minion/Documents/Mucka/Mucka_Review_2026-09-14/Savings_Feasibility_2026-10-20/`. No app code/version, catalogue barcode, billing, cloud account, email service or outgoing message was changed by this research. Testing app remains **2026.10.20.4**.

## Commercial validation recommendation — 20 October 2026

The owner has requested explicit critical judgement throughout the project. Persistent project guidance is saved in AGENTS.md. The recommendation is to test monetisation while finishing reliability and product evidence; a polished interface does not yet establish willingness to pay.

The proposed A$4.99 monthly / A$39 annual plan remains an unvalidated price hypothesis. Pet profiles and registration details may be entered infrequently. PetDesk advertises a free owner app with appointments, records and reminders ([official owner app](https://petdesk.com/download-app-for-pet-health)); PetCloud describes an overlapping pet passport with microchip, council and vaccination details and reminders ([official description](https://www.petcloud.com.au/d/blog/how-to-manage-your-pets-life-easily/)). Their overlap challenges differentiation; it does not prove Mucka has no opportunity. No claim that every competitor feature is available to every Australian owner is made.

A future paid organiser needs continuing benefits such as dependable reminders, backup and family access. Those services are not currently connected and have operating/support costs. The owner's decision to keep storage local until release still applies. AI portraits remain a separate optional credit-based hypothesis, with actual cost measured per acceptable result including retries and support. Neither pet art nor a subscription should influence food assessments.

Recommended next work while the owner tests two pets: complete a usability/accessibility pass and resolve observed failures; define the first-release catalogue using supported product identities rather than total catalogue size; progress the evidence and specialist review needed for a defensible nutrition method. Avoid expanding the feature list before these tests and decisions.

Before implementing billing, run an exploratory two-week trial with 10–20 prospective owners beyond friends/family. Observe setup completion, return use, missing-data problems, which features are used and objections to an explicit proposed price. Compliments and stated interest are weak purchase evidence. Once the promised paid service works, a transparent small paid pilot can test actual purchase and support costs. Do not create fake checkout demand, solicit participants externally or charge anyone without the owner's specific authorisation. The trial size and duration are proposed research choices, not a statistically validated success threshold.

## Current local pet records checkpoint — 20 October 2026

Testing version **2026.10.20.4** adds [My pets](../mucka-pets.html) to the main five-item navigation (replacing the Explore shortcut; category browsing and the Explore screen remain available). It starts empty and keeps the [original Plus concept](../mucka-plus.html) separate. Owners can add and edit their own profiles and photos, microchip/registration details, vet notes and reminders. Pet photos are resized to local JPEGs; no pet record or photo upload is performed. No Supabase account or paid backend was created: the owner chose local storage until release.

Profiles, photos, visits and reminders save together in a separate IndexedDB database. Saves are acknowledged after transaction completion; aborted writes retain session edits and allow backup. Revision checks prevent a stale tab from overwriting newer records. Healthy tabs refresh from local changes; unreadable stored records are not silently overwritten. Add/edit/delete flows have validation and destructive confirmations. Deleting a pet removes its associated local records, but not exported backups or calendar events.

A JSON backup contains profiles, photos, visits and reminders. Restoration validates the whole file and photo decodes, shows record counts and asks before atomically replacing current data. Demo and capture backup formats are rejected. Transfer into a clean separate browser context passed. Keep downloaded files private because they contain the entered identifiers, contacts and photos. [Pet storage and privacy explanation](../pet-care-privacy.html).

Monthly/yearly reminders create a next pending occurrence when marked complete; month-end clamping preserves the original day and undo protects an already edited successor. Calendar export includes only the next pending events, converted from the device's local time to UTC, with a one-hour display alarm. The owner must import the file and check calendar alert settings on iPhone. It is not a live calendar feed or Mucka push service. Account sync, automatic cloud backup, push delivery, payments and live AI portraits remain deferred. Prepared Studio examples remain labelled.

Validation: **63 Node checks**, **14 real-pet browser scenarios**, **eight scanner scenarios** and the **13 retained premium-demo scenarios** pass. Pet browser coverage includes photos/reopen, visit/reminder editing, repeating dates/undo, calendar alerts, backup restoration/cancellation, a separate browser transfer, phone layouts/dialogs, aborted writes, stale tabs and navigation back to favourites/manual lookup. Layouts checked at 320/390/768/1100 pixels. Real iPhone photo picking, backup Files handling and calendar import/alert delivery still need the owner's device test.

Catalogue coverage remains 1,080 active products, 973 displayed photos, 107 photo gaps, 474 supported barcode lookups and 606 unresolved barcode cases. The product spreadsheet remains current; the project document and trackers have been updated. Next: field-test one actual pet and a test calendar reminder, then complete remaining app usability/data evidence and launch-scope work. Numerical health assessments remain unvalidated.

## Earlier premium concept checkpoint — 20 October 2026

Testing version **2026.10.20.3** adds [Mucka Plus](../mucka-plus.html), linked from Home and Profile. The responsive preview includes editable sample pet profiles (microchip, registration, usual vet and care notes), a vet-visit timeline, reminders with completion/undo and calendar-file export, demo JSON export/reset, local photo selection and four prepared portrait styles. Proposed A$4.99/month or A$39/year pricing is a customer-testing hypothesis. Studio credits would be separate; no credit price is set.

This is a concept, not a paid care service. Records are fictional and stored under a separate browser key. Storage failures remain visible, preserve session edits and offer export; corrupt saved records are left untouched until reset. Uploaded photos stay in the tab, are not persisted or uploaded, and are not transformed by this preview. Artwork is labelled as a fictional sample border collie; users can explore astronaut, royal, watercolour and cartoon styles and download a selected sample. Accounts, cloud backup, family sharing, phone notifications, payments and live AI generation are not connected. Calendar export creates all-day events without pretending Mucka delivered alerts.

All **54 Node checks and 13 premium browser scenarios passed**. Browser coverage includes saved edits and visit notes, reminders/completion/undo, escaped calendar output, exports, invalid/local photo handling, style selection/sample downloads, keyboard tabs/dialog closure, reset confirmation, blocked storage and corrupt saved data. Layouts were checked at 320, 390, 768 and 1,100 pixels. The 338 KB display artwork is 88.8% smaller than its generated PNG original. No paid image API is called by the prototype.

Catalogue coverage remains **1,080 active products, 973 displayed product photos, 107 photo gaps, 474 supported barcode lookups and 606 unresolved barcode cases**. The pet portrait examples are not catalogue photos. Before building a paid service, test repeat use and willingness to pay, then implement dependable account/storage/reminder services. Payment or sponsorship must not influence food assessments.

## Earlier catalogue checkpoint — 20 October 2026

Testing version **2026.10.20.2** contains **1,080 active products, 973 displayed photos, 107 photo gaps, 474 supported barcode lookups and 606 unresolved barcode cases**. All 115 prior photo gaps received fresh searches. Seven now have reviewed recipe photographs; one missing-photo entry merged into its existing duplicate. A second merge removed an already photographed duplicate. These changes explain the net six additional displayed photos and two fewer active catalogue entries.

Only two confirmed duplicates were merged: SavourLife IDs 189 → 188 and 1013 → 33. Old detail links and saved favourites resolve to the retained products. Original rows remain archived in source and the master workbook. The 34 remaining groups with similar names have pack, species or unresolved-code differences and remain separate. Six catalogue records were corrected, including removal of an Indoor Chicken barcode that belongs to Furball. No new barcode association was enabled.

Seven recipe photographs (IDs 141, 145, 185, 190, 324, 379 and 926) have explicit pictured-pack qualifications. Six are newly sourced originals; one archived photo was restored after correcting food form. Photo matching does not establish the saleable pack, barcode, nutrition or image-use rights. [Current 107 gaps](image-gaps-2026-10-20.json), [dated decisions](../data/catalogue-resolution-2026-10-20.json) and [remaining duplicate review](../data/duplicate-review-2026-10-20.json) retain the evidence limits.

Validation: **54 Node tests** pass, the responsive-image cache regression passes, and all seven photo views load without overflow at 320, 390 and 768 pixels. Existing verified image bytes are reused for identical originals. Both Home and My captures show this version. The earlier scanner/capture browser checks below remain relevant; the owner is testing the physical scanner.

The master Word document and catalogue workbook have been rebuilt with current counts, photos, scanner eligibility, sources and duplicate markers. Older originals are archived. Remaining launch work: resolve the 107 photo/identity cases with better evidence, complete accessibility/device checks, expand sourced label facts, define the supported release catalogue and finish privacy/image-use review. Ratings still require a defensible method.

## Earlier scanner checkpoint — 20 October 2026

Testing version **2026.10.20.1** fixes the main scanner's camera-start cancellation race and adds manual barcode lookup with check-digit validation. Missing camera code, denied permission, absent cameras and busy cameras give recoverable messages. A close/reopen waits for the previous camera to settle; stale callbacks cannot open a product. Escape closes the overlay, keyboard focus stays inside it and returns to Scan, and leaving/hiding the page releases the camera. The same packet can be scanned again immediately. Manual and camera input share the existing exact-product evidence lookup; the unused historical barcode alias map has been removed. Main app and My captures display the same release number.

Validation: 50 automated Node tests, eight main-scanner browser scenarios and 16 saved-capture browser scenarios passed. Browser camera events are simulated; real iPhone permission, camera, native sharing and storage behaviour still need a physical device check. The scanner fallback was visually reviewed at phone width and checked at 320, 390 and 768 pixels. Script: `scripts/test-main-scanner-browser.cjs` (Playwright via NODE_PATH). Prepared for the existing draft PR's testing deployment, not a consumer health-rating launch.

Recounted from the current app: **1,082 products; 967 displayed photos; 115 photo gaps; 474 supported barcode matches; 608 unresolved barcode cases; 13 products with identity-bound starter evidence.** No barcode, photo or scoring coverage was added by the scanner fix.

### Work we can complete without supplier replies

1. Resolve the 115 remaining image/identity cases against the dated worklist, prioritising duplicates, nonexistent pack descriptions and recipe/species conflicts. Do not force a photograph or barcode onto an uncertain listing.
2. Complete accessibility and device checks for search, product details, favourites and captures, including keyboard/screen-reader navigation, small screens, failed images and network interruptions. The scanner checks are one part of this work, not full certification.
3. Expand source-backed label facts from current manufacturer information while keeping company claims separate from exact-recipe evidence. Do not turn a missing supplier answer into a low nutrition score.
4. Define a release catalogue of sufficiently supported products and clearly label remaining research entries. Launch readiness should be measured by reliable behaviour and evidence, not a promise that all 1,082 provisional listings will become verified.
5. Finalise public-facing data/privacy information and confirm image-use rights before broader release. Captures currently save only in the same browser/site, with ZIP backup rather than cloud sync.

### Short owner phone check once the release is live

- Confirm version **2026.10.20.1** on Home and My captures.
- Scan one known bag; cancel and immediately reopen Scan, then scan the same bag again. Confirm the recipe and pack size.
- Type **9392596027556** into the scanner form: it should open Billie's Bowl Adult with Aussie Beef, 20kg. This checks lookup separately from camera reading.
- For an unmatched packet, save its front and barcode photographs, reopen the same browser, then export a ZIP to Files. Send any failure with the displayed version and a screenshot; there is no request to buy or scan a shopful of products.

### Supplier position

SavourLife case 25614 is with quality control; Mars case 10605377 is under review. Neither has supplied the requested nutrition evidence. GS1 confirms the trial has no payment obligation or automatic paid conversion, but requires known GTINs and therefore does not discover unknown barcodes by name. Post-trial rights and query counting remain incomplete. No signup or payment. See the outreach queue for exact message IDs and dates.

The sections below are historical checkpoints and retain their original counts.

## Current testing position — 13 October 2026

[Testing build 2026.10.13.10](https://deploy-preview-2--mucka-prototype.netlify.app/?v=2026.10.13.10) contains 1,082 catalogue products, 474 source-supported barcode lookups and 846 displayed product photographs. The [current image gap list](image-gaps-2026-10-13.csv) has 236 missing or withheld photos. GS1 has received the provisional candidate-GTIN CSV; its reply is still needed to validate those associations and decide on licensed data access. The remaining 608 barcode cases and 236 image cases are separate worklists. Online image review does not prove that a barcode scans to the pictured pack.

The app remains an information/testing preview. The product assessment method and ingredients are still under review, so prior numerical scores remain labelled as unvalidated history. A broad consumer launch should wait for source-backed product identities, image rights where needed, and field scan checks of representative current packs. All 50 automated checks and 16 isolated browser capture scenarios pass for this build; PR 2 remains draft and the public main branch has not changed.

My captures now provides saved drafts, separate packet/barcode/ingredient photos, duplicate-scan recovery and ZIP export/restoration. Storage is local to this browser/device, with visible failure handling. See [capture behaviour, privacy and validation](collector-captures-2026-10-13.md). Real iPhone photo capture and native sharing remain to be checked.

## Earlier update 13 October 2026 round two

Testing version **2026.10.13.3** enables **458** exact-pack barcode associations. This round adds **43** across **20 brands**. **624** listings remain unresolved (291 missing and 333 withheld). All **44 automated tests** and four synchronization checks pass. Existing source conflicts remain withheld. No new physical scans were performed.

[Round-two research and sources](barcode-research-round2-2026-10-13.md). Continue the information preview and targeted pack tests. Full coverage and broader launch readiness remain incomplete.

## Earlier update 13 October 2026

Testing version 2026.10.13.2 has 1,082 products and 415 source-supported barcode matches. This round adds 103 exact-pack online associations across 24 brands and removes six wrong associations. 306 barcodes are missing; 361 recorded codes remain withheld (316 unverified, eight conflicts and 37 malformed/incomplete). No normalized duplicates remain.

The owner reports six successful physical scans: both Leaps & Bounds bags, Advance Lamb & Rice 20kg, Black Hawk Lamb & Rice 20kg, Hypro Chicken & Duck 20kg, and Billie’s Bowl Aussie Beef 20kg. New online matches are not physical scan confirmations.

All 43 automated checks pass. Photos display for 831 products (332 sourced, 499 reviewed older assignments); 251 gaps remain. Starter catalogue evidence still covers 13 selected records. The old scores appear only as unvalidated detail-page history; health rankings and recommendations remain paused.

[Current research and sources](barcode-research-2026-10-13.md) and [testing preview](https://deploy-preview-2--mucka-prototype.netlify.app/?v=2026.10.13.2).

Decision: continue the information preview and targeted pack tests. Full barcode coverage and broader launch readiness are not complete. Production remains unchanged and PR 2 remains a draft.

## Implemented and checked

- At the 22 September baseline, 1,080 catalogue entries had 829 displayed photos (327 sourced and 502 older reviewed assignments). The current 12 October photo and catalogue counts are above.
- 13 identity-bound manufacturer evidence records, up from five. Eight new records: 129, 130, 245, 246, 325, 326, 953 and 1017. New source snapshots were collected on 22 September; the original five retain their own check dates.
- Blackdog Carob Drops ID1080 now has a reviewed 1kg photograph. Catalogue size and barcode remain unverified, and the caption reflects that limit.
- Health scores remain paused. Manufacturer adequacy claims are attributed, not presented as independent certification. Unknown and conflicting fields remain explicit.
- Collector barcode text is escaped before HTML rendering in known/unknown result sheets and the queue. A regression test covers hostile text and confirms the original identifier is preserved.
- Main scanner dependency pinned to html5-qrcode 2.3.8, matching Collector.
- At the 22 September baseline, all 33 Node tests passed and 783 original image files had WebP display derivatives. The current 12 October validation and image counts are above; asset-size reductions remain file-size comparisons, not measured page-load times.

## Work still required before a broader launch

1. Resolve catalogue identities and barcode conflicts, prioritising species, veterinary variants and pack sizes. The complete 251-entry worklist is retained in the completion folder. 23 saved candidates are in the owner review PDF. A tick identifies the intended product; it does not establish a barcode or ingredient match.
2. Expand manufacturer evidence beyond the 13 checked records. The other 1,067 entries must continue showing that ingredients have not been added. Recheck evidence when recipes or product identities change.
3. Resume physical iPhone/Android camera and actual packet matching tests when the owner is ready. Cover known/unknown codes, denied camera permission, repeated scans and conflicting packs. These tests remain deliberately deferred.
4. Confirm permission to use product photography for the intended release. The manifest records public source URLs but does not assert a licence grant.
5. Review privacy and data retention for the intended release. Favourites and captures are local. The previous in-memory Collector queue has been replaced with saved drafts and ZIP backup/restore in 2026.10.13.10; cloud sync and guaranteed storage retention are not provided. See the current capture documentation above.
6. Complete manual accessibility and device checks across primary flows. Current automated tests and a browser spot check are not comprehensive accessibility, security or cross-device certification.

## Matching research outcome

- ID1080: retailer URL calls the item Buttons, but the original pack clearly says Blackdog Carob Drops 1kg; recipe match accepted with pack qualification.
- ID1093: manufacturer confirms the Venison/Wild Boar product exists; retailer candidate is an unlabelled tray of raw food. It cannot visually identify the recipe and is withheld.
- ID557: manufacturer product page found; original pack image requests failed (404/403). No substitute veterinary variant accepted.
- ID1049: older Balanced Life Enhanced Kangaroo sources did not yield an exact accessible product image.
- IDs207 and216: catalogue weights differ from the manufacturer options found. No silent pack-size replacement.
- ID534: inconsistent life-stage wording in the source; ingredient evidence was not promoted.
- Remaining historical research is retained with its original dates. This review does not claim every unresolved entry was freshly researched.

## Owner review

Mucka_Photo_Review.pdf contains 23 unpublished candidates with Correct / Incorrect / Unsure choices, notes and clickable source links. Mark the intended product and any corrected pack size; use Unsure freely. Return the saved PDF for reconciliation.

The full research, original source snapshots, ingredient expansion audit, remaining worklist and fillable-form QA are in Mucka_Review_2026-09-14/Catalogue_Completion_2026-09-22. Main remains unchanged; work is for draft PR #2 and its Netlify preview.

The user asked to see historical scores again. They are visible on product detail pages as “Legacy prototype score — unvalidated.” This is display-only; health-rating badges, ranking and recommendations remain paused pending method review. The number must not be presented as a validated nutrition or health assessment.
