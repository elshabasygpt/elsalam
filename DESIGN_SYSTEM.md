# 🌿 Elsalam Vegetable Oils – Enterprise Design System

**Industry:** Industrial Food Manufacturing (Vegetable Oils, Margarine, Shortening)  
**Market:** Egypt + Middle East + Export Markets  
**Languages:** Arabic (RTL) - Primary | English (LTR) - Secondary  

---

## 🎨 1. Brand Foundation

**Brand Personality:**
- Reliable Strategic Partner
- Innovative & Sustainable
- Industrial Leader

**Visual Direction:**
- **Organic Curves:** Inspired by palm leaves.
- **Industrial Geometry:** Solid, structured, conveying manufacturing strength.
- **Rounded Corners:** Soft, modern approachability.
- **Layered Backgrounds:** Depth representing the complex extraction processes.
- **Curved Section Separators:** Fluidity of oil and continuous production.

---

## 🎨 2. Color System

### Base Colors
| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary | Primary Green | `#2E7D32` | Main CTAs, branding, vital components |
| Primary Dark | Dark Green | `#1B5E20` | Hover states, headers, strong emphasis |
| Accent | Light Green | `#66BB6A` | Success states, secondary CTAs, leaf accents |
| Accent | Golden Orange | `#F4A100` | Warnings, special badges, premium highlights |

### Neutrals & Backgrounds
| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Background | Soft Background | `#F8FAF9` | Main app background, distinct from pure white |
| Background | Light Gray | `#EDEDED` | Borders, dividers, secondary surfaces |
| Text | Dark Text | `#1F2937` | Primary typography, high readability |
| Surface | White | `#FFFFFF` | Cards, modals, primary surfaces |

### Gradient System
- **Primary Gradient:** `linear-gradient(to right, #2E7D32, #66BB6A)` (Usage: Hero backgrounds, special highlights, decorative borders).

---

## 🔤 3. Typography System

**Arabic (Primary - RTL):** `Cairo` (Primary), `DIN Next Arabic` (Alternative)  
**English (Secondary - LTR):** `Inter` (Primary), `Poppins` (Alternative)

### Typography Scale (Responsive)
| Level | Font Size | Weight | Line Height | Usage |
|-------|-----------|--------|-------------|-------|
| H1 | `48px` | Bold | 1.2 | Hero sections, main page titles |
| H2 | `36px` | Bold | 1.3 | Major section headers |
| H3 | `28px` | SemiBold | 1.4 | Card titles, subsections |
| H4 | `22px` | Medium | 1.4 | Small widgets, modal titles |
| Body Large | `18px` | Regular | 1.6 | Hero subtitles, featured text |
| Body Reg | `16px` | Regular | 1.6 | Standard paragraph text |
| Small Text | `14px` | Regular | 1.5 | Metadata, tags, captions, secondary info |

### Typographic Rules
- **Arabic Letter Spacing:** Must be `0` to preserve cursive baseline connection.
- **English Letter Spacing:** Ranging from `-0.01em` (Headers) to `0` (Body text).
- **Alignment:** Rely on CSS logical properties (`text-align: start`) rather than hardcoding left/right.

---

## 📏 4. Spacing System

Based on an **8px base grid system**.

**Scale:**
`4px` / `8px` / `16px` / `24px` / `32px` / `48px` / `64px` / `96px`

**Layout Constraints:**
- **Desktop Container:** `1280px` max-width, center-aligned.
- **Tablet Container:** `1024px` max-width.
- **Mobile Container:** `100%` width with `16px` horizontal padding.
- **Section Spacing:** Use `96px` vertically between major sections on Desktop, `64px` on Mobile.

---

## 🌗 5. Elevation, Shadows & Borders

### Shadow Scale
- **Soft Card (`shadow-card`):** `0 4px 6px -1px rgba(0,0,0,0.05)` — standard product/service cards.
- **Medium Elevation (`shadow-elevation`):** `0 10px 15px -3px rgba(0,0,0,0.1)` — card hover states, dropdowns.
- **Floating Modal (`shadow-modal`):** `0 20px 25px -5px rgba(0,0,0,0.1)` — modals, dialogs, sticky headers.

### Border Radius
- **Small (`6px`):** Buttons, inputs, small tags.
- **Medium (`12px`):** Standard cards, dropdown menus, alert boxes.
- **Large (`20px`):** Featured cards, large image wrappers.
- **Section (`48px`):** For large, leaf-inspired curved section dividers (often applied top-left and bottom-right).

