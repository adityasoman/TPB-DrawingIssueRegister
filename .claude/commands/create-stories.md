---
description: Generate GitHub Issues from a PRD
argument-hint: <path-to-prd> [--repo OWNER/REPO] [--milestone MILESTONE_TITLE]
---

# Create GitHub Issues from PRD

Generate structured user stories from a Product Requirements Document. When GitHub MCP is configured, automatically creates the issues in GitHub.

**Input**: $ARGUMENTS

---

## Phase 1: LOAD

Read the PRD file provided as input. If no path given, look for:
1. `.agents/PRDs/*.prd.md` files
2. `PRD.md` at project root
3. Ask the user which PRD to use

Extract:
- User stories already defined in the PRD
- Acceptance criteria from success criteria and requirements
- Implementation phases and their deliverables
- Technical constraints and dependencies

Parse optional flags from arguments:
- `--repo` or `-r`: GitHub repository in `owner/repo` format (e.g., `acme/my-app`)
- `--milestone` or `-m`: Milestone title to link issues to (e.g., `v1.0`)

---

## Phase 2: ANALYZE

### Break Down into Stories

For each feature or requirement in the PRD:

1. **Create a user story** in the format:
   ```
   As a [user type], I want to [action], so that [benefit]
   ```

2. **Define acceptance criteria** (3-5 per story):
   ```
   Given [context], when [action], then [expected result]
   ```

3. **Estimate complexity**: Small / Medium / Large
   - Small: Single file change, clear implementation
   - Medium: Multiple files, some design decisions
   - Large: Cross-cutting concerns, architecture changes

4. **Identify dependencies** between stories

### Story Categories → GitHub Labels

Group stories by type and map to GitHub labels:
- **Feature**: New functionality → label: `enhancement`
- **Enhancement**: Improvement to existing functionality → label: `enhancement`
- **Bug**: Fix for known issues → label: `bug`
- **Technical**: Infrastructure, refactoring, tooling → label: `technical`
- **Spike**: Research or investigation needed → label: `spike`

Also apply labels for scope: `frontend`, `backend`, `api`, `database`, etc.

---

## Phase 3: STRUCTURE

### For Each Story, Create

```markdown
## [STORY-ID] Story Title

**Type**: Feature | Enhancement | Technical | Spike
**Priority**: High | Medium | Low
**Complexity**: Small | Medium | Large
**Phase**: (from PRD implementation phases)
**Labels**: (e.g., `enhancement`, `frontend`, `api`)

### Description
As a [user type], I want to [action], so that [benefit].

### Acceptance Criteria
- [ ] Given [context], when [action], then [result]
- [ ] Given [context], when [action], then [result]
- [ ] Given [context], when [action], then [result]

### Technical Notes
- Key implementation details
- Files likely to be modified
- Patterns to follow (reference CLAUDE.md or project conventions)

### Dependencies
- Blocked by: [other story IDs]
- Blocks: [other story IDs]
```

### Ordering

Order stories by:
1. Phase (from PRD implementation phases)
2. Dependencies (blocked stories come after their blockers)
3. Priority (High first within each phase)

---

## Phase 4: VALIDATE

Before output, verify:
- [ ] Every PRD requirement maps to at least one story
- [ ] No story is too large (break down if > 1 day of work)
- [ ] Acceptance criteria are testable and specific
- [ ] Dependencies form a valid DAG (no circular dependencies)
- [ ] Stories cover the full SDLC: types, validation, services, routes, UI, tests
- [ ] Each story can be independently reviewed and merged

---

## Phase 5: OUTPUT

Create the directory if it doesn't exist: `mkdir -p .agents/stories`

Save the stories to `.agents/stories/` directory as a markdown file.

---

## Phase 6: GITHUB INTEGRATION (when MCP is available)

**Check if the GitHub MCP server is available.** Look for tools prefixed with `mcp__github__` (e.g., `mcp__github__create_issue`, `mcp__github__list_milestones`). If available, offer to push issues directly to GitHub.

### If GitHub MCP IS available:

