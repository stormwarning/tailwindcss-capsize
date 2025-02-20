// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/vitest.d.ts" />

import { describe, expect, it } from 'vitest'

import capsizePlugin from '../src/index.js'
import { css, html, run } from './run.js'

const CSS_INPUT = css`
	@tailwind utilities;
`
const BASE_CONFIG = {
	content: [
		{
			raw: html`
				<div class="font-sans text-sm leading-sm capsize leading-trim"></div>
				<div class="font-sans text-md leading-md capsize leading-trim"></div>
				<div class="sm:font-sans sm:text-sm sm:leading-sm capsize leading-trim"></div>
				<div class="sm:font-sans sm:text-md sm:leading-md capsize leading-trim"></div>
			`,
		},
	],
	corePlugins: {
		fontFamily: false,
		fontSize: false,
		lineHeight: false,
	},
}
const BASE_THEME = {
	screens: {},
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
}

describe('Plugin', () => {
	describe('in "modern" mode', () => {
		it('generates utility classes with a default root size', async () => {
			await run(CSS_INPUT, {
				...BASE_CONFIG,
				theme: {
					...BASE_THEME,
					screens: {
						sm: '640px',
					},
					fontSize: {
						sm: '14px',
						md: '1.5rem',
					},
					lineHeight: {
						sm: '20px',
						md: '2.5rem',
					},
				},
				plugins: [capsizePlugin],
			}).then((result) =>
				expect(result.css).toMatchFormattedCss(css`
					.font-sans {
						--ascent-scale: 0.9688;
						--descent-scale: 0.2415;
						--cap-height-scale: 0.7273;
						--line-gap-scale: 0;
						--line-height-scale: 1.2102;
						font-family: Inter, sans-serif;
					}

					.text-md {
						--font-size-px: 24;
						font-size: 1.5rem;
					}

					.text-sm {
						--font-size-px: 14;
						font-size: 14px;
					}

					.leading-md {
						--line-height-offset: calc(
							(((var(--line-height-scale) * var(--font-size-px)) - 40) / 2) / var(--font-size-px)
						);
						line-height: 2.5rem;
					}

					.leading-sm {
						--line-height-offset: calc(
							(((var(--line-height-scale) * var(--font-size-px)) - 20) / 2) / var(--font-size-px)
						);
						line-height: 20px;
					}

					.capsize::before {
						display: table;
						content: '';
						margin-block-end: calc(
							(
									(var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2) - var(
											--line-height-offset
										)
								) *
								-1em
						);
					}

					.capsize::after {
						display: table;
						content: '';
						margin-block-start: calc(
							((var(--descent-scale) + var(--line-gap-scale) / 2) - var(--line-height-offset)) *
								-1em
						);
					}

					@media (min-width: 640px) {
						.sm\\:font-sans {
							--ascent-scale: 0.9688;
							--descent-scale: 0.2415;
							--cap-height-scale: 0.7273;
							--line-gap-scale: 0;
							--line-height-scale: 1.2102;
							font-family: Inter, sans-serif;
						}

						.sm\\:text-md {
							--font-size-px: 24;
							font-size: 1.5rem;
						}

						.sm\\:text-sm {
							--font-size-px: 14;
							font-size: 14px;
						}

						.sm\\:leading-md {
							--line-height-offset: calc(
								(((var(--line-height-scale) * var(--font-size-px)) - 40) / 2) / var(--font-size-px)
							);
							line-height: 2.5rem;
						}

						.sm\\:leading-sm {
							--line-height-offset: calc(
								(((var(--line-height-scale) * var(--font-size-px)) - 20) / 2) / var(--font-size-px)
							);
							line-height: 20px;
						}
					}
				`),
			)
		})

		it('generates utility classes with a custom root size', async () => {
			await run(CSS_INPUT, {
				...BASE_CONFIG,
				theme: {
					...BASE_THEME,
					fontSize: {
						sm: '14px',
						md: '1.5rem',
					},
					lineHeight: {
						sm: '20px',
						md: '2.5rem',
					},
				},
				plugins: [capsizePlugin({ rootSize: 12 })],
			}).then((result) =>
				expect(result.css).toMatchFormattedCss(css`
					.font-sans {
						--ascent-scale: 0.9688;
						--descent-scale: 0.2415;
						--cap-height-scale: 0.7273;
						--line-gap-scale: 0;
						--line-height-scale: 1.2102;
						font-family: Inter, sans-serif;
					}

					.text-md {
						--font-size-px: 18;
						font-size: 1.5rem;
					}

					.text-sm {
						--font-size-px: 14;
						font-size: 14px;
					}

					.leading-md {
						--line-height-offset: calc(
							(((var(--line-height-scale) * var(--font-size-px)) - 30) / 2) / var(--font-size-px)
						);
						line-height: 2.5rem;
					}

					.leading-sm {
						--line-height-offset: calc(
							(((var(--line-height-scale) * var(--font-size-px)) - 20) / 2) / var(--font-size-px)
						);
						line-height: 20px;
					}

					.capsize::before {
						display: table;
						content: '';
						margin-block-end: calc(
							(
									(var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2) - var(
											--line-height-offset
										)
								) *
								-1em
						);
					}

					.capsize::after {
						display: table;
						content: '';
						margin-block-start: calc(
							((var(--descent-scale) + var(--line-gap-scale) / 2) - var(--line-height-offset)) *
								-1em
						);
					}
				`),
			)
		})

		it('works with unitless or percentage line-height values', async () => {
			await run(CSS_INPUT, {
				...BASE_CONFIG,
				theme: {
					...BASE_THEME,
					fontSize: {
						sm: '1rem',
					},
					lineHeight: {
						sm: '100%',
						md: '1.5',
					},
				},
				plugins: [capsizePlugin],
			}).then((result) =>
				expect(result.css).toMatchFormattedCss(css`
					.font-sans {
						--ascent-scale: 0.9688;
						--descent-scale: 0.2415;
						--cap-height-scale: 0.7273;
						--line-gap-scale: 0;
						--line-height-scale: 1.2102;
						font-family: Inter, sans-serif;
					}

					.text-sm {
						--font-size-px: 16;
						font-size: 1rem;
					}

					.leading-md {
						--line-height-offset: calc(
							(
									(
											(var(--line-height-scale) * var(--font-size-px)) - calc(
													1.5 * var(--font-size-px)
												)
										) /
										2
								) /
								var(--font-size-px)
						);
						line-height: 1.5;
					}

					.leading-sm {
						--line-height-offset: calc(
							(
									(
											(var(--line-height-scale) * var(--font-size-px)) - calc(
													1 * var(--font-size-px)
												)
										) /
										2
								) /
								var(--font-size-px)
						);
						line-height: 100%;
					}

					.capsize::before {
						display: table;
						content: '';
						margin-block-end: calc(
							(
									(var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2) - var(
											--line-height-offset
										)
								) *
								-1em
						);
					}

					.capsize::after {
						display: table;
						content: '';
						margin-block-start: calc(
							((var(--descent-scale) + var(--line-gap-scale) / 2) - var(--line-height-offset)) *
								-1em
						);
					}
				`),
			)
		})

		it('works with default line-height values', async () => {
			await run(CSS_INPUT, {
				...BASE_CONFIG,
				theme: {
					...BASE_THEME,
					fontSize: {
						md: ['1rem', '1.5rem'],
					},
					lineHeight: {},
				},
				plugins: [capsizePlugin],
			}).then((result) =>
				expect(result.css).toMatchFormattedCss(`
					.font-sans {
						--ascent-scale: 0.9688;
						--descent-scale: 0.2415;
						--cap-height-scale: 0.7273;
						--line-gap-scale: 0;
						--line-height-scale: 1.2102;
						font-family: Inter, sans-serif;
					}

					.text-md {
						--font-size-px: 16;
						font-size: 1rem;
						--line-height-offset: calc(
							(((var(--line-height-scale) * var(--font-size-px)) - 24) / 2) / var(--font-size-px)
						);
						line-height: 1.5rem;
					}

					.capsize::before {
						display: table;
						content: "";
						margin-block-end: calc(
							((var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2) -
								var(--line-height-offset)) * -1em
						);
					}

					.capsize::after {
						display: table;
						content: "";
						margin-block-start: calc(
							((var(--descent-scale) + var(--line-gap-scale) / 2) - var(--line-height-offset)) * -1em
						);
					}
				`),
			)
		})

		it('generates utility classes with a custom activation class', async () => {
			await run(CSS_INPUT, {
				...BASE_CONFIG,
				theme: {
					...BASE_THEME,
					fontSize: {
						sm: '1rem',
					},
					lineHeight: {
						md: '1.5',
					},
				},
				plugins: [capsizePlugin({ className: 'leading-trim' })],
			}).then((result) =>
				expect(result.css).toMatchFormattedCss(`
					.font-sans {
						--ascent-scale: 0.9688;
						--descent-scale: 0.2415;
						--cap-height-scale: 0.7273;
						--line-gap-scale: 0;
						--line-height-scale: 1.2102;
						font-family: Inter, sans-serif;
					}

					.text-sm {
						--font-size-px: 16;
						font-size: 1rem;
					}

					.leading-md {
						--line-height-offset: calc(
							(((var(--line-height-scale) * var(--font-size-px)) - calc(1.5 * var(--font-size-px))) / 2) /
								var(--font-size-px)
						);
						line-height: 1.5;
					}

					.leading-trim::before {
						display: table;
						content: "";
						margin-block-end: calc(
							((var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2) -
								var(--line-height-offset)) * -1em
						);
					}

					.leading-trim::after {
						display: table;
						content: "";
						margin-block-start: calc(
							((var(--descent-scale) + var(--line-gap-scale) / 2) - var(--line-height-offset)) * -1em
						);
					}
				`),
			)
		})
	})

	describe('in "classic" mode', () => {
		it('generates utility classes with a default root size', async () => {
			await run(CSS_INPUT, {
				...BASE_CONFIG,
				theme: {
					...BASE_THEME,
					fontSize: {
						sm: '14px',
						md: '1.5rem',
					},
					lineHeight: {
						sm: '20px',
						md: '2.5rem',
					},
				},
				plugins: [capsizePlugin({ mode: 'classic' })],
			}).then((result) =>
				expect(result.css).toMatchFormattedCss(`
					.font-sans.text-sm.leading-sm.capsize::before,
					.font-sans .text-sm.leading-sm.capsize::before,
					.font-sans .text-sm .leading-sm.capsize::before,
					.text-sm .font-sans.leading-sm.capsize::before,
					.text-sm .font-sans .leading-sm.capsize::before {
						content: '';
						margin-block-end: -0.3506em;
						display: table;
					}

					.font-sans.text-sm.leading-sm.capsize::after,
					.font-sans .text-sm.leading-sm.capsize::after,
					.font-sans .text-sm .leading-sm.capsize::after,
					.text-sm .font-sans.leading-sm.capsize::after,
					.text-sm .font-sans .leading-sm.capsize::after {
						content: '';
						margin-block-start: -0.3506em;
						display: table;
					}

					.font-sans.text-sm.leading-md.capsize::before,
					.font-sans .text-sm.leading-md.capsize::before,
					.font-sans .text-sm .leading-md.capsize::before,
					.text-sm .font-sans.leading-md.capsize::before,
					.text-sm .font-sans .leading-md.capsize::before {
						content: '';
						margin-block-end: -1.0649em;
						display: table;
					}

					.font-sans.text-sm.leading-md.capsize::after,
					.font-sans .text-sm.leading-md.capsize::after,
					.font-sans .text-sm .leading-md.capsize::after,
					.text-sm .font-sans.leading-md.capsize::after,
					.text-sm .font-sans .leading-md.capsize::after {
						content: '';
						margin-block-start: -1.0649em;
						display: table;
					}

					.font-sans.text-md.leading-sm.capsize::before,
					.font-sans .text-md.leading-sm.capsize::before,
					.font-sans .text-md .leading-sm.capsize::before,
					.text-md .font-sans.leading-sm.capsize::before,
					.text-md .font-sans .leading-sm.capsize::before {
						content: '';
						margin-block-end: -0.053em;
						display: table;
					}

					.font-sans.text-md.leading-sm.capsize::after,
					.font-sans .text-md.leading-sm.capsize::after,
					.font-sans .text-md .leading-sm.capsize::after,
					.text-md .font-sans.leading-sm.capsize::after,
					.text-md .font-sans .leading-sm.capsize::after {
						content: '';
						margin-block-start: -0.053em;
						display: table;
					}

					.font-sans.text-md.leading-md.capsize::before,
					.font-sans .text-md.leading-md.capsize::before,
					.font-sans .text-md .leading-md.capsize::before,
					.text-md .font-sans.leading-md.capsize::before,
					.text-md .font-sans .leading-md.capsize::before {
						content: '';
						margin-block-end: -0.4697em;
						display: table;
					}

					.font-sans.text-md.leading-md.capsize::after,
					.font-sans .text-md.leading-md.capsize::after,
					.font-sans .text-md .leading-md.capsize::after,
					.text-md .font-sans.leading-md.capsize::after,
					.text-md .font-sans .leading-md.capsize::after {
						content: '';
						margin-block-start: -0.4697em;
						display: table;
					}
				`),
			)
		})

		it('generates utility classes with a custom root size', async () => {
			await run(CSS_INPUT, {
				...BASE_CONFIG,
				theme: {
					...BASE_THEME,
					fontSize: {
						sm: '14px',
						md: '1.5rem',
					},
					lineHeight: {
						sm: '20px',
						md: '2.5rem',
					},
				},
				plugins: [capsizePlugin({ rootSize: 12, mode: 'classic' })],
			}).then((result) =>
				expect(result.css).toMatchFormattedCss(`
					.font-sans.text-sm.leading-sm.capsize::before,
					.font-sans .text-sm.leading-sm.capsize::before,
					.font-sans .text-sm .leading-sm.capsize::before,
					.text-sm .font-sans.leading-sm.capsize::before,
					.text-sm .font-sans .leading-sm.capsize::before {
						content: '';
						margin-block-end: -0.3506em;
						display: table;
					}

					.font-sans.text-sm.leading-sm.capsize::after,
					.font-sans .text-sm.leading-sm.capsize::after,
					.font-sans .text-sm .leading-sm.capsize::after,
					.text-sm .font-sans.leading-sm.capsize::after,
					.text-sm .font-sans .leading-sm.capsize::after {
						content: '';
						margin-block-start: -0.3506em;
						display: table;
					}

					.font-sans.text-sm.leading-md.capsize::before,
					.font-sans .text-sm.leading-md.capsize::before,
					.font-sans .text-sm .leading-md.capsize::before,
					.text-sm .font-sans.leading-md.capsize::before,
					.text-sm .font-sans .leading-md.capsize::before {
						content: '';
						margin-block-end: -0.7078em;
						display: table;
					}

					.font-sans.text-sm.leading-md.capsize::after,
					.font-sans .text-sm.leading-md.capsize::after,
					.font-sans .text-sm .leading-md.capsize::after,
					.text-sm .font-sans.leading-md.capsize::after,
					.text-sm .font-sans .leading-md.capsize::after {
						content: '';
						margin-block-start: -0.7078em;
						display: table;
					}

					.font-sans.text-md.leading-sm.capsize::before,
					.font-sans .text-md.leading-sm.capsize::before,
					.font-sans .text-md .leading-sm.capsize::before,
					.text-md .font-sans.leading-sm.capsize::before,
					.text-md .font-sans .leading-sm.capsize::before {
						content: '';
						margin-block-end: -0.1919em;
						display: table;
					}

					.font-sans.text-md.leading-sm.capsize::after,
					.font-sans .text-md.leading-sm.capsize::after,
					.font-sans .text-md .leading-sm.capsize::after,
					.text-md .font-sans.leading-sm.capsize::after,
					.text-md .font-sans .leading-sm.capsize::after {
						content: '';
						margin-block-start: -0.1919em;
						display: table;
					}

					.font-sans.text-md.leading-md.capsize::before,
					.font-sans .text-md.leading-md.capsize::before,
					.font-sans .text-md .leading-md.capsize::before,
					.text-md .font-sans.leading-md.capsize::before,
					.text-md .font-sans .leading-md.capsize::before {
						content: '';
						margin-block-end: -0.4697em;
						display: table;
					}

					.font-sans.text-md.leading-md.capsize::after,
					.font-sans .text-md.leading-md.capsize::after,
					.font-sans .text-md .leading-md.capsize::after,
					.text-md .font-sans.leading-md.capsize::after,
					.text-md .font-sans .leading-md.capsize::after {
						content: '';
						margin-block-start: -0.4697em;
						display: table;
					}
				`),
			)
		})

		it('works with unitless or percentage line-height values', async () => {
			await run(CSS_INPUT, {
				...BASE_CONFIG,
				theme: {
					...BASE_THEME,
					fontSize: {
						sm: '1rem',
					},
					lineHeight: {
						sm: '100%',
						md: '1.5',
					},
				},
				plugins: [capsizePlugin({ mode: 'classic' })],
			}).then((result) =>
				expect(result.css).toMatchFormattedCss(`
					.font-sans.text-sm.leading-sm.capsize::before,
					.font-sans .text-sm.leading-sm.capsize::before,
					.font-sans .text-sm .leading-sm.capsize::before,
					.text-sm .font-sans.leading-sm.capsize::before,
					.text-sm .font-sans .leading-sm.capsize::before {
						content: '';
						margin-block-end: -0.1364em;
						display: table;
					}

					.font-sans.text-sm.leading-sm.capsize::after,
					.font-sans .text-sm.leading-sm.capsize::after,
					.font-sans .text-sm .leading-sm.capsize::after,
					.text-sm .font-sans.leading-sm.capsize::after,
					.text-sm .font-sans .leading-sm.capsize::after {
						content: '';
						margin-block-start: -0.1364em;
						display: table;
					}

					.font-sans.text-sm.leading-md.capsize::before,
					.font-sans .text-sm.leading-md.capsize::before,
					.font-sans .text-sm .leading-md.capsize::before,
					.text-sm .font-sans.leading-md.capsize::before,
					.text-sm .font-sans .leading-md.capsize::before {
						content: '';
						margin-block-end: -0.3864em;
						display: table;
					}

					.font-sans.text-sm.leading-md.capsize::after,
					.font-sans .text-sm.leading-md.capsize::after,
					.font-sans .text-sm .leading-md.capsize::after,
					.text-sm .font-sans.leading-md.capsize::after,
					.text-sm .font-sans .leading-md.capsize::after {
						content: '';
						margin-block-start: -0.3864em;
						display: table;
					}
				`),
			)
		})

		it('generates utility classes with a custom activation class', async () => {
			await run(CSS_INPUT, {
				...BASE_CONFIG,
				content: [
					{
						raw: html` <div class="font-sans text-sm leading-md leading-trim"></div> `,
					},
				],
				theme: {
					...BASE_THEME,
					fontSize: {
						sm: '1rem',
					},
					lineHeight: {
						md: '1.5',
					},
				},
				plugins: [
					capsizePlugin({
						className: 'leading-trim',
						mode: 'classic',
					}),
				],
			}).then((result) =>
				expect(result.css).toMatchFormattedCss(`
					.font-sans.text-sm.leading-md.leading-trim::before,
					.font-sans .text-sm.leading-md.leading-trim::before,
					.font-sans .text-sm .leading-md.leading-trim::before,
					.text-sm .font-sans.leading-md.leading-trim::before,
					.text-sm .font-sans .leading-md.leading-trim::before {
						content: '';
						margin-block-end: -0.3864em;
						display: table;
					}

					.font-sans.text-sm.leading-md.leading-trim::after,
					.font-sans .text-sm.leading-md.leading-trim::after,
					.font-sans .text-sm .leading-md.leading-trim::after,
					.text-sm .font-sans.leading-md.leading-trim::after,
					.text-sm .font-sans .leading-md.leading-trim::after {
						content: '';
						margin-block-start: -0.3864em;
						display: table;
					}
				`),
			)
		})
	})
})
