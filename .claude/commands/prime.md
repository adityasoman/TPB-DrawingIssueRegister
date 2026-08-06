---
description: Prime agent with codebase understanding
argument-hint: [github-issues] [github-discussions-or-wiki-pages]
---

# Prime: Load Project Context

**Input**: $ARGUMENTS

## Objective

Build comprehensive understanding of this codebase by analyzing structure and key files.

## Process

### Step 0: Load External Context (if provided)

The first argument is an optional GitHub issue number or comma-separated list of issue numbers (e.g., `42` or `42,43,44`). The second argument is an optional GitHub Discussion number or comma-separated list of numbers (e.g., `10` or `10,11`).

Assume the repo is the one in the current working directory. Determine `owner` and `repo` from `git remote get-url origin`.

If GitHub issue numbers are provided:
1. For each issue number, call `mcp__github__get_issue` with the resolved `owner`/`repo` to fetch the title, body, labels, and comments
2. Use this context to understand what work is expected, including acceptance criteria in the issue body

If GitHub Discussion numbers are provided:
1. For each discussion number, call `mcp__github__get_discussion` with the resolved `owner`/`repo`
2. Use this context as additional background for understanding the project

### Step 1: Analyze the Codebase

1. Read `CLAUDE.md` for project conventions and structure
2. **Backend** (`backend-app/`):
   - Read `backend-app/main.py` for router registration and middleware
   - Scan `backend-app/Routes/` for available API endpoints
   - Scan `backend-app/Agents/` for agent definitions (Base, Architecture, CaseStudy)
   - Read `backend-app/requirements.txt` for dependencies
3. **Frontend App** (`frontend-app/`):
   - Read `frontend-app/src/App.tsx` for routing setup
   - Scan `frontend-app/src/pages/` for available pages
   - Scan `frontend-app/src/components/agent-builder/` for the node graph system
   - Read `frontend-app/package.json` for dependencies
4. Check recent commits with `git log --oneline -5`

## Output

Produce a scannable summary of what you learned:

- **Project Purpose**: One sentence
- **Tech Stack**
  - Frontend App: React 19 + TypeScript, Vite, Tailwind/DaisyUI, Firebase, ReactFlow, Excalidraw, Three.js
  - Backend: FastAPI, Google ADK, Gemini/Vertex AI, GCS, Firestore, Replicate
- **API Surface**: Key route groups and what they do (e.g. `/architecture/chat`, `/media/image/*`, `/storage/*`, `/profiles/*`)
- **Agent Structure**: Which agents exist under `Agents/Base/`, `Agents/Architecture/`, `Agents/CaseStudy/`, and what each does
- **Frontend Pages**: List of pages and their purpose
- **Agent Builder Nodes**: Categories of nodes available in the visual editor
- **Current State**: Recent commits, current branch
- **Issue Context** (if issues were provided): What work is in scope, key requirements or acceptance criteria

Use bullet points. Keep it concise.