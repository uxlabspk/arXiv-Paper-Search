<div align="center">

# arXiv Paper Search

### Search academic papers without the noise.

A **modern, dark-themed** web app for searching and exploring papers from the arXiv open-access archive — with optional AI-powered relevance filtering.

No API keys required for arXiv search. Mistral AI is optional for smarter filtering.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Express](https://img.shields.io/badge/Express-5.x-lightgrey?style=flat-square)](https://expressjs.com/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/) [![License](https://img.shields.io/badge/License-ISC-00C853?style=flat-square)](LICENSE)

</div>

---

## Why?

Most academic search tools are either bare-bones or bloated. arXiv's own search returns walls of text with no filtering intelligence. This app gives you a clean, fast interface with optional AI filtering that actually understands whether a paper is relevant to your query — not just keyword matching.

> "Search smarter, not harder."

---

## Features

### Full-text arXiv Search

Query papers by keyword across all fields via the arXiv API. No API key required — just type and search.

### AI-Powered Filtering

Optional Mistral AI integration evaluates each paper's relevance to your query. Toggle it on or off per search. See exactly how many papers passed or were filtered out.

### Sort Options

Sort results by Submitted Date, Relevance, or Last Updated Date.

### Configurable Result Count

Retrieve 5–100 papers per search using a simple range slider.

### Dual View Modes

Switch between a **Cards** view (with abstracts, authors, and staggered animations) and a compact **Table** view for quick scanning.

### CSV Export

Download your search results as a CSV file with one click — ready for spreadsheets or further analysis.

### Dark Aesthetic

Glassmorphism-inspired design with amber accents, ambient glow orbs, and subtle grid textures. Responsive on desktop and mobile.

### And more

- **Fail-open AI** — if Mistral fails, papers still show unfiltered
- **Parallel AI processing** — multiple papers evaluated simultaneously
- **Transparent filtering** — see approved vs. rejected counts in the results header
- **Responsive layout** — sidebar on desktop, stacked on mobile
- **Error handling** — dedicated states for empty queries, no results, and API failures

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Run it

```bash
git clone https://github.com/uxlabspk/arXiv-Paper-Search.git
cd arXiv-Paper-Search
npm install
```

**(Optional)** Create a `.env` file to enable AI filtering:

```env
PORT=3000
MISTRAL_API_KEY=your_mistral_api_key_here
AI_FILTER_ENABLED=true
```

Get your API key from [Mistral AI Console](https://console.mistral.ai/).

**Development mode** (hot-reload):

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## How it works

```
You type a query
    ↓
Express route         GET /search with query params (q, max, sort, ai_filter)
    ↓
arXiv API             Fetches papers via http://export.arxiv.org/api/query
    ↓
XML Parser            fast-xml-parser parses response into Paper objects
    ↓
(Optional) Mistral AI Each paper evaluated for relevance in parallel
    ↓
EJS Template          Renders results in Cards or Table view
    ↓
Browser               Dark UI with sort, filter stats, CSV export
```

**AI filtering flow:** Query hits `/search` → arXiv returns N papers → each paper's title + abstract + authors sent to Mistral → AI returns `{approved, reason}` → only approved papers render → stats shown in header.

**Fail-open:** If Mistral times out (30s) or errors, all papers pass through unfiltered.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | **Node.js 18+** |
| Language | **TypeScript 6** |
| Server | **Express 5** |
| Templating | **EJS 5** |
| Styling | **Tailwind CSS 4** |
| HTTP Client | **Axios** |
| XML Parsing | **fast-xml-parser** |
| AI API | **Mistral AI** (optional) |
| Dev Server | **tsx + nodemon** |

---

## Project Structure

```
arxiv-paper-search/
├── src/
│   ├── index.ts                  # Express server entry point
│   ├── css/
│   │   └── main.css              # Tailwind CSS source
│   └── services/
│       ├── arxiv.service.ts      # arXiv API integration & Paper types
│       └── ai.service.ts         # Mistral AI filtering service
├── views/
│   ├── landing.ejs               # Landing page with search form
│   └── index.ejs                 # Search results (cards + table)
├── public/
│   └── css/
│       └── style.css             # Compiled Tailwind output
├── .env.example                  # Environment variables template
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## Configuration

All settings live in `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `MISTRAL_API_KEY` | `''` | Mistral AI API key |
| `AI_FILTER_ENABLED` | `false` | Enable AI-powered relevance filtering |
| `MISTRAL_MODEL` | `mistral-tiny-latest` | Model to use |
| `MISTRAL_ENDPOINT` | `https://api.mistral.ai/v1/chat/completions` | Custom API endpoint |

---

## Contributing

1. Fork it
2. Create a branch (`git checkout -b feat/my-thing`)
3. Commit (`git commit -m 'Add my thing'`)
4. Push (`git push origin feat/my-thing`)
5. Open a PR

---

## License

ISC — do whatever you want with it.

---

**If this saves you from yet another clunky academic search UI, give it a star.**

It helps others find it, and tells me this is worth continuing.

[⭐ Star this repo](https://github.com/uxlabspk/arXiv-Paper-Search/stargazers)
