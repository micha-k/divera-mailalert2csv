## Why

Parsed alert data can currently be inspected only in the browser table, despite the project's CSV-oriented purpose. Users need a reliable download that opens cleanly in Excel without filtered views silently omitting records or untrusted mail content corrupting the CSV structure or becoming executable spreadsheet formulas.

## What Changes

- Add a CSV download control for parsed alert results.
- Export every successfully parsed result, independent of active table search, status filters, and sorting.
- Exclude failed results and omit the redundant `status` and `error` fields from the CSV.
- Serialize a fixed column set using Excel-friendly UTF-8, delimiters, line endings, quoting, embedded-content escaping, and spreadsheet-formula protection.
- Disable the download control until at least one successful result exists and reset it when results are cleared.
- Version local script and stylesheet URLs so a deployed page cannot combine the new download control with stale cached application modules.
- Increment both the HTML and JavaScript application versions because the change affects UI resources and JavaScript behavior.

## Capabilities

### New Capabilities

- `result-csv-export`: Download all successfully parsed alert records as a structurally safe, Excel-compatible CSV file.

### Modified Capabilities

None.

## Impact

- `index.html` and `styles.css` for the download control, versioned asset URLs, and HTML version.
- `app.mjs` for export selection, CSV serialization, versioned local module imports, browser download behavior, and the JavaScript version.
- A small dependency-free CSV serialization module may be introduced to keep escaping logic testable outside the DOM.
- No backend, upload, spreadsheet library, or XLSX dependency is introduced.
