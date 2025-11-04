# PHASE 0.5: Design System Documentation & Extension

**Phase:** 0.5 (Design Foundation)
**Duration:** 2 days (8-10 hours)
**Architecture Version:** Musical Journey v1.0
**Status:** 🟡 Not Started

---

## Your Task

Audit the existing All Ears design system, document all current patterns and components, and extend with comprehensive specifications for journey-specific UI elements. This creates a single source of truth for all design decisions before any UI implementation begins.

---

## What You Will Build

1. **Design System Audit** - Document All Ears current Material-UI theme, components, and patterns
2. **Style Guide** - Comprehensive 1,000+ line component specification (Show.me format)
3. **Journey Component Specs** - Detailed specifications for 8 new journey-specific components
4. **Design Philosophy** - Document design principles and aesthetic decisions
5. **Component Examples** - React/Material-UI implementation code for each component

---

## Prerequisites

Before starting, ensure:
- [ ] Phase 0 complete (infrastructure setup)
- [ ] Familiar with All Ears current UI (run `npm run dev` and explore)
- [ ] Read `/CLAUDE.md` (existing design system section)
- [ ] Reviewed Show.me's `style-guide.md` for format reference
- [ ] Have access to any existing design mockups or Figma files

---

## Implementation Steps

### Day 1: Audit Existing Design System (4-5 hours)

#### Task 1.1: Audit Material-UI Theme (1 hour)

**File to Review:** `/src/components/App.js` (lines 29-56)

**Audit Checklist:**

**Colors:**
- Primary color: `#181C1E` (dark charcoal)
- Secondary color: `#FF6E1D` (orange)
- Background colors: Document light and dark mode values
- Text colors: Document hierarchy (primary, secondary, disabled)
- Border colors: Document from existing cards/inputs

**Typography:**
- Font family: `'Prompt', sans-serif` (Google Fonts)
- H1-H6 specifications (size, weight, line-height)
- Body text specifications
- Caption/small text specifications
- Font weights used: 400 (regular), 500 (medium), 600 (semi-bold)

**Spacing:**
- Base grid: Identify spacing scale
- Padding values: Document common padding patterns
- Margin values: Document common margin patterns
- Gap values: For flex/grid layouts

**Shadows:**
- Card shadows
- Modal shadows
- Button shadows (if any)

**Document in:** `/design-system/audit.md` (temporary file)

```markdown
# All Ears Design System Audit

## Color Palette

### Primary Colors
- Primary: #181C1E (Dark Charcoal)
- Secondary: #FF6E1D (Orange)
- Background: #FFFFFF (Light), #181C1E (Dark)

### Grayscale
- [Document from existing components]

## Typography
- Font Family: 'Prompt', sans-serif
- H5: 1.2rem, 500 weight, 0 margin-bottom
- H6: 1.1rem, 500 weight
- [Continue audit...]
```

**Acceptance Criteria:**
- [ ] All theme colors documented with hex codes
- [ ] Typography scale complete (H1-H6, body, caption)
- [ ] Spacing patterns identified
- [ ] Shadow values documented

---

#### Task 1.2: Audit Existing Components (2 hours)

**Components to Audit:**

**1. Card Components** (`SongSmall.js`, `SongMedium.js`, `AlbumSmall.js`)
- Width, height specifications
- Padding values
- Border radius
- Hover states
- Image aspect ratios
- Text truncation patterns

**2. Navigation** (`NavBar.js`)
- Height: 64px (confirmed in App.js padding)
- Background color
- Link styling (active, inactive, hover)
- Spacing between items
- Logo specifications

**3. Music Player** (`MusicPlayer.js`)
- Height: 88px (confirmed in App.js padding)
- Background color: `#F4F2F7`
- Button specifications
- Slider styling
- Layout pattern

**4. Search** (`SearchBar.js`)
- Input field height
- Border styling
- Placeholder text color
- Focus states
- Button styling

**5. Context Menus** (`TrackContextMenu.js`, `QueueContextMenu.js`)
- Menu item height
- Padding
- Hover background
- Icon size and spacing
- Divider styling

