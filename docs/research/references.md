# JoJo The Jeweler — Reference Research

Date: 2026-11-04. Method: WebFetch (rendered text) + raw HTML via curl for theme/font/colour tokens. No browser, so hover/motion notes are inferred from markup (two-image cards, slider controls, video assets) and flagged where inferred. Sites that blocked fetching (Eliantte, Veert NYC, Shyne, Aporro, Martine Ali, Pricci, Sova, Sasai, Oberig) are listed at the end with what is publicly known.

Legend: **S** = strong, **W** = weak.

---

## 1. Primary references

### 1.1 Mavani & Co — mavaniandco.com (client likes)
- **Platform**: Shopify, theme **Prestige 11.4.1** (Maestrooo). Store id 60921905325.
- **Nav**: Logo left; Watches / Jewelry / Merch / Events / Services / About us; Login, Search, "Cart (0)". Watches = brand-grouped mega menu (Rolex 15 sub-collections, Patek 3, AP 2, Richard Mille, Cartier). Jewelry mega = "Exclusive Collections" (The Mavani Collection, Horoscope) + "Shop by Category" (Bracelets, Chains, Custom, Earrings, Pendants, Rings) + Women's/Men's. Mobile = slide-out drawer with accordions. Announcement bar still reads placeholder "Announce something here." (W).
- **Hero**: Prestige slideshow, 4 auto-rotating 1080p looping video clips with thumbnails; headline "Masterpieces, Handcrafted for You."; CTAs "Explore Collection" + "DESIGN YOUR PIECE"; each slide captions a custom piece ("Custom Jesus Piece", "Custom Cross Chain") with "Inquire for Purchase". **S**: video-first, custom-work-first positioning. **W**: no price anchoring.
- **Section order**: Hero video slideshow → "For Him" product carousel → "FOR HER" carousel → brand shortcut tiles (Patek / AP / Richard Mille "shop now") → "FEATURED TIMEPIECES" carousel → image-only promo banner → 4-icon value strip (Free delivery worldwide / Satisfied or refunded / Top-notch support / Secure payments; body copy still placeholder "Short content about your store") → "Trusted by Our Clients" review carousel (4.9/5, 256 verified reviews, 8 quotes "Daniel R", "Sophia L.") → footer.
- **Category presentation**: none on home beyond carousels; categories live in mega menu only (W).
- **Product card**: Prestige card, square-ish 1:1 image, second image on hover (two images in markup), title, "Add to cart" ghost button, "Sale price $65,000.00". No compare-at, badges or swatches. Some watch cards show "$0.00" (W).
- **PDP** (Mini Diamond Cuban Link, $7,500): 2 images with zoom + prev/next, no video; no variants; quantity stepper + single "Add to cart"; no sticky bar; share row; 4 trust rows (placeholder copy); **spec table** instead of accordions: Retail price, Gender Unisex, 7.50 ct, 14k yellow gold, G colour / SI clarity, chain 6.50mm wide x 22" long, 62 g (**S** — exact spec table is the right pattern for heavy chains); "This item comes with Mavani & Co's 14-day warranty."; "You may also like" 4 cards (one with compare-at $8,599.99 → $7,999.99); "Premier Timepiece Selections" 18-watch carousel.
- **Social proof**: review carousel 4.9/5; no celebrity block; Instagram/X links (ericdajeweler) in footer.
- **Editorial**: none on home; "Gallery" page in nav.
- **Typography** (from font files): headings **Montserrat 500, uppercase, 0 letter-spacing**; body **Nunito Sans 400/400i/700i**; Lato and Josefin Sans also loaded (legacy). Scale not exposed; Prestige default h1 ~ 48–56px desktop.
- **Palette**: scheme tokens: text `rgb(28 28 28)` on white and white on black; accent gold `#fed57b` used for icons; Trustpilot green `#00b67a`; black/`#121212` dark sections. Black + white + soft gold.
- **Motion**: slideshow autoplay/crossfade, carousel prev/next, hover image swap (Prestige default fade), newsletter popup on load.
- **Footer**: Main menu column; INFO column (FAQ's, Privacy, Refund, Contact, Ownership and Trademark); newsletter "Subscribe to receive updates, access to exclusive deals, and more."; X + Instagram; country selector; PayPal + Venmo icons only; "© 2026 - Mavani & Co."
- **Verdict**: **S** video hero, custom-first CTAs, spec table, "For Him / For Her" split, review carousel. **W** placeholders everywhere, no financing, no category tiles, no celebrity proof, thin footer payments.

### 1.2 Miami Cuban Link — shopmiamicubanlink.com (client likes; built by Waves)
- **Platform**: Shopify, theme **Spotlight 12.0.0** (Dawn family), customised ("cutom-shopify-theme"). Store 69311267045.
- **Nav**: utility row Log in / Cart / Search / Instagram; text wordmark "Miami Cuban Link"; Home / Shop / Custom Jewelery / Bridal / About / Contact / Portfolio / Financing. Shop = dropdown with 3rd level under Chains: All Chains, Diamond Chains, Miami Cuban Links, **10K, 14K, 18K Cuban Chains** (karat-as-navigation — **S**, reuse). Financing menu = Acima + Synchrony. Cart drawer (Dawn style). No announcement bar.
- **Hero**: looping .mov video; "Discover the Pinnacle of Luxury Jewelry"; one CTA "Shop Now" → /collections/all.
- **Section order**: Hero → unlabelled 4-ring carousel ("View all" → Rings) → "Our Newest High Jewelry Collection" with designer quote ("I try to make everything look as if it were growing, uneven, at random, organic, in motion.") + "Custom Jewelry" link → two unlabelled promo images → "The Miami Cuban Link Icons" 4-product carousel → "Shop by Category" 5 image tiles (MCL Chains, Bracelet, Pendants, Earrings, Grillz) → "MCL GEMS" 3-post blog carousel → footer.
- **Product card**: Dawn card, two images (primary/secondary hover), title (Title Case: "14k White Gold 2ct Diamond Heart Necklace"), "Regular price / From $4,500.00", empty unit-price markup, no badges/swatches/stars. Collection page: only Availability filter, 37 products, 24 per page (W — no karat/width/length facets despite a karat-driven catalogue).
- **PDP**: blocked (client_error) — assume Dawn/Spotlight default: thumbnail-left gallery, pill variants, sticky ATC on mobile.
- **Financing**: Acima + Synchrony (lease-to-own + credit) in nav only — no price-level messaging (W).
- **Warranty**: none on page; meta copy says "last a lifetime".
- **Social proof**: none (no reviews, no celebs). Instagram link only. Blog posts dated Dec 2024 (stale).
- **Typography**: `--font-heading-family: Montserrat` / `--font-body-family: Montserrat` (n4/n7/i4/i7); **Vollkorn** serif forced with `!important` for display headings; **Bebas Neue** forced on at least one element; Poppins once. Three competing families = **W**.
- **Palette**: scheme tokens `--color-background: 0,0,0` and `255,255,255`; buttons black, white, **gold `rgb(235,174,42)` (#EBAE2A)** and deep green `rgb(30,56,50)` (#1E3832). Text `#111111`, greys `#f3f3f3/#828282`. Black + white + warm gold + forest-green accent.
- **Footer**: logo + "Most Popular" (Jewelry, Custom Jewelery, Diamond Chains, Gold Chains, Watches — 3 links point at the myshopify domain, W), Policy Statements, Contact (email, 1-855 number, Hialeah FL address), "Join our e-mail list", Instagram, country selector, "Built by Waves © 2026".
- **Verdict**: **S** karat-level nav, grillz as first-class category, video hero, designer-quote block, 5-tile shop-by-category. **W** generic Dawn cards, no social proof, no facets, mixed fonts, broken slugs ("…heart-necklace-copy").

---

## 2. Hip-hop / street-luxury competitors

### 2.1 Icebox — icebox.com (Atlanta)
- Shopify **Dawn 15.4.1**, heavily customised. Font: **Montserrat** everywhere (n3–n7). Palette: white base, `#140F0F` near-black, accent burgundy `#710F36` and navy `#194180`; dark scheme `rgb(18,18,18)`.
- **Nav**: top utility "Icebox Concierge · Chat, Call, or Text (404) 842-0266" + country; Men / Women / Bridal / Watches / Leather & Accessories / Custom Jewelry / About. Men/Women = multi-column mega menu with categories + **price tiers "Under $1,500 … $10,000+"** + featured links; "Trending searches" list in search (**S**).
- **Hero**: video with poster; "Designed to Stand Out."; CTAs "Shop men" / "Shop women".
- **Order**: Hero → in-store sale banner → collab feature "Icebox X Adidas X Anthony Edwards" (CTA "Icebox Archive") → "Shop Our Favorites" **tabs: Best Sellers / Ready to Ship / New Arrivals / Under $1,500** → "Popular Categories" with Women/Men toggle (tiles) → "The World's #1 Custom Jewelry Brand" (CTA "Get Started") + 3 cards (Bridal, Watches, Leather) → "Shop By Category" tabs (Gold and Silver Chains, Popular Pendants…) → Atlanta Flagship address + map → "Icebox Services" (Financing, Care & Repair, Sell & Trade) → newsletter "Latest from Icebox" → footer.
- **Card**: two-image hover, title, material/stone line ("14K gold, VS diamonds"), "From $1,308", badges **"Ready to ship" / "Custom order"** (**S** — the single most useful badge pair for this category).
- **PDP (Miami Cuban Gold Chain)**: breadcrumb Home › Jewelry › Chains › Gold Chains; modal gallery per variant (front/detail/worn/clasp/back); **Color: Yellow / White / Rose Gold**; **Width ("Size") 1.5mm→18mm with price per step** (1.5mm $1.3k, 4mm $5.2k, 8mm $15.8k, 12mm $38.8k, 18mm $86.3k); **Length 16/18/20/22/24"**; "Ready to ship" tag per option; "ADD TO BAG — $1,308" (price in button) + "CONTACT US"; trust rows "1 Year Warranty / Free Insured Shipping / Lifetime Authenticity Guarantee"; "Ships within 1–2 business days with insured, tracked delivery. All sales are final; eligible items may be exchanged within 14 days."; **length guide** ("16" sits at the base of the neck … 24" mid-chest — the most common length for pendants"; "going one length longer helps a pendant clear a collar"; "Still deciding? Ask a specialist"); specs Metal / Width / Item Weight 5.5g / Chain Style; "Popular Pieces" related.
- **Proof**: celebrity page + Adidas collab; no reviews on home. Financing = service card (no Affirm/Klarna text).
- **Footer**: Services / Support / Our Company / Policies + showroom address, hours, 9 payment icons.
- **Verdict**: **S** best PDP in category (width x length x colour matrix with price per width, length guide, ready-to-ship), tabbed merchandising, price-tier nav. **W** no review widget, hero generic.

### 2.2 Johnny Dang & Co — johnnydangandco.com (Houston, grillz)
- Shopify custom theme ("Johnny Dang - Custom", theme_store_id 2481 base). Fonts: **Playfair Display (headings, serif, italic available) + Inter (body/sub/accent)**. Palette: black `rgb(0 0 0)` sections, off-white `#faf9f6`, pale blue `rgb(225 237 245)`, accent **orange `#FF6200`** (CTA), Judge.me green `#108474`.
- **Nav**: ABOUT US / COLLECTION / CHAINS / DIAMONDS / BRIDAL / CUSTOM / DESIGN / SILVER JEWELRY / GRILLZ / BOOK AN APPOINTMENT; simple dropdowns; account, wishlist, cart, region. No announcement bar.
- **Hero**: autoplay video; "REDEFINING ICED-OUT LUXURY"; CTAs **"Call Us" + "Book An Appointment"** (consult-first, **S** for high-ticket custom).
- **Order**: Hero → "BEHIND THE ICE" video (taglines "Passion Behind Our Creations", "Drip in Diamonds", "Luxury That Trends") → "CUSTOM BLING, CUSTOM FLEX / Create Your Own Custom Ice Pieces" banner → **"Celebs That Choose Us" video testimonials** (DJ Khaled, Drake, Mexican OT) → "Featured Collections" tiles with "BESTSELLER" tags → "Best Sellers" → numbered image gallery → "THE KING OF BLING" founder story (Paul Wall, Travis Scott, Migos, Beyoncé) → newsletter → footer.
- **Card**: SKU-prefixed title "JDWR-043 - 10K SI Honeycomb Diamond Grillz", "Sale" badge, $6,000.00 vs struck $9,900.00; no swatches/stars. Grillz pages blocked; footer has "Adjusting Grillz" support page (**S** — grillz need fit/adjust content).
- **Footer**: Quick Links (incl. Flash Deals, Testimonials, Blogs) / Support / Customer Care (hours Mon–Sat 10–7, address 6224 Richmond Ave).
- **Verdict**: **S** serif+sans pairing, celebrity video testimonials, founder myth, appointment CTA. **W** no financing, no variants on cards, no category tiles.

### 2.3 IF & Co. — ifandco.com (Los Angeles, Ben Baller)
- Shopify **Wonder 2.5.1** (theme_store_id 2684). Fonts: **Inter** (n4/n5/n7) + **DM Sans** (n5/n7). Palette: white `#ffffff`, black `#000000`/`#101010`, warm off-white `#f8f6f3`; buttons black-on-white, CTA black.
- **Nav**: Shop / Company / Contact Us / Custom; Shop = category tree (Chains 10, Pendants 10, Bracelets 6, Rings 6, Earrings 3, Grills 2); mobile drawer with "Shop +" accordion. Announcement bar 2 lines: "Complimentary Shipping on Qualifying Orders" / "Early Black Friday · 20% Off Sitewide · Now through Nov 30."
- **Hero**: looping video; eyebrow "Early Black Friday"; "OUR BIGGEST SALE. EVER."; single CTA "Shop the Sale".
- **Order**: "Every form of fine." text-only category links with "View Collection →" → "The Collection" 4 cards → autoplay video → "Designed in-house. Built to last forever." (CTA "Inquire About Custom") → **"Trusted by" celebrity name strip + stats row "500+ Celebrity Clients / 30+ Years of Craft / Global Recognition" + "As seen in" Harper's Bazaar, Complex, LA Times, GQ** → "Something one of a kind in mind?" bespoke CTA → footer.
- **Card**: name + category label + "From $6,000.00"; **tier naming in title: "(Partially Iced)" / "(Fully Iced)"** (**S** — adopt as explicit tier taxonomy). No badges/swatches.
- **PDP (Gold Atlas Link Chain 4.0mm)**: breadcrumb "Atlas Link Chains · Chains"; main image + 7 thumbnails grouped Yellow/White/Rose; "From $6,000.00"; Gold quality "14K YELLOW GOLD" (copy says 14k or 18k any colour); Length 16–26"; width fixed per product (3.0mm $3,400 / 4.0mm $6,000 / 5.0mm $8,400 as separate products); buttons "Add to Cart", "Request Customization", "Chain Length Chart", "Size Chart"; 6 trust rows (Insured Express Delivery $1,500+ w/ signature, Secure & Flexible Payment "financing options tailored", Client-Focused Support, Made in California, Craft Mastery, Decades of Service "75,000 satisfied shoppers"); accordions About / Item Specifications (placeholder, W) / Shipping & Delivery / Send Your Questions form.
- **Verdict**: **S** stats row + press strip, "Request Customization" secondary CTA, minimal black/white luxury. **W** text-only categories, placeholder specs, no reviews.

### 2.4 GLD — gld.com (Miami, mass-premium)
- Shopify **Debut 17.11.0** (heavily built out). Font **Montserrat** (+ fallback). Palette: `#161616` black, gold `#debe61`, promo red `#c80f2e`, Trustpilot `#00b67a`.
- **Nav**: 3-message rotating announcement ("50% OFF Sitewide code BLACK", "Shop the GLD Gift Guide", "Buy One, Get One FREE code BOGO"); trust strip "Lifetime Guarantee + Fast Free Shipping"; "Official licensee" NFL/NCAA/MLB/NBA row; mega nav Chains / Pendants / Gift Guide / 2 for $99 / Bundles / New Drops / Mens / Womens / Make a Set / Sale / Collabs / Fan Shop / Fine Jewelry.
- **Home**: promo hero ("BETTER THAN BLACK FRIDAY", "Shop All") → Trustpilot "Excellent, 60,089 reviews" → "ARCHIVE SALE up to 60% off" → "Spotted In" → newsletter → footer. Promo-saturated (W for JoJo's tier).
- **Collection /collections/chains** (441 products) — **best facet model in the set (S)**: Color (White 202, Yellow 148, Rose 48, Black Rhodium 24, two-tone), Product Style (Cuban 110, Tennis 85, Rope, Figaro, Herringbone, Franco, Palm, Box…), **Chain Length 14"–32" + Adjustable**, **Product Width "under 4mm / 5–9mm / 10mm+"**, **Iced Product Yes/No**, Price, Occasion (Classic/Casual/Unique/To Stand Out), In stock. Sort incl. "New drops". Card title "Rope Chain in Yellow Gold- 4mm", "from $110", promo badge text, "Restock" badge; "Load more" + Page 1 of 10.
- **Verdict**: **S** facets, Make-a-Set/Bundles, lifetime guarantee header strip, collab/licensing. **W** discount-heavy brand voice.

### 2.5 Frost NYC — frostnyc.com (Diamond District)
- Shopify; theme colour `#212b36`. Nav: MEN'S CHAINS / MEN'S PENDANTS / CHAIN & PENDANT / MEN'S BRACELETS / MEN'S RINGS / WATCHES / LADIES JEWELRY / EARRINGS FOR MEN / CUSTOM + "SELL YOUR JEWELRY AND WATCHES"; multi-level dropdowns with accordion toggles on mobile; phone 888-485-1061 in utility bar.
- **Home**: category link blocks (CHAINS → Men's Gold Chains / Iced Out Chains / Silver Chains / HIGH END CHAINS …) → "Know More About Jewelry" blog (10 posts: "How Much Are VVS Diamonds", "How To Clean a Cuban Link Chain") → **trust badges "Free shipping / Lifetime Upgrade / 1M+ Customers / 4.5 Google Rating"** → About → footer.
- **Financing**: Affirm Financing, ACIMA Leasing, Progressive "NO CREDIT REQUIRED", "All Financing / Leasing Options" page (**S** — three-tier financing ladder is the hip-hop-jewellery norm).
- **Warranty**: "lifetime warranty and lifetime upgrade" (**S** — trade-up language). Footer has "Length & Width Options" page.
- **Verdict**: **S** financing ladder, lifetime upgrade, 5,000 sq ft showroom proof, SEO blog. **W** dated template, text-only home, no hero copy.

### 2.6 JAXXON — jaxxon.com (DTC, plated/bonded)
- Headless (Sanity CMS + Cloudinary; Shopify checkout URLs). Fonts: **DM Sans (variable) + DM Mono** (mono for labels/prices — **S** detail). Palette: `#F8F8F8` light grey base, black, `#0c0c0c`.
- **Nav/announce**: repeating marquee "BLACK FRIDAY SALE — UP TO 55% OFF"; header promo cards ("Build Your Own Chain Stack", "New Youth Bracelets & Sets"); "Find in store"; "Sign in for personalized offers".
- **Order**: Hero (sale) → "Cuban Cross Rope Bundles" → "Shop by Collection" 4 cards → **"Find Your Chain" quiz ("Tell us your style & we'll find the perfect match" → "Start Now")** → "Shop by Category" 7 tiles → **"Worn by the Best" athlete hotspot profiles** (Justin Jefferson, OBJ, Dustin Johnson… each with shoppable hotspots) → "Shop in store" → "Featured in" 9 logos → "OUTLAST. OUTSHINE.™".
- **Card**: two images (product + on-model), title "Cuban Link Chain 8mm", finish subtitle "14k Gold Finish / Platinum Finish / Black Rhodium Finish / 925 Sterling Silver", compare-at $229 → $179, **"$50 OFF" badge**, "New / Sold Out / Only a Few Left / LUXX ✨" labels. Collection filter = chips (Cuban, Rope, Sets, Stacks, Bundle, Iced, Sale, Most Gifted, Figaro).
- **PDP (Cuban 8mm)**: 5 images + 1 video, thumbs left; 3,467 reviews 5.0; $229 → $179 "$50 OFF", "Save $50", **"Pay in 4 installments of $44.75"**, "Traditional retail $350" value anchor; **Chain Length as S (18") / M (20") / L (22" Most Popular) / XL (24") / 2XL (26") with "Start with usual t-shirt size"**; add-ons "Add Matching Bracelet +$49 ($149 value)", "Add Complimentary Engraving"; "Add to Cart" + "Buy Now"; bundle upsell "$120 OFF Cuban Set 8mm $328 → $208"; shipping tiers (Express 2–3 days $4.99, Fastest 1–2 days $24.99, "Order within…" countdown); "30 Day Returns & Exchanges"; **"365-Day Warranty"**, "30-Day Risk-Free Trial", "Fair Pricing"; Details (14k gold bonded to Performance Steel, PVD, 59–63g); "Why You'll Love It" 5 icon cards; "Athletes Choose JAXXON" carousel; review summary + UGC photos; 4 FAQs; 10 related.
- **Verdict**: **S** best conversion PDP (installments, t-shirt-size lengths, bundle upsell, warranty rows, quiz). **W** plated product; discount noise. Borrow mechanics, not tier.

### 2.7 CRAFTD London — craftdlondon.com (DTC)
- Shopify **Prestige 7.3.0**. Font **Montserrat**, headings **700 uppercase, letter-spacing 0.18em** (strongest "street" type setting in the set). Palette black/white, grey `#bebebe`.
- **Announcement**: rotating 5 messages — "Free Shipping When You Spend $125" / "Lifetime Guarantee on ALL items" / "24,000+ ★★★★★ Reviews" / "1 MILLION+ Happy Customers" / "SHIPS FROM THE USA".
- **Nav**: BESTSELLERS / CHAINS / PENDANTS / BRACELETS / RINGS / SETS & GIFTS / COLLECTIONS; mega menu columns **"By Style" / "By Material" / "Bestsellers"** + promo image tile per menu; SETS & GIFTS has "Build Your Own", Occasions, "Gifts Under $50/$75/$100".
- **Hero**: two looping product videos; "The World's #1 Men's Jewellery Brand"; CTAs "BESTSELLERS" / "NEW IN".
- **Order**: "As seen on" (GQ, Complex, Pause, Forbes, The Times) → category tiles "BROWSE A WIDE RANGE OF HAND CRAFTD PIECES" (CHAINS, BRACELETS, RINGS, PENDANTS, GEMSTONES, HATS) → "PICK YOUR OWN SET" (Save when you buy / 80+ sets / Lifetime Guarantee) → trust icons "ELEMENT PROOF / LIFETIME GUARANTEE / 1 MILLION+ CUSTOMERS" → "Essential reads" 3 blog cards → "GIFTED ONCE. WORN FOREVER." → "CRAFTD Nation" newsletter.
- **Collection**: hero copy "A good chain completes your look. It's crisp. Quality. Classic."; **material tabs Gold / Silver / Rose Gold above grid**; filters Color, Product Type, Price, In stock; card title "Cuban (Gold) 8mm", "From $107.99", **row of available lengths 18"–26" above title**, "Save 27%" on sets.
- **Verdict**: **S** rotating proof announcement bar, By Style/By Material menu, material tabs on PLP, lengths-on-card, gift-wrap add-ons ($8.99 Luxury Gift Box "Most Popular"). **W** budget tier.

### 2.8 King Ice — kingice.com (LA, collabs)
- Shopify **Symmetry 7.1.2**. Fonts: headings **Barlow 900 uppercase**, body **Figtree**, Nunito secondary. Palette white/`#333333`, Judge.me green, red `#c20000`.
- Top strip: "DESIGNED IN LOS ANGELES / Buy now and pay later with Shop Pay / Lifetime Warranty on all Jewelry / Fast and easy returns". Mega menu groups Shop / Collections (Crosses, Jesus Pieces, Angel Pieces, Dog Tags…) / Collabs (Death Row Records, Notorious B.I.G., Sonic…) / Culture (Lookbooks, Jewelry 101, Blog, Influencers).
- Hero image "TIME HITS DIFFERENT / MEET THE MELROSE AND SUNSET SERIES / SHOP NOW". Home = stack of collab banners each followed by 5–8 card carousel; "Chains" block with style links Miami Cuban / Rope / Herringbone / Tennis / Franco. Cards: "New arrival", "Sold out", **"3 in stock" scarcity**, "Quick buy". 16,400 verified reviews.
- **Verdict**: **S** Barlow 900 display type, style-link sub-nav under Chains, Culture/Lookbook menu, scarcity badges. **W** carousel fatigue.

### 2.9 Daniel Jewelry Inc — danieljewelryinc.com (Hialeah, solid-gold Cuban specialist)
- **BigCommerce Stencil**. Nav Bracelets / Chains / … / **Shop by Karat (10k, 14k, 18k, 22k, Silver)** / **Gold Calculator** / Blog.
- Home: 4-slide carousel → category tiles with "BUY NOW" (CHAINS, PENDANTS, WATCHES, RINGS, BRACELETS) → "FEATURED PRODUCTS" → "THE LATEST ARRIVALS" → "Join us & Shop Instagram" → "#VogueJewellery".
- Card: "Sale" label, Quickview, vendor, **title pattern "{width}mm Miami Cuban Link {karat} Solid Chain"** ("8mm Miami Cuban Link 14k Solid Chain" Was $17,865 → Now $15,535), MSRP/Was/Now, "Choose Options". Latest arrivals lists silver Cuban bracelets 5→12mm as separate SKUs ($330–$960).
- Collection intro: "74 of the 124 chains are Cuban… widths 1.5mm to 14mm in 10k, 14k, 18k, 22k… 18 to 30 inch lengths… starting at $910 for a 1.5mm 14k Cuban" + gold-calculator link for live gold-rate pricing and trade-in.
- **Verdict**: **S** karat-first IA, width-first titles, gold calculator / trade-in. **W** dated BigCommerce template, no financing, Instagram block unstyled.

### 2.10 Avianne & Co — avianneandco.com (NYC)
- Shopify. Announcement "10% OFF JEWELRY CODE FALL10 / Call Now 1 (332)-244-4038". Mega menus Gold Chains / Men / Women / Rings / … / Custom Jewelry / Lab Made Jewelry / Watches / Press. Hero image "This Holiday Season, Go Bigger", CTAs **"Start Your Custom Piece" + "Shop Best Sellers"**. Order: intro ("For 25+ years… go-to jeweler for artists and athletes") → 8 category tiles "Explore →" (incl. **Cubans** and **Lab Jewelry** as tiles) → Best sellers 8 cards + "SHOW MORE" → **"Built for the Culture" celebrity grid** (Future, Drake, Nicki Minaj, 2 Chainz, Justin Bieber) → Lab Jewelry (CVD, IGI) → Diamond Bracelets → Tennis Chains → Bridal. Cards: "from" price, strike compare-at, "-16% sale … -75% sale" badges, variant leak in title (W).
- **Verdict**: **S** "Built for the Culture" headline + celeb grid, lab-grown as explicit tier, custom-first hero CTA. **W** inconsistent brand age copy, percent badges cheapen.

### 2.11 Trax NYC — traxnyc.com
- Custom platform; 47th St showroom link in header; 12 M/W category blurbs; live stats "18,861 current items / retail value $42.7M"; "Priced by Inquires Only" on custom pendants; "Trax Guarantee". **W** overall (dated), but "priced by inquiry" + live inventory counter are reusable ideas.

### 2.12 Hatton Labs — hattonlabs.com (London, fashion-adjacent)
- Shopify starter theme, **Helvetica Neue Light/Medium** only; palette white/black/`#777777`, gold `#c9b578`. Hero "UP TO 70% OFF / Solid .925 sterling silver jewellery – designed in London". Value strip "DESIGNED IN LONDON / 1 YEAR WARRANTY / FREE SHIPPING / .925 STERLING SILVER" (repeated as closing trust row "100K+ SHIPPED…"). Cards: name, **variant options listed on card (sizes 7–10, lengths 6.5"–8.5", Silver/Gold)**, material line, "£228 £380 40% OFF", badges bestseller / new in / back in stock / "Only 2 Left". Press pull-quotes with artist names (Dev Hynes, Bakar), retailer proof (Selfridges, SSENSE, KITH). **S** fashion-credential proof, options-on-card.

---

## 3. Luxury / editorial benchmarks

### 3.1 Messika — messika.com/en
- **Astro 7.1** (custom, not Shopify). H1 SEO-only; hero = full-bleed campaign image "Move Link: The strength of connection" + "Discover the Move Link Collection". Order: 4 lifestyle category tiles (Bracelets, Rings, Necklaces, Earrings) → "Our selection" 16-card grid → campaign "Irina Shayk Brings Magnetic Intensity" → collection feature "Move Noa" → "E-boutique Benefits" (adviser contact, free delivery/returns, gift box, **"Pay in instalments with Alma"**). **Card: title + 3 metal swatch thumbnails labelled "White gold / Yellow gold / Pink gold" + price (€1,390–€12,900), no badges** (**S** — metal swatches on card is the luxury-correct way to expose colour variants). Footer 5 columns + 7 socials + 13 regions.
### 3.2 Alighieri — alighieri.com (London)
- Shopify custom theme ("Alighieri by Dash"). Palette off-white `#F5F3EF`, black. Headings end with a typographic underscore ("Introducing _", "Delve into the collection_", "Set the tone_") — a cheap, ownable type signature. **Card 4:5 (400×500), product + on-model second image, badges "Made to Order" / "New In", material line "18kt solid gold", size pills S/M/L.** Story block + "Read the story"; bag drawer asks "Is this a gift for someone else?" + personal note. Value props with gold-texture icons.
### 3.3 Shay — shayjewelry.com (LA, celeb fine jewellery)
- Shopify. Top "CONNECT WITH US" panel (WhatsApp, email, concierge phone, appointment). Nav includes **READY TO SHIP**, **HIGH JEWELRY**, **As Seen On**. Home: "NEW IN : ZAR" slideshow → campaign → "BEST SELLERS" → 4 category tiles → GIF → founders' story → blog → service strip "COMPLIMENTARY worldwide SHIPPING / RETURNS & EXCHANGES / PERSONAL CONCIERGE SERVICES / BOOK AN APPOINTMENT". Cards: "NEW ARRIVAL" / "BEST SELLER" badges, "From $28,800 USD". Monochrome logo set. **S**: Ready-to-Ship vs High Jewelry split; WhatsApp concierge.
### 3.4 Urban Jürgensen — urbanjurgensen.com (Next.js)
- Editorial-grade watch site: no prices anywhere; alternating full-bleed product slide (UJ-1 / UJ-2 / UJ-3, uppercase title + tagline + "DISCOVER") with Maison / Articles / History carousels between; artist-portrait article cards; inquiry form with "Model of Interest" dropdown. **S** cadence model for a V2 cinematic home.
### 3.5 AMBUSH — ambushdesign.com (Tokyo streetwear-jewellery)
- Carousel with **category tabs (NEW / OUTERWEAR / … / JEWELRY)** as hero; stacked uppercase banner links ("JEWELRY NEW ARRIVALS"); season archive nav SS15→SS27; "AMBUSH UNIVERSE" playlist block; JA/EN + JPY/USD. **S** archive-as-navigation, playlist/culture block.
### 3.6 Awwwards-tier (not fetchable; from listings): **Floema Jewelry** (Luis Bizarro — WebGL image planes, page transitions, scroll-driven gallery; Awwwards Independent of the Year 2021), **Sova Jewelry House** (SOTD — large-type header, category and product-page inspiration entries), **Sasai Jewelry** (about page inspiration), **Oberig Jewelry** (product gallery inspiration), **Limnia** (3-step modular configurator "select type → base → danglers"). Treat as V2 motion references only.

---

## 4. Category commerce patterns (observed, with sources)

| Pattern | How the field does it | JoJo rule |
|---|---|---|
| Metal colour | Icebox PDP "Color: Yellow / White / Rose Gold"; Messika card swatches; GLD facet Color (+Black Rhodium, two-tone) | 3 swatches (YG/WG/RG) on card + PDP; two-tone as separate SKU |
| Karat | MCL nav "10K/14K/18K Cuban Chains"; Daniel "Shop by Karat" 10/14/18/22k + Silver; Icebox fixed 14K; Frost "14k or 18k, some 10k" | Karat as PDP option **and** PLP facet; 10K entry / 14K default / 18K premium |
| Width | Icebox 1.5→18mm one product, price per step; Daniel + JAXXON + CRAFTD put mm in title; GLD facet buckets <4 / 5–9 / 10mm+ | One product per style with width option; show per-width price; title "Miami Cuban 12mm" |
| Length | 16/18/20/22/24 (Icebox), 18–26 (IF&Co, CRAFTD), 14–32 + Adjustable (GLD facet); JAXXON maps S–2XL to inches + t-shirt-size hint; Icebox body-position guide | 18/20/22/24/26/30"; inline length guide with body-position copy; 30" for pendants |
| Tiers | IF&Co "(Partially Iced)/(Fully Iced)"; GLD "Iced Product Yes/No"; Icebox "VS diamonds" line; Avianne "Lab Made" section; JAXXON "14k Gold Finish" vs "LUXX 925"; Frost "HIGH END CHAINS" | Explicit 4-tier ladder: Solid Gold → Partially Iced → Fully Iced (VS/VVS natural) → Lab-Iced; never sell plated under the JoJo mark |
| Ready vs custom | Icebox badges "Ready to ship" / "Custom order" + lead copy; Shay "READY TO SHIP" nav; Alighieri "Made to Order"; Mavani "Inquire for Purchase"; Trax "Priced by Inquires Only" | Badge pair on every card; "Request Customization" secondary CTA (IF&Co) |
| Bundles | JAXXON Cuban Set / "Add Matching Bracelet +$49"; CRAFTD "Pick Your Own Set / 80+ sets"; GLD "Make a Set", "2 for $99" | "Chain + Pendant" and "Chain + Bracelet" set builder with set discount |
| Financing | Frost: Affirm + Acima + Progressive ladder; MCL: Acima + Synchrony; JAXXON "Pay in 4 installments of $44.75"; King Ice "Buy now pay later with Shop Pay"; Messika Alma | Affirm (prime) + Acima/Progressive (no-credit lease) + Shop Pay; per-unit "as low as $X/mo" under price |
| Warranty | GLD/CRAFTD/King Ice "Lifetime Guarantee/Warranty"; Frost "Lifetime Warranty + Lifetime Upgrade"; Icebox "1 Year Warranty + Lifetime Authenticity Guarantee"; JAXXON "365-Day Warranty"; Mavani 14-day | "Lifetime Craftsmanship Warranty · Lifetime Authenticity Guarantee · Lifetime Trade-Up" trio |
| Trust strip | 3–4 icon rows (Hatton, CRAFTD, Mavani, Frost) | Solid gold stamped · Free insured shipping · Lifetime warranty · Financing available |
| Grillz | JD "Adjusting Grillz" support; MCL grillz category tile; King Ice Grillz nav | Mold-kit flow, top/bottom/teeth-count options, fit-adjust policy page |

---

## 5. Section library (strongest individual sections)

| # | Section | Source | Why it works | Adapt for JoJo |
|---|---|---|---|---|
| 1 | Looping video slideshow hero w/ custom-piece captions | Mavani | Motion + proof of craft in first viewport | 3 clips (12mm Cuban on neck, iced pendant macro, grillz smile); caption "Custom · Inquire" per slide; CTAs "Shop Chains" / "Start Custom" |
| 2 | Rotating proof announcement bar | CRAFTD | 5 trust facts cycle above nav | "Solid 10K–18K gold" / "Lifetime warranty" / "Affirm & no-credit financing" / "Free insured shipping" / "Atlanta/… showroom" |
| 3 | By Style / By Material mega menu + promo tile | CRAFTD, Icebox price tiers | Mirrors how buyers think (Cuban vs 14K vs budget) | Chains menu: By Style (Miami Cuban, Rope, Franco, Tennis, Figaro) · By Karat (10K/14K/18K) · By Width (6/8/12/18mm) · By Price (Under $2.5k … $25k+) · promo tile |
| 4 | Tabbed merchandising row | Icebox "Shop Our Favorites" | One module, four intents | Tabs: Best Sellers · Ready to Ship · New Drops · Under $2,500 |
| 5 | Shop by Category image tiles | MCL (5 tiles), Avianne (8 "Explore →") | Visual, scannable, grillz-inclusive | 6 tiles 4:5: Cuban Chains · Pendants · Bracelets · Grillz · Rings · Custom |
| 6 | Karat / material tabs above PLP | CRAFTD (Gold/Silver/Rose), Daniel Shop by Karat | Reduces facet friction | Tabs 10K / 14K / 18K + colour swatch chips |
| 7 | Product card w/ hover model shot + badge pair + metal swatches | Icebox badges + Messika swatches + Alighieri 4:5 | Says tier, availability and colour before click | 4:5 image, second image on hover (on-neck), "Ready to Ship"/"Made to Order", 3 metal dots, "From $X", "as low as $Y/mo" |
| 8 | Width × Length × Colour PDP matrix w/ per-width price | Icebox | Width is the real price driver for Cubans | Width pills show price ("12mm — $38.8k"); length pills with body-position tooltip; colour swatches |
| 9 | Length guide inline | Icebox + JAXXON | Kills the #1 return reason | Silhouette graphic with 18/20/22/24/26/30 markers; "one longer for pendants" tip; "Ask a specialist" link |
| 10 | Installments + warranty + trial rows | JAXXON | Price objection handled at the button | "Pay from $X/mo with Affirm" · "No credit needed with Acima" · "Lifetime warranty" · "14-day exchange" |
| 11 | Bundle upsell / set builder | JAXXON, CRAFTD, GLD | AOV lift | "Complete the set: + matching 12mm bracelet, save $400" |
| 12 | Celebrity video testimonials | Johnny Dang | Culture proof beats star ratings | 3–4 vertical 9:16 clips, muted autoplay, tap for sound; names + piece |
| 13 | Stats + press strip | IF & Co | Credibility in one glance | "500+ artists · 20 yrs · Made in-house" + 4 press logos |
| 14 | "Worn by the Best" shoppable hotspots | JAXXON | Lookbook that sells | Artist/athlete portraits with hotspot dots → product drawer |
| 15 | Custom process CTA ("Something one of a kind in mind?") | IF & Co, Avianne, JD "Book an Appointment" | Captures the high-ticket lead | 3-step strip Sketch → CAD → Set, "Start Custom" + WhatsApp |
| 16 | Founder / "King of Bling" story | Johnny Dang | Myth-making | "JoJo" portrait, origin, hometown; serif pull-quote |
| 17 | Spec table on PDP | Mavani | Buyers of 60g chains want numbers | Karat · Width · Length · Weight (g) · Stone ct / colour / clarity · Clasp |
| 18 | Trust-icon strip | Hatton, Mavani | Cheap reassurance | 4 icons, 1 line each, no placeholder copy |
| 19 | Flagship / showroom block with map + hours | Icebox, Frost, JD | Local intent + legitimacy | Address, hours, "Book appointment", map embed |
| 20 | Culture menu (Lookbooks, Jewelry 101, Influencers) + archive seasons | King Ice, AMBUSH | Keeps the brand a culture object | "Culture" nav: Lookbook · Journal · Jewelry 101 · Artists |
| 21 | Scarcity/status badges ("3 in stock", "Restock", "Only 2 Left") | King Ice, GLD, Hatton | Urgency without % off | Use on Ready-to-Ship only |
| 22 | Gift / bag drawer upsell | Alighieri, CRAFTD | Attach rate | Gift box, "Add a note", engraving |
| 23 | Alternating full-bleed product slides w/ editorial between | Urban Jürgensen | Cinematic rhythm | V2 only (see below) |
| 24 | Gold calculator / trade-in | Daniel, Frost "Sell your jewelry" | Repeat/upgrade loop | "Trade up your chain" page + estimator |

---

## 6. Recommended V1 homepage (ship-safe, Shopify-compatible)

Type: display **Barlow Condensed 800/900 uppercase** or **Montserrat 700 uppercase 0.14em tracking** (CRAFTD/King Ice lineage) + body **Inter 400/500**; optional serif accent (Playfair Display Italic) for pull-quotes only (JD). Palette: `#0B0B0B` base, `#F5F3EF` paper, gold `#D4AF37`→`#EBAE2A` (MCL) gradient for accents only, text `#1C1C1C` on light (Mavani). Cards 4:5. Max-width 1440, 16px gutters at phone.

1. **Announcement bar** — rotating 5 proof messages (CRAFTD) + utility: phone/WhatsApp, country.
2. **Header** — wordmark centre, mega menu Chains / Pendants / Bracelets / Grillz / Rings / Custom / Culture; menu columns By Style · By Karat · By Width · By Price + promo tile (CRAFTD + Icebox).
3. **Hero** — 3-clip video slideshow, custom-piece captions, CTAs "Shop Cuban Chains" + "Start Custom" (Mavani + Avianne).
4. **Trust strip** — 4 icons: Solid Gold Only · Lifetime Warranty · Affirm & No-Credit Financing · Free Insured Shipping (Hatton/Frost).
5. **Shop by Category** — 6 tiles 4:5 (MCL/Avianne).
6. **Tabbed "The Drip"** — Best Sellers · Ready to Ship · New Drops · Under $2,500 (Icebox), cards per Section 5 #7.
7. **Stats + press** — "500+ artists · Est. year · Made in-house" + logos (IF & Co).
8. **"Built for the Culture"** — celebrity video testimonial carousel (JD) with name + piece; link to As Seen On.
9. **Cuban Builder / set builder teaser** — pick style → karat → width → length, live price; "+ matching bracelet" (JAXXON/CRAFTD/Limnia).
10. **Custom process** — Sketch → CAD → Set, "Request Customization" + "Book Appointment" (IF & Co / JD).
11. **Lookbook hotspots** — "Worn by the Best" 3–6 portraits (JAXXON).
12. **Founder story** — JoJo portrait + serif pull-quote (JD).
13. **Showroom + reviews** — map/hours block beside 4.9★ review carousel (Icebox + Mavani).
14. **Journal** — 3 cards "How to size a Cuban", "VS vs VVS", "Grillz care" (Frost/CRAFTD).
15. **Footer** — Shop / Services (Custom, Financing, Trade-Up, Repairs) / Support (Size Guide, Length & Width, Adjusting Grillz, Shipping, Returns) / Company; newsletter; payment icons incl. Affirm/Shop Pay; address + hours; socials.

## 7. V2 experimental homepage (cinematic / 3D / horizontal)

Stack: React Three Fiber GLB ring/chain viewer (existing Jewlx pipeline), GSAP ScrollTrigger pinned sections, Lenis smooth scroll; fall back to V1 modules below the fold on low-power devices.

1. **Pre-loader** — gold-weight counter ("0 → 62 g") then wordmark reveal (Floema-style transition).
2. **Hero** — full-bleed 3D Cuban link rotating on drag, light rig sweep; headline in 160–200px condensed uppercase; scroll cue.
3. **Horizontal "Width Wall"** — pinned horizontal scroll through 6mm → 8mm → 12mm → 18mm, link scales physically, price and weight count up per stop (Icebox matrix made spatial).
4. **Karat spectrum** — scrub-driven colour shift Yellow → Rose → White on the same model; swatch legend.
5. **Alternating full-bleed product slides** — Cuban / Pendant / Grillz, uppercase title + tagline + "DISCOVER", editorial card between each (Urban Jürgensen cadence).
6. **Celebrity reel** — 9:16 video wall, hover-to-unmute, marquee of names (JD + AMBUSH playlist energy).
7. **Iced-out macro** — pinned video of stone setting with text reveals "VS · VVS · hand-set".
8. **Configurator teaser** — live 3D set builder (Limnia 3-step) with "as low as $X/mo".
9. **Archive** — season/drop list SS24 → FW26 as oversized typographic index (AMBUSH).
10. **Showroom + footer** — map, appointment, WhatsApp; footer as in V1.

Guardrails: keep LCP under 2.5s with poster images, respect `prefers-reduced-motion`, keep all commerce (cards, PDP) on V1 patterns.

---

## 8. Not fetchable (for the record)
Eliantte (server error), Veert NYC (robots), Shyne (robots), Aporro / Martine Ali / Pricci (client error), Sova (sova.ua resolves to a different company; the jewellery site is region-locked), Sasai / Oberig (robots), Awwwards pages (robots), gldshop.com (domain parked → gld.com). Jacob & Co returned only a meta shell (tile colour `#ffc40d`, white theme). Veert.com is a landscaping company — the jewellery brand is veertnyc.com.
