# All Ears — Tree of Life Theme Design Spec

> Visual language inspired by organic growth, Klimt, and Art Nouveau. Flowing, alive, beautiful.

---

## Philosophy

Where Metro is systematic, Tree of Life is **organic**. Music doesn't really grow in straight lines — it branches, intertwines, cross-pollinates. This theme embraces that natural chaos.

Inspired by:
- **Gustav Klimt's "Tree of Life"** — gold, spirals, ornate beauty
- **Art Nouveau** — flowing lines, natural forms
- **Botanical illustrations** — detailed, scientific yet beautiful
- **Mycelium networks** — hidden connections underground

The Tree of Life theme says: *"Music grows. Artists are branches. Your journey is a path through the canopy."*

---

## Visual Language

### Nodes (Flowers, Fruits, Leaves)

Each artist, album, or track is a **growth point** on the tree.

| Node Type | Visual |
|-----------|--------|
| **Artist** | Flower bloom — circular with petal details |
| **Album** | Fruit — rounded organic shape |
| **Track** | Leaf — smaller, teardrop/oval |
| **Current position** | Full bloom, glowing gold center |
| **Visited** | Colored, full opacity |
| **Unvisited (available)** | Bud — smaller, muted, ready to bloom |
| **Unexplored (hinted)** | Seed/dot — tiny, very subtle |

**Node Decoration:**
- Subtle swirl patterns inside larger nodes
- Gold accents on current/selected
- Gentle shadow/glow for depth

### Branches (Edges)

Connections are **branches and vines**.

| Connection Type | Visual |
|-----------------|--------|
| **Direct influence** | Thick branch, organic curves |
| **Collaboration** | Intertwined vines (two lines wrapping) |
| **Same genre/scene** | Thin tendril, dotted with tiny leaves |
| **Your traveled path** | Golden, glowing, slightly thicker |

**Branch Behavior:**
- **Organic curves** — bezier curves, no straight lines
- **Tapered thickness** — thicker near parent, thinner toward child
- **Small decorations** — tiny leaves or buds along branches
- **Growth animation** — branches "grow" outward when revealed

### Color Palette

**Primary (Klimt-inspired):**

| Element | Color | Hex |
|---------|-------|-----|
| Gold (highlights) | Warm gold | `#D4AF37` |
| Deep gold | Rich amber | `#B8860B` |
| Background (dark) | Deep forest | `#0D1F0D` |
| Background (light) | Warm cream | `#FDF8E7` |

**Genre Colors (earthy/jewel tones):**

| Genre | Color | Hex | Metaphor |
|-------|-------|-----|----------|
| Rock | Deep Red | `#8B0000` | Autumn leaves |
| Jazz | Sapphire | `#0F52BA` | Night sky |
| Electronic | Cyan/Teal | `#008B8B` | Bioluminescence |
| Hip-Hop | Amber | `#FF8C00` | Sunset |
| R&B/Soul | Plum | `#8E4585` | Ripe fruit |
| Classical | Ivory/Gold | `#D4AF37` | Gilded age |
| Folk/Country | Forest Green | `#228B22` | Deep woods |
| Pop | Rose | `#FF69B4` | Spring bloom |
| Metal | Obsidian | `#1C1C1C` | Dark bark |
| Indie | Sage | `#77815C` | New growth |

### Typography

| Element | Style |
|---------|-------|
| Node name | 13px, serif, warm brown or cream |
| Current node | 15px, serif italic, gold |
| Journey title | 28px, decorative serif (Playfair Display) |
| Narrative text | 14px, serif, good line-height |

**Font Stack:**
```css
--tree-heading: 'Playfair Display', Georgia, serif;
--tree-body: 'Cormorant Garamond', 'Times New Roman', serif;
--tree-accent: 'Tangerine', cursive; /* for flourishes */
```

---

## Layout & Composition

### Canvas

- Dark mode: Deep forest green (`#0D1F0D`) with subtle texture
- Light mode: Warm parchment (`#FDF8E7`) with paper texture
- Subtle organic patterns in background (very low opacity vines/leaves)
- No grid — organic positioning

### Growth Pattern (Auto-Layout)

1. **Root node** at bottom-center (or center)
2. **Tree grows upward** (or radially outward)
3. **Branches curve naturally** — avoid harsh angles
4. **Heavier nodes** (more connections) get thicker branches
5. **Genre clusters** grow on same major branch
6. **New growth** appears at branch tips

**Layout Algorithm:**
- Force-directed with organic constraints
- Prefer upward/outward growth
- Allow some overlap of leaves (natural)
- Golden ratio spacing where possible

### Canvas Texture

Subtle background elements (very low opacity, 5-10%):
- Swirling vine patterns
- Scattered tiny leaves
- Klimt-style spiral motifs
- Aged paper texture (light mode)
- Forest floor texture (dark mode)

---

## Interaction Design

### Node Interactions

| Action | Result |
|--------|--------|
| **Hover** | Bloom animation — node "opens" slightly, gold glow |
| **Click** | Full bloom, detail panel with ornate frame |
| **Double-click** | Grow new branches from this node |
| **Long-press** | Context menu in decorative frame |

### Detail Panel

Styled like an illuminated manuscript page:
- Ornate gold border/frame
- Artist image in circular frame with decorative edge
- Name in elegant serif
- Narrative text in readable serif
- Decorative flourishes in corners
- "Explore" button styled as golden seed

### Journey Recording

When recording:
- Path marked with golden glow
- Small golden markers at each stop (like trail markers)
- Accumulated "collection" shown as gathered flowers
- Journey becomes a "branch" you can name

