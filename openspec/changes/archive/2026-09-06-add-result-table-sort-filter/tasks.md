## 1. Result Filter Controls

- [x] 1.1 Add visible result filter controls to `index.html` above the results table.
- [x] 1.2 Add a full-text search input for result rows.
- [x] 1.3 Add a status filter control for all, successful, and failed results.
- [x] 1.4 Style the filter controls in `styles.css` for desktop and mobile layouts.
- [x] 1.5 Keep filter controls disabled until parsed results exist.

## 2. Result Sorting Controls

- [x] 2.1 Convert practical table headers into sortable controls for file, status, date, keyword, location, priority, unit, and author.
- [x] 2.2 Leave the alert text column unsortable.
- [x] 2.3 Add visual indication for the active sort column and sort direction.
- [x] 2.4 Keep sorting controls disabled until parsed results exist.

## 3. Display State Logic

- [x] 3.1 Add JavaScript state for search text, status filter, and sort column/direction.
- [x] 3.2 Derive visible results by applying the active filters to `results`.
- [x] 3.3 Apply active sorting to the filtered result rows without mutating `results`.
- [x] 3.4 Render an empty filtered-results message when filters match no rows.
- [x] 3.5 Reset filter and sort state when `clearFiles()` clears local page state.

## 4. Verification

- [x] 4.1 Verify filter controls are visible but disabled before parsing results exist.
- [x] 4.2 Verify text filtering matches visible result fields.
- [x] 4.3 Verify status filtering shows only the selected result status.
- [x] 4.4 Verify combined text and status filters are applied together.
- [x] 4.5 Verify sortable headers order filtered rows and toggle direction.
- [x] 4.6 Verify clearing files/results resets filters and sorting.
