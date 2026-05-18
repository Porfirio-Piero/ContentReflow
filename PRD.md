# 📋 Product Requirements Document: ContentReflow

## Overview
**Project Name:** ContentReflow  
**Tagline:** "Know where every piece of content has been"  
**Problem Statement:** Content creators with multi-platform presence can't track which blog posts have become tweets, LinkedIn posts, YouTube scripts, or newsletter segments. They waste time recreating content they already have and miss repurposing opportunities.  
**Target User:** Solo content creators, newsletter writers, indie hackers doing content marketing across 3+ platforms  
**MVP Build Time Estimate:** 6 hours  
**Date:** 2026-05-18  
**PRD Version:** 1.0  
**Selected Problem:** prob-005 (Score: 10.0/10)

---

## Problem Validation

### User Evidence
- **Source 1 (Reddit r/productivity):** "I have 100+ blog posts but can't keep track of which ones I've turned into tweets, LinkedIn posts, YouTube scripts. I end up recreating content I already have."
- **Source 2 (IndieHackers):** Content creators consistently cite "keeping track of what I've already published where" as a top pain point — not creation, but tracking.
- **Source 3 (Dedup check from May 12 scout):** Content repurposing came up before but with an automation angle. This is a *tracking* angle — different solution space.

### Market Validation
- ✅ Content repurposing tools market growing rapidly (creator economy boom)
- ✅ Repurpose.io exists but automates — doesn't help you *track* what's been done
- ✅ Notion templates exist but aren't purpose-built (they're just databases)
- ✅ Solo creators need this, not teams — lower friction for adoption
- ✅ Free tool gap: no dead-simple "what have I posted where?" tracker

### Competitive Landscape
| Competitor | Price | Gap |
|------------|-------|-----|
| Repurpose.io | $15-83/mo | Automates repurposing but doesn't track what's been done |
| Notion Templates | Free | Generic databases, no purpose-built repurposing workflow |
| Airtable Templates | Free tier | Too much setup, not mobile-friendly |
| ContentCal | $19/mo | Scheduling focus, not repurposing tracking |
| **ContentReflow** | Free (localStorage) | Purpose-built content repurposing tracker. Simple. Mobile-friendly. |

---

## User Persona

**Name:** Creator Chloe  
**Role:** Solo content creator / indie hacker  
**Age:** 25-40  
**Context:** Writes a weekly newsletter, posts on Twitter/X, LinkedIn, and sometimes YouTube. Has 100+ pieces of content scattered across platforms.

**Pain Point:** Can't remember which blog posts have been turned into tweets, which YouTube videos became LinkedIn articles, or which newsletter segments are still waiting to be repurposed.

**Current Workflow:** Scattered Google Sheet that's always out of date, or just… guessing. "Did I already tweet about this? Let me scroll through my timeline."

**Desired Outcome:** "Show me all my content pieces and which platforms each one has been repurposed to. Let me see at a glance what's untouched and what's done."

**Willingness to Pay:** Medium — would use if free, might pay for cloud sync later  
**Tech Comfort:** High — daily user of multiple platforms and tools

---

## MVP Features (P0 Only — 3 Features, 6 hours total)

### Feature 1: Content Inventory with Status Matrix (2.5 hours)
**Priority:** P0  
**User Story:** As a creator, I want to see all my content pieces in one place with a visual status matrix showing which platforms each piece has been repurposed to.  
**Acceptance Criteria:**
- [ ] Add content piece (title, type: blog/newsletter/video/podcast, original URL, date)
- [ ] Visual status matrix: columns for each platform (Twitter/X, LinkedIn, YouTube, Newsletter, Instagram, TikTok) with checkmark/empty cells
- [ ] Click a cell to toggle repurposing status (done/planned/not started)
- [ ] Color coding: green = done, yellow = planned, empty = not started
- [ ] Filter by type, platform, or completion status
- [ ] Sort by date, title, or completion percentage
**Complexity:** Moderate  
**Estimated Hours:** 2.5

### Feature 2: Content Detail View with Repurposing Notes (2 hours)
**Priority:** P0  
**User Story:** As a creator, I want to click on a content piece and see details about each repurposed version — what was changed, the new URL, and any notes.  
**Acceptance Criteria:**
- [ ] Click content title → detail view with all platform entries
- [ ] Each platform entry has: status (done/planned/skipped), URL of repurposed piece, notes
- [ ] Add/edit notes per platform entry ("condensed to 3 tweets", "turned into LinkedIn carousel")
- [ ] "Open original" link to source content
- [ ] Quick-add new platform entry from detail view
- [ ] Delete platform entries that are no longer relevant
**Complexity:** Simple  
**Estimated Hours:** 2

