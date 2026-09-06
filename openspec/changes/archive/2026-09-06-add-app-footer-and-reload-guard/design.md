## Context

The app is a static browser-only page composed of `index.html`, `styles.css`, `app.mjs`, and `parser-core.mjs`. It currently focuses on selecting `.eml` files, parsing them locally, and displaying results, but it does not expose a visible app version or warn before losing selected files/results through a reload or navigation.

Because this tool processes local files without persistence, selected `File` objects and parsed table state disappear on page unload. A lightweight browser-native guard is appropriate once the user has created volatile state.

## Goals / Non-Goals

**Goals:**
- Show visible HTML and JavaScript version labels in a page footer.
- Render the JavaScript version from JavaScript at runtime so the loaded script identifies itself.
- Add attribution text with a link to the `micha-k` GitHub profile.
- Warn before page unload when selected files, parsed results, or active parsing would be lost.
- Keep the change compatible with a static GitHub Pages style deployment.

**Non-Goals:**
- Persist selected files or parsed results across reloads.
- Add a build step, package metadata reader, or server-side version endpoint.
- Guarantee custom dialog text in every browser.
- Change parsing behavior or result table semantics.

## Decisions

### Use explicit constants for static app versions

Add an HTML-visible version value in `index.html` and a JavaScript version constant in `app.mjs`. The JS constant will be written into a footer element during startup.

Alternative considered: derive versions from `package.json` or Git metadata. This project does not currently have a build pipeline or package manifest, so deriving versions would add tooling that is disproportionate for a static maintenance label.

### Place metadata and attribution in a footer

Add a footer below the main app content, reusing the current restrained visual style. The footer can contain the HTML version, JS version, and attribution without competing with the file import workflow.

Alternative considered: place version text in the header. The header already communicates the product and local-processing privacy note; operational metadata is less important than the primary workflow.

### Use `beforeunload` only when volatile state exists

Register a `beforeunload` handler that asks for confirmation only when selected files exist, results exist, or parsing is in progress. The guard should be inactive on a clean page and after the user clears files/results.

Alternative considered: always warn on unload. That would protect the page but make normal browsing feel noisy before the user has anything to lose.

### Track parsing state explicitly

Introduce a small boolean such as `isParsing` around the parsing loop. This lets the unload guard remain active while a batch is running, even before a result row has been appended.

Alternative considered: infer active parsing from file entry statuses. A dedicated flag is simpler to read and avoids coupling unload protection to display badge labels.

## Risks / Trade-offs

- Browser unload dialogs ignore custom text in many modern browsers -> Use the standard `event.preventDefault()` and `event.returnValue` pattern and document it as best-effort behavior.
- Footer version constants can drift if only one file is updated -> Keep the labels explicit and easy to find, and include verification tasks for both footer values.
- Users may intentionally reload after parsing and see a confirmation -> Disable the guard once `clearFiles()` removes selected files and results.
