## 1. Independent Application Versions

- [x] 1.1 Increment the static HTML version in `index.html` from `0.1.0` to `0.1.1`.
- [x] 1.2 Increment `APP_JS_VERSION` in `app.mjs` from `0.1.0` to `0.1.1`.
- [x] 1.3 Verify that a loaded page displays `HTML v0.1.1` and that JavaScript writes `JS v0.1.1` at runtime.

## 2. Page Branding

- [x] 2.1 Add `docs/logo.png` immediately to the left of the existing page title group with decorative image semantics.
- [x] 2.2 Add constrained logo and title-group styles that preserve the current header alignment and spacing.
- [x] 2.3 Verify that the logo, title, and privacy note do not overlap or overflow at desktop and mobile viewport sizes.

## 3. README Branding and Usage

- [x] 3.1 Display `docs/logo.png` near the README title using a relative path, constrained dimensions, and descriptive alternative text.
- [x] 3.2 Link the hosted GitHub Pages app prominently and document local static-server setup as an optional self-hosting path with a concrete command and browser URL.
- [x] 3.3 Document file selection or drag and drop, explicit parsing, and result search, status filtering, and sorting.
- [x] 3.4 Document that mail processing remains local and that selected files and results are transient across reload or close.

## 4. Verification

- [x] 4.1 Validate the OpenSpec change and confirm the versioning, branding, and documentation scenarios are covered.
- [x] 4.2 Verify the README logo path resolves and the page logo asset loads from the static server.
- [x] 4.3 Confirm the existing file-selection, parsing, filtering, sorting, footer attribution, and unload-warning behavior remains intact.
