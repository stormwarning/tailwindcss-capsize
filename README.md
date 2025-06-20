# tailwindcss-capsize

[![npm version][npm-img]][npm-url]

> A TailwindCSS plugin that generates text-box-trim utility classes using [Capsize].

```bash
npm install --save-dev tailwindcss-capsize
```

## text-box-trim?

Formerly known as `leading-trim`, a [proposed CSS property] to remove the extra space from text bounding boxes, which affects optical alignment. This [article from Microsoft Design] outlines the problem and how the proposed solution works.

## Configuration

A JavaScript config file is required due to the values needed by the plugin. 

```css
@config "../tailwind.config.js";
```

Other Tailwind settings can be configured through CSS directives or included in the config file.

This plugin requires a `fontMetrics` key added to your Tailwind theme. It should
be an object with keys matching those in your `fontFamily` definitions, and each key should have an object of the following shape:

```ts
{
	ascent: number
	descent: number
	lineGap: number
	unitsPerEm: number
	capHeight: number
}
```

These values can be determined by using the [Capsize website], [fontkit], [FontDrop!], or some other means.

### A full example

```js
// tailwind.config.js
import pluginCapsize from 'tailwindcss-capsize'
export default {
	theme: {
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
		},
		fontMetrics: {
			// Keys here must match those in fontFamily.
			sans: {
				capHeight: 2048,
				ascent: 2728,
				descent: -680,
				lineGap: 0,
				unitsPerEm: 2816,
			},
		},
		// ...
	},
	plugins: [pluginCapsize],
}
```

## Usage

The new `.capsize` utility class should be applied to the _direct parent_ element surrounding a text node. This class requires `font-family`, `font-size`, and `line-height` utilities to be applied at some point above it in the cascade in order for the required custom properties to be available.

```html
<!-- Example using default TailwindCSS config -->

<p class="font-sans text-base leading-none capsize">Lorem ipsum dolor</p>
```

## Options

### rootSize

#### type: `number` (optional, default: `16`)

The plugin assumes a root font-size of `16px` when converting from rem values. To use a different value, pass it in (without units) to the plugin options.

```js
pluginCapsize({ rootSize: 12 })
```

### className

#### type: `string` (optional, default: `'capsize'`)

The default `.capsize` utility class can be replaced with a custom class name if preferred.

```js
pluginCapsize({ className: 'leading-trim' })
```

## Tips and tricks

### Text truncation and line clamping

Sometimes an interface calls for truncating text to a single line or clamping text to a specified number of lines. Applying these methods to the same element that the default `.capsize` class is applied to will cause issues since the class assigns pseudo `::before` and `::after` elements to that element.

```html
<!-- ❌ Does NOT work -->

<p class="font-sans text-base leading-none capsize truncate">
	Text to be truncated to a single line
</p>
```

To solve this, a child element to the element with the `.capsize` class should wrap the text. This element should receive the styling to truncate or line clamp.

```html
<!-- ✅ Does work! -->

<p class="font-sans text-base leading-none capsize">
	<span class="truncate">Text to be truncated to a single line</span>
</p>
```

## Related

[🔡 tailwindcss-opentype] — Utility classes for advanced typographic features.

[npm-url]: https://www.npmjs.com/package/tailwindcss-capsize
[npm-img]: https://img.shields.io/npm/v/tailwindcss-capsize.svg?style=flat-square
[Capsize]: https://github.com/seek-oss/capsize
[proposed CSS property]: https://www.w3.org/TR/css-inline-3/#leading-trim
[article from microsoft design]: https://medium.com/microsoft-design/leading-trim-the-future-of-digital-typesetting-d082d84b202
[Capsize website]: https://seek-oss.github.io/capsize/
[fontkit]: https://github.com/foliojs/fontkit
[FontDrop!]: https://fontdrop.info
[🔡 tailwindcss-opentype]: https://github.com/stormwarning/tailwindcss-opentype
