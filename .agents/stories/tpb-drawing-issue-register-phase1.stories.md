# TPB Drawing Issue Register — Phase 1 User Stories

Source PRD: `.agents/PRDs/tpb-drawing-issue-register-phase1.prd.md`

Styling approach: Tailwind CSS (added as a prerequisite build-pipeline story below). All dark-theme and layout stories use Tailwind utility classes and a themed `tailwind.config.js` rather than hand-written CSS.

---

## STORY-1: Remove scaffold placeholders (manifest.xml, package.json)

**Type**: Technical
**Priority**: High
**Complexity**: Small
**Phase**: 1 — Branding & theme
**Labels**: `technical`, `high-priority`

### Description
As a developer, I want the manifest.xml and package.json cleaned of Contoso/template placeholders, so that the add-in identifies itself as TPB Drawing Issue Register rather than the Yeoman scaffold.

### Acceptance Criteria
- [ ] Given manifest.xml, when inspected, then `<Id>` is a new GUID, `<ProviderName>` is "TP Bennett", `<Description>` and `<SupportUrl>` reflect the real product, and `<AppDomains>` no longer references contoso.com.
- [ ] Given package.json, when inspected, then `name`/`repository` fields reference TPB-DrawingIssueRegister, not `office-addin-taskpane`.
- [ ] Given `npm run validate`, when run, then office-addin-manifest validation passes.

### Technical Notes
- Files: `manifest.xml`, `package.json`.
- Reference CLAUDE.md "Known scaffold placeholders to update before shipping".

### Dependencies
- Blocked by: none
- Blocks: STORY-11

---

## STORY-2: Set up Tailwind CSS build pipeline

**Type**: Technical
**Priority**: High
**Complexity**: Small
**Phase**: 1 — Branding & theme
**Labels**: `technical`, `high-priority`

### Description
As a developer, I want Tailwind CSS integrated into the webpack build, so that all subsequent UI stories can use utility classes for the dark theme and layout instead of hand-written CSS.

### Acceptance Criteria
- [ ] Given `tailwind.config.js` and `postcss.config.js`, when added, then Tailwind is configured to scan `src/**/*.html` and `src/**/*.ts` for class usage.
- [ ] Given `webpack.config.js`, when updated, then it processes Tailwind directives (`@tailwind base/components/utilities`) via `postcss-loader` for both the `taskpane` and `commands` bundles.
- [ ] Given `npm run build` and `npm run watch`, when run, then the Tailwind output CSS is generated without errors, and unused utility classes are purged/minified in production builds.
- [ ] Given a test utility class (e.g. `bg-black text-white`) added to `taskpane.html`, when the dev server runs, then it renders correctly, confirming the pipeline works end-to-end.

### Technical Notes
- Files: new `tailwind.config.js`, `postcss.config.js`; `webpack.config.js`; `package.json` (devDependencies: `tailwindcss`, `postcss`, `autoprefixer`, `postcss-loader`); `src/taskpane/taskpane.css` (add `@tailwind` directives).
- This project uses webpack 5 + babel-loader per CLAUDE.md; `postcss-loader` needs to be added to the existing CSS rule chain.
- Remove the test utility class once verified — it's only there to prove the pipeline works.

### Dependencies
- Blocked by: none
- Blocks: STORY-3 (and transitively STORY-4 through STORY-10)

---

## STORY-3: Apply dark theme to task pane using Tailwind

**Type**: Enhancement
**Priority**: High
**Complexity**: Medium
**Phase**: 1 — Branding & theme
**Labels**: `enhancement`, `frontend`, `high-priority`

### Description
As a document controller, I want the task pane to use a dark visual theme, so that the tool matches the requested dark UI and is comfortable to use.

### Acceptance Criteria
- [ ] Given `tailwind.config.js`, when configured, then `theme.extend.colors` defines the placeholder dark palette (background, surface, border, text, accent) as named tokens.
- [ ] Given the task pane loads, when rendered, then background, surfaces, borders, and text use Tailwind utility classes referencing those color tokens (e.g. `bg-surface`, `text-accent`) rather than hand-written CSS rules.
- [ ] Given interactive elements (buttons, inputs, radios), when focused/hovered, then they use Tailwind's `focus:`/`hover:` variants with the same accent token consistently.