**6. Modal/Dialog Patterns**
- Backdrop color and opacity
- Content background
- Padding
- Border radius
- Z-index

**Document Format:**

```markdown
## Existing Components

### SongSmall Card
**Specifications:**
- Width: 200px
- Height: auto
- Padding: 16px
- Border radius: 8px
- Hover: [describe hover state]

**States:**
- Default: [specs]
- Hover: [specs]
- Active/Playing: [specs]

**Implementation:**
[Copy relevant Material-UI sx props]
```

**Acceptance Criteria:**
- [ ] All 6+ component types documented
- [ ] State specifications for each (default, hover, active, disabled)
- [ ] Measurements extracted (width, height, padding, radius)
- [ ] Material-UI `sx` prop patterns captured

---

#### Task 1.3: Identify Patterns & Conventions (1 hour)

**Patterns to Document:**

**1. Card Pattern**
- All cards use Material-UI `Card` component
- Consistent border-radius across cards
- Album art is always square aspect ratio
- Text truncation with ellipsis for long titles

**2. Icon Usage**
- Material-UI icons (`@mui/icons-material`)
- Standard sizes: `small`, `medium`, `large`
- Icon colors match text hierarchy

**3. Button Pattern**
- Primary buttons: Filled
- Secondary buttons: Outlined
- Icon buttons: No background, hover changes opacity
- Disabled state: Reduced opacity

**4. Spacing Pattern**
- Consistent gap between cards in lists
- Standard padding inside cards
- Margin between sections

**5. Color Usage**
- Primary color for emphasis (active states, CTAs)
- Secondary color for accents (icons, highlights)
- Grayscale for hierarchy (primary text, secondary text, borders)

**Document in:** `/design-system/patterns.md` (temporary)

**Acceptance Criteria:**
- [ ] Card pattern documented
- [ ] Icon usage pattern documented
- [ ] Button pattern documented
- [ ] Spacing conventions identified
- [ ] Color usage guidelines documented

---

### Day 2: Create Journey Component Specifications (4-5 hours)

#### Task 2.1: Define Journey-Specific Color Extensions (30 min)

**New Colors Needed:**

**Pathway Type Colors** (for different connection types):
- Influences (backward): `#7B61FF` (purple)
- Legacy (forward): `#4CAF50` (green)
- Collaborators: `#FF6E1D` (existing secondary - orange)
- Contemporaries: `#03A9F4` (blue)
- Genre Connections: `#E91E63` (pink)

**Graph/Node Colors:**
- Node border (default): `rgba(255, 255, 255, 0.3)`
- Node border (center): `#FF6E1D` (secondary)
- Node border (visited): `rgba(255, 255, 255, 0.5)`
- Edge/connection line: `rgba(255, 255, 255, 0.2)`
- Edge (hover): `rgba(255, 255, 255, 0.4)`

**Recording/Journey Colors:**
- Recording active: `#F44336` (red)
- Journey count badge: `#FF6E1D` (secondary)

**Add to:** `/design-system/style-guide.md` under "Color Palette - Journey Extensions"

**Acceptance Criteria:**
- [ ] Pathway type colors defined (5 types)
- [ ] Graph element colors defined
- [ ] Recording UI colors defined
- [ ] All colors have hex codes and opacity values

---

#### Task 2.2: Specify PathwayNode Component (1 hour)

**Component:** `PathwayNode` - Visual node in the journey graph

**Based On:** Existing `SongSmall` card pattern

**Specifications:**

