/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { FontMetrics } from '@capsizecss/core'
import createPlugin from 'tailwindcss/plugin'

import {
	isPlainObject,
	lineHeightProperties,
	normalizeThemeValue,
	normalizeValue,
	round,
} from './utils.js'

export interface CapsizePluginOptions {
	/** The root font-size, in pixels. */
	rootSize?: number
	/** Custom utility classname. */
	className?: string
}

interface FontSizeOptions {
	lineHeight?: string
	letterSpacing?: string
	fontWeight?: string
}

const thisPlugin = createPlugin.withOptions<Partial<CapsizePluginOptions>>(
	({ rootSize = 16, className = 'capsize' } = {}) =>
		function ({ addUtilities, matchUtilities, prefix, theme }) {
			let fontMetrics = theme('fontMetrics', {}) as Record<string, FontMetrics>
			let fontFamily = (theme('fontFamily', {}) as Record<string, unknown>) ?? {}

			// Font-family
			matchUtilities(
				{
					font(value: string | string[]) {
						function fallback(family: string | string[]) {
							return {
								'font-family': family,
							}
						}

						let family = normalizeThemeValue('fontFamily', value)
						let familyKey = Object.keys(fontFamily).find((key) => fontFamily[key] === value)

						if (familyKey === undefined) return fallback(family)

						let metrics = fontMetrics[familyKey]

						if (metrics === undefined) return fallback(family)

						let { ascent, descent, lineGap, unitsPerEm, capHeight } = metrics
						let ascentScale = ascent / unitsPerEm
						let descentScale = Math.abs(descent) / unitsPerEm
						let capHeightScale = capHeight / unitsPerEm
						let lineGapScale = lineGap / unitsPerEm
						let lineHeightScale = (ascent + lineGap + Math.abs(descent)) / unitsPerEm

						return {
							'--ascent-scale': round(ascentScale),
							'--descent-scale': round(descentScale),
							'--cap-height-scale': round(capHeightScale),
							'--line-gap-scale': round(lineGapScale),
							'--line-height-scale': round(lineHeightScale),
						}
					},
				},
				{
					values: theme('fontFamily'),
					type: ['lookup', 'generic-name', 'family-name'],
				},
			)

			// Font-size
			matchUtilities(
				{
					// @ts-expect-error -- Extra custom properties mismatches base type.
					text(value: string | [string, string | FontSizeOptions]) {
						let [fontSize, options] = Array.isArray(value) ? value : [value]
						let fontSizeActual = normalizeValue(fontSize, rootSize)
						let { lineHeight } = (
							isPlainObject(options) ? options : { lineHeight: options }
						) as FontSizeOptions

						return {
							'--font-size-px': String(fontSizeActual),
							...lineHeightProperties(lineHeight, rootSize),
						}
					},
				},
				{
					values: theme('fontSize'),
					type: ['absolute-size', 'relative-size', 'length', 'percentage'],
				},
			)

			// Line-height
			matchUtilities(
				{
					// @ts-expect-error -- Extra custom properties mismatches base type.
					leading(value: string | string[]) {
						let lineHeight = normalizeThemeValue('lineHeight', value) as string

						return lineHeightProperties(lineHeight, rootSize)
					},
				},
				{
					values: theme('lineHeight'),
				},
			)

			// Leading-trim
			addUtilities(
				{
					[`.${prefix(className)}`]: {
						'&::before': {
							display: 'table',
							content: '""',
							'margin-bottom':
								'calc(((var(--ascent-scale) - var(--cap-height-scale) + var(--line-gap-scale) / 2) - var(--line-height-offset)) * -1em)',
						},
						'&::after': {
							display: 'table',
							content: '""',
							'margin-top':
								'calc(((var(--descent-scale) + var(--line-gap-scale) / 2) - var(--line-height-offset)) * -1em)',
						},
					},
				},
				{},
			)
		},
)

export default thisPlugin
