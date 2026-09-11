## MODIFIED Requirements

### Requirement: DIVERA alert field extraction
The system SHALL extract structured alert data from the decoded DIVERA mail body using field markers rather than concrete sample values. `Stichwort:` and `Sonderrechte/Priorität:` SHALL be required markers. `Adresse:`, `Einheiten:`, `Gruppe:` or `Gruppen:`, and `Verfasst von:` SHALL be optional markers.

#### Scenario: Standard DIVERA alert body is parsed
- **WHEN** the decoded body contains `Stichwort:`, `Adresse:`, `Sonderrechte/Priorität:`, alert text, and `Einheiten:`
- **THEN** the system extracts `einsatzstichwort`, `ort`, `priority`, `alarm_text`, and `einheit`
- **AND** the system returns empty `gruppe` and `verfasser` values

#### Scenario: Alert body without address is parsed
- **WHEN** the decoded body contains `Stichwort:`, `Sonderrechte/Priorität:`, alert text, and `Einheiten:`
- **AND** the decoded body does not contain `Adresse:`
- **THEN** the system extracts `einsatzstichwort`, `priority`, `alarm_text`, and `einheit`
- **AND** the system returns empty `ort` and `gruppe` values

#### Scenario: Alert body without units is parsed
- **WHEN** the decoded body contains `Stichwort:`, `Adresse:`, `Sonderrechte/Priorität:`, and alert text
- **AND** the decoded body does not contain `Einheiten:`
- **THEN** the system extracts `einsatzstichwort`, `ort`, `priority`, and `alarm_text`
- **AND** the system returns empty `einheit` and `gruppe` values

#### Scenario: Alert body without address and units is parsed
- **WHEN** the decoded body contains `Stichwort:`, `Sonderrechte/Priorität:`, and alert text
- **AND** the decoded body does not contain `Adresse:`, `Einheiten:`, `Gruppe:`, or `Gruppen:`
- **THEN** the system extracts `einsatzstichwort`, `priority`, and `alarm_text`
- **AND** the system returns empty `ort`, `einheit`, and `gruppe` values

#### Scenario: Plural groups field without units is parsed
- **WHEN** the decoded body contains alert text followed by `Gruppen: Region 1, Region 2, Region 3`
- **AND** the decoded body does not contain `Einheiten:`
- **THEN** the system extracts `Region 1, Region 2, Region 3` as `gruppe`
- **AND** the system returns an empty `einheit`
- **AND** the system excludes the groups marker and value from `alarm_text`

#### Scenario: Singular group marker is parsed
- **WHEN** the decoded body contains `Gruppe:` followed by a group value
- **THEN** the system extracts the value as `gruppe`

#### Scenario: Units and groups are parsed together
- **WHEN** the decoded body contains `Einheiten:` followed by a units value and then `Gruppen:` followed by a groups value
- **THEN** the system extracts the units value as `einheit` and the groups value as `gruppe`
- **AND** the system excludes the groups marker and value from `einheit`

#### Scenario: Optional author field is parsed
- **WHEN** the decoded body contains `Verfasst von:` after the alert text, units section, or groups section
- **THEN** the system extracts the author value as `verfasser`
- **AND** the system excludes `Verfasst von:` and its value from `alarm_text`, `einheit`, and `gruppe`

#### Scenario: Footer follows DIVERA alert body
- **WHEN** the decoded body contains DIVERA footer text after the alert fields
- **THEN** the system excludes the footer from extracted alert fields

#### Scenario: Required DIVERA marker is missing
- **WHEN** the decoded body is missing `Stichwort:` or `Sonderrechte/Priorität:`
- **THEN** the system marks that file as failed with a field extraction error

### Requirement: Tabular result display
The system SHALL display parsing results in a table with one row per processed file.

#### Scenario: File parses successfully
- **WHEN** a selected `.eml` file is parsed successfully
- **THEN** the table row shows `datum`, `einsatzstichwort`, `ort`, `priority`, `alarm_text`, `einheit`, `gruppe`, and `verfasser`

#### Scenario: File parsing fails
- **WHEN** a selected `.eml` file cannot be parsed successfully
- **THEN** the table row shows the file name and an error status explaining the failure

#### Scenario: Multiple files are parsed
- **WHEN** multiple selected `.eml` files are parsed
- **THEN** the table displays one result row for each processed file

### Requirement: Result filtering
The system SHALL provide visible result filtering controls for parsed `.eml` rows, including full-text filtering across all visible result fields and status filtering.

#### Scenario: Filters are disabled before parsing results exist
- **WHEN** no parsing results are displayed
- **THEN** the result filtering controls are visible
- **AND** the result filtering controls are disabled

#### Scenario: User filters results by group text
- **WHEN** parsing results are displayed
- **AND** the user enters text that occurs in a result's `gruppe` value
- **THEN** the table includes that result among the matching rows

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
The system SHALL allow users to sort parsed result rows by practical table columns, including the group column, without changing the underlying parsed data.

#### Scenario: Sort controls are disabled before parsing results exist
- **WHEN** no parsing results are displayed
- **THEN** sortable table header controls are disabled

#### Scenario: User sorts by group
- **WHEN** parsing results are displayed
- **AND** the user activates the sortable `Gruppe` table header
- **THEN** the table displays the currently filtered rows ordered by `gruppe`
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