```markdown
### PathwayNode Component

**Purpose:** Represents an artist, track, or genre in the journey graph

**Dimensions:**
- Width: 180px
- Height: 240px (with image: 180px + content: 60px)
- Border-radius: 8px
- Border: 2px solid (color varies by state)

**States:**

1. **Default (Surrounding Node)**
   - Background: rgba(255, 255, 255, 0.08) (dark mode)
   - Border: rgba(255, 255, 255, 0.3)
   - Shadow: 0px 2px 8px rgba(0, 0, 0, 0.2)
   - Cursor: pointer
   - Transition: all 0.2s ease

2. **Center Node (Active)**
   - Background: rgba(255, 110, 29, 0.1)
   - Border: 2px solid #FF6E1D
   - Shadow: 0px 4px 16px rgba(255, 110, 29, 0.3)
   - Transform: scale(1.1)

3. **Visited Node**
   - Background: rgba(255, 255, 255, 0.12)
   - Border: rgba(255, 255, 255, 0.5)
   - Opacity: 0.7

4. **Hover**
   - Transform: translateY(-4px)
   - Shadow: 0px 6px 20px rgba(0, 0, 0, 0.3)
   - Border color brightens

**Layout:**
- Image: 180x180px, covers full width, border-radius: 8px 8px 0 0
- Content padding: 12px
- Node type badge: absolute position, top-right, 8px from edge
- Title: 14px, semi-bold, white, truncate with ellipsis
- Subtitle: 12px, regular, rgba(255,255,255,0.7)

**Badge (Node Type Indicator):**
- Size: 28x28px circle
- Background: Pathway type color (with 0.9 opacity)
- Icon: Material-UI icon, 16px, white
- Icons:
  - Artist: PersonIcon
  - Track: MusicNoteIcon
  - Genre: CategoryIcon

**Animation:**
- Entry: Fade in + scale from 0.8 to 1.0 (0.3s ease-out)
- Exit: Fade out + scale to 0.8 (0.2s ease-in)
- Center transition: Smooth movement (0.4s ease-in-out)

**React/Material-UI Implementation:**
\`\`\`jsx
import { Card, CardMedia, CardContent, Typography, Badge, Avatar } from '@mui/material';
import { Person, MusicNote, Category } from '@mui/icons-material';

const PathwayNode = ({ data, state = 'default', onNodeClick }) => {
  const stateStyles = {
    default: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      transform: 'scale(1)',
    },
    center: {
      background: 'rgba(255, 110, 29, 0.1)',
      border: '2px solid #FF6E1D',
      transform: 'scale(1.1)',
      boxShadow: '0px 4px 16px rgba(255, 110, 29, 0.3)',
    },
    visited: {
      background: 'rgba(255, 255, 255, 0.12)',
      opacity: 0.7,
    },
  };

  const iconMap = {
    artist: Person,
    track: MusicNote,
    genre: Category,
  };

  const Icon = iconMap[data.type];

  return (
    <Card
      sx={{
        width: 180,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...stateStyles[state],
        '&:hover': {
          transform: state === 'center' ? 'scale(1.1)' : 'translateY(-4px)',
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)',
        },
      }}
      onClick={() => onNodeClick(data)}
    >
      <Badge
        badgeContent={
          <Avatar sx={{ width: 28, height: 28, bgcolor: data.pathwayColor }}>
            <Icon sx={{ fontSize: 16, color: 'white' }} />
          </Avatar>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ width: '100%' }}
      >
        <CardMedia
          component="img"
          image={data.image}
          alt={data.name}
          sx={{ height: 180, width: 180 }}
        />
      </Badge>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }} noWrap>
          {data.name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }} noWrap>
          {data.subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};
\`\`\`
```

**Acceptance Criteria:**
- [ ] All 4 states specified (default, center, visited, hover)
- [ ] Dimensions and spacing documented
- [ ] Badge system specified
- [ ] Animation timings defined
- [ ] React implementation example provided

---

#### Task 2.3: Specify JourneyGraph Component (1 hour)

**Component:** `JourneyGraph` - Main visual exploration interface

**Based On:** React Flow with custom styling

**Specifications:**