1. **Resolve the repository** to use:
   - Use the `--repo` argument if provided
   - Otherwise call `mcp__github__get_file_contents` on the working directory or check git remote to detect the repo
   - If still unclear, ask the user: "Which GitHub repo should I create issues in? (format: owner/repo)"

2. **Set up labels** before creating issues:
   - Call `mcp__github__list_labels` to see what labels already exist
   - For any required labels that are missing, call `mcp__github__create_label` to create them with sensible colours:
     - `enhancement` → `#a2eeef`
     - `bug` → `#d73a4a`
     - `technical` → `#e4e669`
     - `spike` → `#d876e3`
     - `high-priority` → `#b60205`
     - `medium-priority` → `#fbca04`
     - `low-priority` → `#0e8a16`

3. **Resolve or create the milestone** (if `--milestone` was provided or epic grouping makes sense):
   - Call `mcp__github__list_milestones` to check if the milestone already exists
   - If it doesn't exist, call `mcp__github__create_milestone` with the title and (optionally) a due date extracted from the PRD
   - Note the returned milestone number for use in issue creation

4. **Ask the user** before creating issues:
   ```
   I've generated {count} issues. Would you like me to create these in GitHub?
   - Repository: {OWNER/REPO}
   - Milestone: {MILESTONE_TITLE} (milestone #{NUMBER})
   ```

5. **If user confirms**, create issues using `mcp__github__create_issue` for each story with these parameters:
   - `owner`: repo owner
   - `repo`: repo name
   - `title`: Story title
   - `body`: Full markdown body including description, acceptance criteria checklist, and technical notes (use GitHub-flavoured markdown; checkboxes render as `- [ ]`)
   - `labels`: Array of label names (e.g., `["enhancement", "frontend", "high-priority"]`)
   - `milestone`: Milestone number (integer) if resolved above

   **Body template to use:**
   ```markdown
   ## Description
   As a [user type], I want to [action], so that [benefit].

   ## Acceptance Criteria
   - [ ] Given [context], when [action], then [result]
   - [ ] Given [context], when [action], then [result]

   ## Technical Notes
   - Key implementation details
   - Files likely to be modified

   ## Dependencies
   - Blocked by: #[issue number or story ID]
   - Blocks: #[issue number or story ID]

   ---
   *Generated from PRD — Phase: {phase} | Complexity: {complexity}*
   ```

6. **Create dependency cross-references** after all issues are created:
   - Once all issues have GitHub issue numbers, go back and update each issue's body to replace local story IDs (e.g., `STORY-3`) with real GitHub issue references (e.g., `#12`) using `mcp__github__update_issue`
   - This makes GitHub automatically render "mentioned in" links between issues

7. **Report created issues**:
   ```markdown
   ## GitHub Issues Created

   | # | Title | Labels | Milestone |
   |---|-------|--------|-----------|
   | #12 | Story title | enhancement, frontend | v1.0 |
   | #13 | Story title | technical | v1.0 |
   ...

   **Repository**: https://github.com/{owner}/{repo}
   **Milestone**: https://github.com/{owner}/{repo}/milestone/{number}
   **Issues**: https://github.com/{owner}/{repo}/issues
   ```

### If GitHub MCP is NOT available:

Output the stories as markdown only and note:
```
GitHub MCP is not configured. To push issues to GitHub automatically:
1. Create a Personal Access Token at https://github.com/settings/tokens
   (needs repo scope, or fine-grained: Issues: Read & Write, Metadata: Read)
2. Add the GitHub MCP server to Claude Code:
   claude mcp add-json github '{"type":"http","url":"https://api.githubcopilot.com/mcp/","headers":{"Authorization":"Bearer YOUR_PAT"}}' --scope user
3. Re-run this command
```

---

## Tips

- Keep stories small enough to complete in 1-2 days
- Acceptance criteria should be verifiable without asking the author
- Technical stories need acceptance criteria too (build passes, tests pass, etc.)
- GitHub's `- [ ]` checkboxes in issue bodies render as a progress tracker on the issue card — use them for acceptance criteria
- Use milestones to group by PRD phase (e.g., `Phase 1 — Core`, `Phase 2 — Polish`)
- Mention related issues with `#number` so GitHub auto-links them
- Reference the PRD section for each story so reviewers can trace back