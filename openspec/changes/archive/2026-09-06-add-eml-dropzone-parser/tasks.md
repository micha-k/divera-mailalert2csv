## 1. Static App Structure

- [x] 1.1 Create the static HTML, CSS, and JavaScript entry files for the GitHub Pages app
- [x] 1.2 Add a pinned browser-capable MIME parsing dependency or document the selected CDN import
- [x] 1.3 Ensure the app can be opened locally as a static page without a backend

## 2. File Selection UI

- [x] 2.1 Build a drag-and-drop area that accepts multiple files
- [x] 2.2 Add a file picker control that accepts multiple `.eml` files
- [x] 2.3 Display the selected file list before parsing starts
- [x] 2.4 Mark unsupported file types and exclude them from parsing
- [x] 2.5 Add a parse button that is disabled or guarded when no supported files are selected

## 3. EML and Body Parsing

- [x] 3.1 Implement browser-side file reading for selected `.eml` files
- [x] 3.2 Parse each `.eml` file with the selected MIME parser
- [x] 3.3 Extract and validate the mail `Date` header as `datum`
- [x] 3.4 Extract the decoded plain text body when available
- [x] 3.5 Implement HTML-to-text fallback when no usable plain text body exists
- [x] 3.6 Normalize decoded body text for reliable marker-based parsing

## 4. DIVERA Field Extraction

- [x] 4.1 Implement extraction for `einsatzstichwort` from `Stichwort:`
- [x] 4.2 Implement extraction for `ort` from `Adresse:`
- [x] 4.3 Implement extraction for `priority` from `Sonderrechte/Priorität:`
- [x] 4.4 Implement extraction for `alarm_text` between priority and `Einheiten:`
- [x] 4.5 Implement extraction for `einheit` from `Einheiten:`
- [x] 4.6 Remove known DIVERA footer text from extracted content
- [x] 4.7 Return per-file parse errors when required fields cannot be extracted

## 5. Result Display

- [x] 5.1 Render a results table with one row per processed file
- [x] 5.2 Show `datum`, `einsatzstichwort`, `ort`, `priority`, `alarm_text`, and `einheit` for successful parses
- [x] 5.3 Show file name and error status for failed parses
- [x] 5.4 Keep successful and failed file results visible after a batch parse

## 6. Verification

- [x] 6.1 Verify the provided example `.eml` file produces the expected field values
- [x] 6.2 Verify multiple `.eml` files can be selected and parsed in one run
- [x] 6.3 Verify unsupported files are excluded and reported
- [x] 6.4 Verify all parsing happens locally without backend calls