```markdown
### JourneyGraph Component

**Purpose:** Interactive graph for exploring musical connections

**Container:**
- Width: 100% (full screen width minus padding)
- Height: calc(100vh - 64px - 108px - 120px)
  (viewport - navbar - player - recording controls)
- Min-height: 500px
- Background: Radial gradient from #1a1a1a (center) to #0a0a0a (edges)
- Border-radius: 12px
- Overflow: hidden

**Layout Pattern: Radial**
- Center node: Middle of viewport
- Surrounding nodes: Arranged in circle around center
- Radius: 300px from center
- 5 nodes maximum (one per pathway type)

**Edges/Connections:**
- Line width: 2px
- Color: rgba(255, 255, 255, 0.2)
- Stroke-dasharray: 5,5 (dashed)
- Animation: Dash moves along line (infinite loop)
- Hover: Color changes to rgba(255, 255, 255, 0.4), width: 3px

**Edge Labels:**
- Background: rgba(0, 0, 0, 0.8)
- Padding: 4px 8px
- Border-radius: 4px
- Font: 11px, 500 weight
- Color: rgba(255, 255, 255, 0.9)
- Text: Pathway type name ("Influences", "Legacy", etc.)
- Position: Midpoint of edge
- Visibility: Hidden by default, show on hover

**Controls:**
- Zoom controls: Bottom-right corner
- Pan: Drag background
- Reset view: Button in top-right
- Mini-map: Bottom-left (optional for MVP)

**Loading State:**
- Center area: CircularProgress (Material-UI)
- Text: "Discovering musical connections..."
- Background: Slightly dimmed graph
- Prevents interaction during loading

**Empty State:**
- Center: Large icon (ExploreIcon)
- Text: "Start your musical journey"
- Subtext: "Search for any artist, track, or genre"
- CTA button: "Begin Exploring"

**Interaction:**
- Click node: Triggers pathway generation, node moves to center
- Hover node: Shows preview tooltip with description
- Drag node: Repositions (only surrounding nodes, not center)
- Scroll: Zoom in/out
- Double-click: Play representative tracks

**React Flow Styling:**
\`\`\`jsx
import ReactFlow, { Background, Controls } from 'reactflow';

const graphStyles = {
  background: 'radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%)',
  borderRadius: '12px',
};

const edgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: {
    stroke: 'rgba(255, 255, 255, 0.2)',
    strokeWidth: 2,
    strokeDasharray: '5,5',
  },
};

<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={{ pathwayNode: PathwayNode }}
  style={graphStyles}
  defaultEdgeOptions={edgeOptions}
  fitView
  minZoom={0.5}
  maxZoom={1.5}
>
  <Background color="#ffffff" gap={16} size={1} style={{ opacity: 0.05 }} />
  <Controls />
</ReactFlow>
\`\`\`
```

**Acceptance Criteria:**
- [ ] Container dimensions and background specified
- [ ] Radial layout pattern documented
- [ ] Edge styling and animation specified
- [ ] All interaction patterns documented
- [ ] Loading and empty states specified
- [ ] React Flow configuration provided

---

#### Task 2.4: Specify NarrativeCard Component (45 min)

**Component:** `NarrativeCard` - Displays AI-generated music history stories

**Based On:** Material-UI Card with custom content layout

**Specifications:**

```markdown
### NarrativeCard Component

**Purpose:** Display AI-generated narratives explaining musical connections

**Dimensions:**
- Width: 100% (responsive, max-width: 800px)
- Min-height: 120px
- Padding: 24px
- Border-radius: 12px
- Margin-bottom: 16px

**Visual Style:**
- Background: rgba(255, 255, 255, 0.05)
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Backdrop-filter: blur(10px) (glassmorphism effect)

**Content Layout:**
- Icon: Left side, 40x40px circle
- Title: Top, 16px semi-bold
- Body text: 14px regular, line-height: 1.6
- Connection indicator: Bottom, with arrow icon

**Icon System:**
- Background: Pathway type color (from PathwayNode)
- Icon: Material-UI icon matching connection type
- Icons:
  - Influences: TrendingDownIcon
  - Legacy: TrendingUpIcon
  - Collaborators: PeopleIcon
  - Contemporaries: CalendarIcon
  - Genre: CategoryIcon

**Typography:**
- Title: 16px, 600 weight, white
- Body: 14px, 400 weight, rgba(255,255,255,0.9), line-height: 1.6
- Key terms: 500 weight, secondary color (#FF6E1D)
- Connection label: 12px, rgba(255,255,255,0.7)

**States:**
- Default: As specified above
- Hover: Border brightens to rgba(255,255,255,0.2)
- Expanded: Max-height increases (if collapsible)

**React Implementation:**
\`\`\`jsx
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { TrendingDown, TrendingUp, People } from '@mui/icons-material';

const NarrativeCard = ({ narrative, connectionType, pathwayColor }) => {
  const iconMap = {
    influences: TrendingDown,
    legacy: TrendingUp,
    collaborators: People,
  };

  const Icon = iconMap[connectionType];

  return (
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        p: 3,
        transition: 'border-color 0.2s',
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: pathwayColor }}>
          <Icon sx={{ color: 'white' }} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            {narrative.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.6,
              '& strong': {
                fontWeight: 500,
                color: '#FF6E1D',
              },
            }}
            dangerouslySetInnerHTML={{ __html: narrative.text }}
          />
        </Box>
      </Box>
    </Card>
  );
};
\`\`\`
```

