# Mock Data Notes

The mock data in `mock-excerpts.json` is built from the supplied article table.

It uses real article titles, author names, X article URLs, and the summary text from the table. It does not invent article body content.

## Files

- `mock-excerpts.json`: `chrome.storage.local`-shaped mock data
- `options-demo.html`: static normal-state screenshot page
- `options-demo-selected.html`: static selected-state screenshot page

## Use in Extension Options

To load the mock data into a local unpacked extension during manual testing:

1. Open the extension Options page.
2. Open DevTools for the Options page.
3. Paste a `chrome.storage.local.set(...)` payload using the contents of `mock-excerpts.json`.
4. Reload the Options page.

The JSON root already matches the extension storage keys:

- `twitterTocArticles`
- `twitterTocExcerpts`
- `twitterTocExcerptSettings`

## Source Scope

The mock excerpts are summaries from the provided table, not full article quotations. This keeps the data truthful and avoids claiming access to article text that was not provided.
