## MODIFIED Requirements

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

## ADDED Requirements

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
