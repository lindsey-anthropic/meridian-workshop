# Meridian Workshop

A Claude Code workshop. You're a consultant responding to an RFP, then delivering the engagement.

## Prerequisites

Install these first:

- **Claude Code** — [docs.claude.com/claude-code](https://docs.claude.com/en/docs/claude-code/overview)
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **uv** (Python package manager) — `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **git**

## Setup

The workshop ends with opening a PR, so **fork this repo first**, then clone your fork:

```bash
git clone https://github.com/<your-username>/meridian-workshop.git
cd meridian-workshop
claude
```

That's it. Say hi — Claude will take it from there.

## If you get disconnected

Just run `claude` again in this directory and tell Claude where you left off.

## What's in here

- `docs/rfp/` — the RFP and client background
- `proposal/` — your response goes here (starts empty)
- `client/`, `server/` — the application you'll be working on in Act 2
- `.claude/` — project-level Claude Code config (agents, commands, skills) left by the previous vendor