---

## 🧱 6. Component System

### Buttons
- **Primary:** Background `#2E7D32`, Text `#FFFFFF`, Hover `#1B5E20`.
- **Secondary:** Background `#F8FAF9`, Text `#2E7D32`, Border `1px solid #2E7D32`.
- **Outline:** Transparent, Border `1px solid #EDEDED`, Text `#1F2937`.
- **Ghost:** Transparent, Text `#2E7D32`, Hover bg `#F8FAF9`.
- **Disabled:** Background `#EDEDED`, Text `#9CA3AF`, Cursor `not-allowed`.

### Cards
- **Product Card:** Image top (`radius-lg` at the top only). Title, spec text, and Primary CTA at the bottom. Hover: raise `elevation`.
- **Service Card:** Industrial/Organic icon situated logically (top-start). Structured feature list.
- **Team Card:** Circular portrait, centered title & position.

### Forms & Inputs
- **Inputs/Selectors:** Height `48px`, Radius `6px`, Border `#EDEDED`. 
- **Focus Ring:** `2px solid #66BB6A`.
- **Validation:** Error border `#EF4444` with helper text; Success border `#66BB6A`.

### Badges
- **Status/Category Tag:** Background `#EDEDED` (or tinted Accent), Text matches intent, Radius `6px`, padding `4px 8px`. Text `14px`.

---

## 🏭 7. Industry-Specific UI Elements

- **Production Timeline Component:** A vertical (mobile) or horizontal (desktop) stepper for: *Harvest → Extraction → Refining → Packaging*.
- **Quality Control Block:** Custom lists using shield-check or leaf icons instead of standard bullets.
- **Certifications Banner:** A dedicated auto-scrolling row or grid for ISO, Halal, FDA badges. Imagery should be greyscale initially, coloring on hover.
- **Organic Pattern Overlay:** Subtle palm fruit or leaf geometric motifs embedded in `#F8FAF9` backgrounds at 3-5% opacity.

---

## 🌍 8. RTL & Multi-Language Support Rules

1. **Mirroring:** UI Frameworks (like Tailwind) must use logical properties (e.g., `start` instead of `left`, `me-4`, `ps-4`, `flex-row-reverse` dynamically handled by `dir="rtl"`).
2. **Icons:** Directional icons (arrows, chevrons, run indicators) MUST be flipped when `dir="rtl"`.
3. **Typography Switch:** The global font stack should seamlessly fall back to English equivalents for LTR text blocks. 
4. **Mixed Content (`<bdi>`):** Wrap English terminology (e.g., *Vitamin E*, *Omega-3*) within `<bdi>` tags inside an Arabic paragraph to prevent punctuation displacement.

---

## ⚙️ 9. Figma-Ready Structure (Tokens Array)

Organize the Figma file precisely in this structure for clean handoff:
```text
🎨 Foundations
 ┣ 🎨 Colors (Primary, Secondary, Neutral, Semantic)
 ┣ 🔤 Typography (Arabic, English)
 ┣ 📏 Spacing & Layout Grids
 ┗ 🌗 Shadows & Blurs
🧱 Components
 ┣ 🖱️ Buttons (States: Default, Hover, Active, Disabled)
 ┣ 📋 Forms (Inputs, Textarea, Checkboxes)
 ┣ 🃏 Cards (Products, Services)
 ┣ 🧭 Navigation (Navbar, Menu, Mobile Drawer)
 ┗ 🔔 Feedback (Alerts, Badges, Modals)
📐 Patterns
 ┣ 🖼️ Hero Sections (LTR / RTL variations)
 ┣ 🏭 Process Timelines
 ┗ 🦶 Footers
```

---

## ♿ 10. Accessibility & Contrast Validation

- **Primary Green (`#2E7D32`) on White (`#FFFFFF`):** Contrast Ratio **5.7:1** — *Passes WCAG AA for normal text*.
- **Dark Green (`#1B5E20`) on Soft Background (`#F8FAF9`):** Contrast Ratio **8.4:1** — *Passes WCAG AAA*.
- **White (`#FFFFFF`) on Primary Green (`#2E7D32`):** Contrast Ratio **5.7:1** — *Passes WCAG AA for button text*.
- **⚠️ Contrast Warning:** Golden Orange (`#F4A100`) on White has low contrast (**2.2:1**). 
  - *Fix:* Use Orange exclusively for large decorative text, broad UI accents, or badge backgrounds with Dark Text (`#1F2937`) over it. 
