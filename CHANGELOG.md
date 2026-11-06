# Changelog

## 2026-11-06 (engagement rings, round 2; favicon and share images)
- Engagement page: live preview removed; drawn diamond shapes replaced with photographs of each cut and photographs of each setting (two generated grids, sliced into tiles); colour added (champagne-to-rose step bar and button, coloured icons for lab-grown/natural/help, how-it-works and consultation icons, soft coloured glow behind the builder); builder centred.
- Favicon set: gold monogram on black (SVG, 16/32/48 ICO, 180 apple-touch, 192/512 PNG) and a web manifest; the old favicon was black-only and vanished on dark tabs.
- Share images: 1200×630 cards for home, engagement rings, clients, about and custom (the old one was a tall portrait crop); og:image width/height set; products keep their own photo.
- Magnific: 130 credits (diamond shapes grid, settings grid).

## 2026-11-06 (engagement rings)
- New `/engagement-rings` page, separate from `/custom`, modelled on Rocco's custom ring enquiry and extended: photographic hero, how-it-works with icons, an eight-step builder (shape with drawn diamond illustrations for 11 cuts plus Other, carat, lab-grown or natural, setting with line drawings, metal and US ring size, budget and timing, consultation type with a react-day-picker calendar (no Sundays or past days, next 60 days) and store-hours time slots, details with a review and edit links). A live ring preview updates with every choice. Sends through the same text/email hand-off as the other forms; draft kept on the device. Own title, description and Service schema; in the sitemap, footer and phone menu.
- Magnific: 65 credits (hero image).

## 2026-11-06 (clients page, homepage split)
- `/` is the homepage without the entrance; `/v2` is the same homepage behind the buzz-in storefront door; the earlier film version moved to `/film`.
- New `/clients` page ("Worn by"): hero with three rows of client names sliding against each other over the Lil Baby clip; an index where the piece follows the cursor (thumbnails on phones); a chapter per client (Lil Baby, Young Thug, Richard Ríos, NAV, 22Gz) with the film opening from a slit, a drifting chapter number and a second picture; Lil Mabu listed; a dome gallery of the Drive photos; a custom-piece close. Every name, piece and line comes from JoJo's Instagram captions or the store. Clips cut from the full reels (720p). Linked in the nav, phone menu and footer; in the sitemap with its own title and description.

## 2026-11-06 (round 4)
- Weigh it: the baked-in "0.00" is removed from the scale photo's display; the live reading is seven-segment digits (DSEG7) with faint unlit segments, warped into the display's perspective. The chain is cut out of its satin and rests on the pan.
- Showroom: address, hours and phone in three aligned columns (label, value, note, action).
- Who wears it: centred block, equal margins.
- Films re-cut from the 4K originals at their original start points (Danny Phantom opens on the pendant again; R money opens on the pendant, sharp); posters are each film's exact first frame. Safari gets the MP4 and loops reliably; an end-of-clip guard restarts any browser that stalls.
- Entry door locked as approved.

## 2026-11-06 (round 3)
- Hero gate rebuilt on a photograph of a Diamond District storefront (wide for desktop, tall for phones): the two glass doors are cut from the photo and hinge open over the doorway, "JoJo The Jeweler" glows on the sign band, the buzzer sits on the jamb (desktop) or over the photo's intercom (phone). Same press-only entry and zoom-through.
- Weigh it uses a photograph of a jeweler's scale: the chain lands on its pan and the grams read on its own LCD.
- Films re-encoded from the 4K Drive originals: 1920-tall for desktop, 1080-tall for phones (no more pixelation on big screens); posters are the first HD frame.
- Who wears it: J pendant leads as a looping clip; every tile now comes from the full reels or the 4K film instead of 640px thumbnails.
- About: two films side by side in "How a piece gets made", steps below, less dead scroll; watch section uses the sharp product photo; FAQ opens and closes smoothly and is centred on desktop; "Started at fifteen" text and photo closer.
- Footer email field has a border. PDP supporting copy about 0.75× body size.
- SEO: per-route title, description, canonical, robots, Open Graph/Twitter and JSON-LD (JewelryStore, WebSite search, Product + breadcrumbs, CollectionPage, FAQPage, Service), written live and as static HTML per route at build (scripts/seo-pages.mjs); headings read as words; heading levels fixed; sitemap lastmod; /lab, /v2, /checkout kept out of the index.
- Magnific: 195 credits (3 images × 65: storefront wide, storefront tall, scale).

## 2026-11-05 (direction A, "Ice is light")

