## Why

DIVERA alert mails can include an optional `Verfasst von:` section that names the author of the alert message. The current parser does not model this field, so author information can be lost or accidentally folded into the `einheit` value.

## What Changes

- Extract the optional `Verfasst von:` body field into a new result field named `verfasser`.
- Preserve successful parsing when `Verfasst von:` is absent by returning an empty `verfasser` value.
- Ensure `einheit` stops before the optional author section when it is present.
- Display the parsed author value with the rest of the alert result data.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `eml-alert-import`: Extend DIVERA alert extraction and tabular results with the optional `verfasser` field.

## Impact

- Parser logic in `parser-core.mjs` must recognize the optional `Verfasst von:` marker.
- Batch result objects and parse error placeholders in `app.mjs` must include `verfasser`.
- The results table in `index.html` and row rendering in `app.mjs` must add a `Verfasser` column.
- Existing `.eml` examples cover both absent and present author sections.