### Technical Notes
- Files: `tailwind.config.js` (color tokens), `src/taskpane/taskpane.html` (utility classes), `src/taskpane/taskpane.css` (only `@tailwind` directives plus any custom keyframes that can't be expressed as utilities, e.g. the STORY-9 halo animation).
- Exact TPB hex codes are still TBD (PRD Open Question) — placeholder tokens now live in one config file, so swapping them later is a one-file change.

### Dependencies
- Blocked by: STORY-2 (Set up Tailwind CSS build pipeline)
- Blocks: STORY-4, STORY-5, STORY-6, STORY-7, STORY-8, STORY-9

---

## STORY-4: Add TP Bennett logo header

**Type**: Feature
**Priority**: Medium
**Complexity**: Small
**Phase**: 1 — Branding & theme
**Labels**: `enhancement`, `frontend`, `medium-priority`

### Description
As a document controller, I want to see the TP Bennett logo in the top-left of the pane, so that the tool is recognizable as an official TPB tool.

### Acceptance Criteria
- [ ] Given `src/assets/branding/` folder, when created, then it exists and is wired into webpack/HTML so a dropped logo file renders automatically.
- [ ] Given no logo file is present yet, when the pane loads, then a placeholder/alt text is shown instead of a broken image.
- [ ] Given a logo file is later added to `src/assets/branding/` with the documented filename, when the pane reloads, then the logo renders top-left without further code changes.

### Technical Notes
- Files: `src/taskpane/taskpane.html` (Tailwind utility classes for layout/positioning), `webpack.config.js` (asset handling), new folder `src/assets/branding/`.
- Actual logo file is an Open Question in the PRD — not yet supplied.

### Dependencies
- Blocked by: STORY-3 (Apply dark theme to task pane using Tailwind)
- Blocks: STORY-11

---

## STORY-5: Add footer with copyright and version label

**Type**: Feature
**Priority**: Medium
**Complexity**: Small
**Phase**: 1 — Branding & theme
**Labels**: `enhancement`, `frontend`, `medium-priority`

### Description
As a document controller, I want to see "© 2026 TP Bennett. All rights reserved." and "Version: Released for Testing" in the footer, so that I know this is an official, in-testing build.

### Acceptance Criteria
- [ ] Given the task pane loads, when scrolled to the bottom, then the footer displays both static strings exactly as specified.
- [ ] Given the footer, when styled with Tailwind utility classes, then it fits the dark theme and stays visible/anchored without overlapping section content.

### Technical Notes
- Files: `src/taskpane/taskpane.html`.
- Strings are hard-coded per PRD decision (not derived from `package.json`).

### Dependencies
- Blocked by: STORY-3 (Apply dark theme to task pane using Tailwind)
- Blocks: STORY-11

---

## STORY-6: Build transmittal upload section

**Type**: Feature
**Priority**: High
**Complexity**: Medium
**Phase**: 2 — Upload section
**Labels**: `enhancement`, `frontend`, `high-priority`

### Description
As a document controller, I want to drag-and-drop or browse for one or more transmittal files, so that I can load them into the tool before processing.

### Acceptance Criteria
- [ ] Given the upload section, when a user drags one or more `.xlsx`/`.xls`/`.csv` files onto the dropzone, then they are accepted and listed by filename.
- [ ] Given the upload section, when a user clicks to browse instead, then a native file picker opens allowing multi-select of the same file types.
- [ ] Given a file with an unsupported extension (e.g. `.pdf`, `.docx`), when dropped or selected, then it is rejected with an inline error message and does not appear in the accepted list.
- [ ] Given a listed file, when the user clicks its remove control, then it is removed from the pending upload list.

### Technical Notes
- Files: `src/taskpane/taskpane.html` (Tailwind utility classes for the dropzone/list), `src/taskpane/excel.ts` (or new module) for drag/drop and validation logic.
- Client-side type validation only in Phase 1 — no file content parsing (that's Phase 2 of the product).

### Dependencies
- Blocked by: STORY-3 (Apply dark theme to task pane using Tailwind)
- Blocks: STORY-10

---

## STORY-7: Build issue mode radio selector

**Type**: Feature
**Priority**: High
**Complexity**: Small
**Phase**: 3 — Issue mode selector
**Labels**: `enhancement`, `frontend`, `high-priority`

### Description
As a document controller, I want to indicate whether a transmittal contains a single issue or multiple issues, so that the tool (in Phase 2 of the product) knows how to parse it.

### Acceptance Criteria
- [ ] Given the section loads, when rendered, then "Single issue" is selected by default.
- [ ] Given the two radio options, when a user selects "Multiple issues", then the selection state updates and is retrievable by the rest of the app.
- [ ] Given the section, when rendered, then it visually communicates the two states clearly (labels, spacing) consistent with the dark theme.

### Technical Notes
- Files: `src/taskpane/taskpane.html` (Tailwind utility classes), `src/taskpane/excel.ts` (state handling).
- No downstream logic consumes this state yet — Phase 2 of the product will.

### Dependencies
- Blocked by: STORY-3 (Apply dark theme to task pane using Tailwind)
- Blocks: STORY-10

---

## STORY-8: Bundle template and implement "Load Template Issue Register" button

**Type**: Feature
**Priority**: Medium
**Complexity**: Medium
**Phase**: 4 — Template loading
**Labels**: `enhancement`, `frontend`, `medium-priority`

### Description
As a document controller, I want to click a button to insert the standard issue register template into my workbook, so that I have the correct structure ready before populating it.

### Acceptance Criteria
- [ ] Given the example template `.xlsx` has been supplied and bundled as a static asset, when the user clicks "Load Template Issue Register", then a new worksheet (e.g. "Issue Register") is inserted into the active workbook matching the template's headers/formatting.
- [ ] Given the template sheet already exists in the workbook, when the button is clicked again, then the user is warned before any overwrite/duplicate occurs (no silent data loss).
- [ ] Given `npm run build`, when run, then the bundled template asset is included in the output without errors.

### Technical Notes
- Files: `src/taskpane/excel.ts`, new asset under `assets/` or `src/assets/`, `webpack.config.js` (static asset copy), `taskpane.html` (Tailwind utility classes for the button).
- Follows the standard `Excel.run` pattern from CLAUDE.md (`.load()` → `context.sync()` → act).

### Dependencies
- Blocked by: STORY-3 (Apply dark theme to task pane using Tailwind); also blocked by external delivery of the example `.xlsx` template (tracked in PRD Open Questions — not a code task)
- Blocks: STORY-10

---

## STORY-9: Add disabled "Populate Register" button with halo effect

**Type**: Feature
**Priority**: Medium
**Complexity**: Small
**Phase**: 5 — Populate Register (stub)
**Labels**: `enhancement`, `frontend`, `medium-priority`

### Description
As a document controller, I want to see a clearly-styled "Populate Register" button, so that I understand this capability exists even though it isn't active yet.

### Acceptance Criteria
- [ ] Given the section loads, when rendered, then the "Populate Register" button has a halo/glow effect applied.
- [ ] Given the button, when in its Phase 1 state, then it is disabled (not clickable) and visually indicates a disabled state (e.g. reduced opacity via `disabled:` Tailwind variant) while retaining the halo styling.
- [ ] Given the button, when inspected in dev tools, then no click handler performs any workbook action (stub only).

### Technical Notes
- Files: `src/taskpane/taskpane.html` (Tailwind utility classes + `disabled:` variant), `src/taskpane/taskpane.css` (only the halo/glow `@keyframes` animation, since box-shadow pulse animations aren't expressible as plain Tailwind utilities without a plugin).
- No click handler wired, per PRD decision (disabled rather than a "coming soon" toast).

### Dependencies
- Blocked by: STORY-3 (Apply dark theme to task pane using Tailwind)
- Blocks: STORY-10

---

## STORY-10: Add section captions across all four sections

**Type**: Enhancement
**Priority**: Low
**Complexity**: Small
**Phase**: 6 — Section captions
**Labels**: `enhancement`, `frontend`, `low-priority`

### Description
As a first-time tester, I want a short persistent caption under each section, so that I understand what each control does without needing separate documentation.

### Acceptance Criteria
- [ ] Given each of the four sections (upload, issue mode, load template, populate register), when rendered, then each has one line of small helper text underneath it.
- [ ] Given the captions, when reviewed, then wording matches the plain-language descriptions in the PRD's Layout section.
- [ ] Given the dark theme, when captions render with Tailwind text/opacity utilities, then their contrast meets basic legibility (not gray-on-gray).

### Technical Notes
- Files: `src/taskpane/taskpane.html` (Tailwind utility classes).
- Purely additive copy/styling once the upload, radio, load-template, and populate-register markup exists.

### Dependencies
- Blocked by: STORY-6, STORY-7, STORY-8, STORY-9
- Blocks: STORY-11

---

## STORY-11: Verify Phase 1 build, lint, and manual sideload

**Type**: Technical
**Priority**: Medium
**Complexity**: Small
**Phase**: Cross-phase (Definition of Done)
**Labels**: `technical`, `medium-priority`

### Description
As a developer, I want to confirm the Phase 1 shell builds, lints, and sideloads cleanly, so that it's ready for controllers to test in Excel desktop.

### Acceptance Criteria
- [ ] Given `npm run lint`, when run, then it passes with no errors.
- [ ] Given `npm run build`, when run, then the production build completes without errors, including the Tailwind CSS pipeline.
- [ ] Given `npm start`, when run, then the add-in sideloads into Excel desktop and the task pane opens without console errors.
- [ ] Given the sideloaded pane, when manually walked through (upload, radio, load template, populate button), then it matches the PRD's Phase 1 success metrics.

### Technical Notes
- No new files; verification task only.
- Reference PRD "Success Metrics" table.

### Dependencies
- Blocked by: STORY-1, STORY-4, STORY-5, STORY-10
- Blocks: none

---

*Generated from PRD: `.agents/PRDs/tpb-drawing-issue-register-phase1.prd.md`*
