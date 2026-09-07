## Context

The browser app stores each processed mail as a flat result object and renders those objects in a searchable, filterable, and sortable table. It currently has no export implementation. Successful and failed rows share the same in-memory `results` array, while display filtering and sorting are derived separately by `getVisibleResults()`.

The exported content originates in email files and is therefore untrusted. Besides ordinary CSV delimiters, quotes, and multiline alarm text, values may begin with characters that spreadsheet applications interpret as formulas. The app remains build-free and browser-only, so export must not require a backend or spreadsheet library.

## Goals / Non-Goals

**Goals:**

- Download all and only successfully parsed results as one Excel-compatible CSV file.
- Keep export selection independent from table search, status filtering, and sorting.
- Preserve every field boundary when values contain semicolons, quotes, or line breaks.
- Prevent exported untrusted values from being interpreted as spreadsheet formulas.
- Keep CSV serialization independently testable and dependency-free.
- Increment both application versions under the established version policy, including a follow-up patch increment for the cache-coherency fix.

**Non-Goals:**

- Creating `.xlsx` workbooks, formulas, styles, worksheets, or native spreadsheet data types.
- Exporting failed rows or the `status` and `error` fields.
- Exporting only the currently visible table subset or reproducing its active sort order.
- Uploading results or persisting generated files after the browser download completes.

## Decisions

### Export from the canonical results array

The download handler filters the original `results` array for `status === "ok"`. It does not call `getVisibleResults()` and therefore ignores search text, status selection, and sort state. Successful rows remain in parse order, making the exported dataset stable and preventing an unnoticed display filter from dropping records.

### Use a fixed schema

The CSV columns are always written in this order: `source_file`, `datum`, `einsatzstichwort`, `ort`, `priority`, `alarm_text`, `einheit`, and `verfasser`. The first row contains those stable field names. Missing optional values become empty strings. `status` and `error` are excluded because every exported row is successful.

### Isolate standards-aware serialization

A small pure ES module owns the column schema and transforms result objects into CSV text. It prefixes the document with a UTF-8 byte-order mark, uses semicolons as delimiters and CRLF line endings, normalizes embedded line endings, quotes every field, and doubles embedded double quotes. Quoting every value provides one uniform rule and prevents delimiters or multiline alarm text from changing row shape.

The module also prefixes an apostrophe to any value whose first meaningful characters could trigger spreadsheet formula interpretation, including values beginning with `=`, `+`, `-`, or `@` after leading whitespace or control characters. This intentionally changes those exceptional exported strings to favor safe handling of untrusted mail content in Excel.

### Keep browser download orchestration in the app

`app.mjs` creates a `Blob` with `text/csv;charset=utf-8`, creates a temporary object URL, activates a temporary anchor with a filename in the form `divera-alarme-YYYY-MM-DD.csv`, then revokes the URL. The download control is disabled whenever no successful result exists and is updated by the existing render cycle.

### Place one explicit command in the results heading

The results-panel heading groups the existing result count with a `CSV herunterladen` command. The control remains visible but disabled before successful results exist, matching the established approach for filtering and sorting controls.

### Version local asset and module URLs

`index.html` appends the current release version to its local stylesheet and application-module URLs. `app.mjs` does the same for local module imports. This ensures a deployment cannot load new HTML containing the initially disabled download button while reusing an older cached application module that never manages that button. The follow-up fix increments both displayed versions to `0.1.3`, and a source-level regression test checks that the displayed versions and URL tokens remain aligned.

## Risks / Trade-offs

- [CSV cannot preserve native spreadsheet data types] → Export stable textual representations, especially the existing ISO date string; use XLSX only if typed cells become a future requirement.
- [Semicolon-delimited CSV favors German Excel locale behavior] → Document and test the delimiter explicitly; all values remain correctly quoted for other CSV-aware importers.
- [Formula protection alters rare values beginning with formula characters] → Apply it consistently to every untrusted field and document the security rationale.
- [Object URLs can retain memory] → Revoke each generated URL immediately after triggering the download.
- [UI filters may make the exported row count surprising] → Label the action as the complete successful-results export and test that active filters never affect it.
- [Browsers or hosting caches can mix files from different releases] → Add matching version tokens to local asset and module URLs and verify their alignment in an automated test.
