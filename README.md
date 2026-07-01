# arXiv Paper Search

A modern, dark-themed web application for searching and exploring academic papers from the arXiv open-access archive. Built with Node.js, Express, TypeScript, and Tailwind CSS.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green) ![TypeScript](https://img.shields.io/badge/TypeScript-6.x-blue) ![Express](https://img.shields.io/badge/Express-5.x-lightgrey) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8)

## Features

- **Full-text arXiv Search** — Query papers by keyword across all fields via the arXiv API
- **AI-Powered Filtering** — Results are automatically filtered by Mistral AI for better relevance (optional)
- **Sort Options** — Sort results by Submitted Date, Relevance, or Last Updated
- **Configurable Result Count** — Retrieve 5–100 papers per search using a range slider
- **Dual View Modes** — Switch between a Cards view (with abstracts) and a compact Table view
- **CSV Export** — Download search results as a CSV file with one click
- **Responsive UI** — Works on desktop and mobile
- **Dark Aesthetic** — Glassmorphism-inspired design with amber accents and subtle grid textures

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Language | TypeScript 6 |
| Framework | Express 5 |
| Templating | EJS 5 |
| Styling | Tailwind CSS 4 |
| HTTP Client | Axios |
| XML Parsing | fast-xml-parser |
| Dev Server | tsx + nodemon |

## Project Structure

```
arxiv-paper-search/
├── src/
│   ├── index.ts                # Express server entry point
│   ├── css/
│   │   └── main.css            # Tailwind CSS source
│   └── services/
│       ├── arxiv.service.ts    # arXiv API integration & Paper types
│       └── ai.service.ts       # Mistral AI filtering service
├── views/
│   ├── index.ejs               # Main EJS template (search results)
│   └── landing.ejs             # Landing page with search form
├── public/
│   └── css/
│       └── style.css           # Compiled Tailwind output (gitignored)
├── .env.example                # Environment variables template
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/uxlabspk/arXiv-Paper-Search.git
   cd arXiv-Paper-Search
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file to configure the port and AI settings:

   ```env
   PORT=3000
   MISTRAL_API_KEY=your_mistral_api_key_here
   AI_FILTER_ENABLED=true
   ```

   **AI Configuration:**
   - `MISTRAL_API_KEY`: Get your API key from [Mistral AI Console](https://console.mistral.ai/)
   - `AI_FILTER_ENABLED`: Set to `true` to enable AI filtering of search results
   - `MISTRAL_MODEL`: (Optional) Model to use (default: `mistral-tiny-latest`)
   - `MISTRAL_ENDPOINT`: (Optional) Custom API endpoint

### Running the App

**Development mode** (auto-restarts on file changes):

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. Enter a search query in the sidebar (e.g., `attention mechanism`, `RLHF`, `diffusion models`)
2. Adjust the **Max Results** slider (5–100)
3. Toggle **AI Filter Results** to enable/disable AI-powered relevance filtering
4. Choose a **Sort By** option: Submitted Date, Relevance, or Last Updated
5. Select **Cards** or **Table** view mode
6. Click **Search Papers**
7. View AI filtering status in the results header
8. Click **Abstract** to open the paper on arXiv, or **PDF** to open the PDF directly
9. Click **Download CSV** to export the current results

## AI-Powered Filtering

The application includes optional AI-powered filtering using the **Mistral AI API**. When enabled, each paper returned by arXiv is evaluated by Mistral AI to determine its relevance to your search query.

### How it works:
1. You perform a search query
2. The app fetches results from arXiv API
3. Each paper is sent to Mistral AI for relevance evaluation
4. Only papers approved by AI are shown in the results
5. You can see filtering statistics in the results header

### AI Features:
- **Relevance Scoring**: AI evaluates paper titles, abstracts, and authors against your query
- **Transparent Filtering**: See how many papers were approved vs. rejected
- **Toggle On/Off**: Enable or disable AI filtering per search via the form toggle
- **Fail-Open Design**: If AI service fails, papers are still shown (not blocked)
- **Parallel Processing**: Multiple papers are evaluated simultaneously for performance

### AI Configuration:
```typescript
// In src/services/ai.service.ts
interface AIConfig {
  apiKey: string;           // Your Mistral API key
  model: string;            // Model to use (default: mistral-tiny-latest)
  endpoint: string;         // API endpoint
  enabled: boolean;         // Enable/disable AI filtering
}
```

## arXiv API

The application queries the official [arXiv API](https://arxiv.org/help/api/index) — no API key required.

**Endpoint used:**
```
http://export.arxiv.org/api/query?search_query=all:{query}&max_results={n}&sortBy={criterion}&sortOrder=descending
```

Each result is parsed into the following `Paper` interface:

```typescript
interface Paper {
  title: string;
  authors: string;
  abstract: string;
  date: string;       // YYYY-MM-DD
  url: string;        // arXiv abstract page
  pdf_url: string;    // Direct PDF link
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run the server with `tsx` |
| `npm run dev` | Run with `nodemon` for hot-reloading |


## License

ISC