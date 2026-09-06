## Why

Parsed alert batches can quickly become difficult to scan once multiple `.eml` files are processed. Sorting and filtering the results table makes it easier to find specific alerts, inspect errors, and compare parsed fields without exporting or reprocessing data.

## What Changes

- Add visible result table controls for full-text filtering and status filtering.
- Keep result filter controls visible but disabled before parsed results exist.
- Add sortable table headers for useful result columns.
- Allow repeated activation of a sortable header to toggle ascending and descending order.
- Reset filter and sorting state when the user clears the local page state.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `eml-alert-import`: Add result table filtering and sorting behavior for parsed `.eml` results.

## Impact

- Updates `index.html`, `styles.css`, and `app.mjs`.
- No backend, persistence, build step, or new dependency is introduced.
- The feature affects display order and visibility only; parsed result data remains unchanged.
