## Context

The parser currently extracts DIVERA fields by requiring `Stichwort:`, `Adresse:`, `Sonderrechte/Priorität:`, and `Einheiten:` in that order. It slices field values between those markers, which makes `Adresse:` and `Einheiten:` hard requirements even though some DIVERA alert templates can omit them.

The result table already has stable columns for `ort` and `einheit`, so missing optional fields can be represented as empty strings without changing the UI shape.

## Goals / Non-Goals

**Goals:**
- Accept valid alert mails that omit `Adresse:`.
- Accept valid alert mails that omit `Einheiten:`.
- Return empty `ort` and/or `einheit` values when the matching optional markers are absent.
- Keep `Stichwort:` and `Sonderrechte/Priorität:` required.
- Preserve `alarm_text`, optional `verfasser`, and footer stripping behavior.

**Non-Goals:**
- Add new table columns or rename existing result fields.
- Infer missing address or units from free-form alert text.
- Make `Verfasst von:` required.
- Broaden parsing to arbitrary non-DIVERA mail formats.

## Decisions

### Reduce required markers to the true required split points

Only `Stichwort:` and `Sonderrechte/Priorität:` should cause a missing-required-field error. `Adresse:`, `Einheiten:`, and `Verfasst von:` should be treated as optional markers that contribute field boundaries when present.

Alternative considered: keep `Adresse:` required and only relax `Einheiten:`. That would still reject address-less alerts, which is one of the target cases for this change.

### Derive field boundaries from the next available marker

Use ordered marker positions to decide where each field ends:
- `einsatzstichwort` ends at `Adresse:` when present, otherwise at `Sonderrechte/Priorität:`.
- `ort` exists only when `Adresse:` is present and ends at `Sonderrechte/Priorität:`.
- `alarm_text` starts after the parsed priority value and ends before the earliest following optional marker: `Einheiten:`, `Verfasst von:`, or the end of the footer-stripped body.
- `einheit` exists only when `Einheiten:` is present and ends before `Verfasst von:` when author follows it, otherwise at the end of the footer-stripped body.

Alternative considered: special-case every missing-field combination. Boundary derivation keeps the parser easier to extend as optional sections change.

### Keep marker ordering validation, but only for present markers

The parser should still reject impossible marker order, such as `Adresse:` before `Stichwort:` or `Einheiten:` before `Sonderrechte/Priorität:`. Ordering checks should compare only markers that are present and relevant.

Alternative considered: skip order validation for optional sections. That risks silently folding mislabeled or malformed content into the wrong output fields.

## Risks / Trade-offs

- `Verfasst von:` can appear without `Einheiten:` -> Treat it as an alarm-text boundary and still extract `verfasser`.
- Missing `Einheiten:` means alarm text may run until the author marker or body end -> Continue stripping known DIVERA footers before extraction.
- Optional marker ordering can be subtle -> Add focused parser fixtures for missing address, missing units, and missing both.
