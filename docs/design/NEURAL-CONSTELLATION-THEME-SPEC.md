# All Ears — Neural Constellation Theme Design Spec

> Visual language inspired by neural networks, star maps, and the cosmos. Futuristic, luminous, infinite.

---

## Philosophy

Music connections are like synapses firing — or stars linked by ancient astronomers into constellations. This theme merges **neuroscience** and **astronomy** into something that feels like exploring the universe inside your mind.

Inspired by:
- **Neural network visualizations** — glowing nodes, electric connections
- **Star maps and planetarium software** — points of light in vast darkness
- **Bioluminescence** — deep sea creatures, glowing in the dark
- **Sci-fi interfaces** — Minority Report, Interstellar, Her

The Neural Constellation theme says: *"Music is a universe. Artists are stars. Your journey is a path through the cosmos of sound."*

---

## Visual Language

### Nodes (Stars / Neurons)

Each artist, album, or track is a **point of light**.

| Node Type | Visual |
|-----------|--------|
| **Artist** | Bright star — larger, with subtle rays/flare |
| **Album** | Medium star — solid glow, no rays |
| **Track** | Small star — tiny point of light |
| **Current position** | Pulsar — rhythmic bright pulse with halo rings |
| **Visited** | Full brightness, soft glow aura |
| **Unvisited (available)** | Dimmer star, 50% brightness |
| **Unexplored (hinted)** | Faint twinkle, barely visible |

**Node Details:**
- Core: bright center point
- Glow: soft radial gradient outward
- Rays: subtle light rays on larger nodes (artists)
- Halo: concentric rings on current/selected

### Connections (Synapses / Constellation Lines)

Connections are **neural pathways** or **constellation lines**.

| Connection Type | Visual |
|-----------------|--------|
| **Direct influence** | Bright synapse — glowing line with pulse animation |
| **Collaboration** | Double helix — two intertwined glowing strands |
| **Same genre/scene** | Faint constellation line — thin, dotted |
| **Your traveled path** | Electric arc — bright, crackling with energy |

**Connection Behavior:**
- Lines have subtle **particle flow** along them (like electricity)
- Brightness increases near nodes (synapse glow)
- Slight **curve** to lines (not perfectly straight)
- **Pulse animation** travels along connections when activated

### Color Palette

**Core Colors (Cosmic/Electric):**

| Element | Color | Hex |
|---------|-------|-----|
| Background | Deep space black | `#050510` |
| Primary glow | Electric blue | `#00D4FF` |
| Secondary glow | Soft purple | `#9D4EDD` |
| Accent | Hot pink/magenta | `#FF006E` |
| Warm accent | Amber/gold | `#FFB700` |
| Highlight | Pure white | `#FFFFFF` |

**Genre Colors (Nebula-inspired):**

| Genre | Color | Hex | Cosmic Metaphor |
|-------|-------|-----|-----------------|
| Rock | Red giant | `#FF3333` | Betelgeuse |
| Jazz | Cool blue | `#4169E1` | Blue giant |
| Electronic | Cyan | `#00FFFF` | Synthetic pulse |
| Hip-Hop | Orange nova | `#FF8C00` | Supernova |
| R&B/Soul | Violet | `#9400D3` | Nebula gas |
| Classical | Gold/white | `#FFD700` | Ancient star |
| Folk/Country | Warm amber | `#DAA520` | Distant sun |
| Pop | Hot pink | `#FF69B4` | Young star |
| Metal | Deep red/black | `#8B0000` | Red dwarf |
| Indie | Teal | `#20B2AA` | Distant galaxy |

### Typography

| Element | Style |
|---------|-------|
| Node name | 11px, sans-serif, ALL CAPS, letter-spacing +1px |
| Current node | 13px, sans-serif bold, glowing text-shadow |
| Journey title | 24px, thin sans-serif, wide letter-spacing |
| Data readout | 10px, monospace, dim |
| Narrative | 14px, light sans-serif, high contrast |

**Font Stack:**
```css
--neural-heading: 'Rajdhani', 'Orbitron', sans-serif;
--neural-body: 'Inter', 'Roboto', sans-serif;
--neural-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

---

## Layout & Composition

### Canvas (The Void)

- Pure black background (`#050510`)
- Subtle star field (tiny random dots, very dim, parallax on pan)
- Faint nebula clouds (colored gradients, 5% opacity)
- No hard edges — everything fades into darkness

