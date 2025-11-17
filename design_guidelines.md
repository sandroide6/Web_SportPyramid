# Design Guidelines: Professional Tournament Bracket Management System

## Design Approach: Hybrid Sports Platform

**Primary Inspiration:** Challonge bracket visualization + ESPN tournament interfaces + Material Design data organization

**Key Principle:** Professional sports presentation meeting utility-focused tournament management. Balance competitive aesthetics with efficient data entry and clear hierarchy.

---

## Typography System

**Primary Font:** Inter or Roboto (Google Fonts)
- Headers (Tournament names): 600 weight, 24-32px
- Match participants: 500 weight, 16-18px  
- Scores/results: 700 weight, 20-24px
- Body text (forms, labels): 400 weight, 14-16px
- Status indicators (KO, W, DQ): 600 weight uppercase, 12px

**Hierarchy Rule:** Participant names and scores are always most prominent in match cards

---

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, py-8)
- Component padding: p-4 to p-6
- Section spacing: py-8 to py-12
- Grid gaps: gap-4 to gap-6
- Match card internal spacing: p-4

**Grid Strategy:**
- Tournament list: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Bracket view: Horizontal scrollable canvas for large tournaments
- Match editing panel: 2-column layout (participant info | result entry)
- Settings/import: Single column max-w-2xl centered

---

## Component Library

### Navigation & Controls
- **Top Bar:** Tournament name (left), mode toggle (Referee/Public), theme switch, export menu (right)
- **Action Buttons:** Prominent primary actions (New Tournament, Edit Match, Generate PDF)
- **Tab Navigation:** Tournament overview | Bracket | Participants | Settings

### Match Cards (Core Component)
```
Structure:
┌─────────────────────┐
│ Round X - Match Y   │
├─────────────────────┤
│ 🔴 RED COMPETITOR   │
│ Flag | Name | Cat.  │
│ Score: XX           │
├─────────────────────┤
│ 🔵 BLUE COMPETITOR  │
│ Flag | Name | Cat.  │
│ Score: XX           │
├─────────────────────┤
│ Winner Badge/Status │
└─────────────────────┘
```

**Visual Treatment:**
- Red competitor: subtle warm background tint
- Blue competitor: subtle cool background tint
- Winner: bold border on winning side
- Status badges: KO (red), W (orange), DQ (dark gray)
- Hover state (Referee mode): border highlight + edit icon

### Bracket Visualization
- **Connection Lines:** 2px solid lines connecting matches
- **Spacing:** 32px vertical between rounds, 16px between matches
- **Responsive Strategy:** Vertical stacking on mobile, horizontal canvas on desktop
- **Zoom Controls:** Fixed position bottom-right (Fit to screen, Zoom in/out)

### Forms & Data Entry
- **Import Modal:** Drag-drop zone + manual text input + format selector
- **Tournament Creation Wizard:** Step indicator at top, form sections with clear labels
- **Participant Editor:** Table view with inline editing, bulk actions toolbar
- **Result Entry Panel:** Large touch-friendly inputs, quick-select options (KO, W, DQ)

### Mode Differentiation
- **Referee Mode:** Edit icons visible, all fields interactive, warning yellow accent for caution actions
- **Public Mode:** Clean read-only view, no edit controls, share/export options prominent

---

## Visual Hierarchy Rules

1. **Match Results > Participant Names > Meta Info:** Scores are largest, names second, categories/flags tertiary
2. **Active Tournament > Past Tournaments:** Current bracket full opacity, completed tournaments reduced opacity
3. **Primary Actions > Secondary:** "Create Tournament" and "Edit Match" prominent, export/settings secondary
4. **Winners Highlighted:** Visual distinction (border, badge, opacity shift) for advancing competitors

---

## Responsive Breakpoints

- **Mobile (< 768px):** Vertical bracket flow, stacked match cards, bottom sheet for editing
- **Tablet (768-1024px):** Compact horizontal bracket, side panel for editing
- **Desktop (> 1024px):** Full canvas bracket, modal or side drawer for detailed editing

---

## State & Feedback

- **Loading States:** Skeleton screens for bracket generation
- **Success/Error:** Toast notifications (top-right, 3-second auto-dismiss)
- **Confirmation Dialogs:** For destructive actions (delete tournament, reset bracket)
- **Offline Indicator:** Subtle banner when service worker active
- **Auto-save Indicator:** Small checkmark animation after each edit

---

## Animations (Minimal)

- Match card selection: 150ms scale(1.02) + shadow increase
- Bracket navigation: Smooth scroll with easing
- Winner declaration: Subtle confetti or glow effect (optional, toggleable)
- Mode switching: 200ms fade transition

**Critical:** No distracting animations during active tournament use. Performance over flourish.

---

## Images

**Tournament Placeholder States:**
- Empty state illustration when no tournaments exist (simple line art of bracket structure)
- Sport-specific icons (small, 24x24) for tournament category selection

**No hero images needed** - this is a utility application focused on immediate functionality. Dashboard/list view on entry.