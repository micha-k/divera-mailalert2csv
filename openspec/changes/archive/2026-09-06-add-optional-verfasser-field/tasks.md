## 1. Parser Extraction

- [x] 1.1 Add an optional `Verfasst von:` marker lookup after the required `Einheiten:` marker.
- [x] 1.2 Split the units section at `Verfasst von:` when present so `einheit` excludes the author field.
- [x] 1.3 Return `verfasser` with the cleaned author value when present and an empty string when absent.
- [x] 1.4 Keep missing `Verfasst von:` from triggering required field extraction errors.

## 2. Result Display

- [x] 2.1 Include `verfasser` in successful and failed batch result objects.
- [x] 2.2 Add a `Verfasser` column to the results table header.
- [x] 2.3 Render `verfasser` in successful result rows and keep failed rows aligned with the table columns.

## 3. Verification

- [x] 3.1 Verify the existing test alarm example still parses successfully with an empty `verfasser`.
- [x] 3.2 Verify the new Storno example parses `Lutz Thormann` as `verfasser`.
- [x] 3.3 Verify `einheit` does not include `Verfasst von:` or the author value.
