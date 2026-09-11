## MODIFIED Requirements

### Requirement: Stable CSV schema
The system SHALL export a header row and exactly these columns in order for every successful result: `source_file`, `datum`, `einsatzstichwort`, `ort`, `priority`, `alarm_text`, `einheit`, `gruppe`, and `verfasser`.

#### Scenario: Successful row is serialized
- **WHEN** a successful result is added to the CSV
- **THEN** its values are written under the matching fixed headers
- **AND** `status` and `error` are not exported

#### Scenario: Optional parsed value is empty
- **WHEN** `ort`, `einheit`, `gruppe`, or `verfasser` is absent or empty in a successful result
- **THEN** the corresponding CSV field is an empty quoted value
- **AND** the row retains the fixed number and order of columns

#### Scenario: Group list is serialized as one field
- **WHEN** `gruppe` contains a comma-separated value such as `Region 1, Region 2, Region 3`
- **THEN** the complete value is serialized in the single `gruppe` CSV field
- **AND** following values remain in their intended columns
