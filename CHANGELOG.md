# Changelog

Release notes are tracked here and mirrored to GitHub Releases through
`.github/workflows/sync-releases.yml`. GitHub profile automations should read
the published GitHub Releases API once the workflow has been run on `main`.

## 0.2.1 - 2026-06-01

- Expanded TOC title display so long article titles are easier to read.
- Refined popup title styling to keep titles visible without crowding the UI.
- Bumped extension package and manifest versions from `0.2.0` to `0.2.1`.

Commit: `8eb493de91384057224fc0e88c50a87dd54d3c10`

## 0.2.0 - 2026-02-27

- Fixed heading extraction for updated X/Twitter article markup.
- Fixed TOC extraction in fullscreen article views.
- Added versioned build archive output to `.gitignore`.
- Bumped extension package and manifest versions from `0.1.0` to `0.2.0`.

Commit: `c72e64e60f0c20bb61645e1baaddd144bd24b0f4`

## 0.1.0 - 2026-02-25

- Added the pinnable floating TOC panel for X/Twitter long-form articles.
- Added drag-to-move behavior and persisted panel position.
- Added popup controls, options entry point, and production build zip script.
- Replaced the starter extension metadata with XTOC package, manifest, and
  README content.

Commit: `bb4cc4fe385721f8b1f5d0da2f1b4ddc6006ca7c`
