# NBP — Design Guidelines

Design system extracted from the **Narodowy Bank Polski** public website ([nbp.pl](https://nbp.pl)) on **2026-06-24**. These tokens define the visual language for UIs that should feel consistent with the NBP brand.

> Source of truth for tokens: [`assets/design-tokens.json`](../assets/design-tokens.json)

---

## Assets

| Asset | Path | Notes |
|---|---|---|
| Homepage screenshot | [`../assets/homepage.png`](../assets/homepage.png) | Full-page reference capture |
| Logo (wordmark + emblem) | [`../assets/logo.svg`](../assets/logo.svg) | Inline SVG, single-color `#BDAD7D`, viewBox `0 0 205 64` |
| Favicon | [`../assets/favicon.png`](../assets/favicon.png) | Navy tile with gold "NBP" (rendered from original `/favicon.ico`) |
| Design tokens | [`../assets/design-tokens.json`](../assets/design-tokens.json) | Structured token source |

> Note: the original favicon is a binary `.ico` at `https://nbp.pl/favicon.ico`. Network downloads were blocked in this environment, so it was rendered to PNG in-browser. Re-fetch the `.ico` if a binary favicon is required.

---

## Colors

### Brand

| Token | Hex | Usage |
|---|---|---|
| `brand.primary` | `#152E52` | Deep navy — header bar, headings, primary brand surfaces, footer |
| `brand.accent` | `#BDAD7D` | Gold / sand — logo, primary buttons (the "MENU" / call-to-action), highlights, date badges |
| `brand.secondary` | `#4A74B0` | Mid blue — links and secondary ("WIĘCEJ") buttons |
| `brand.error` | `#C8102E` | Errors / alerts (standard government red) |
| `brand.success` | `#2E7D32` | Success / positive states |

### Background

| Token | Hex | Usage |
|---|---|---|
| `background.default` | `#FFFFFF` | Page background |
| `background.light` | `#F7F7F7` | Alternating section bands (e.g. exchange-rate / system blocks) |
| `background.dark` | `#152E52` | Header, footer, dark feature panels |
| `background.overlay` | `rgba(21,46,82,0.6)` | Modal / image overlays |

### Text

| Token | Hex | Usage |
|---|---|---|
| `text.primary` | `#464646` | Body copy |
| `text.secondary` | `#2B2B2B` | Emphasised body text |
| `text.muted` | `#717171` | Captions, metadata |
| `text.heading` | `#152E52` | Headings on light backgrounds |
| `text.link` | `#4A74B0` | Hyperlinks |
| `text.onDark` | `#FFFFFF` | Text on navy/dark surfaces |

### Border

| Token | Hex | Usage |
|---|---|---|
| `border.default` | `#C4C4C4` | Dividers, card outlines |
| `border.input` | `#BFCEDD` | Form-field borders (subtle blue-grey) |

---

## Typography

NBP pairs a **serif** for headings with a **humanist sans-serif** for body text — a classic, institutional, trustworthy combination.

### Font families

- **Headings:** `"Brygada 1918", Georgia, "Times New Roman", serif`
  Brygada 1918 is a contemporary Polish serif; weights 400/500/600/700 (plus italics) are loaded via `@font-face` (TrueType). Headings on nbp.pl use **weight 500 (Medium)**.
- **Body / UI:** `"Libre Franklin", -apple-system, Arial, "Noto Sans", sans-serif`
  Loaded via `@font-face` across the full weight range (100–900). Body uses **weight 400**, nav uses **600**.

```css
@font-face {
  font-family: "Brygada 1918";
  font-weight: 500;
  src: url("/assets/fonts/brygada-1918/Brygada1918-Medium.ttf") format("truetype");
  font-display: swap;
}
@font-face {
  font-family: "Libre Franklin";
  font-weight: 400;
  src: url("/assets/fonts/libre-franklin/LibreFranklin-Regular.ttf") format("truetype");
  font-display: swap;
}
```
Both families are freely available on Google Fonts as a fallback to self-hosting.

### Weight scale

| Token | Value |
|---|---|
| `regular` | 400 |
| `medium` | 500 |
| `semibold` | 600 |
| `bold` | 700 |

### Size scale

| Token | Size | Usage |
|---|---|---|
| `sm` | 13px | Buttons, labels, metadata |
| `base` | 15px | Body text (site computes ~15.5px) |
| `md` | 16px | Lead paragraphs |
| `lg` | 20px | Sub-headings |
| `xl` | 27px | `h1` / `h2` (Brygada 1918, weight 500, line-height 40px) |
| `2xl` | 34px | Hero headings |

### Line height

| Token | Value | Usage |
|---|---|---|
| `tight` | 1.2 | Compact labels |
| `base` | 1.55 | Body copy (24px on 15.5px) |
| `heading` | 1.48 | Headings (40px on 27px) |

---

## Spacing

Based on a **4px** unit:

| Token | Value |
|---|---|
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 20px |
| 6 | 24px |
| 7 | 28px |
| 8 | 32px |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `none` | 0px | Flush sections, image bands |
| `sm` | 2px | Subtle chips / tags |
| `md` | 4px | **Buttons** (primary & secondary) |
| `input` | 6px | Search / form fields |
| `full` | 999px | Pills |
| `circle` | 50% | Date badges, icon buttons, avatars |

The overall feel is **low-radius and restrained** — NBP uses sharp-to-slightly-rounded corners, never heavily pill-shaped UI.

---

## Components

### Header
- Background: `#152E52` (navy), text `#FFFFFF`.
- Contains the gold NBP logo (left), search field, and a gold **MENU** toggle.

### Navigation
- Top-level items: `#152E52`, **weight 600**, **UPPERCASE**.
- Dropdown items: weight 400, normal case.

### Buttons

**Primary (call-to-action / MENU)**
- Background `#BDAD7D`, text `#152E52`
- Padding `12px 27px`, radius `4px`, font 13px / weight 500, UPPERCASE

**Secondary ("WIĘCEJ" / more)**
- Background `#4A74B0`, text `#FFFFFF`, 1px border `#4A74B0`
- Padding `6px 12px`, radius `4px`, font 13px / weight 500, UPPERCASE

### Inputs
- Background `#FFFFFF`, border `1px solid #BFCEDD`, radius `6px`
- Padding `10px`, text `#464646`, font 15px

### Sections
- Content is organised in alternating bands: white (`#FFFFFF`) and light grey (`#F7F7F7`), plus occasional full navy (`#152E52`) feature panels.

### Badges
- Circular (`50%`) gold date/event badges in calendar/event modules.

---

## Logo Usage

- The logo ([`logo.svg`](../assets/logo.svg)) is a single-color **gold (`#BDAD7D`)** lockup: the circular NBP emblem followed by the "NARODOWY BANK POLSKI" wordmark, on a `0 0 205 64` canvas.
- Primary placement is on the **navy header** (`#152E52`), where the gold provides strong contrast.
- On light backgrounds, recolor the SVG `fill` to `#152E52` (navy) for sufficient contrast, or keep gold only over dark/imagery surfaces.
- Preserve clear space around the lockup (≈ the height of the emblem) and never stretch — scale uniformly via the viewBox.

---

## Visual Style Summary

The NBP identity is **formal, institutional, and trustworthy** — the visual language of a central bank. A deep navy (`#152E52`) anchors the brand, paired with a refined **gold/sand** (`#BDAD7D`) that signals heritage and value (an apt nod to a bank). A serif/sans pairing — **Brygada 1918** for headings over **Libre Franklin** for text — balances classical authority with modern legibility. Layouts are clean, generously spaced, and content-dense without clutter, using low corner radii and restrained accent color. The result reads as official, calm, and authoritative rather than playful or trendy.
