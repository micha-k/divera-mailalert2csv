## Why

The displayed HTML and JavaScript versions remain at `0.1.0` even after changes to their respective application areas, so the footer does not reliably identify the delivered code. The app also has an existing logo that is not used in the interface or README, while the README's usage guidance is too brief for users who need to start and operate the browser app.

## What Changes

- Define an independent version increment policy for the HTML/UI and JavaScript application areas, including which files affect each version and when neither version changes.
- Increment the HTML and JavaScript versions for this change to account for the affected UI and script areas.
- Display `docs/logo.png` at a compact size to the left of the page title without disrupting the responsive header layout.
- Display the same logo in the README.
- Link the hosted GitHub Pages app prominently in the README and expand the usage guidance, making local server instructions explicitly optional for self-hosting.
- Document the normal app workflow, local processing, and page-reload behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `eml-alert-import`: Extend app metadata requirements with independent version increment rules, add application branding requirements, and specify user-facing usage documentation.

## Impact

- `index.html` and `styles.css` for logo placement, responsive presentation, and the HTML version.
- `app.mjs` for the JavaScript version.
- `README.md` for logo presentation, the hosted-app link, and expanded hosted and local usage instructions.
- `docs/logo.png` is reused as an existing static asset; no new runtime dependency is introduced.
