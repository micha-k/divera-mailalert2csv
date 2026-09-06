## Why

DIVERA 24/7 alert statistics need an easy, privacy-preserving input path that works without IMAP credentials, backend infrastructure, or server-side mail access. Uploading exported `.eml` files directly in a static web page allows users to process alert mails locally and keeps the app compatible with GitHub Pages hosting.

## What Changes

- Add a static web page workflow where users can drag and drop or select multiple `.eml` files.
- Add an explicit parsing action button so users can review selected files before processing starts.
- Parse each uploaded `.eml` file in the browser and extract the DIVERA alert data from the mail body.
- Extract the mail header date and the body fields `einsatzstichwort`, `ort`, `priority`, `alarm_text`, and `einheit`.
- Display parsed results in a table with one row per uploaded mail.
- Show parse status and errors per file when a file cannot be processed or does not match the expected DIVERA body format.

## Capabilities

### New Capabilities

- `eml-alert-import`: Upload, parse, and display DIVERA alert data from multiple `.eml` files in a browser-only web page.

### Modified Capabilities

- None.

## Impact

- Adds the first user-facing static HTML/CSS/JavaScript app surface.
- Introduces a client-side MIME parsing dependency loaded from a common CDN or bundled equivalent.
- Keeps all mail content and parsed alert data in the browser; no backend, IMAP connection, or remote processing is introduced.
- Uses the example `.eml` files under `examples/eml/` as local fixtures for development and manual verification.
