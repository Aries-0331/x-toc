# X & Twitter Article TOC

A browser extension that adds an interactive table of contents and lightweight excerpt capture to X.com and Twitter long-form articles.

[![Version](https://img.shields.io/badge/version-0.3.0-blue)](https://github.com/Aries-0331/twitter-toc-extension/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/size/nbdgpckkcfkomnmdefinikjijgljgjfp)](https://chromewebstore.google.com/detail/nbdgpckkcfkomnmdefinikjijgljgjfp?utm_source=item-share-cb)

## Features

- **Automatic TOC Detection** - Automatically detects headings in long-form articles
- **Floating Panel** - Pinnable panel that stays on screen while reading
- **Drag-to-Move** - Position the TOC panel anywhere on the screen
- **Position Persistence** - Remembers your panel position across sessions
- **Dark Mode Support** - Automatically matches X.com's light/dark theme
- **Article Title** - Includes article title as the first TOC entry
- **Excerpt Saving** - Select text in an article and save it with one click
- **Local Excerpt Library** - Manage saved excerpts from the options page
- **Markdown / JSON Export** - Export all excerpts or selected excerpts for Obsidian, Notion, Logseq, or other knowledge-base workflows

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/Aries-0331/twitter-toc-extension.git
cd twitter-toc-extension

# Install dependencies
npm install

# Build for development
npm run dev

# Build for production
npm run build
```

### Loading in Browser

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/chromium` folder

## Usage

### Table of contents

1. Visit any long-form article on X.com or Twitter.com
2. Click the extension icon in the toolbar
3. The table of contents will appear in the popup
4. Click the pin icon to show a floating panel on the page
5. Drag the panel to reposition it

### Saving excerpts

1. Open an X/Twitter long-form article
2. Select text in the article body
3. Click the floating `save to xtoc` button
4. Open `Options` from the popup to view saved excerpts
5. Use checkboxes to select excerpts for export or deletion

## Excerpt Storage

Excerpt data is stored locally in the extension with `chrome.storage.local`.

Storage keys:

- `twitterTocArticles`
- `twitterTocExcerpts`
- `twitterTocExcerptSettings`

Exports support:

- Markdown for note-taking apps and personal knowledge bases
- JSON for future sync or automation workflows

## Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Build for specific browser
npm run build:firefox
npm run build:edge
```

## Releases

Release history is tracked in [CHANGELOG.md](CHANGELOG.md) and
[docs/releases.json](docs/releases.json). Release package names and GitHub
Release titles use the `v0.3.0` format without an XTOC/project-name prefix.

## Project Structure

```
src/
├── manifest.json        # Extension manifest (Manifest V3)
├── background.js        # Service worker
├── logo.png            # Extension icon
├── content/
│   ├── scripts.js     # TOC extraction, floating panel, excerpt saving
│   └── styles.css     # Panel and excerpt button styles
├── popup/
│   ├── index.html
│   ├── scripts.js     # Popup TOC UI and options entry
│   └── styles.css
└── options/
    ├── index.html
    ├── scripts.js     # Excerpt library, export, deletion
    └── styles.css
```

## Tech Stack

- [Extension.js](https://extension.js.org) - Build tool
- Vanilla JavaScript - No frameworks
- Chrome Manifest V3

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Extension.js](https://extension.js.org) for the build system
