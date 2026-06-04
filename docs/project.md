# X & Twitter Article TOC

## Overview

X & Twitter Article TOC is a browser extension for reading X/Twitter long-form articles. It provides an article table of contents, a pinnable floating navigation panel, and local excerpt capture for saving selected text.

## Current Version

Version: `0.3.0`

## Chrome Store Single Purpose

X & Twitter Article TOC provides focused reading tools for X/Twitter long-form articles: an interactive table of contents for navigation and local excerpt saving/export for capturing useful passages.

## Core Features

- Detect headings in X/Twitter long-form articles
- Show an article table of contents in the popup
- Pin a floating TOC panel to the page
- Drag and persist the floating panel position
- Select article text and save it as an excerpt
- Manage saved excerpts in the options page
- Select excerpts for batch export or deletion
- Export excerpts as Markdown or JSON

## Excerpt Workflow

1. Select text inside an X/Twitter article.
2. Click `save to xtoc`.
3. The extension saves the excerpt and article metadata locally.
4. Open Options to review saved excerpts.
5. Select excerpts and export them to Markdown or JSON.

## Local Storage

The excerpt MVP uses `chrome.storage.local`.

Storage keys:

- `twitterTocArticles`
- `twitterTocExcerpts`
- `twitterTocExcerptSettings`

## Export Design

Markdown is the primary knowledge-base format because it works well with Obsidian, Logseq, Notion import, and plain file systems.

JSON is kept for automation and future sync integrations.

Export modes:

- All excerpts as Markdown
- All excerpts as JSON
- Selected excerpts as Markdown
- Selected excerpts as JSON

## Project Structure

```text
src/
├── manifest.json
├── background.js
├── content/
│   ├── scripts.js
│   └── styles.css
├── popup/
│   ├── index.html
│   ├── scripts.js
│   └── styles.css
└── options/
    ├── index.html
    ├── scripts.js
    └── styles.css
```

## Development Commands

```bash
npm install
npm run dev
npm run build
npm run build:firefox
npm run build:edge
```

## Notes

The excerpt feature is intentionally not a persistent web highlighter. It captures selected text and metadata for later export, but it does not restore highlights when revisiting the article page.
