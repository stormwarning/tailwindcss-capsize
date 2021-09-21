---
'tailwindcss-capsize': patch
---

Fix usage when `require`ing plugin

```diff
- require('tailwindcss-capsize').default
+ require('tailwindcss-capsize')
```
