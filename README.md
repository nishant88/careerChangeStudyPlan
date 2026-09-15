# LevelUp — Executive TPM & Product Self-Study Companion

**LevelUp** is a personal self-study and skill-tracking web application engineered for a Technical Delivery Manager / Product Owner accelerating into a **Technical Program Manager (TPM)** role with secondary **Product Management** depth.

---

## Key Features

1. **Structured 12-Week Curriculum (Pre-Seeded)**
   - **Phase 1: Program Management Rigor (Weeks 1–4)**: RAID logs, quantitative risk governance, structured PRDs/INVEST criteria, delivery metrics (Velocity, Cycle Time, CFD), cross-team dependency mapping, and steering committees.
   - **Phase 2: Technical Fluency (Weeks 5–8)**: REST API contracts, webhooks & idempotency, system design fundamentals (caching, load balancing, CAP theorem), quality engineering & canary release pipelines, and SQL telemetry analytics.
   - **Phase 3: Product Strategy & Executive Communication (Weeks 9–12)**: Prioritization frameworks (RICE, Cost of Delay / WSJF), outcome-driven OKRs, McKinsey/Minto Pyramid Principle communication (SCQA 1-pagers), and AI-augmented PM workflows.
   - Each week includes: learning goal, authoritative seed guides, and an **"Apply it at work"** practical assignment tailored to enterprise platforms.

2. **Intelligent Daily Topic Crawler (Core Engine)**
   - Automatically executes once daily at **07:00 AM** via `node-cron`.
   - Crawls fresh, high-signal resources for all currently active topics (**Now** backlog column + current week).
   - **Deduplication Engine**: Hashes every discovered URL with SHA-256; never shows or stores duplicate material.
   - **Priority Weighting**:
     - `High`: 3–4 fresh finds per day.
     - `Medium`: 2 fresh finds per day.
     - `Low`: 1 fresh find per day.
     - `Paused / Archived`: 0 finds.
   - Sources: Hacker News Algolia live queries, high-authority engineering publications (Martin Fowler, Pragmatic Engineer, Lenny's Newsletter, AWS Architecture, Netflix Tech Blog, Stripe Engineering, Uber Engineering), and an optional search engine adapter.

3. **Now / Next / Someday Topic Backlog**
   - Lightweight Kanban board to manage custom learning interests.
   - Topics in **Now** are actively crawled; moving a topic to **Next** or **Someday** immediately pauses crawling for it.
   - Quick-add topic bar always accessible in the top header.

4. **Saved Resource Library**
   - One-click "Save for Later" moves articles from the morning feed into your permanent library.
   - Filter by topic, publisher/domain, or read/unread status.
   - Full-text search across titles, summaries, and your own personal takeaway notes.

5. **Executive Dashboard & Focus Session**
   - Today's crawl digest cards with quick actions: *Save for Later*, *Mark as Read*, *Dismiss*.
   - Current active week spotlight and workplace action item checklist.
   - 45-minute daily focus study timer with audio chime and automatic study-session logging.
   - Real-time streak tracking (flame counter) and monthly reading metrics.

---

## Tech Stack & Architecture

- **Backend**: Node.js + Express + `better-sqlite3`
  - Local database file in `server/data/levelup.db` (zero external DB installation required).
  - Background scheduler using `node-cron`.
- **Frontend**: React 18 + Vite 5 + **Vanilla CSS Design System**
  - Custom glassmorphism, responsive grid, dark/light mode toggle.
  - Typography: Google Fonts `Outfit`, `Plus Jakarta Sans`, and `JetBrains Mono`.
  - Crisp icons via `lucide-react`.
- **Single-Command Developer Workflow**:
  - `npm run dev`: Starts Express backend (port 3001) and Vite client (port 5173 with proxy) concurrently.
  - `npm start`: Runs the production server on `http://localhost:3000`.

---

## Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the App

#### Option A: Production Mode (Single Command)
```bash
npm run build
npm start
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option B: Development Mode (Hot Reload)
```bash
npm run dev
```
Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How the Daily Crawler Works

### Automated Crawl Schedule
By default, the crawler runs every morning at **07:00 AM** local time (`0 7 * * *`). You can change this schedule at any time inside the app's **Settings Modal** (gear icon in the top right) or via the `CRAWLER_CRON` environment variable.

### Trigger Crawl Manually
You can trigger a fresh crawl on demand at any time:
1. Click **"Crawl Now"** in the top navigation bar or **"Refresh Crawl"** on the dashboard.
2. Or run the standalone CLI script in your terminal:
   ```bash
   npm run crawl
   ```

---

## Managing Your Own Topics

1. **Quick-Add Topic**: Type any topic into the header's input (e.g. `Distributed Tracing with OpenTelemetry`) and press `Enter`. It will be added to the **Now** queue with high priority and picked up by the crawler.
2. **Add Topic with Notes**: Click **"Add New Topic"** in the **Topic Backlog** tab to specify:
   - Topic name
   - *"Why I want to learn this"* (personal context/intent)
   - Priority (`High`, `Medium`, or `Low`)
   - Initial backlog column (`Now`, `Next`, or `Someday`)
   - Tags
3. **Pausing or Resuming Crawling**: Drag or click the move buttons on any topic card to shift it between columns:
   - `Now` = Actively searched by crawler every day.
   - `Next` / `Someday` = Inactive/paused.
4. **Deleting or Archiving**: Click the trash icon on any topic card. It will be archived and immediately excluded from future crawls.

---

## Database Management & Reseeding

All data persists in `server/data/levelup.db`.

If you ever want to reset or re-seed the initial 12-week curriculum and sample topics:
```bash
npm run seed
# or for a clean wipe:
node server/db/seed.js --force
```

---

## Optional: Custom Search API Configuration

LevelUp includes an intelligent multi-source fetcher (free Hacker News Algolia live queries, high-authority engineering feeds, and a curated technical knowledge vault) so **no API keys are required** to use the crawler out of the box.

If you wish to hook in an external search API (e.g., SerpAPI or Tavily), create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
And add your key:
```env
SERPAPI_KEY=your_key_here
```
