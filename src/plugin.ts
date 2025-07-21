/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { FontMetrics } from '@capsizecss/core'
import createPlugin from 'tailwindcss/plugin'

import {
	isPlainObject,
	lineHeightProperties,
	normalizeThemeValue,
	normalizeValue,
	round,
} from './utilities.js'

export interface CapsizePluginOptions {
	/** Custom utility classname. */
	className?: string
	/** The root font-size, in pixels. */
	rootSize?: number
}

interface FontSizeOptions {
	fontWeight?: string
	letterSpacing?: string
	lineHeight?: string
}

type PluginType = ReturnType<typeof createPlugin.withOptions<CapsizePluginOptions>>

function fallback(family: string | string[]) {
	return {
		'font-family': family,
	}
}

const thisPlugin: PluginType = createPlugin.withOptions<CapsizePluginOptions>(
	({ rootSize = 16, className = 'capsize' } = {}) =>
		// eslint-disable-next-line @typescript-eslint/unbound-method
		({ addUtilities, matchUtilities, prefix, theme }) => {
			let fontMetrics = theme('fontMetrics', {}) as Record<string, FontMetrics>
			let fontFamily = theme('fontFamily', {}) as Record<string, unknown>

			// Font-family
			matchUtilities(
				{
					font(value: string | string[]) {
						let family = normalizeThemeValue('fontFamily', value)
						let familyKey = Object.keys(fontFamily).find((key) => fontFamily[key] === value)

						if (familyKey === undefined) return fallback(family)

						let metrics = fontMetrics[familyKey]

						if (!(familyKey in fontMetrics)) return fallback(family)

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
					text(value: string | [string, string | FontSizeOptions]) {
						/**
						 * For some reason, tailwindcss-intellisense passes
						 * object and undefined values in here, so we handle
						 * those cases so it doesn't break IDE plugins.
						 */
						if (!value || isPlainObject(value)) return {}

						let [fontSize, options] = Array.isArray(value) ? value : [value]
						let fontSizeActual = normalizeValue(fontSize, rootSize)
						let { lineHeight } = (
							isPlainObject(options) ? options : { lineHeight: options }
						) as FontSizeOptions

						return {
							'--font-size-px': String(fontSizeActual),
							...(lineHeight ? lineHeightProperties(lineHeight, rootSize) : {}),
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
					leading(value: string | string[]) {
						let lineHeight = normalizeThemeValue('lineHeight', value) as string

						return lineHeight ? lineHeightProperties(lineHeight, rootSize) : {}
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