### Feature 3: Dashboard with Repurposing Gaps (1.5 hours)
**Priority:** P0  
**User Story:** As a creator, I want to see at a glance which content pieces haven't been repurposed yet and which platforms I'm neglecting.  
**Acceptance Criteria:**
- [ ] Dashboard shows: total content pieces, total repurposed, repurposing rate (%)
- [ ] "Untouched" section: content with zero repurposed platforms (biggest opportunity)
- [ ] "Neglected platforms" section: which platforms have the fewest repurposed pieces
- [ ] Quick-action: click untouched content → go to detail view to add repurposing
- [ ] Stats update in real-time as content is added/updated
**Complexity:** Simple  
**Estimated Hours:** 1.5

---

## Post-MVP Features (NOT building now — for reference only)

These are explicitly excluded from this build:
- AI-powered repurposing suggestions (P1)
- Content calendar view (P1)
- Platform-specific format templates (P1)
- Import from RSS/substack (P2)
- Browser extension for quick-add (P2)
- Cloud sync / multi-device (P2)
- Team collaboration (P2)

---

## Technical Requirements

### Tech Stack
```yaml
Framework: Next.js 14 (App Router)
Styling: Tailwind CSS
UI Components: shadcn/ui (Table, Dialog, Badge, Card, Button)
Storage: localStorage with JSON export/import (no server database)
Account System: None — single-user local app, no auth needed
Deployment: Vercel via GitHub Actions
State: React useState/useReducer + localStorage persistence
```

### Key Architecture Decisions for MVP Speed
1. **No server database** — All data in localStorage. Export/import JSON for backup and portability. A creator with 200 pieces of content × 6 platforms produces ~500KB — well within localStorage limits.
2. **No account system** — Single-user app. Your content, your device. V2 adds optional cloud sync.
3. **No real-time or collaboration** — Solo tool. No WebSockets, no shared state.
4. **No external APIs** — No fetching content from platforms. User adds content manually.
5. **Mobile-first** — Creators check their phone between recording sessions. Must work on mobile.

### Data Model
```
Content: {
  id: string,
  title: string,
  type: "blog" | "newsletter" | "video" | "podcast" | "social" | "other",
  originalUrl?: string,
  createdAt: string (ISO date),
  notes?: string
}

PlatformEntry: {
  id: string,
  contentId: string,
  platform: "twitter" | "linkedin" | "youtube" | "newsletter" | "instagram" | "tiktok" | "other",
  status: "done" | "planned" | "skipped",
  url?: string,
  notes?: string,
  updatedAt: string (ISO date)
}

// localStorage keys
"contentreflow_content" -> Content[]
"contentreflow_entries" -> PlatformEntry[]
```

### External APIs
- None for MVP (all client-side)
- Future V2: RSS import, browser extension, optional cloud sync

---

## Success Metrics

### MVP Launch Criteria
- [ ] All 3 P0 features functional
- [ ] Can add, edit, and delete content pieces
- [ ] Status matrix displays correctly with toggle interaction
- [ ] Detail view shows all platform entries with notes
- [ ] Dashboard shows stats and identifies gaps
- [ ] Data persists in localStorage across sessions
- [ ] JSON export/import works
- [ ] Works on mobile Chrome/Safari and desktop Chrome
- [ ] Build passes on Vercel

---

## Risks & Mitigation

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| localStorage limits | Low | 200 pieces × 6 platforms ≈ 500KB. Export for backup. |
| No cloud sync = single device | Medium | V2 adds optional sync. localStorage export is backup. |
| Too many platforms in matrix | Low | Start with 6 core platforms. Custom platforms in V2. |
| Users want AI suggestions | Medium | V1 is tracking only. Validate demand first. |
| Mobile UX on status matrix | Medium | Responsive grid with horizontal scroll on mobile. |

---

## Build Plan (6 hours)

| Hour | Task | Deliverable |
|------|------|-------------|
| 1 | Project setup, layout, types, data model | Next.js project, data models, layout shell |
| 2 | Content inventory + status matrix | Content list, add/edit/delete, matrix grid |
| 3 | Status matrix toggle + filtering | Interactive matrix cells, filter/sort controls |
| 4 | Content detail view + platform entries | Detail page, platform entry CRUD, notes |
| 5 | Dashboard + gap analysis | Stats, untouched section, neglected platforms |
| 6 | Polish, responsive, export/import, deploy | Mobile CSS, JSON export/import, Vercel live URL |

---

## Appendix

### Research Sources
- Reddit r/productivity: "What productivity tool do you wish existed?" (content tracking mentions)
- IndieHackers: Creator pain points discussion
- Repurpose.io: Automation-focused, tracking gap confirmed
- May 12 scout: Content repurposing (automation angle) — different from our tracking angle

### Problem Scout Reference
- **Scout Run ID:** de4acfc4-f438-ba0a-9f41-2d20d591b7c0
- **Problem ID:** prob-005
- **Score:** 10.0/10
- **Source data:** `overnight-factory/2026-05-17/problems-discovered.json`

---

*PRD created by BotFather — Overnight App Factory Phase 2 (Product Owner)*  
*Date: 2026-05-18T04:30:00Z*