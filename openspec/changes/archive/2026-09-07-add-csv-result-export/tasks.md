## 1. CSV Serialization

- [x] 1.1 Add a dependency-free CSV export module with the fixed eight-column schema and successful-result selection helper.
- [x] 1.2 Serialize UTF-8 CSV with a byte-order mark, semicolon delimiters, CRLF line endings, quoted fields, doubled quotes, and normalized embedded line breaks.
- [x] 1.3 Protect every exported field that could be interpreted as a spreadsheet formula after leading whitespace or control characters.
- [x] 1.4 Add Node tests covering column order, empty optional values, semicolons, quotes, multiline text, Unicode, formula protection, and exclusion of failed rows.

## 2. Browser Download Integration

- [x] 2.1 Add a visible `CSV herunterladen` control to the results heading, disabled by default.
- [x] 2.2 Enable the control only when the canonical results array contains at least one successful result and disable it again after clearing results.
- [x] 2.3 Implement download handling that exports all successful results in parse order without consulting table search, status filter, or sort state.
- [x] 2.4 Create and trigger a temporary `text/csv;charset=utf-8` object URL using the filename pattern `divera-alarme-YYYY-MM-DD.csv`, then revoke it.
- [x] 2.5 Style the result heading actions and download control for coherent desktop and mobile layouts.

## 3. Metadata and Documentation

- [x] 3.1 Increment the HTML and JavaScript versions from `0.1.1` to `0.1.2`.
- [x] 3.2 Update the README workflow to mention that all successfully parsed results can be downloaded as CSV for Excel.

## 4. Verification

- [x] 4.1 Run syntax checks, CSV serialization tests, and strict OpenSpec validation.
- [x] 4.2 Verify CSV download state before parsing, after successful and failed parsing, and after clearing results.
- [x] 4.3 Verify active search, status filtering, and sorting do not alter the exported successful rows or their parse order.
- [x] 4.4 Verify the download filename, media type, BOM, delimiters, quoting, line endings, field count, and formula protection in the generated file.
- [x] 4.5 Verify the results heading and CSV control do not overlap or overflow at desktop and mobile viewport sizes.

## 5. Download Activation Regression

- [x] 5.1 Add matching cache-busting version tokens to local stylesheet, app, parser, and CSV-module URLs and increment HTML and JavaScript versions to `0.1.3`.
- [x] 5.2 Add and run a regression test that keeps displayed versions and local asset/module version tokens aligned.
- [x] 5.3 Reload the locally served page and verify the current JavaScript runtime owns the initially disabled CSV control.