**Acceptance Criteria:**
- [ ] Dimensions and spacing specified
- [ ] Glassmorphism effect documented
- [ ] Icon system defined for all connection types
- [ ] Typography hierarchy specified
- [ ] React implementation provided

---

#### Task 2.5: Specify ChatInterface Component (45 min)

**Component:** `ChatInterface` - Conversational AI for deeper exploration

**Based On:** Material-UI Paper with custom message layout

[Due to length, continuing in next response...]

**Acceptance Criteria:**
- [ ] Message bubble styling specified
- [ ] Input field specifications documented
- [ ] Suggested prompts styling defined
- [ ] Typing indicator specified
- [ ] React implementation provided

---

#### Task 2.6: Specify JourneyRecorder & JourneyPlaylist Components (45 min)

[Specifications for remaining components...]

---

### Day 2 Subtotal: 6 tasks, 4-5 hours

---

## Acceptance Criteria

**Phase 0.5 is complete when:**

- [ ] All Ears design system fully audited
- [ ] Existing components documented (6+ components)
- [ ] Patterns and conventions identified
- [ ] Journey color extensions defined
- [ ] 8 journey components specified:
  - [ ] PathwayNode
  - [ ] JourneyGraph
  - [ ] NarrativeCard
  - [ ] ChatInterface
  - [ ] JourneyRecorder
  - [ ] JourneyPlaylist
  - [ ] JourneyTrackCard
  - [ ] StartingPointSelector
- [ ] Each component has: dimensions, states, animations, React code
- [ ] style-guide.md is 1,000+ lines (Show.me format)
- [ ] design-philosophy.md created
- [ ] All specifications follow All Ears aesthetic
- [ ] Ready for Phase 1 (AI Implementation)

---

## Reference Documentation

- [EXECUTION-PLAN.md](./EXECUTION-PLAN.md) - Daily task breakdown
- [TESTING.md](./TESTING.md) - Design system validation tests
- [PROGRESS.md](./PROGRESS.md) - Track your progress
- [Show.me style-guide.md](/Users/davidbaden/Projects/Show.me/design-system/style-guide.md) - Format reference
- [CLAUDE.md](../../CLAUDE.md) - All Ears codebase guide
- [Material-UI Theme Docs](https://mui.com/material-ui/customization/theming/)

---

## Important Reminders

1. **Audit First, Extend Second**: Document existing patterns before adding new ones
2. **Consistency is Key**: Journey components must feel native to All Ears
3. **Show.me Format**: Follow their comprehensive specification style
4. **Code Examples**: Include React/Material-UI implementation for each component
5. **States Matter**: Document default, hover, active, disabled for interactive elements
6. **Dark Mode**: All Ears uses dark theme, optimize specifications for dark backgrounds
7. **Accessibility**: Include ARIA labels and keyboard navigation in specs

---

## Next Phase

**Phase 1: AI Foundation** - Implement AI pathway generation system using design system specifications for data structure planning.
