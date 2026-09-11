## Context

The parser currently recognizes ordered markers for subject, address, priority, units, and author. Alert text ends at the first units or author marker, while units end at the author marker. The new `Suizid.eml` example contains `Gruppen: Region 1, Region 2, Region 3` after the alert text and before the author, with no units section. As a result, the current parser incorrectly includes the complete groups section in `alarm_text`.

The result is consumed by table rendering, client-side search and sorting, and a fixed-schema CSV serializer. Adding a parsed field therefore crosses all of these modules while remaining entirely client-side and dependency-free.

## Goals / Non-Goals

**Goals:**

- Recognize both singular `Gruppe:` and plural `Gruppen:` as one optional field.
- Correctly delimit alert text, units, groups, and author for every supported combination of optional sections.
- Preserve the decoded group list as one normalized `gruppe` string.
- Expose groups consistently in the result table, search, sorting, and CSV export.
- Preserve existing behavior for messages without groups.

**Non-Goals:**

- Splitting group names into an array or separate CSV columns.
- Filtering the CSV export according to table controls.
- Supporting arbitrary marker ordering outside the observed DIVERA order.
- Changing MIME decoding or introducing another parser dependency.

## Decisions

### Add groups to the ordered marker model

The parser will detect `Gruppe:` and `Gruppen:` case-insensitively at the beginning of a line and place the marker after optional units and before optional author in the expected order. This follows the existing marker-oriented parser and the order demonstrated by the new real-world example.

An alternative would be to extract each field independently without order validation. That would tolerate more layouts but could silently absorb malformed or unrelated body text. Retaining ordered validation keeps failures explicit and consistent with current behavior.

### Derive every optional section boundary from the next marker

The first available marker among units, groups, and author will terminate priority plus alert text. When units exist, their value will end at groups or author. When groups exist, their value will end at author or the footer-stripped body end. This supports groups with or without units and with or without an author without duplicating parsing paths.

### Store groups as one normalized string

The parser will return `gruppe` as the decoded, single-line value following the group marker. A comma-separated value such as `Region 1, Region 2, Region 3` remains intact. Missing groups produce an empty string, matching the conventions for other optional fields.

Splitting on commas was rejected because group names may contain punctuation and the current UI and CSV schema represent one scalar value per field.

### Propagate the field through all result consumers

The table will add a sortable `Gruppe` column, and the global result search will include `gruppe`. Error-result placeholders will also carry an empty `gruppe` so all rows have a stable shape. The CSV schema will add `gruppe` between `einheit` and `verfasser`, reflecting message order and retaining one fixed column count.

### Update both independent versions

The HTML version will be incremented because the table markup changes. The JavaScript version will be incremented because parser, result handling, and CSV behavior change. Associated cache-busting tokens and version assertions will be updated together according to the existing version policy.

## Risks / Trade-offs

- [DIVERA emits groups in an unobserved position] -> Cover the verified order and fail clearly on malformed ordering; add another captured example before broadening the accepted grammar.
- [A line in free-form alarm text begins with `Gruppe:` or `Gruppen:`] -> Require the marker at the beginning of a line, consistent with existing field detection; this remains an inherent ambiguity of marker-based plain text.
- [Adding a CSV column affects downstream consumers expecting the old column count] -> Keep the schema explicit and append the field in semantic message order; document it as a deliberate schema extension.
- [Wide result tables become harder to scan] -> Reuse the existing horizontally scrollable table container and compact column styling.
