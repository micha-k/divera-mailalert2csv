## Why

Some DIVERA alert emails identify recipient groups with a `Gruppen:` section, but the current parser treats that section as part of the alert text. The newly added example demonstrates that groups are optional and can occur even when no `Einheiten:` section is present.

## What Changes

- Recognize optional `Gruppe:` and `Gruppen:` markers and extract their value into the `gruppe` result field.
- Keep group names as one normalized string and return an empty value when no group section exists.
- Use the group marker as a boundary for alert text and, when present, the units section.
- Show the group value in the result table and include it in table search and sorting.
- Add `gruppe` to the fixed CSV export schema for all successful results.
- Add parser, UI, and CSV coverage for alerts with and without units, groups, and authors.
- Increment the independently maintained HTML and JavaScript versions because both UI and parser behavior change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `eml-alert-import`: Extract optional alert groups and expose them in the searchable and sortable result table.
- `result-csv-export`: Include the optional group value in the stable Excel-compatible CSV schema.

## Impact

The parser result shape, marker-boundary handling, failed-result defaults, result-table columns, search and sort configuration, and CSV column list are affected. Existing alerts without a group section remain supported and produce an empty `gruppe` value. The static HTML and JavaScript version metadata and cache-busting tokens also require updates.
