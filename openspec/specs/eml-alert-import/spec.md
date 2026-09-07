## Purpose

Define the browser-only workflow for importing exported DIVERA 24/7 alert mails from `.eml` files, extracting alert data locally, and displaying the parsed results.

## Requirements

### Requirement: Multiple EML file selection
The system SHALL provide a web page where users can add multiple `.eml` files through a drag-and-drop area and through a conventional file picker.

#### Scenario: User drops multiple EML files
- **WHEN** the user drops multiple `.eml` files into the drop area
- **THEN** the system lists the selected files without starting parsing automatically

#### Scenario: User selects multiple EML files by file picker
- **WHEN** the user selects multiple `.eml` files through the file picker
- **THEN** the system lists the selected files without starting parsing automatically

#### Scenario: User adds unsupported file type
- **WHEN** the user adds a file that is not an `.eml` file
- **THEN** the system marks that file as unsupported and excludes it from parsing

### Requirement: Explicit parsing start
The system SHALL provide a parsing button that starts processing the currently selected supported `.eml` files.

#### Scenario: User starts parsing selected files
- **WHEN** at least one supported `.eml` file is selected and the user activates the parsing button
- **THEN** the system parses each selected supported file in the browser

#### Scenario: User starts parsing without files
- **WHEN** no supported `.eml` files are selected and the user activates the parsing button
- **THEN** the system keeps parsing idle and informs the user that files must be selected first

### Requirement: Local browser-side mail parsing
The system SHALL parse uploaded `.eml` files locally in the browser and SHALL NOT send mail content or parsed alert data to a backend service.

#### Scenario: EML file is parsed
- **WHEN** the user starts parsing a selected `.eml` file
- **THEN** the system reads and parses the file using browser APIs
- **AND** the mail content remains on the client side

### Requirement: Mail body extraction
The system SHALL extract a decoded readable mail body from each parsed `.eml` file, preferring the `text/plain` body and falling back to an HTML-derived text body when necessary.

#### Scenario: Plain text body exists
- **WHEN** a parsed `.eml` file contains a decoded `text/plain` body
- **THEN** the system uses the plain text body for DIVERA field extraction

#### Scenario: Only HTML body exists
- **WHEN** a parsed `.eml` file has no usable plain text body and contains an HTML body
- **THEN** the system derives readable text from the HTML body for DIVERA field extraction

#### Scenario: No usable body exists
- **WHEN** a parsed `.eml` file has no usable plain text body and no usable HTML body
- **THEN** the system marks that file as failed with a body extraction error

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

### Requirement: Mail date extraction
The system SHALL extract `datum` from the `.eml` mail `Date` header.

#### Scenario: Date header is present
- **WHEN** a parsed `.eml` file contains a valid `Date` header
- **THEN** the system includes the parsed date as `datum` in the result

#### Scenario: Date header is missing or invalid
- **WHEN** a parsed `.eml` file has no valid `Date` header
- **THEN** the system marks that file as failed with a date extraction error

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

### Requirement: App footer metadata
The system SHALL display footer metadata for the static browser app, including independently maintained HTML and JavaScript version labels and developer attribution. The HTML version SHALL represent `index.html`, `styles.css`, and user-visible static assets. The JavaScript version SHALL represent `app.mjs` and `parser-core.mjs`.

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

#### Scenario: Change affects only HTML and UI resources
- **WHEN** a release changes `index.html`, `styles.css`, or a user-visible static asset without changing JavaScript resources
- **THEN** the HTML version is incremented
- **AND** the JavaScript version remains unchanged

#### Scenario: Change affects only JavaScript resources
- **WHEN** a release changes `app.mjs` or `parser-core.mjs` without changing HTML and UI resources
- **THEN** the JavaScript version is incremented
- **AND** the HTML version remains unchanged

#### Scenario: Change affects both versioned areas
- **WHEN** a release changes both HTML/UI resources and JavaScript resources
- **THEN** both version labels are incremented independently

#### Scenario: Change affects documentation only
- **WHEN** a release changes only project documentation
- **THEN** neither application version is incremented

### Requirement: Application branding
The system SHALL use the existing `docs/logo.png` asset as compact application branding beside the page title and in the README.

#### Scenario: Page header displays the logo
- **WHEN** the page is loaded
- **THEN** the logo is displayed at a compact size immediately to the left of the application title group
- **AND** the logo does not displace or overlap header content at supported viewport sizes

#### Scenario: Decorative page logo is announced accessibly
- **WHEN** assistive technology reads the page header
- **THEN** the logo does not duplicate the adjacent application title

#### Scenario: README displays the logo
- **WHEN** the README is rendered with repository-relative assets available
- **THEN** the same logo is displayed near the project title at a constrained size
- **AND** the logo has descriptive alternative text

### Requirement: User usage documentation
The project SHALL prominently link to the hosted GitHub Pages app and document how to open and operate it without implying that mail data is uploaded. Local static-server guidance SHALL be presented as an optional self-hosting path.

#### Scenario: User opens the hosted app
- **WHEN** a user views the beginning of the README
- **THEN** the documentation prominently links to `https://micha-k.github.io/divera-mailalert2csv/`
- **AND** the documentation states that the hosted app can be used without local setup

#### Scenario: User prepares a locally hosted app
- **WHEN** a user reads the README usage section
- **THEN** the documentation identifies local server setup as optional and necessary only for local hosting
- **AND** the documentation explains how to serve the repository with a static web server
- **AND** the documentation provides a concrete local server command and browser address

#### Scenario: User follows the import workflow
- **WHEN** a user reads the README usage section
- **THEN** the documentation explains file selection or drag and drop, explicit parsing, and result search, filtering, and sorting

#### Scenario: User understands data handling and volatility
- **WHEN** a user reads the README usage section
- **THEN** the documentation states that mail files are processed locally in the browser
- **AND** the documentation warns that selected files and results can be lost when the page is reloaded or closed

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
