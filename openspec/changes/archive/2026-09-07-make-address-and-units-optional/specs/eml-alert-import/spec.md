## MODIFIED Requirements

### Requirement: DIVERA alert field extraction
The system SHALL extract structured alert data from the decoded DIVERA mail body using field markers rather than concrete sample values. `Stichwort:` and `Sonderrechte/Priorität:` SHALL be required markers. `Adresse:`, `Einheiten:`, and `Verfasst von:` SHALL be optional markers.

#### Scenario: Standard DIVERA alert body is parsed
- **WHEN** the decoded body contains `Stichwort:`, `Adresse:`, `Sonderrechte/Priorität:`, alert text, and `Einheiten:`
- **THEN** the system extracts `einsatzstichwort`, `ort`, `priority`, `alarm_text`, `einheit`, and an empty `verfasser`

#### Scenario: Alert body without address is parsed
- **WHEN** the decoded body contains `Stichwort:`, `Sonderrechte/Priorität:`, alert text, and `Einheiten:`
- **AND** the decoded body does not contain `Adresse:`
- **THEN** the system extracts `einsatzstichwort`, `priority`, `alarm_text`, and `einheit`
- **AND** the system returns an empty `ort`

#### Scenario: Alert body without units is parsed
- **WHEN** the decoded body contains `Stichwort:`, `Adresse:`, `Sonderrechte/Priorität:`, and alert text
- **AND** the decoded body does not contain `Einheiten:`
- **THEN** the system extracts `einsatzstichwort`, `ort`, `priority`, and `alarm_text`
- **AND** the system returns an empty `einheit`

#### Scenario: Alert body without address and units is parsed
- **WHEN** the decoded body contains `Stichwort:`, `Sonderrechte/Priorität:`, and alert text
- **AND** the decoded body does not contain `Adresse:` or `Einheiten:`
- **THEN** the system extracts `einsatzstichwort`, `priority`, and `alarm_text`
- **AND** the system returns empty `ort` and `einheit` values

#### Scenario: Optional author field is parsed
- **WHEN** the decoded body contains `Verfasst von:` after the alert text or units section
- **THEN** the system extracts the author value as `verfasser`
- **AND** the system excludes `Verfasst von:` and its value from `alarm_text` and `einheit`

#### Scenario: Footer follows DIVERA alert body
- **WHEN** the decoded body contains DIVERA footer text after the alert fields
- **THEN** the system excludes the footer from extracted alert fields

#### Scenario: Required DIVERA marker is missing
- **WHEN** the decoded body is missing `Stichwort:` or `Sonderrechte/Priorität:`
- **THEN** the system marks that file as failed with a field extraction error