### Spatial Layout

1. **Origin point** at center (your starting star)
2. **Nodes spread radially** in 3D-projected 2D space
3. **Z-depth simulation** — farther nodes are smaller and dimmer
4. **Clustering** — related artists form "constellations"
5. **Negative space** — embrace the void, don't overcrowd

**Layout Algorithm:**
- Force-directed with strong repulsion
- Genre clusters as gravitational wells
- 3D coordinates projected to 2D (subtle parallax)
- Minimum distance between stars enforced

### Depth & Atmosphere

- **Foreground:** Current node, bright and large
- **Midground:** Connected nodes, medium brightness
- **Background:** Distant unexplored, faint twinkles
- **Parallax:** Background stars move slower when panning

---

## Interaction Design

### Node Interactions

| Action | Result |
|--------|--------|
| **Hover** | Star brightens, info tooltip fades in |
| **Click** | Zoom toward star, ripple ring expands, detail panel |
| **Double-click** | "Scan" animation, reveal connected stars |
| **Long-press** | Radial context menu appears around node |

### Scanning Animation (Explore)

When expanding from a node:
1. Pulse ring expands outward from node
2. As ring passes, new nodes "appear" (fade/scale in)
3. Connection lines draw with electric crackle
4. Sound design: subtle synthesizer ping (optional)

### Detail Panel (Star Data)

Styled like a sci-fi HUD / telescope readout:
```
┌─────────────────────────────────────┐
│ ◉ STAR CLASSIFICATION              │
├─────────────────────────────────────┤
│ ★ ARTIST NAME                       │
│ ▸ Genre: Electronic                 │
│ ▸ Era: 2010s                        │
│ ▸ Connections: 14                   │
├─────────────────────────────────────┤
│ ┌───────────┐                       │
│ │   Image   │  AI Narrative here    │
│ └───────────┘  describing the       │
│                artist's influence   │
├─────────────────────────────────────┤
│  [▶ PLAY]  [⟡ EXPLORE]  [+ ADD]    │
└─────────────────────────────────────┘
```

- Thin borders, subtle glow
- Monospace data readouts
- Scan lines animation (subtle)
- Corners have tech details (coordinates, ID)

### Journey Recording (Flight Path)

When recording:
- Path drawn as glowing electric arc
- "Warp trail" effect behind your movement
- Each visited star gets a numbered marker
- Journey line pulses with traveling light
- "Flight recorder" UI shows distance traveled

---

## Components

### Star Node (React Flow Custom Node)

```
       ✦
      /|\
     / | \
    ·  ●  ·
     \ | /
      \|/
   STAR NAME
```

**Layers:**
1. Core point (bright center)
2. Inner glow (genre color, 50% opacity)
3. Outer halo (white/blue, 20% opacity)
4. Rays (on hover/select, 4-8 lines outward)
5. Label below (small caps)

**States:**
- Dim (unexplored)
- Visible (available)
- Bright (visited)
- Pulsar (current — rhythmic pulse)
- Supernova (selected — expanded, extra glow)

### Synapse Edge (React Flow Custom Edge)

- Slightly curved line (quadratic bezier)
- Gradient: dim at ends, bright at middle
- Particle animation: dots traveling along line
- Glow effect: blur shadow matching line color
- Pulse: periodic brightness wave

### HUD Frame (Detail Panel)

```
╔══════════════════════════════╗
║ ◈ SYSTEM SCAN ◈             ║
╠══════════════════════════════╣
║                              ║
║       Content here           ║
║                              ║
╠══════════════════════════════╣
║ LOC: 47.2° • DIST: 3.2 LY   ║
╚══════════════════════════════╝
```

- Thin line borders (1px, cyan glow)
- Corner accents (small tech details)
- Subtle scan line animation
- Data readouts in corners (coordinates, etc.)

### Minimap (Star Chart)

- Circular viewport (like telescope view)
- Shows full constellation zoomed out
- Current view indicated by frame
- Faint grid overlay
- Click to navigate

---

## Animation & Motion

