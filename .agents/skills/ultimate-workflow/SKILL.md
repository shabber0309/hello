---
name: ultimate-workflow
description: Applies the Ultimate Multi-Agent Developer Suite workflow (Roo Code context tracking, Ralph Loop iteration, GSD aggressive delivery, CodeRabbit PR standards) to all tasks.
---

# Ultimate Multi-Agent Workflow Skill

When executing any task in this codebase, adhere strictly to the three core pillars:

## 1. Roo Code & Ralph Loop Layer
- Build an unbroken loop from diagnosis -> minimal diff -> build assertion -> visual confirmation.
- Inspect affected source files with surgical precision before editing.
- Never write code blind without checking the surrounding component trees.

## 2. GSD Layer (Aggressive Execution)
- Build immediately with `npm run build` or targeted test runners to prove code works.
- Keep output concise, professional, and action-focused.
- If any build or runtime step errors, diagnose the specific stack trace and remediate immediately.

## 3. CodeRabbit Layer (Zero-Defect Code Quality)
- Maintain strict modular component boundaries.
- Ensure all CSS files avoid low-contrast submerged colors.
- Guarantee full responsiveness across desktop, tablet, and mobile breakpoints.
