## ADDED Requirements

### Requirement: App footer metadata
The system SHALL display footer metadata for the static browser app, including separate HTML and JavaScript version labels and developer attribution.

#### Scenario: Footer shows HTML version
- **WHEN** the page is loaded
- **THEN** the footer shows the current HTML version label

#### Scenario: Footer shows JavaScript version from runtime
- **WHEN** the JavaScript app module initializes
- **THEN** the footer shows the current JavaScript version label written by the JavaScript runtime

#### Scenario: Footer shows developer attribution
- **WHEN** the page is loaded
- **THEN** the footer shows `developed with ❤️ by micha-k`
- **AND** `micha-k` links to `https://github.com/micha-k`

### Requirement: Page unload protection
The system SHALL warn users before page reload, close, or navigation when local file selection, parsing progress, or parsed results may be lost.

#### Scenario: User leaves with selected files
- **WHEN** one or more files are selected
- **AND** the user reloads, closes, or navigates away from the page
- **THEN** the browser is asked to show a native leave confirmation dialog

#### Scenario: User leaves while parsing is active
- **WHEN** parsing is active
- **AND** the user reloads, closes, or navigates away from the page
- **THEN** the browser is asked to show a native leave confirmation dialog

#### Scenario: User leaves with parsed results
- **WHEN** one or more parsing results are displayed
- **AND** the user reloads, closes, or navigates away from the page
- **THEN** the browser is asked to show a native leave confirmation dialog

#### Scenario: User leaves after clearing local state
- **WHEN** no files are selected, no parsing is active, and no parsing results are displayed
- **AND** the user reloads, closes, or navigates away from the page
- **THEN** the system does not request a leave confirmation dialog
