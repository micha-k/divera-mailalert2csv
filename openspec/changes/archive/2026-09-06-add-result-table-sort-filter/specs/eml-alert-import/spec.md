## ADDED Requirements

### Requirement: Result filtering
The system SHALL provide visible result filtering controls for parsed `.eml` rows, including full-text filtering and status filtering.

#### Scenario: Filters are disabled before parsing results exist
- **WHEN** no parsing results are displayed
- **THEN** the result filtering controls are visible
- **AND** the result filtering controls are disabled

#### Scenario: User filters results by text
- **WHEN** parsing results are displayed
- **AND** the user enters text into the result search field
- **THEN** the table displays only rows whose visible result fields contain the entered text

#### Scenario: User filters results by status
- **WHEN** parsing results are displayed
- **AND** the user selects a status filter
- **THEN** the table displays only rows matching the selected status

#### Scenario: User combines text and status filters
- **WHEN** parsing results are displayed
- **AND** the user enters text and selects a status filter
- **THEN** the table displays only rows matching both filters

#### Scenario: Filters leave no matching rows
- **WHEN** active filters match no parsing results
- **THEN** the table shows an empty filtered-results message

#### Scenario: User clears local state after filtering
- **WHEN** filtering state is active
- **AND** the user clears the selected files and results
- **THEN** the system resets the result filters

### Requirement: Result sorting
The system SHALL allow users to sort parsed result rows by practical table columns without changing the underlying parsed data.

#### Scenario: Sort controls are disabled before parsing results exist
- **WHEN** no parsing results are displayed
- **THEN** sortable table header controls are disabled

#### Scenario: User sorts by a sortable column
- **WHEN** parsing results are displayed
- **AND** the user activates a sortable table header
- **THEN** the table displays the currently filtered rows ordered by that column
- **AND** the table indicates the active sort column and direction

#### Scenario: User toggles sort direction
- **WHEN** a sortable column is already active
- **AND** the user activates the same table header again
- **THEN** the table reverses the sort direction for that column

#### Scenario: User changes sort column
- **WHEN** a sortable column is active
- **AND** the user activates a different sortable table header
- **THEN** the table sorts by the newly selected column in ascending order

#### Scenario: User clears local state after sorting
- **WHEN** sorting state is active
- **AND** the user clears the selected files and results
- **THEN** the system resets the result sorting state
