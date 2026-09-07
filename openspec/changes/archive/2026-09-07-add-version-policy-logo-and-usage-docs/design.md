## Context

The footer currently exposes separate HTML and JavaScript versions, but both values are manually fixed at `0.1.0` and previous UI, parser, and result-table changes did not update them. The app has no build step or package metadata from which versions can be generated. A square transparent logo already exists at `docs/logo.png`, and the README currently provides only a brief usage summary.

The change crosses static HTML, CSS, JavaScript metadata, and documentation, but it must preserve the browser-only architecture and avoid adding a build system or dependency solely for version management.

## Goals / Non-Goals

**Goals:**

- Make the displayed HTML and JavaScript versions meaningful through a clear independent increment policy.
- Bring both displayed versions to `0.1.1` for this change, which affects both UI and JavaScript release state.
- Integrate the existing logo into the page header and README at appropriate display sizes.
- Make the hosted GitHub Pages app the primary README entry point and give self-hosting users enough guidance to start a local static server.
- Give users enough README guidance to complete the normal import workflow.

**Non-Goals:**

- Automating releases or deriving versions from Git history.
- Introducing a package manager, bundler, or build pipeline.
- Changing parser behavior, result-table behavior, or the logo image itself.
- Guaranteeing operation when `index.html` is opened directly through `file://`.

## Decisions

### Keep independent manual versions

The HTML version remains static footer text in `index.html`, while the JavaScript version remains a constant written to the footer by `app.mjs` at runtime. A change SHALL increment the HTML version when it modifies `index.html`, `styles.css`, or a user-visible static asset. A change SHALL increment the JavaScript version when it modifies `app.mjs` or `parser-core.mjs`. A change affecting both groups increments both versions; a documentation-only change increments neither.

This keeps the mechanism compatible with the build-free application. A shared manifest or Git-derived value was considered, but either would blur the independent versions or require runtime fetching/build tooling that the project does not otherwise need.

### Use patch increments for maintenance changes

Both versions move from `0.1.0` to `0.1.1`. The purpose is to establish a reliable baseline rather than reconstruct version numbers for each historical commit. Future changes apply the same affected-area rule and choose an appropriate semantic increment, with patch as the default for compatible maintenance changes.

### Treat the page logo as decorative beside the title

The header uses `docs/logo.png` in a compact fixed-size image immediately left of the existing eyebrow and `h1`. Because adjacent text already names the application, the image uses an empty alternative text value to avoid redundant screen-reader output. CSS constrains its dimensions and preserves a coherent horizontal header on desktop and mobile.

### Embed the existing logo directly in the README

The README references `docs/logo.png` through a relative path and uses explicit display dimensions so the high-resolution source does not dominate the document. Descriptive alternative text identifies the logo in this context.

### Document the static-server workflow

The README prominently links to `https://micha-k.github.io/divera-mailalert2csv/` as the primary no-setup option. Local static-server instructions are placed in an explicitly optional self-hosting subsection and include a concrete server example and browser URL. Shared usage steps cover file selection, explicit parsing, and result filtering/sorting. The documentation also reiterates local-only processing and warns that selected files and results are transient. A static server is documented instead of direct `file://` use because browser module and CDN behavior is more reliable over HTTP.

## Risks / Trade-offs

- [Manual versions can still be forgotten] → Make affected-area increments an explicit requirement and implementation task for every relevant change.
- [File ownership does not capture every future architecture change] → Treat the listed files as the current mapping and update the policy if assets or modules are reorganized.
- [The large source logo may add unnecessary transfer size] → Reuse it for now to avoid asset duplication; constrain rendered dimensions and consider an optimized derivative only if measured load impact becomes material.
- [README server commands vary by environment] → Present one common Python example while keeping the wording open to any static web server.