### Performance and compatibility
- Homepage video on load cut from about 44 MB to 2.7 MB: the four films re-encoded for background playback (6–12 MB down to 2.6–3.7 MB each, no visible loss), and every video except the one at the top of a page now downloads nothing until it is about a screen away.
- Every WebP image has a JPG (or PNG with transparency) copy; browsers without WebP (Safari 13 and older) are detected once and get those instead. Videos ship WebM with an MP4 fallback.
- Gate: the original entrance is kept (display windows, doors swinging in, zoom through into the hero). It runs smoother: the glass is a static frosted light instead of a live blur of the film, the doors and storefront sit on their own GPU layers, the door layers are prepared during the buzz, the cursor light rests while the gate is up, and the film waits on its first frame until you're through.

### Changed
- Direction A chosen in /lab: the page is true black and the jewellery is the only light. Light, wide display type; champagne only on the action; the custom-process field is dark now, so the site is one black world. A soft light follows the cursor, and product cards stay dim until pointed at (both switchable).
- Homepage hero: the street entrance of the store. Granite front, backlit "JoJo The Jeweler" fascia with the brass 3, steel-framed glass doors with gold-leaf lettering and the hours, lit display windows either side with real pieces, and an intercom (camera, speaker, red LED, brass buzzer). The page doesn't scroll until the buzzer is pressed: the LED turns green, the lock rattles, the doors swing in and you walk through onto the hero film as the headline rises. Once per session; skipped for reduced motion.
- Product photos colour-graded to one look (`scripts/grade-products.py`): satin matched to the same depth and neutral tone; originals kept in `content/media-originals/products`.
- "Price your Cuban" replaced by "Weigh it": the Miami Cuban drops onto a 47th Street gold scale whenever an option changes; the green display counts the grams and the price rolls up. Metal recolours the chain, width sizes it, add to bag from there.
- Removed the line under "Who wears it".
- Design controller v2 (dev or `?design=1`): five themes in the A family (Ice, Champagne, Platinum, Rose, Daylight), five font pairs, sliders for heading size, body text, heading letter-spacing, section spacing, page margins and corner radius; cursor light, card dimming, photography treatment (natural, high contrast, mono), film grain and motion (full, calm, still). "Copy this look" makes a link that opens the site with those settings.
- /lab: previews for choosing the direction, hero and the "Price your Cuban" replacement.

## 2026-11-05 (review round 2)

### Changed
- Units: every CSS length is now rem (media queries in em; 1–2px hairlines stay px), so the layout scales with the browser's base font size. Type scale reduced and made more gradual: display tops out at 6.5rem (was 11rem), h1 5rem, h2 3.5rem, so MacBook-width screens no longer get 140px headlines.
- Phone menu: one "Shop" section (open by default, collapsible) lists every category with counts and two category pictures; Custom, About, Contact below; wishlist, search, Instagram and the phone number underneath.
- Homepage order: hero → shop by piece → price your Cuban → the pieces → custom work → who wears it → showroom. Each section is sized to one screen (svh). Custom work is a swipe rail on phone; on desktop its intro stays pinned while the films slide past. "Who wears it" is a swipe rail on phone.
- Images: product photos ship an 800px copy for phones (srcset), and any image that fails to load is retried once, then hidden instead of showing a broken icon.
- Product page: choosing a metal recolours the photo (also on cards via the metal dots, in quick view, the Cuban builder and the bag), with a note saying which metal the photo really shows; pages open on that metal. Sample star ratings on the product title and cards, and a sample reviews section, all labelled sample (`SAMPLE_REVIEWS` in `src/data/reviews.ts` hides them).
- About: the V2 monogram shutter opens onto JoJo's reel; "15" scrubs in beside the story; counters for the facts; two rows of photographs move against each other with the scroll; the three custom steps are drawn by a line that fills as you read; the watch picture opens from the centre.
- Custom: three-step inquiry (the piece, the idea, you) with a review screen: piece type, metal, karat, stones, size or measurements, the idea, reference photos, text on the piece, budget range, needed-by date and occasion, name, phone, email, Instagram and preferred contact. Sends a formatted text (or email once `VITE_CONTACT_EMAIL` is set); draft kept on the device.
- Contact: rebuilt with the number as the headline, the current New York time against store hours, Text / Call / Instagram DM / Directions, a topic-based form (with a watch field for selling), a map, store facts, and the store's four-step sell-a-watch process.
- Tests: Firefox and WebKit projects; new tests for the metal preview, reviews, phone menu, homepage order, custom and contact forms, About, and image retry.

