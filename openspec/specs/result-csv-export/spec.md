## Purpose

Define how successfully parsed alert results are downloaded as a structurally safe, Excel-compatible CSV file in the browser.

## Requirements

### Requirement: Successful result CSV selection
The system SHALL allow users to download all successfully parsed results as CSV independently of result-table search, status filters, and sorting.

#### Scenario: Successful results are available
- **WHEN** at least one parsed result has status `ok`
- **THEN** the CSV download control is enabled

#### Scenario: No successful result is available
- **WHEN** there are no parsed results with status `ok`
- **THEN** the CSV download control is visible and disabled

#### Scenario: User downloads results
- **WHEN** the user activates the enabled CSV download control
- **THEN** the system downloads one CSV file containing every result with status `ok`
- **AND** the CSV contains no failed result

#### Scenario: Display filters and sorting are active
- **WHEN** the user activates the CSV download while search, status filtering, or sorting changes the visible table rows
- **THEN** the CSV still contains all successful results in their original parse order

#### Scenario: Results are cleared
- **WHEN** the user clears selected files and parsed results
- **THEN** the CSV download control becomes disabled

#### Scenario: Updated export release is loaded
- **WHEN** the page is loaded after an export release is deployed
- **THEN** local application assets and modules are requested with the current version token
- **AND** stale application code cannot leave the CSV download control unmanaged

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

### Requirement: Excel-compatible CSV encoding
The system SHALL serialize CSV as UTF-8 with a byte-order mark, semicolon delimiters, CRLF record endings, and every field enclosed in double quotes.

#### Scenario: Value contains a semicolon
- **WHEN** an exported value contains `;`
- **THEN** the semicolon remains inside one quoted CSV field

#### Scenario: Value contains a double quote
- **WHEN** an exported value contains `"`
- **THEN** each embedded double quote is escaped as `""` inside the quoted CSV field

#### Scenario: Value contains line breaks
- **WHEN** an exported value contains one or more line breaks
- **THEN** the line breaks are normalized and retained inside one quoted CSV field
- **AND** following values and records remain in their intended columns and rows

#### Scenario: Value could be interpreted as a spreadsheet formula
- **WHEN** an exported value begins with `=`, `+`, `-`, or `@` after any leading whitespace or control characters
- **THEN** the serialized value is prefixed so spreadsheet software treats it as text rather than an executable formula

#### Scenario: CSV download is created
- **WHEN** CSV serialization completes
- **THEN** the browser downloads it with media type `text/csv;charset=utf-8`
- **AND** the filename follows `divera-alarme-YYYY-MM-DD.csv`
