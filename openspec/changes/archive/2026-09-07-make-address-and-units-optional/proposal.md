## Why

DIVERA alert mails can omit the `Adresse:` and `Einheiten:` sections for some alert types. The parser currently treats both markers as required, causing otherwise usable mails to fail instead of returning partial structured data.

## What Changes

- Treat `Adresse:` as optional during DIVERA alert field extraction.
- Treat `Einheiten:` as optional during DIVERA alert field extraction.
- Return an empty `ort` value when `Adresse:` is absent.
- Return an empty `einheit` value when `Einheiten:` is absent.
- Keep `Stichwort:` and `Sonderrechte/Priorität:` as required markers.
- Preserve extraction of `alarm_text` and optional `verfasser` when either optional marker is missing.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `eml-alert-import`: Relax DIVERA alert extraction so address and units are optional fields while required marker validation remains focused on the fields needed to identify and split an alert.

## Impact

- Updates parser logic in `parser-core.mjs`.
- May update parser verification fixtures or tests/scripts if present.
- No changes to table columns, backend behavior, dependencies, or local-only processing.
