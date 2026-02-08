# All Ears — Metro Theme Design Spec

> Visual language inspired by transit maps. Clean, navigable, iconic.

---

## Philosophy

Transit maps solve the same problem we have: **making complex networks feel navigable**. They strip away geographic reality in favor of *clarity of connection*. That's exactly what a musical journey needs — not literal positions, but clear relationships.

The Metro theme says: *"Music is a city. Artists are stations. Your journey is a route."*

---

## Visual Language

### Stations (Nodes)

Each artist, album, or track is a **station**.

| Node Type | Visual |
|-----------|--------|
| **Artist** | Solid circle, larger (24-32px) |
| **Album** | Rounded square (20px) |
| **Track** | Small circle (12-16px) |
| **Current position** | Pulsing ring animation |
| **Visited** | Filled, full opacity |
| **Unvisited (available)** | Hollow/outline, 60% opacity |
| **Unexplored (hinted)** | Dotted outline, 30% opacity |

**Station Labels:**
- Artist/album name below or beside node
- Font: Clean sans-serif (Inter, Helvetica, or system)
- Truncate long names with ellipsis
- Show full name on hover

### Lines (Edges)

Connections are **route lines**.

| Connection Type | Visual |
|-----------------|--------|
| **Direct influence** | Solid line, 3px |
| **Collaboration** | Dashed line, 3px |
| **Same genre/scene** | Dotted line, 2px |
| **Your traveled path** | Thick line, 5px, glowing |

**Line Behavior:**
- Lines use 45° and 90° angles only (classic metro style)
- Smooth corners with small radius
- Lines connect at station edges, not centers

### Color System

**Route Colors (by genre/era):**

| Genre | Color | Hex |
|-------|-------|-----|
| Rock | Red | `#E53935` |
| Jazz | Blue | `#1E88E5` |
| Electronic | Cyan | `#00BCD4` |
| Hip-Hop | Orange | `#FB8C00` |
| R&B/Soul | Purple | `#8E24AA` |
| Classical | Gold | `#FFB300` |
| Folk/Country | Green | `#43A047` |
| Pop | Pink | `#EC407A` |
| Metal | Dark Gray | `#424242` |
| Indie | Teal | `#26A69A` |

**State Colors:**
| State | Color |
|-------|-------|
| Current position | White with glow |
| Your path | Bright white or gold highlight |
| Background | Dark: `#121212` / Light: `#FAFAFA` |
| Grid lines (subtle) | `rgba(255,255,255,0.05)` |

### Typography

| Element | Style |
|---------|-------|
| Station name | 12-14px, Medium weight |
| Current station | 14-16px, Bold, white |
| Line labels | 10px, ALL CAPS, tracking +0.5px |
| Journey title | 24px, Bold |

**Font Stack:** 
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

---

## Layout & Composition

### Canvas

- Dark background default (`#121212`)
- Subtle grid pattern (like graph paper, very low opacity)
- Generous padding (stations never touch edges)
- Zoom: 50% → 200% range
- Pan: drag to move around

### Auto-Layout Rules

1. **Starting node** at center
2. **New nodes** expand outward in available directions
3. **Prefer horizontal/vertical** over diagonal
4. **Minimum spacing** between stations: 80px
5. **Cluster related genres** (same-color lines stay near each other)
6. **Avoid line crossings** where possible (swap node positions if needed)

### Viewport Behavior

- **On explore:** Smooth pan to keep newest node visible
- **On click:** Center clicked node with subtle animation
- **Pinch/scroll:** Zoom in/out
- **Double-tap:** Reset view to show full journey

---

## Interaction Design

### Station Interactions

| Action | Result |
|--------|--------|
| **Hover** | Show full name, subtle scale up (1.1x) |
| **Click** | Select station, show detail panel |
| **Double-click** | Expand pathways from this station |
| **Long-press (mobile)** | Context menu |

### Detail Panel (on select)

