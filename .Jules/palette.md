## 2024-05-24 - Keyboard Accessibility & ARIA States
**Learning:** Interactive UI components acting as buttons must receive `role="button"` and `tabindex="0"` to support keyboard navigation, alongside standard `aria-label` assignments. Screen reader alerts should use `aria-live`.
**Action:** Applied `aria-pressed` states correctly within logical `role="group"` boundaries (such as the difficulty selection) and added a standard `:focus-visible` CSS selector to multiple clickable classes to clearly highlight active elements for keyboard users.
