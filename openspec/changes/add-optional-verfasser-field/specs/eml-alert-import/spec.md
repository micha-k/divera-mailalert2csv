## MODIFIED Requirements

### Requirement: DIVERA alert field extraction
The system SHALL extract structured alert data from the decoded DIVERA mail body using field markers rather than concrete sample values.

#### Scenario: Standard DIVERA alert body is parsed
- **WHEN** the decoded body contains `Stichwort:`, `Adresse:`, `Sonderrechte/Priorität:`, alert text, and `Einheiten:`
- **THEN** the system extracts `einsatzstichwort`, `ort`, `priority`, `alarm_text`, `einheit`, and an empty `verfasser`

#### Scenario: Optional author field is parsed
- **WHEN** the decoded body contains `Verfasst von:` after `Einheiten:`
- **THEN** the system extracts the author value as `verfasser`
- **AND** the system excludes `Verfasst von:` and its value from `einheit`

#### Scenario: Footer follows DIVERA alert body
- **WHEN** the decoded body contains DIVERA footer text after the alert fields
- **THEN** the system excludes the footer from extracted alert fields

#### Scenario: Required DIVERA marker is missing
- **WHEN** the decoded body is missing a required DIVERA field marker
- **THEN** the system marks that file as failed with a field extraction error

### Requirement: Tabular result display
The system SHALL display parsing results in a table with one row per processed file.

#### Scenario: File parses successfully
- **WHEN** a selected `.eml` file is parsed successfully
- **THEN** the table row shows `datum`, `einsatzstichwort`, `ort`, `priority`, `alarm_text`, `einheit`, and `verfasser`

#### Scenario: File parsing fails
- **WHEN** a selected `.eml` file cannot be parsed successfully
- **THEN** the table row shows the file name and an error status explaining the failure

#### Scenario: Multiple files are parsed
- **WHEN** multiple selected `.eml` files are parsed
- **THEN** the table displays one result row for each processed file
