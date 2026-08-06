# TPB Drawing Issue Register — Phase 1 (UI Shell)

## Problem Statement

TPB drawing/document controllers currently process incoming transmittals and maintain the drawing issue register manually — there's no Excel-native tool that lets them ingest a transmittal file and build a register from it without hand-copying data. The current repo is still the unmodified `office-addin-taskpane` Yeoman scaffold (Contoso branding, "fill range yellow" sample logic) with none of this behavior built yet.

Phase 1 does not build the actual transmittal-parsing/register-population logic (that's Phase 2). It builds the branded, functional UI shell — the container the real logic will be wired into — so the tool can be sideloaded, demoed, and tested by document controllers while Phase 2 logic is developed in parallel.

## Key Hypothesis

We believe a branded, clearly-labeled task-pane UI (upload → issue-mode selection → load template → populate register) will let document controllers understand and trust the workflow before the population logic exists.
We'll know we're right when the add-in sideloads cleanly into Excel desktop, a controller can drag in transmittal file(s), pick single/multiple issue mode, and successfully insert the template register sheet — all without needing explanation beyond the on-screen captions.

## Users

**Primary User**: TPB drawing/document controllers — admin staff who receive transmittals and maintain the drawing register as part of their document control duties. Not necessarily technical; UI copy should assume first-time users during testing.

**Job to Be Done**: When a transmittal (or batch of transmittals) arrives, I want to load it into a standard register template inside Excel, so I can process drawing issues without manually re-keying data.

**Non-Users**: Project architects/engineers are not the primary target for Phase 1, though nothing in the UI prevents them from using it.

## Solution

A dark-themed Excel task-pane add-in with a vertically stacked, sectioned layout: TPB logo top-left, a footer with copyright/version, and four functional sections (upload transmittals, choose issue mode, load template register, populate register). Phase 1 delivers the fully styled, interactive shell with real file-upload and template-insertion behavior; the "Populate Register" button is present with its halo-glow treatment but disabled, since its logic is explicitly deferred to Phase 2.

### Layout (top to bottom)

1. **Header** — TP Bennett logo, top-left.
2. **Section 1 — Upload Transmittal(s)**: Drag-and-drop zone + click-to-browse file picker. Accepts `.xlsx`, `.xls`, `.csv` only (validated client-side; other types rejected with an inline error). Multi-file select supported; selected files listed with a per-file remove control. Short caption underneath explaining the section's purpose.
3. **Section 2 — Issue Mode**: Radio group — "Single issue" / "Multiple issues in this transmittal." Defaults to "Single issue." Short caption underneath explaining the distinction.
4. **Section 3 — Load Template**: Button labeled "Load Template Issue Register." On click, inserts a new worksheet (e.g. "Issue Register") into the active workbook, populated from a template `.xlsx` bundled as a static asset in the repo (supplied by the user; exact source file TBD until provided). Short caption underneath.
5. **Section 4 — Populate Register**: Button labeled "Populate Register" with a CSS halo/glow visual treatment, rendered in a **disabled** state in Phase 1 (no click handler wired). Short caption noting this functionality ships in Phase 2.
6. **Footer**: "© 2026 TP Bennett. All rights reserved." plus a static line "Version: Released for Testing." Hard-coded strings, not derived from `package.json`.

### Visual Design

- Dark theme throughout (near-black background, neutral gray surfaces/borders, single accent color for focus states and the Populate Register halo).
- Exact TP Bennett brand hex codes are **TBD** — Phase 1 ships with a placeholder professional dark palette, swapped for brand colors once supplied.
- Logo asset lives in `src/assets/branding/` (new folder; user will drop the logo file in directly).

### MVP Scope

| Priority | Capability | Rationale |
|----------|------------|-----------|
| Must | Dark theme applied across task pane | Explicit requirement; sets visual foundation for everything else |
| Must | TPB logo rendered top-left, footer with copyright/version | Explicit branding requirement |
| Must | Transmittal upload control (drag-and-drop + browse, multi-file, `.xlsx`/`.xls`/`.csv` only, client-side type validation) | Core first step of the workflow |
| Must | Single/Multiple issue radio selector, defaulted to Single, with helper caption | Explicit requirement; needed before template/populate steps make sense |
| Must | "Load Template Issue Register" button that inserts the bundled template as a new sheet in the active workbook | Explicit requirement; only non-stubbed piece of business logic in Phase 1 |
| Must | "Populate Register" button with halo effect, rendered disabled | Explicit requirement; visually complete but intentionally inert pending Phase 2 |
| Must | Short persistent caption under each of the four sections | Explicit requirement, aimed at first-time testers |
| Won't | Transmittal parsing / actual register population logic | Explicitly deferred to Phase 2 |
| Won't | Dynamic version numbering from `package.json` | Static string chosen for Phase 1 simplicity |
| Won't | Exact TP Bennett brand hex codes | Not yet supplied; placeholder palette used |

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|---------------|
| Add-in sideloads without errors | Sideload succeeds on first `npm start` | Manual test in Excel desktop |
| Upload control accepts valid files, rejects invalid types | 100% of `.xlsx`/`.xls`/`.csv` accepted; non-matching types rejected with visible error | Manual test with sample file set |
| Template load inserts correct sheet | New "Issue Register" sheet appears in active workbook matching the supplied template | Manual test once example `.xlsx` is provided |
| Visual QA sign-off | Dark theme, branding, and section captions approved by requester | Manual review |

## Open Questions

- [ ] Example issue register `.xlsx` template file has not yet been supplied — blocks final implementation of the "Load Template" button and the exact register sheet structure.
- [ ] TP Bennett logo asset file has not yet been supplied (folder `src/assets/branding/` is ready to receive it).
- [ ] Exact TP Bennett brand hex codes / dark theme palette not yet supplied — Phase 1 ships with a placeholder palette.
- [ ] Phase 2 scope (what "Populate Register" actually does — parsing rules for single vs. multiple issue transmittals, mapping to register columns) is intentionally out of scope here and needs its own PRD.

## Implementation Phases

| # | Phase | Description | Status | Depends |
|---|-------|-------------|--------|---------|
| 1 | Branding & theme | Replace Contoso/scaffold branding; apply dark theme; add logo + footer (copyright, static version label) | pending | - |
| 2 | Upload section | Build drag-and-drop + browse multi-file control with `.xlsx`/`.xls`/`.csv` validation and selected-file list | pending | 1 |
| 3 | Issue mode selector | Radio group (Single/Multiple), defaulted to Single, with caption | pending | 1 |
| 4 | Template loading | Bundle example `.xlsx` as static asset; wire button to insert it as a new sheet via Office.js | pending | 1, and receipt of example file |
| 5 | Populate Register (stub) | Style button with halo effect; render disabled; add caption noting Phase 2 | pending | 1 |
| 6 | Section captions | Add short helper caption under each of the four sections | pending | 2, 3, 4, 5 |

---

*Generated: 2026-08-06*
*Status: DRAFT - needs validation (pending example template file and logo asset)*
