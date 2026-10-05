# Live Fix - Ultimate Developer Suite & Workflow Standards

This project adheres to the **Ultimate Multi-Agent Workflow** integrating Roo Code context analysis, Ralph Loop continuous verification, GSD (Get Shit Done) aggressive execution, and CodeRabbit PR-grade review standards.

---

## 1. Roo Code & Ralph Loop Layer (Context & Iteration)
- **Unbroken Execution Tracking**: Every task maintains an unbroken cycle of inspection -> surgical edit -> build verification -> live validation.
- **Precise File Context**: Analyze surrounding component architecture, props, and CSS variables before editing.
- **Targeted Diffs**: Never rewrite entire files blindly; use focused diff replacements.
- **No Hallucinated Placeholders**: All mock data, images, and routes must be working and coherent with the platform's transparent repair model.

---

## 2. Get Shit Done (GSD Layer - Aggressive Execution)
- **Prioritize Working Code**: Validate every feature change with `npm run build` and live endpoint/browser assertions.
- **Concise, High-Value Communication**: Keep explanations clear, professional, and action-focused.
- **Self-Healing Iterations**: When a test or build fails, automatically backtrack, identify root cause, and apply fixes immediately without waiting.
- **Comprehensive Verification**: Public, Customer, Technician, and Admin portals must remain fully functional with zero broken links or dead buttons.

---

## 3. CodeRabbit Layer (Pull Request & Quality Standards)
- **Modular Component Architecture**: Keep React components focused, with CSS separated into dedicated files (`*.css`).
- **High-Contrast Design & Accessibility**: All text, badges, and buttons must pass strict contrast ratios in both light and dark modes. Never use raw white `#fff` text on light or un-inverted backgrounds.
- **Clean Console & Clean Network**: Zero unhandled console warnings, zero invalid DOM props, and graceful API fallbacks.
