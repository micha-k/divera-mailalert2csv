## Context

The browser app parses DIVERA `.eml` alert mails locally and extracts field values from the decoded mail body with marker-based slicing. Existing required markers are `Stichwort:`, `Adresse:`, `Sonderrechte/Priorität:`, and `Einheiten:`.

A new example mail includes an optional `Verfasst von:` section after `Einheiten:` and before the DIVERA footer. Without recognizing this marker, the parser risks including the author section in the `einheit` value and does not expose the author as structured data.

## Goals / Non-Goals

**Goals:**

- Extract `Verfasst von:` into `verfasser` when the marker is present.
- Keep files without `Verfasst von:` valid and return an empty `verfasser` value.
- Keep `einheit` limited to the units section, excluding the author section.
- Show `verfasser` in the parsed result table.

**Non-Goals:**

- Do not make `Verfasst von:` a required DIVERA marker.
- Do not introduce CSV export behavior in this change.
- Do not add a backend or change local browser-only parsing.

## Decisions

### Treat `Verfasst von:` as an optional section marker

The parser should search for a `Verfasst von:` marker after the required `Einheiten:` marker. If found, the text between `Einheiten:` and `Verfasst von:` becomes `einheit`, and the text after `Verfasst von:` becomes `verfasser`.

Alternative considered: parse the author value from the alarm text greeting/signature. That would be fragile because free-form alert text can contain names for other reasons.

### Preserve current required marker validation

Only the existing required DIVERA markers should cause field extraction failure when absent. Missing `Verfasst von:` should produce `verfasser: ""` and leave existing example mails valid.

Alternative considered: fail when `Verfasst von:` is absent. That would reject valid mails from the existing template and contradicts the field's optional nature.

### Continue using footer stripping as the outer boundary

Footer removal should still happen before field extraction. The optional author marker then provides an inner boundary between `einheit` and `verfasser`.

Alternative considered: make the footer marker the direct end of `einheit` in all cases and parse author separately from the full body. That duplicates boundary logic and makes it easier for the two fields to diverge.

## Risks / Trade-offs

- `Verfasst von:` text appears inside free-form alarm text -> Only consider markers that occur after `Einheiten:` so alert text is not accidentally split.
- Template spelling changes -> Keep the marker pattern isolated with the other field markers so variants can be added later.
- Wider result table may become harder to scan -> Add one compact `Verfasser` column and keep empty values blank for mails without an author section.
