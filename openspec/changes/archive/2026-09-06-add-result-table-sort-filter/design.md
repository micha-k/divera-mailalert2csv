## Context

The app currently keeps parsed rows in a `results` array and renders the table directly from that array. With larger batches, users need a way to narrow results and compare fields without changing the underlying parsed data.

The app is static and dependency-light, so filtering and sorting should be implemented with browser-native controls and plain JavaScript state. Controls should be visible near the results table but disabled before parsed results exist, matching the agreed behavior.

## Goals / Non-Goals

**Goals:**
- Add visible result controls for full-text filtering and status filtering.
- Keep result controls disabled until parsed results exist.
- Add sortable headers for practical result columns.
- Preserve the original `results` array and derive a filtered/sorted display list for rendering.
- Reset filter and sort state when the user clears the local page state.

**Non-Goals:**
- Add pagination, column hiding, export, saved views, or persistent preferences.
- Sort by the long `alarm_text` column in the first version.
- Change how `.eml` files are parsed or how result data is stored.
- Add a table/grid dependency.

## Decisions

### Derive visible results from immutable display state

Keep `results` as the source of truth for parsed output. Add lightweight UI state for `filterText`, `statusFilter`, and `sortState`, then derive `visibleResults` immediately before rendering table rows.

Alternative considered: mutate `results` in-place when sorting. That makes reset behavior and future filters more error-prone because the original parse order is lost.

### Use one full-text field plus one status filter

Provide a text input that matches across visible result fields and a status select for `all`, `ok`, and `error`. This covers the common workflows: finding a location/keyword/unit and isolating parse failures.

Alternative considered: add per-column filters. That is more powerful but too dense for the current compact static app and would add more state than this first version needs.

### Make table headers interactive for useful columns

Turn headers for `source_file`, `status`, `datum`, `einsatzstichwort`, `ort`, `priority`, `einheit`, and `verfasser` into sortable buttons. Repeated activation toggles ascending/descending for the active column. `alarm_text` remains unsortable because long narrative text is less useful as a sort key and could add visual noise.

Alternative considered: sort every column including `alarm_text`. This is simpler mechanically but less useful in the interface.

### Disable controls before results exist

Render the filter/search controls from the start so the layout is predictable, but disable them until `results.length > 0`. Sort buttons should also be disabled before results exist.

Alternative considered: hide controls until results exist. That keeps the initial page cleaner but causes the results panel layout to shift after parsing.

## Risks / Trade-offs

- Date values are displayed as strings -> Sort using the displayed value unless a richer parsed date key is introduced later.
- Full-text filtering across long alert text can match more than users expect -> Include all visible fields for discoverability and allow clearing the text filter.
- Disabled controls may be missed at first glance -> Keep them visible and near the results table so the feature is discoverable once results appear.
