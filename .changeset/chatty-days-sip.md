---
"tailwindcss-capsize": major
---

Update plugin for Tailwind v4 support

v4 was a major change to how projects are configured as well as what plugins are allowed to modify. Previously, this plugin disabled `corePlugins` like `fontSize` in order to include custom CSS properties within the same utilities. This is no longer possible in v4, so while the *usage* hasn't changed, the CSS being output now includes duplicate declarations — one from the plugin and one from Tailwind itself.

v4 also allows configuration within CSS itself. However, this plugin relies on object values which aren't supported in CSS, so a JavaScript config file is still required. You can either use the JS file for all your settings, or just the settings for this plugin and configure the rest of your project in CSS.

The `mode` option has also been removed. This also removes the dependency on `@capsizecss/core`.
