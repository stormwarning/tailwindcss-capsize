// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/vitest.d.ts" />

import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { css, run } from './run.js'

// eslint-disable-next-line unicorn/prefer-module
const CONFIG_PATH = path.resolve(__dirname, './tailwind.config.js')
const CSS_INPUT = `
	@tailwind utilities;
	@config "${CONFIG_PATH}";
	@source inline("{sm:,}font-sans");
	@source inline("{sm:,}text-sm");
	@source inline("{sm:,}text-md");
	@source inline("{sm:,}leading-sm");
	@source inline("{sm:,}leading-md");
	@source inline("capsize");
	@source inline("leading-trim");

	@source not inline("leading-none");
	@source not inline("table");
	@source not inline("truncate");
`
const BASE_CONFIG = {}
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
			}).then((result) =>
				expect(result.css).toMatchFormattedCss(css`
					/*! tailwindcss v4.1.10 | MIT License | https://tailwindcss.com */
					@layer properties;

					.capsize {
						&::before {
							display: table;
							content: '';
							margin-bottom: calc(
								(
										(
												var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2
											) - var(--line-height-offset)
									) *
									-1em
							);
						}
						&::after {
							display: table;
							content: '';
							margin-top: calc(
								((var(--descent-scale) + var(--line-gap-scale) / 2) - var(--line-height-offset)) *
									-1em
							);
						}
					}

					.font-sans {
						font-family: Inter, sans-serif;
					}
					.text-md {
						font-size: 1.5rem;
					}
					.text-sm {
						font-size: 14px;
					}
					.leading-md {
						--tw-leading: 2.5rem;
						line-height: 2.5rem;
					}
					.leading-sm {
						--tw-leading: 20px;
						line-height: 20px;
					}

					.font-sans {
						--ascent-scale: 0.9688;
						--descent-scale: 0.2415;
						--cap-height-scale: 0.7273;
						--line-gap-scale: 0;
						--line-height-scale: 1.2102;
					}
					.leading-md {
						--line-height-offset: calc(
							(((var(--line-height-scale) * var(--font-size-px)) - 40) / 2) / var(--font-size-px)
						);
					}
					.leading-sm {
						--line-height-offset: calc(
							(((var(--line-height-scale) * var(--font-size-px)) - 20) / 2) / var(--font-size-px)
						);
					}
					.text-md {
						--font-size-px: 24;
					}
					.text-sm {
						--font-size-px: 14;
					}

					.sm\:font-sans {
						@media (width >= 640px) {
							font-family: Inter, sans-serif;
						}
					}
					.sm\:text-md {
						@media (width >= 640px) {
							font-size: 1.5rem;
						}
					}
					.sm\:text-sm {
						@media (width >= 640px) {
							font-size: 14px;
						}
					}
					.sm\:leading-md {
						@media (width >= 640px) {
							--tw-leading: 2.5rem;
							line-height: 2.5rem;
						}
					}
					.sm\:leading-sm {
						@media (width >= 640px) {
							--tw-leading: 20px;
							line-height: 20px;
						}
					}

					.sm\:font-sans {
						@media (width >= 640px) {
							--ascent-scale: 0.9688;
							--descent-scale: 0.2415;
							--cap-height-scale: 0.7273;
							--line-gap-scale: 0;
							--line-height-scale: 1.2102;
						}
					}
					.sm\:leading-md {
						@media (width >= 640px) {
							--line-height-offset: calc(
								(((var(--line-height-scale) * var(--font-size-px)) - 40) / 2) / var(--font-size-px)
							);
						}
					}
					.sm\:leading-sm {
						@media (width >= 640px) {
							--line-height-offset: calc(
								(((var(--line-height-scale) * var(--font-size-px)) - 20) / 2) / var(--font-size-px)
							);
						}
					}
					.sm\:text-md {
						@media (width >= 640px) {
							--font-size-px: 24;
						}
					}
					.sm\:text-sm {
						@media (width >= 640px) {
							--font-size-px: 14;
						}
					}

					@property --tw-leading {
						syntax: '*';
						inherits: false;
					}
					@layer properties {
						@supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or
							((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
							*,
							::before,
							::after,
							::backdrop {
								--tw-leading: initial;
							}
						}
					}
				`),
			)
		})

		it('generates utility classes with a custom root size', async () => {
			await run(
				CSS_INPUT,
				{
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
				},
				{ rootSize: 12 },
			).then((result) =>
				expect(result.css).toMatchFormattedCss(css`
					/*! tailwindcss v4.1.10 | MIT License | https://tailwindcss.com */
					@layer properties;

					.capsize {
						&::before {
							display: table;
							content: '';
							margin-bottom: calc(
								(
										(
												var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2
											) - var(--line-height-offset)
									) *
									-1em
							);
						}
						&::after {
							display: table;
							content: '';
							margin-top: calc(
								((var(--descent-scale) + var(--line-gap-scale) / 2) - var(--line-height-offset)) *
									-1em
							);
						}
					}

					.font-sans {
						font-family: Inter, sans-serif;
					}
					.text-md {
						font-size: 1.5rem;
					}
					.text-sm {
						font-size: 14px;
					}
					.leading-md {
						--tw-leading: 2.5rem;
						line-height: 2.5rem;
					}
					.leading-sm {
						--tw-leading: 20px;
						line-height: 20px;
					}

					.font-sans {
						--ascent-scale: 0.9688;
						--descent-scale: 0.2415;
						--cap-height-scale: 0.7273;
						--line-gap-scale: 0;
						--line-height-scale: 1.2102;
					}
					.leading-md {
						--line-height-offset: calc(
							(((var(--line-height-scale) * var(--font-size-px)) - 30) / 2) / var(--font-size-px)
						);
					}
					.leading-sm {
						--line-height-offset: calc(
							(((var(--line-height-scale) * var(--font-size-px)) - 20) / 2) / var(--font-size-px)
						);
					}
					.text-md {
						--font-size-px: 18;
					}
					.text-sm {
						--font-size-px: 14;
					}

					@property --tw-leading {
						syntax: '*';
						inherits: false;
					}
					@layer properties {
						@supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or
							((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
							*,
							::before,
							::after,
							::backdrop {
								--tw-leading: initial;
							}
						}
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
			}).then((result) =>
				expect(result.css).toMatchFormattedCss(css`
					/*! tailwindcss v4.1.10 | MIT License | https://tailwindcss.com */
					@layer properties;

					.capsize {
						&::before {
							display: table;
							content: '';
							margin-bottom: calc(
								(
										(
												var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2
											) - var(--line-height-offset)
									) *
									-1em
							);
						}
						&::after {
							display: table;
							content: '';
							margin-top: calc(
								((var(--descent-scale) + var(--line-gap-scale) / 2) - var(--line-height-offset)) *
									-1em
							);
						}
					}

					.font-sans {
						font-family: Inter, sans-serif;
					}
					.text-sm {
						font-size: 1rem;
					}
					.leading-md {
						--tw-leading: 1.5;
						line-height: 1.5;
					}
					.leading-sm {
						--tw-leading: 100%;
						line-height: 100%;
					}

					.font-sans {
						--ascent-scale: 0.9688;
						--descent-scale: 0.2415;
						--cap-height-scale: 0.7273;
						--line-gap-scale: 0;
						--line-height-scale: 1.2102;
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
					}
					.text-sm {
						--font-size-px: 16;
					}

					@property --tw-leading {
						syntax: '*';
						inherits: false;
					}
					@layer properties {
						@supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or
							((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
							*,
							::before,
							::after,
							::backdrop {
								--tw-leading: initial;
							}
						}
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
			}).then((result) =>
				expect(result.css).toMatchFormattedCss(css`
					/*! tailwindcss v4.1.10 | MIT License | https://tailwindcss.com */

					.capsize {
						&::before {
							display: table;
							content: '';
							margin-bottom: calc(
								(
										(
												var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2
											) - var(--line-height-offset)
									) *
									-1em
							);
						}
						&::after {
							display: table;
							content: '';
							margin-top: calc(
								((var(--descent-scale) + var(--line-gap-scale) / 2) - var(--line-height-offset)) *
									-1em
							);
						}
					}

					.font-sans {
						font-family: Inter, sans-serif;
					}
					.text-md {
						font-size: 1rem;
						line-height: var(--tw-leading, 1.5rem);
					}

					.font-sans {
						--ascent-scale: 0.9688;
						--descent-scale: 0.2415;
						--cap-height-scale: 0.7273;
						--line-gap-scale: 0;
						--line-height-scale: 1.2102;
					}
					.text-md {
						--font-size-px: 16;
						--line-height-offset: calc(
							(((var(--line-height-scale) * var(--font-size-px)) - 24) / 2) / var(--font-size-px)
						);
					}
				`),
			)
		})

		it('generates utility classes with a custom activation class', async () => {
			await run(
				CSS_INPUT,
				{
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
				},
				{ className: 'leading-trim' },
			).then((result) =>
				expect(result.css).toMatchFormattedCss(css`
					/*! tailwindcss v4.1.10 | MIT License | https://tailwindcss.com */
					@layer properties;

					.leading-trim {
						&::before {
							display: table;
							content: '';
							margin-bottom: calc(
								(
										(
												var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2
											) - var(--line-height-offset)
									) *
									-1em
							);
						}
						&::after {
							display: table;
							content: '';
							margin-top: calc(
								((var(--descent-scale) + var(--line-gap-scale) / 2) - var(--line-height-offset)) *
									-1em
							);
						}
					}

					.font-sans {
						font-family: Inter, sans-serif;
					}
					.text-sm {
						font-size: 1rem;
					}
					.leading-md {
						--tw-leading: 1.5;
						line-height: 1.5;
					}

					.font-sans {
						--ascent-scale: 0.9688;
						--descent-scale: 0.2415;
						--cap-height-scale: 0.7273;
						--line-gap-scale: 0;
						--line-height-scale: 1.2102;
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
					}
					.text-sm {
						--font-size-px: 16;
					}

					@property --tw-leading {
						syntax: '*';
						inherits: false;
					}
					@layer properties {
						@supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or
							((-moz-orient: inline) and (not (color: rgb(from red r g b)))) {
							*,
							::before,
							::after,
							::backdrop {
								--tw-leading: initial;
							}
						}
					}
				`),
			)
		})
	})
})