### Growth Animations

- New nodes: Unfurl like a flower opening (0.5s)
- New branches: Grow outward with slight wobble (0.4s)
- Selection: Gentle pulse, petals shimmer
- Path highlight: Golden light travels along branch

---

## Components

### Bloom Node (React Flow Custom Node)

```
      ✿
   ╱     ╲
  │ Artist │
   ╲     ╱
      │
    name
```

**Structure:**
- SVG flower/leaf shape
- Interior gradient (genre color → lighter)
- Gold ring on select/current
- Label below with subtle shadow

**States:**
- Seed (tiny dot)
- Bud (small, muted)
- Bloom (full size, colored)
- Golden bloom (current position)
- Visited (full color, small gold accent)

### Vine Edge (React Flow Custom Edge)

- Bezier curve (cubic or quadratic)
- Tapered stroke (thick → thin)
- Small leaf decorations at midpoint and ends
- Color gradient along length
- Golden glow for traveled path

### Ornate Frame (Detail Panel)

```
╔═══════════════════╗
║  ❧ Artist Name ❧  ║
║  ┌─────────────┐  ║
║  │   Image     │  ║
║  └─────────────┘  ║
║  Description...   ║
║  ❦ Explore ❦     ║
╚═══════════════════╝
```

- Gold border with corner flourishes
- Inner shadow for depth
- Decorative dividers between sections

### Legend (Botanical Key)

Styled like a botanical illustration key:
```
━━ Influence (branch)
≈≈ Collaboration (vine)
∙∙ Same scene (tendril)

● Rock  ● Jazz  ● Electronic
● Hip-Hop  ● Folk  ● Classical
```

---

## Animation & Motion

| Action | Animation |
|--------|-----------|
| Node appears | Scale 0 → 1 with slight overshoot, rotate 0° → slight wobble |
| Branch grows | Stroke-dasharray animation + slight wave |
| Hover bloom | Scale 1 → 1.15, add glow, 200ms spring |
| Select | Petals shimmer (opacity wave), gold ring appears |
| Pan | Smooth, 400ms ease, slight parallax on background texture |
| Grow pathways | Branches extend outward organically, 500ms |

**Easing:**
```css
--tree-ease: cubic-bezier(0.34, 1.56, 0.64, 1); /* spring */
--tree-grow: cubic-bezier(0.22, 1, 0.36, 1); /* smooth out */
```

---

## Audio/Visual Sync (Stretch Goal)

If playing music while exploring:
- Nodes pulse subtly with beat
- Branches gently sway
- Golden particles drift upward
- Current node "breathes" with the music

---

## Responsive Considerations

### Desktop (>1024px)
- Full tree view, generous canvas
- Detail panel as elegant sidebar
- Rich textures and decorations

### Tablet (768-1024px)
- Full tree, slightly simplified decorations
- Bottom sheet detail panel
- Touch-friendly bloom targets

### Mobile (<768px)
- Simplified nodes (less ornate)
- Reduced background texture
- Larger touch targets (44px)
- Modal detail view
- Vertical scroll for large trees

---

## Dark vs Light Mode

| Element | Dark (Forest) | Light (Parchment) |
|---------|---------------|-------------------|
| Background | `#0D1F0D` | `#FDF8E7` |
| Texture | Subtle dark vines | Aged paper grain |
| Node fill | Jewel tones | Softer pastels |
| Branches | Brown/gold | Dark brown |
| Gold accents | Bright gold `#D4AF37` | Antique gold `#B8860B` |
| Text | Cream `#FDF8E7` | Dark brown `#3D2314` |
| Panel bg | `#1A2F1A` | `#FFFEF5` |

---

## Comparison: Metro vs Tree of Life

| Aspect | Metro | Tree of Life |
|--------|-------|--------------|
| **Vibe** | Urban, systematic | Natural, organic |
| **Lines** | Straight, 45°/90° | Curved, flowing |
| **Nodes** | Geometric | Organic shapes |
| **Colors** | Bold, primary | Earthy, jewel tones |
| **Motion** | Snappy, precise | Flowing, natural |
| **Typography** | Sans-serif | Serif, decorative |
| **Best for** | Quick navigation | Immersive exploration |

---

## Implementation Notes

### React Flow Customization

1. **Custom Node Component:** `BloomNode.jsx`
2. **Custom Edge Component:** `VineEdge.jsx`
3. **Theme context:** `TreeOfLifeThemeProvider`
4. **Layout:** Force-directed with organic constraints (d3-force)

### SVG Assets Needed

- Flower bloom shapes (3-4 variations)
- Leaf shapes (2-3 sizes)
- Vine/branch path templates
- Corner flourishes for frames
- Background texture tiles

### CSS Variables

```css
:root {
  --tree-bg-dark: #0D1F0D;
  --tree-bg-light: #FDF8E7;
  --tree-gold: #D4AF37;
  --tree-gold-dark: #B8860B;
  --tree-branch: #4A3728;
  --tree-heading-font: 'Playfair Display', serif;
  --tree-body-font: 'Cormorant Garamond', serif;
  /* genre colors... */
}
```

---

## Next Steps

1. [ ] Create SVG assets (blooms, leaves, vines)
2. [ ] Build `BloomNode` component
3. [ ] Build `VineEdge` component with bezier curves
4. [ ] Implement growth animations
5. [ ] Add background textures
6. [ ] Build ornate detail panel
7. [ ] Test and refine organic layout

---

*Created: February 2026*
*Theme: Tree of Life / Art Nouveau*
*Status: Design Spec Complete*
