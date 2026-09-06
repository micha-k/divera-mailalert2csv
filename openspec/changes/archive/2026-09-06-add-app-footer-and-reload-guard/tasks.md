## 1. Footer Metadata

- [x] 1.1 Add footer markup to `index.html` with a static HTML version label, a JavaScript version placeholder, and developer attribution.
- [x] 1.2 Link the `micha-k` attribution text to `https://github.com/micha-k`.
- [x] 1.3 Add footer styling in `styles.css` that fits the existing app layout on desktop and mobile.

## 2. Runtime JavaScript Version

- [x] 2.1 Add a JavaScript version constant in `app.mjs`.
- [x] 2.2 Populate the footer JavaScript version placeholder during module initialization.
- [x] 2.3 Keep version population tolerant of the footer element being absent.

## 3. Page Unload Guard

- [x] 3.1 Track whether parsing is currently active.
- [x] 3.2 Add a `beforeunload` handler that requests native confirmation when selected files, active parsing, or parsed results exist.
- [x] 3.3 Ensure clearing files/results disables the unload warning for a clean page state.
- [x] 3.4 Ensure the unload guard does not interfere before the user has selected files or generated results.

## 4. Verification

- [x] 4.1 Verify the footer displays the HTML version, runtime JavaScript version, and attribution link.
- [x] 4.2 Verify selected files trigger a reload/navigation warning in a browser that supports `beforeunload`.
- [x] 4.3 Verify parsed results trigger a reload/navigation warning.
- [x] 4.4 Verify clearing the page state removes the reload/navigation warning.
