# Favourites and profile update — 14 September 2026

Catalogue favourites now persist across page reloads in the same browser and site. The saved format is a versioned list of catalogue IDs under `mucka.favourites.v1`. Unknown IDs and duplicates cannot create product cards. Invalid or unavailable browser storage is handled without blocking browsing; notices explain when changes are only kept for the visit. Temporary user-entered products are never persisted as catalogue favourites.

The heart exposes its selected state and reports whether a change was saved. Updates in another tab refresh the list, heart and profile count. A product opened from Favourites returns to that list with the detail back button.

The profile now shows Your Mucka, favourites and products viewed during the current visit. Opening details no longer increments the camera-scan count. Fixed personal details, example pets and speculative membership prices have been removed. Pet profiles, accounts and memberships are explicitly unavailable. The existing Collector link remains accessible.

Favourites do not sync across devices, browser profiles or the preview and production sites. Clearing website data removes saved favourites. No account or backend was added.

Validation: all 23 automated checks pass, including persistence across fresh visits, malformed data, unavailable storage, temporary entries, changes from other tabs, return navigation and the earlier catalogue/assessment regressions. Local browser checks confirmed saving and restoring a favourite after reload, the profile count and the 390px layout without horizontal overflow or browser errors.

Product images are a separate tracked workstream. Image availability must be distinguished from a verified match to the exact recipe, species and pack. This update adds no product images or nutritional ratings. Physical packet/camera testing remains deferred.
