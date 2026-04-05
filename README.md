# arXiv Paper Search (TypeScript Version)

A stunning, modern web application for searching and exploring scientific papers from arXiv.

## Features
- **Express.js & TypeScript**: Robust and type-safe backend.
- **EJS Templating**: Dynamic server-side rendering.
- **Tailwind CSS 4**: Premium, modern, and responsive UI with glassmorphism effects.
- **Fast arXiv Search**: Direct integration with the arXiv API.
- **Export to CSV**: Easily save your search results.
- **Dark Mode**: Built-in sleek dark aesthetic.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript
- **Frontend**: EJS, Tailwind CSS 4, Google Fonts (Outfit)
- **Data**: Axios, fast-xml-parser (arXiv API)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate CSS:
   ```bash
   npm run build:css
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

4. Run in production:
   ```bash
   npm start
   ```

## Project Structure
- `src/`: TypeScript source code.
  - `index.ts`: Server entry point.
  - `services/`: API integration services.
- `views/`: EJS templates for the UI.
- `public/`: Static assets (CSS, images).
- `package.json`: Project dependencies and scripts.
