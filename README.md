# ContentReflow

**Know where every piece of content has been.**

ContentReflow is a content repurposing tracker for solo creators. Track which blog posts have become tweets, LinkedIn posts, YouTube scripts, and more — all in one visual matrix.

## Features

- 📊 **Status Matrix** — Visual grid showing repurposing status across 6 platforms at a glance
- 📝 **Content Inventory** — Add and manage all your content pieces with type, URL, and notes
- 🔍 **Detail View** — Click into any content to see per-platform entries with status, URL, and notes
- 📈 **Dashboard** — See repurposing rate, untouched content, and neglected platforms
- 💾 **localStorage** — All data stays on your device, no account needed
- 📤 **Export/Import** — JSON export/import for backup and portability
- 📱 **Mobile-first** — Responsive design that works on any device

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- shadcn/ui components
- localStorage persistence
- No database, no auth, no external APIs

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Platforms Supported

- Twitter/X
- LinkedIn
- YouTube
- Newsletter
- Instagram
- TikTok

## Status Cycle

Click any cell in the matrix to cycle through:
1. **—** (Not started) → **Done** ✅
2. **Done** → **Planned** 🟡
3. **Planned** → **Skipped** ⏭️
4. **Skipped** → **Done** ✅

## License

MIT