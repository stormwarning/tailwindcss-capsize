---
'tailwindcss-capsize': patch
---

Handle `number` theme values

Internal utilities assumed theme values would always be `string` typed, but in some cases they may be `number`s.
