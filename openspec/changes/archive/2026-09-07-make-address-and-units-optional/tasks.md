## 1. Parser Marker Rules

- [x] 1.1 Update `extractDiveraAlert` so only `Stichwort:` and `Sonderrechte/Priorität:` are required markers.
- [x] 1.2 Treat missing `Adresse:` as valid and return `ort: ""`.
- [x] 1.3 Treat missing `Einheiten:` as valid and return `einheit: ""`.
- [x] 1.4 Keep missing `Verfasst von:` valid and return `verfasser: ""`.

## 2. Parser Boundary Logic

- [x] 2.1 Derive the `einsatzstichwort` boundary from `Adresse:` when present, otherwise from `Sonderrechte/Priorität:`.
- [x] 2.2 Derive the `ort` boundary from `Sonderrechte/Priorität:` only when `Adresse:` is present.
- [x] 2.3 Derive the priority/alarm text block end from the earliest following optional marker or the footer-stripped body end.
- [x] 2.4 Derive the `einheit` boundary from `Verfasst von:` when both markers are present in valid order.
- [x] 2.5 Extract `verfasser` when it appears after the alarm text even if `Einheiten:` is absent.
- [x] 2.6 Preserve ordering validation for present markers so malformed marker order still fails clearly.

## 3. Verification

- [x] 3.1 Verify existing standard alert examples still parse with populated `ort` and `einheit`.
- [x] 3.2 Verify an alert without `Adresse:` parses with empty `ort`.
- [x] 3.3 Verify an alert without `Einheiten:` parses with empty `einheit`.
- [x] 3.4 Verify an alert without both `Adresse:` and `Einheiten:` parses with empty `ort` and `einheit`.
- [x] 3.5 Verify `Verfasst von:` is extracted when `Einheiten:` is absent.
- [x] 3.6 Verify missing `Stichwort:` or `Sonderrechte/Priorität:` still produces a field extraction error.
