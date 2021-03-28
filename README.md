# tailwindcss-capsize

[![npm version][npm-img]][npm-url]

> A TailwindCSS plugin that generates leading-trim utility classes using [Capsize](https://github.com/seek-oss/capsize).

```bash
$ npm install --save-dev tailwindcss-capsize
```

## leading-trim?

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

The plugin assumes a root font-size of `16px` when converting from rem values. To use a different value, pass it in (without units) to the plugin options.

```js
require('tailwindcss-capsize').default({ rootSize: 12 })
```

## Usage

The new `.capsize` utility class should be applied to the *direct parent* element surrounding a text node. This class only provides the neccessary styles for trimming whitespace, utility classes for setting `font-family`, `font-size`, and `line-height` will need to be applied as well.

[npm-url]: https://www.npmjs.com/package/tailwindcss-capsize

[npm-img]: https://img.shields.io/npm/v/tailwindcss-capsize.svg?style=flat-square
