<p align="center">
  <img src="src/logo.png" width="96" height="96" alt="X-TOC logo">
</p>

<h1 align="center">X-TOC</h1>

<p align="center">
  Reading navigation and lightweight clipping for X/Twitter long-form articles.
</p>

<p align="center">
  English · <a href="README.zh-CN.md">中文</a>
</p>

<p align="center">
  <a href="https://github.com/Aries-0331/x-toc/releases"><img src="https://img.shields.io/badge/version-0.4.2-blue" alt="Version 0.4.2"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License"></a>
  <a href="https://chromewebstore.google.com/detail/nbdgpckkcfkomnmdefinikjijgljgjfp?utm_source=item-share-cb"><img src="https://img.shields.io/chrome-web-store/size/nbdgpckkcfkomnmdefinikjijgljgjfp" alt="Chrome Web Store"></a>
</p>

X-TOC is a browser extension for X.com and Twitter.com long-form articles. It adds a table of contents, a floating reading panel, and a local clipping workflow for saving selected passages.

## Features

- Detect headings in X/Twitter long-form articles.
- Show the current article table of contents in the popup.
- Pin a floating TOC panel while reading.
- Drag the floating panel and persist its position.
- Select article text and save it with `save to xtoc`.
- Review saved excerpts in the Options page.
- Export all or selected excerpts as Markdown or JSON.
- Store excerpt data locally with `chrome.storage.local`.

## Install from Source

```bash
git clone https://github.com/Aries-0331/x-toc.git
cd x-toc
npm install
npm run build
```

Load the extension:

1. Open `chrome://extensions/`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select `dist/chromium`.

## Development

```bash
npm run dev
npm run build
npm run build:firefox
npm run build:edge
```

## Privacy

Saved excerpts are stored locally in your browser extension storage. X-TOC does not send saved excerpts to an external server.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
