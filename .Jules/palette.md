## 2024-05-30 - Added Level Selection Accessibility & State UX
**Learning:** Level selection cards lacked keyboard accessibility (`tabIndex` and `keydown` support) and semantic distinction for screen readers and visual distinction (dimming for locked states).
**Action:** Always ensure dynamic menu cards are fully accessible using `tabIndex`, `role="button"`, ARIA attributes, keyboard support, and clear visual/state distinction for unlocked versus locked elements.
## 2024-05-30 - Toast Notifications Accessibility
**Learning:** Toast notifications dynamically displayed during the game (e.g. for achievements or alerts) were not being announced by screen readers because they lacked live region roles.
**Action:** Always add `role="status"` and `aria-live="polite"` (or `"assertive"` if critical) to toast/notification containers to ensure screen readers announce dynamic updates.