Slides in from right or bottom:
- Artist/album/track image
- Name, year, genre tags
- "Play" button (Spotify)
- "Add to journey" / "Explore from here"
- AI-generated narrative snippet

### Journey Recording

When recording:
- Traveled path highlighted with thick glowing line
- Breadcrumb trail shows order visited
- "Stop recording" FAB in corner
- Can add notes/reactions at each stop

---

## Components

### Station Node (React Flow Custom Node)

```
┌─────────────────────┐
│      ●              │  ← Circle (artist)
│   Station Name      │  ← Label below
└─────────────────────┘
```

**States:**
- Default (hollow)
- Visited (filled)
- Current (filled + pulse animation + glow)
- Hovered (scale 1.1, full opacity)

### Route Line (React Flow Custom Edge)

- Straight segments with 45°/90° bends
- Color based on connection type or genre
- Animated dash for "traveling" state
- Glow effect for completed path

### Legend

Fixed position (bottom-left or collapsible):
```
━━━ Rock        ━━━ Jazz
━━━ Electronic  ━━━ Hip-Hop
╌╌╌ Collaboration  ••• Same Scene
```

### Mini-Map

Small overview (bottom-right):
- Shows full graph zoomed out
- Highlights current viewport
- Click to jump to area

---

## Animation & Motion

| Action | Animation |
|--------|-----------|
| New node appears | Fade in + scale from 0.8 → 1.0, 200ms ease-out |
| Line draws | SVG stroke animation, 300ms |
| Select node | Scale to 1.15, 150ms spring |
| Pan to node | Smooth scroll, 400ms ease-in-out |
| Pulse (current) | Opacity 0.7 → 1.0, 1s infinite |
| Path glow | Subtle flicker, 2s infinite |

---

## Responsive Considerations

### Desktop (>1024px)
- Full canvas view
- Detail panel as right sidebar
- Legend always visible

### Tablet (768-1024px)
- Full canvas
- Detail panel as bottom sheet
- Collapsible legend

### Mobile (<768px)
- Canvas takes full screen
- Detail panel as modal overlay
- Tap-and-hold for context actions
- Larger touch targets (40px min)
- Simplified labels (truncate earlier)

---

## Dark vs Light Mode

| Element | Dark Mode | Light Mode |
|---------|-----------|------------|
| Background | `#121212` | `#FAFAFA` |
| Station fill | White | Dark gray |
| Station stroke | Genre color | Genre color |
| Line color | Genre color (bright) | Genre color (muted) |
| Text | White | `#212121` |
| Panel bg | `#1E1E1E` | `#FFFFFF` |

---

## Reference Imagery

**Primary inspiration:**
- London Underground map (Harry Beck)
- Massimo Vignelli's NYC subway map (1972)
- Tokyo Metro map

**Mood:**
- Clean, confident, systematic
- Hints of warmth through color
- Feels like exploring a city

---

## Implementation Notes

### React Flow Customization

1. **Custom Node Component:** `MetroStationNode.jsx`
2. **Custom Edge Component:** `MetroRouteEdge.jsx`
3. **Theme context:** Wrap canvas in `MetroThemeProvider`
4. **Layout engine:** Use dagre or custom force-directed with constraints

### CSS Variables

```css
:root {
  --metro-bg: #121212;
  --metro-station-size: 24px;
  --metro-line-width: 3px;
  --metro-path-width: 5px;
  --metro-font: 'Inter', sans-serif;
  --metro-rock: #E53935;
  --metro-jazz: #1E88E5;
  /* ... etc */
}
```

---

## Next Steps

1. [ ] Create `MetroStationNode` component (static first)
2. [ ] Create `MetroRouteEdge` component
3. [ ] Implement color mapping (genre → route color)
4. [ ] Add auto-layout with 45°/90° constraints
5. [ ] Build detail panel
6. [ ] Add animations
7. [ ] Test on mobile

---

*Created: February 2026*
*Theme: Metro/Transit*
*Status: Design Spec Complete*
