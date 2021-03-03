---
'tailwindcss-capsize': patch
---

Fix issue requiring an empty options object to be passed in

```diff
- require('tailwindcss-capsize')({})
+ require('tailwindcss-capsize')
```