### Fixed after a blind QA pass (an agent given only the URL)
- Checkout no longer dead-ends on the locked Shopify store: `/checkout` collects name, phone, delivery or pick-up and a payment preference and sends the order to JoJo as a text (or email). With the Storefront API connected it hands straight to Shopify checkout. "Buy now" adds the piece and goes there.
- Forms (custom, contact, checkout) never claim a message was sent: the visitor's own app sends it, and the panel offers copy, Instagram DM and call as fallbacks; on a desktop it shows the text to send from a phone. Phone numbers and dates are validated.
- Shop: price filter keys fixed (checkboxes and counts were wrong), zero-result message spans the grid, unknown collections show the 404.
- Keyboard: bag drawer, phone menu and filter sheet keep focus inside, close on Escape and hand focus back; option pills and metal swatches move with the arrow keys. Escape during the add-to-bag animation stops the drawer opening; the animation is shorter.
- Safari: the 3D carousel no longer shows card backs (dimming is an overlay, cards facing away are hidden). Firefox: hero headline holds two lines.
- About anchors (/about#shipping …) land on the section after the pinned chapters measure. The PDP size guide opens in a dialog instead of leaving the page.
- 320px: wordmark hides under 352px so the bag icon stays clear; contact number scales down.
- The V2 3D chain falls back to a photograph without WebGL; a render error now shows a recovery page instead of a blank screen.
- Copy: sample notes reworded for customers, not developers; newsletter no longer says "On the list" when nothing is sent; spec label "Material"; absolute og:image; plural on the bag label; minus disabled at quantity 1; sticky add bar no longer covers the footer on phones; nav keeps a soft scrim over bright footage.

## 2026-11-04 (review round 1)

### Changed
- Nav: desktop is now Shop · Custom · About on the left, the wordmark, and search / wishlist / bag. Shop opens a category panel on hover (or click/keyboard) with counts and three category pictures. Contact lives in the footer and the phone menu.
- Homepage order: hero → shop by piece → the pieces → price your Cuban → custom work → who wears it → showroom.
- Shop by piece is a 3D ring carousel (`src/components/Carousel3D.tsx`): drag, swipe, arrows or arrow keys; side cards come to the front on click; the front card opens the collection.
- "Started at fifteen" moved from the homepage to About, after the hero ("Meet JoJo", the store's own label).
- Custom page: the inquiry form is the first thing on the page, beside the Sp5der film; process and the other three pieces follow.
- Copy on and beside pictures checked against what each one shows: hero caption names the piece, photo alt text no longer guesses who is pictured, no unverified claims ("filmed on 47th Street", "this year", "the block the industry buys from" removed).

## 2026-11-04

### Added
- Project bootstrapped from the Waves storefront boilerplate (Vite, React 19, TypeScript, Tailwind v4, GSAP + Lenis, react-router).
- Asset pipeline: `scripts/collect-assets.mjs` (password-protected Shopify store export + Google Drive folder → WebP/MP4/WebM), `scripts/fetch-instagram.mjs` (Bright Data), both runnable locally or in GitHub Actions.
- Client assets archived in the repo: traced monogram, 10 lifestyle photos, 4 custom-piece films (4K → 1080p 14s loops with posters and stills), store reel and 22 Crew photos, 12 Instagram posts and 5 highlight covers from the profile record.
- Centralised catalogue layer (`src/data/types.ts`, `catalog.ts`, `shopify.ts`, `scripts/build-catalog.mjs`) with Storefront-API-shaped types and a cart permalink checkout.
- Sample catalogue of 21 products / 1,231 variants (`scripts/sample-products.mjs`), every one tagged `sample`.
- Homepage V1 (`/`): film hero, shop tiles, tabbed best sellers, pinned horizontal custom-work chapter, live Cuban price builder, Instagram proof with verified captions, story, showroom.
- Homepage V2 (`/v2`): monogram shutter opening, width wall, drag-to-rotate procedural 3D Cuban (three.js), full-screen piece films, typographic client index, shop rail, close.
- Shop/collection with URL-backed filters and sort, PDP (gallery, variants with sold-out states, quantity, add to bag with fly-to-bag, buy now, sticky bar, specs, related, recently viewed), custom inquiry, about (facts, gallery, watches, policies, FAQ), contact, search, cart, wishlist, 404.
- Five live themes and a design controller (dev builds, or `?design=1`).
- Playwright suite (`tests/storefront.spec.ts`) and a QA GitHub Action.

### Credits spent (accountability)
- Magnific `images_generate`, auto mode, 4:5: **23 images × 65 = 1,495 credits** for the sample product photography in `public/media/products/`. No video, upscales or other paid calls. Balance before: 45,413.
- Bright Data: 26 records returned on the Instagram run (profile OK with 12 embedded posts; reels/posts discovery came back as crawler errors). Re-run the Action to retry.
