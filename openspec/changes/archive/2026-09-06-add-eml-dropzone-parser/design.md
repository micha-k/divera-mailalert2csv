## Context

The app is intended to run as a static GitHub Pages site. Earlier exploration ruled out direct browser-side IMAP access because normal web pages cannot open raw IMAP TCP/TLS connections. The import path for this change is therefore user-provided `.eml` files that are parsed entirely in the browser.

The current repository has no existing app implementation or OpenSpec capabilities. A sample DIVERA 24/7 `.eml` file exists under `examples/eml/` and shows a `multipart/alternative` email with a `text/plain` body and an HTML fallback. The relevant alert data is contained in the mail body, while the alert date comes from the mail `Date` header.

## Goals / Non-Goals

**Goals:**

- Provide a static HTML/CSS/JavaScript page that accepts multiple `.eml` files through drag and drop and file selection.
- Let the user explicitly start parsing after selecting files.
- Parse MIME content locally in the browser and prefer the decoded plain text body.
- Extract `datum`, `einsatzstichwort`, `ort`, `priority`, `alarm_text`, and `einheit`.
- Display one table row per parsed mail and expose parse errors per file.
- Keep the implementation suitable for GitHub Pages hosting.

**Non-Goals:**

- No IMAP, SMTP, mailbox login, or backend service integration.
- No server-side processing or persistence.
- No statistical aggregation or CSV export in this change.
- No support for arbitrary email formats beyond the DIVERA alert body structure defined in the spec.

## Decisions

### Browser-only static app

The app will be implemented as static HTML, CSS, and JavaScript so it can be hosted on GitHub Pages without a backend. All selected files will be processed in memory in the user's browser.

Alternative considered: a small IMAP backend proxy. This would support mailbox access, but adds deployment, credential handling, and operational complexity that is unnecessary for an `.eml` upload workflow.

### MIME parsing via a browser-capable library

The implementation will use PostalMime or an equivalent browser-capable MIME parser to decode `.eml` files. The parser must return the mail `Date` header and decoded text and/or HTML bodies.

Alternative considered: manual MIME and quoted-printable parsing. This is fragile because real `.eml` files include multipart boundaries, transfer encodings, charsets, and folded headers.

### Prefer plain text body

The parser will use the decoded `text/plain` body when available. If no plain text body exists, it will derive readable text from the HTML body by stripping markup and normalizing whitespace.

Alternative considered: parse the HTML template directly. The text body is simpler, less layout-dependent, and already contains the relevant DIVERA content in the sample file.

### Marker-based DIVERA field extraction

The DIVERA parser will extract fields using body markers instead of matching concrete example values:

- `Stichwort:` maps to `einsatzstichwort`
- `Adresse:` maps to `ort`
- `Sonderrechte/Priorität:` maps to `priority`
- Text between priority and `Einheiten:` maps to `alarm_text`
- `Einheiten:` maps to `einheit`

Footer content will be ignored when it starts with known DIVERA footer markers such as `Unser Support-Team ist für Sie da!`.

Alternative considered: fixed line-number extraction. That would break as soon as alert text length, wrapping, or optional fields change.

### Per-file parse status

Each selected file will produce a result object with either extracted alert data or a parse error. The table will include enough status information for users to identify files that failed without stopping the whole batch.

Alternative considered: abort the entire parse run on the first invalid file. That creates poor batch behavior when users upload many alerts.

## Risks / Trade-offs

- Different DIVERA templates may use different field labels or optional sections -> The parser should isolate field matching in a small module and report missing required markers clearly.
- Some `.eml` exports may contain only HTML -> The app will fallback to HTML-to-text conversion, but plain text should remain the preferred source.
- Large batches may block the UI while parsing -> The initial implementation can parse sequentially with progress feedback; future work can move parsing into a Web Worker if needed.
- CDN dependencies can change or fail -> Pin dependency versions and keep the code structured so bundling the dependency later is straightforward.
- Uploaded mails may contain sensitive data -> All processing remains local in browser memory and no network upload is introduced by this change.
