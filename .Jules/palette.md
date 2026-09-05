## 2024-05-30 - Added Level Selection Accessibility & State UX
**Learning:** Level selection cards lacked keyboard accessibility (`tabIndex` and `keydown` support) and semantic distinction for screen readers and visual distinction (dimming for locked states).
**Action:** Always ensure dynamic menu cards are fully accessible using `tabIndex`, `role="button"`, ARIA attributes, keyboard support, and clear visual/state distinction for unlocked versus locked elements.
