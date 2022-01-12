# tailwindcss-capsize

[![npm version][npm-img]][npm-url]

> A TailwindCSS plugin that generates leading-trim utility classes using [Capsize](https://github.com/seek-oss/capsize).

```bash
$ npm install --save-dev tailwindcss-capsize
```

## leading-trim?

A [proposed CSS property](https://www.w3.org/TR/css-inline-3/#leading-trim) to remove the extra space from text bounding boxes, which affects optical alignment. This [article from Microsoft Design][] outlines the problem and how the proposed solution works.

## Configuration

This plugin requires a `fontMetrics` key added to your Tailwind theme. It should be an object with keys matching those in your `fontFamily` definitions, and each key should have an object of the following shape:

```ts
{
    ascent: number
    descent: number
    lineGap: number
    unitsPerEm: number
    capHeight: number
}
```

These values can be determined by using the [Capsize website](https://seek-oss.github.io/capsize/), by using [fontkit](https://github.com/foliojs/fontkit), or some other means.

### A full example

```js
// tailwind.config.js
module.exports = {
    theme: {
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        },
        fontMetrics: {
            sans: {
                capHeight: 2048,
                ascent: 2728,
                descent: -680,
                lineGap: 0,
                unitsPerEm: 2816,
            },
        },
        fontSize: { ... },
        lineHeight: { ... },
        ...
    },
    plugins: [require('tailwindcss-capsize')],
}
```

## Usage

The new `.capsize` utility class should be applied to the _direct parent_ element surrounding a text node. This class requires `font-family`, `font-size`, and `line-height` utilities to be applied at some point above it in the cascade in order for the required custom properties to be available.

## Options

### rootSize

The plugin assumes a root font-size of `16px` when converting from rem values. To use a different value, pass it in (without units) to the plugin options.

```js
require('tailwindcss-capsize')({ rootSize: 12 })
```

### className

The default `.capsize` utility class can be replaced with a custom class name if preferred.

```js
require('tailwindcss-capsize')({ className: 'leading-trim' })
```

### mode

By default the plugin replaces the `fontFamily`, `fontSize`, and `lineHeight` core plugins, adding custom properties to the output of each which are used in the `calc()` expressions in the utility class.

```diff
.font-sans {
+   --ascent-scale: 0.9688;
+   --descent-scale: 0.2415;
+   --cap-height-scale: 0.7273;
+   --line-gap-scale: 0;
+   --line-height-scale: 1.2102;
    font-family: Inter, sans-serif;
}
```

If you need to support browsers that don’t support custom properties, setting `mode` to `'classic'` will handle all the calculation at build-time before the CSS is output. This will require that the markup matches a specific selector format.

```js
require('tailwindcss-capsize')({ mode: 'classic' })
```

## Related

[🔡 tailwindcss-opentype](https://github.com/stormwarning/tailwindcss-opentype)  
Utility classes for advanced typographic features.

[npm-url]: https://www.npmjs.com/package/tailwindcss-capsize
[npm-img]: https://img.shields.io/npm/v/tailwindcss-capsize.svg?style=flat-square
[article from microsoft design]: https://medium.com/microsoft-design/leading-trim-the-future-of-digital-typesetting-d082d84b202
