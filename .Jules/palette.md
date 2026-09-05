## 2024-05-18 - Missing focus states and ARIA labels
**Learning:** Native `<input>` elements were missing ARIA labels making screen reader navigation difficult. Interactive DOM elements mimicking buttons (`div.btn`) were missing `role="button"` and `aria-label` attributes. Missing `:focus-visible` global styles making keyboard navigation very difficult to track.
**Action:** Added `:focus-visible` to `index.html` CSS, and added `aria-label` attributes to leaderboard name input, volume sliders, and HUD icon buttons. Added `role="button"` and `aria-label` attributes to the on-screen touch controls.
## 2024-05-18 - Differentiate character icons in store
**Learning:** Store character icons were identical despite having different character styles (e.g., dog, rabbit, bear, ninja), which could confuse users.
**Action:** Updated `skinIconHTML` in `index.html` to render distinct ear shapes or accessories based on the character's `style` property.
