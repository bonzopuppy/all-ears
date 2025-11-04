# PHASE 0.5: EXECUTION PLAN
**Design System Documentation & Extension**

**Duration:** 2 days (8-10 hours total)
**Phase:** 0.5 (Design Foundation)
**Status:** 🟡 Not Started

---

## Prerequisites Checklist

- [ ] Phase 0 complete (infrastructure setup)
- [ ] All Ears running locally (`npm run dev`)
- [ ] Familiar with existing UI (explored app thoroughly)
- [ ] Read CLAUDE.md design system section
- [ ] Have access to Show.me style-guide.md for format reference

---

## Day 1: Audit Existing Design System (4-5 hours)

### Task 1.1: Audit Material-UI Theme (1 hour)

**File:** `/src/components/App.js` (lines 29-56)

**Extract:**
- Colors: Primary #181C1E, Secondary #FF6E1D, backgrounds, borders
- Typography: Prompt font, H1-H6 specs, body text, caption
- Spacing: Identify padding/margin patterns
- Shadows: Document elevation levels

**Create:** `/design-system/audit.md`

**Acceptance Criteria:**
- [ ] Theme colors with hex codes
- [ ] Typography scale complete
- [ ] Spacing patterns identified
- [ ] Shadow values documented

---

### Task 1.2: Audit Existing Components (2 hours)

**Components:**
- Cards: SongSmall, SongMedium, AlbumSmall, AlbumMedium
- Navigation: NavBar (64px height)
- Player: MusicPlayer (88px height, #F4F2F7 background)
- Search: SearchBar, SearchResults
- Menus: TrackContextMenu, QueueContextMenu
- Lists: ListContainer patterns

**For Each:**
- Dimensions (width, height, padding, margin, border-radius)
- States (default, hover, active, disabled)
- Material-UI sx prop patterns
- Typography usage
- Icon usage

**Update:** `/design-system/audit.md`

**Acceptance Criteria:**
- [ ] 6+ components documented
- [ ] All states specified
- [ ] Measurements extracted
- [ ] sx prop patterns captured

---

### Task 1.3: Identify Patterns & Conventions (1 hour)

**Document:**
- Card pattern (consistent border-radius, image aspect ratio)
- Icon usage (sizes, colors, Material-UI icons)
- Button pattern (primary, secondary, icon buttons)
- Spacing pattern (gaps, padding, margins)
- Color usage (primary for emphasis, secondary for accents)

**Create:** `/design-system/patterns.md`

**Acceptance Criteria:**
- [ ] 5+ patterns documented
- [ ] Usage examples for each
- [ ] Do's and don'ts listed

---

### Day 1 Subtotal: 3 tasks, 4-5 hours

---

## Day 2: Create Journey Component Specifications (4-5 hours)

### Task 2.1: Define Journey Color Extensions (30 min)

**New Colors:**
- Pathway types: Influences (#7B61FF), Legacy (#4CAF50), Collaborators (#FF6E1D), Contemporaries (#03A9F4), Genre (#E91E63)
- Graph elements: Node borders, edges, visited states
- Recording UI: Active recording, badge colors

**Add to:** `/design-system/style-guide.md`

**Acceptance Criteria:**
- [ ] 5 pathway type colors defined
- [ ] Graph element colors specified
- [ ] All colors have hex/rgba values

---

### Task 2.2: Specify PathwayNode Component (1 hour)

**Include:**
- Dimensions: 180x240px
- 4 States: default, center, visited, hover
- Badge system (node type indicator)
- Animation specifications
- React/Material-UI implementation example

**Acceptance Criteria:**
- [ ] All dimensions specified
- [ ] 4 states documented
- [ ] Badge system defined
- [ ] React code example provided

---

### Task 2.3: Specify JourneyGraph Component (1 hour)

**Include:**
- Container dimensions and background
- Radial layout pattern (5 nodes, 300px radius)
- Edge styling (2px, dashed, animated)
- Controls (zoom, pan, reset)
- Loading and empty states
- React Flow configuration

**Acceptance Criteria:**
- [ ] Layout pattern specified
- [ ] Edge animation defined
- [ ] Interactions documented
- [ ] React Flow code provided

---

### Task 2.4: Specify NarrativeCard (45 min)

**Include:**
- Glassmorphism styling (backdrop-filter)
- Icon system (5 connection types)
- Typography hierarchy
- React implementation

**Acceptance Criteria:**
- [ ] Visual style specified
- [ ] Icon system complete
- [ ] React code provided

---

### Task 2.5: Specify ChatInterface (45 min)

**Include:**
- Message bubble styling (user vs AI)
- Input field specifications
- Suggested prompts design
- Typing indicator animation

**Acceptance Criteria:**
- [ ] Message bubbles styled
- [ ] Input field specified
- [ ] React code provided

---

### Task 2.6: Specify JourneyRecorder & JourneyPlaylist (45 min)

**JourneyRecorder:**
- Recording controls (start/stop button)
- Visit counter badge
- Action buttons (View Journey)

**JourneyPlaylist:**
- Track card with narrative
- Connection arrows
- Action button group

**Acceptance Criteria:**
- [ ] Both components specified
- [ ] Layout patterns defined
- [ ] React code provided

---

### Task 2.7: Specify StartingPointSelector (30 min)

**Include:**
- Search input styling
- Type filter buttons
- Results list layout

**Acceptance Criteria:**
- [ ] All elements specified
- [ ] React code provided

---

### Task 2.8: Create design-philosophy.md (30 min)

**Include:**
- All Ears design principles
- Journey feature aesthetic considerations
- Graph visualization philosophy
- Narrative presentation approach
- Dark mode optimization
- Accessibility principles

**Acceptance Criteria:**
- [ ] Philosophy documented
- [ ] Principles defined
- [ ] Examples provided

---

### Task 2.9: Final Review & Consolidation (30 min)

**Tasks:**
- Merge audit.md and patterns.md into style-guide.md
- Organize style-guide.md in Show.me format
- Verify all 8 components specified
- Add table of contents
- Proofread and format

**Acceptance Criteria:**
- [ ] style-guide.md is 1,000+ lines
- [ ] All components included
- [ ] Format matches Show.me pattern
- [ ] No missing specifications

---

### Day 2 Subtotal: 9 tasks, 4-5 hours

---

## Time Breakdown

| Day | Tasks | Estimated Time |
|-----|-------|----------------|
| Day 1 | Audit (3 tasks) | 4-5 hours |
| Day 2 | Specifications (9 tasks) | 4-5 hours |
| **Total** | **12 tasks** | **8-10 hours** |

---

## Dependencies for Next Phase

**Phase 1 (AI Foundation) requires:**
- ✅ Component specifications (for planning data structures)
- ✅ Color system (for pathway type identification)
- ✅ Typography (for narrative formatting)

**Phase 2 (Journey UI) requires:**
- ✅ All 8 component specifications
- ✅ Complete style guide
- ✅ React implementation examples

---

## Reference Links

- [Phase 0.5 PROMPT.md](./PROMPT.md) - Master guide
- [Phase 0.5 TESTING.md](./TESTING.md) - Validation tests
- [Phase 0.5 PROGRESS.md](./PROGRESS.md) - Track progress
- [Show.me style-guide.md](/Users/davidbaden/Projects/Show.me/design-system/style-guide.md)
- [Material-UI Theming](https://mui.com/material-ui/customization/theming/)
