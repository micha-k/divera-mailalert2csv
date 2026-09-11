## 1. Parser And Result Model

- [x] 1.1 Extend the ordered DIVERA marker parser to recognize singular and plural group markers and return an optional `gruppe` value.
- [x] 1.2 Update alert-text, units, groups, and author boundaries for combinations with and without optional sections.
- [x] 1.3 Add parser coverage based on the new `Suizid.eml` structure plus singular-marker, units-plus-groups, missing-groups, and missing-author cases.
- [x] 1.4 Add an empty `gruppe` value to failed-result placeholders so the application retains a stable result shape.

## 2. Result Table

- [x] 2.1 Add a sortable `Gruppe` column to the result table and update empty-state column spans.
- [x] 2.2 Render `gruppe`, include it in full-text search, and register it as a sortable field.
- [x] 2.3 Verify table display, search, and both sort directions with populated and empty group values.

## 3. CSV Export

- [x] 3.1 Add `gruppe` between `einheit` and `verfasser` in the fixed CSV column list.
- [x] 3.2 Update CSV tests for populated and empty groups, fixed column order, and preservation of comma-separated group lists as one quoted field.

## 4. Versioning And Verification

- [x] 4.1 Increment the HTML and JavaScript versions independently and update matching asset and module cache-busting tokens.
- [x] 4.2 Update version assertions and run the complete automated test suite.
- [x] 4.3 Exercise the browser workflow with the new groups example and existing examples, checking responsive table layout and CSV output.