| Action | Animation |
|--------|-----------|
| Node appear | Fade in + scale 0.5→1, subtle twinkle |
| Connection draw | Line extends with particle burst |
| Hover | Brightness 1→1.5, glow radius expands |
| Select | Ripple rings expand outward (3 rings) |
| Scan/explore | Radar sweep, nodes revealed in wave |
| Pulse (current) | Brightness oscillation, 2s cycle |
| Path travel | Light packet moves along line, 0.5s |
| Pan camera | Parallax — bg moves slower than fg |

**Easing:**
```css
--neural-ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--neural-glow: cubic-bezier(0.4, 0, 0.2, 1);
```

### Particle System (Stretch Goal)

- Tiny particles drift slowly across canvas
- Density increases near bright nodes
- Particles follow connection lines
- Creates sense of energy flow

---

## Audio Integration (Stretch Goal)

If playing music while exploring:
- Stars pulse to the beat (subtle scale)
- Connection lines flicker with frequency
- Bass hits create ripple from current node
- High frequencies make distant stars twinkle

---

## Responsive Considerations

### Desktop (>1024px)
- Full cosmic canvas
- Rich particle effects
- HUD panel as sidebar
- Detailed scan animations

### Tablet (768-1024px)
- Full canvas, reduced particles
- Bottom sheet HUD
- Simplified node details

### Mobile (<768px)
- Simplified stars (less glow layers)
- No parallax star field
- Larger touch targets
- Modal HUD panel
- Performance-optimized (fewer particles)

---

## Dark Mode Only?

This theme is **inherently dark**. A "light mode" would break the concept.

However, could offer **color temperature variants:**
- **Cool** (default): Blue/cyan dominant
- **Warm**: Amber/gold dominant (like looking toward galactic center)
- **Vaporwave**: Pink/purple neon (retro-futurism)

---

## Comparison: All Three Themes

| Aspect | Metro | Tree of Life | Neural Constellation |
|--------|-------|--------------|---------------------|
| **Vibe** | Urban, practical | Natural, warm | Cosmic, futuristic |
| **Nodes** | Circles/stations | Flowers/leaves | Stars/points of light |
| **Lines** | Straight, angular | Curved, organic | Glowing, electric |
| **Colors** | Bold primaries | Earthy jewels | Neon, electric |
| **Background** | Neutral | Textured | Deep black void |
| **Motion** | Snappy | Flowing | Electric, pulsing |
| **Feel** | I'm navigating | I'm exploring | I'm discovering |
| **Best for** | Efficiency | Immersion | Wonder |

---

## Implementation Notes

### React Flow Customization

1. **Custom Node Component:** `StarNode.jsx`
2. **Custom Edge Component:** `SynapseEdge.jsx`
3. **Theme context:** `NeuralThemeProvider`
4. **Particles:** Use `react-tsparticles` or custom canvas layer

### Visual Effects Needed

- Star glow (CSS blur + radial gradients)
- Particle system (canvas or WebGL)
- Line pulse animation (SVG stroke-dashoffset)
- Ripple rings (CSS animation with scale + opacity)
- Parallax background (CSS transform on scroll/pan)

### Performance Considerations

```javascript
// Reduce effects on low-power devices
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isLowPower = navigator.deviceMemory < 4; // if available

if (prefersReducedMotion || isLowPower) {
  // Disable particles
  // Reduce glow layers
  // Simplify animations
}
```

### CSS Variables

```css
:root {
  --neural-void: #050510;
  --neural-glow-primary: #00D4FF;
  --neural-glow-secondary: #9D4EDD;
  --neural-glow-accent: #FF006E;
  --neural-star-core: #FFFFFF;
  --neural-font-heading: 'Rajdhani', sans-serif;
  --neural-font-mono: 'JetBrains Mono', monospace;
  --neural-line-glow: 0 0 10px var(--neural-glow-primary);
  /* genre colors... */
}
```

---

## Next Steps

1. [ ] Build star glow effect (CSS/SVG)
2. [ ] Create `StarNode` component with pulse states
3. [ ] Create `SynapseEdge` with particle flow
4. [ ] Add parallax star field background
5. [ ] Build HUD-style detail panel
6. [ ] Implement scan/reveal animation
7. [ ] Add particle system (optional)
8. [ ] Performance testing on mobile

---

*Created: February 2026*
*Theme: Neural Constellation / Cosmic*
*Status: Design Spec Complete*
