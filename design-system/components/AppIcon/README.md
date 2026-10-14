# AppIcon

The app icon: **Clara & Jakob** as two of the sticker characters, waving under the lamp — the Paris one in cobalt with a beret, the London one in postbox red with a bowler. Cream paper, lamp-yellow circle, the same grainy fill as the stickers.

**Files** (in `assets/AppIcon/`, use them as they are — never edit, recolour or crop):

| File | Size | Use |
|---|---|---|
| `apple-touch-icon.png` | 180 × 180 | iPad / iPhone home screen (`<link rel="apple-touch-icon">`) |
| `icon-192.png` | 192 × 192 | manifest, `purpose: "any"` |
| `icon-512.png` | 512 × 512 | manifest, `purpose: "any"`; splash |
| `icon-maskable-512.png` | 512 × 512 | manifest, `purpose: "maskable"` (Android cuts it to a circle or squircle; everything that matters sits in the centre 80 %) |
| `favicon.svg` | vector | browser tab (simplified: flat, no arms, heavier line) |
| `favicon-32.png` | 32 × 32 | browser tab fallback |
| `app-icon.svg`, `app-icon-maskable.svg` | vector | masters for new sizes |

**Rules**
- The PNGs are opaque, full-bleed squares. Don't round the corners and don't add a border — iOS and Android apply their own mask.
- No text in the icon. The home-screen label comes from `apple-mobile-web-app-title` / `short_name`.
- `theme_color` and `background_color` stay **cream-100 `#F4EDDC`**, so the splash matches the icon.
- Small sizes (≤ 48 px) always use the favicon artwork, never a scaled-down master.

**In `index.html`**
```html
<link rel="icon" type="image/svg+xml" href="favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png" />
<link rel="apple-touch-icon" href="apple-touch-icon.png" />
```

**In `manifest.json`**
```json
"icons": [
  { "src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
  { "src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
  { "src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
]
```
