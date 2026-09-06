## Why

The static parser page should expose lightweight maintenance metadata so users can identify the HTML and JavaScript versions they are running. It should also reduce accidental data loss when users reload, close, or navigate away after selecting or parsing local `.eml` files.

## What Changes

- Add a page footer with visible HTML and JavaScript version information.
- Render the JavaScript version from `app.mjs` at runtime into the footer.
- Add footer attribution text: `developed with ❤️ by micha-k`, with `micha-k` linking to the matching GitHub profile.
- Add a browser leave/reload guard that warns users when selected files, parsed results, or active parsing state may be lost.
- Keep the guard best-effort and browser-native, acknowledging that modern browsers control the exact confirmation wording.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `eml-alert-import`: Add app footer metadata/attribution and protect in-progress or retained local parsing state from accidental page unload.

## Impact

- Updates `index.html`, `styles.css`, and `app.mjs`.
- No backend, storage, build tooling, or new runtime dependency is introduced.
- Browser unload behavior remains limited by each browser's implementation of `beforeunload`.
