# مركز إقرأ التعليمي — Iqra Educational Center

A one-page Arabic (RTL) landing site for Iqra Educational Center.
It is plain **HTML + CSS + vanilla JavaScript**: no framework, no build step, no backend.
The booking form emails each request through **[Web3Forms](https://web3forms.com)**, so the site runs as-is on **GitHub Pages**.

## Project structure

```
/index.html          ← the page (all sections + booking form)
/css/styles.css      ← styles (brand colors as CSS variables at the top)
/js/main.js          ← mobile menu, active nav link, payment link config, form submission
/assets/             ← logo.svg, favicon.svg, ornaments (pattern/divider/corner .svg)
/assets/icons/       ← app icons (apple-touch-icon 180, icon 192/512, maskable 512)
/assets/images/      ← hero + gallery photos
/favicon.ico         ← 16/32/48/256 px logo icon (tabs, bookmarks, Windows shortcuts)
/site.webmanifest    ← name + icons used when the site is installed / saved to desktop or home screen
/.nojekyll           ← empty; tells GitHub Pages to serve files as-is
/README.md
```

All asset paths are **relative** (no leading `/`), so the site works under a project subpath such as `https://<username>.github.io/<repo>/`.

## Before you publish: configuration

### 1. Web3Forms access key (required for the booking form)

1. Go to <https://web3forms.com>, enter the email address that should **receive** booking requests, and click **Create Access Key**.
   The key (a UUID like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) arrives at that inbox. The free plan needs no account and no credit card.
2. Open `index.html`, find this line inside `<form id="booking-form">` and replace the placeholder:

   ```html
   <input type="hidden" name="access_key" value="PUT-YOUR-WEB3FORMS-KEY-HERE">
   ```

3. Commit and push. Every submission now arrives by email at the address tied to the key.
   This is why no server is needed and why the form works on GitHub Pages.

Notes:
- The access key is designed to be public; Web3Forms only ever sends to the email address registered with it.
- Optionally, in the Web3Forms dashboard, restrict submissions to your site's domain.
- Until a real key is set, submitting shows the Arabic error message and logs a reminder in the browser console.
- Spam protection: a hidden `botcheck` honeypot field is included.

### 2. Payment link

Open `js/main.js` and set the payment URL in the `SITE_LINKS` object at the top:

```js
var SITE_LINKS = {
  payment: '#'    // «ادفع الآن» button in the header
};
```

While it is `'#'` the button is a harmless placeholder: clicking it does nothing. A real URL opens in a new tab.
The WhatsApp button already points to `https://wa.me/970595112532`. The phone number is in `index.html` (`tel:+970595112532`).

## Preview locally

Double-click `index.html`, or serve the folder (closer to how GitHub Pages behaves):

```bash
python -m http.server 8000
# then open http://localhost:8000/
```

## Deploy to GitHub Pages

1. Create a **public** repository and push these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Iqra Educational Center website"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
2. In the repo go to **Settings → Pages → Build and deployment**:
   Source **Deploy from a branch**, then Branch **main** / **/(root)**, then **Save**.
3. The site goes live at `https://<username>.github.io/<repo>/` within a minute or two.
4. Keep all asset paths **relative** so they resolve under that subpath. The `.nojekyll` file stops Jekyll from processing the site.
5. *(Optional) Custom domain:* add a file named `CNAME` at the repo root containing just your domain (e.g. `iqraa.example.com`).
   Then point DNS to GitHub Pages (a `CNAME` record to `<username>.github.io` for a subdomain, or GitHub's `A` records for an apex domain) and enable **Enforce HTTPS** in Settings → Pages.

## Editing content

- **Text:** all copy lives in `index.html`, one commented block per section (Hero, About, Why us, Programs, VIP card, Gallery, Contact, Footer).
- **Colors:** CSS variables at the top of `css/styles.css` (`--green-900`, `--green-800`, `--gold`, `--gold-light`, `--amber`, `--cream`, `--cream-2`, `--text-dark`, `--text-cream`).
- **Images:** replace the files in `assets/images/` (keep the names, or update the `src`). Recommended sizes are 900×1100 for the hero and 800×600 for the gallery.
  Update each image's Arabic `alt` text to describe the new photo.
- **Footer year:** set automatically from the visitor's clock.

## Site icon (favicon / desktop & home-screen icon)

The logo mark (open book + pencil on dark green) is used everywhere the site is saved:

| Where | File |
|---|---|
| Browser tab, bookmarks | `assets/favicon.svg`, `favicon.ico` |
| Chrome / Edge: **⋮ → Cast, save and share → Install page as app / Create shortcut** (desktop) | `site.webmanifest` → `assets/icons/icon-192.png`, `icon-512.png` |
| Android: **Add to Home screen** | `site.webmanifest` → `assets/icons/icon-maskable-512.png` |
| iPhone / iPad: **Share → Add to Home Screen** | `assets/icons/apple-touch-icon.png` |

Browsers cache icons aggressively. After changing them, hard-refresh (Ctrl+F5) or remove and re-add the shortcut to see the new one.

## Image credits

Photos are from [Unsplash](https://unsplash.com) under the [Unsplash License](https://unsplash.com/license): free for commercial use, no attribution required.
Source photo IDs:

| File | Unsplash source |
|---|---|
| `hero-library.jpg` | `images.unsplash.com/photo-1481627834876-b7833e8f5570` |
| `gallery-1-bookshelves.jpg` | `images.unsplash.com/photo-1507842217343-583bb7270b66` |
| `gallery-2-open-books.jpg` | `images.unsplash.com/photo-1456513080510-7bf3a84b82f8` |
| `gallery-3-classroom.jpg` | `images.unsplash.com/photo-1588072432836-e10032774350` |
| `gallery-4-online-learning.jpg` | `images.unsplash.com/photo-1501504905252-473c47e087f8` |
| `gallery-5-learning-basics.jpg` | `images.unsplash.com/photo-1503676260728-1c00da094a0b` |
| `gallery-6-study-group.jpg` | `images.unsplash.com/photo-1522202176988-66273c2fd55f` |

The logo (open book + pencil), icons and geometric ornaments are original SVGs made for this project.
Fonts: [Tajawal](https://fonts.google.com/specimen/Tajawal) with [Cairo](https://fonts.google.com/specimen/Cairo) as fallback, via Google Fonts (SIL Open Font License).
