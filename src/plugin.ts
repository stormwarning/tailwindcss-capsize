import { createStyleObject } from '@capsizecss/core'
import type { FontMetrics } from '@capsizecss/core'
import type { NestedObject } from '@navith/tailwindcss-plugin-author-types'
import plugin from 'tailwindcss/plugin'

import {
    getRelativeValue,
    isPlainObject,
    isRelativeValue,
    makeCssSelectors,
    normalizeThemeValue,
    normalizeValue,
    round,
} from './utils'

export interface PluginOptions {
    /** The root font-size, in pixels */
    rootSize?: number
    /** Custom utility classname */
    className?: string
    /** CSS Output strategy */
    mode?: 'modern' | 'classic'
}

interface FontSizeOptions {
    lineHeight: string
    letterSpacing?: string
}

export default plugin.withOptions<Partial<PluginOptions>>(
    ({ rootSize = 16, className = 'capsize', mode = 'modern' } = {}) => {
        if (mode === 'classic') {
            return function ({ addUtilities, theme }) {
                let fontMetrics = theme('fontMetrics', {}) as Record<
                    string,
                    FontMetrics
                >
                let lineHeight = theme('lineHeight', {}) as Record<
                    string,
                    string
                >
                let fontSize = theme('fontSize', {}) as Record<string, string>
                let utilities: NestedObject = {}

                Object.keys(fontMetrics).forEach((fontFamily) => {
                    let fontConfig = fontMetrics[fontFamily]

                    Object.keys(fontSize).forEach((sizeName) => {
                        Object.keys(lineHeight).forEach((leading) => {
                            let fs = normalizeValue(
                                fontSize[sizeName],
                                rootSize,
                            )
                            let lh = normalizeValue(
                                lineHeight[leading],
                                rootSize,
                                fs,
                            )

                            let {
                                '::after': after,
                                '::before': before,
                            } = createStyleObject({
                                fontMetrics: fontConfig,
                                fontSize: fs,
                                leading: lh,
                            })

                            utilities[
                                makeCssSelectors(
                                    fontFamily,
                                    sizeName,
                                    leading,
                                    className,
                                )
                            ] = {
                                '&::before': before,
                                '&::after': after,
                            }
                        })
                    })
                })

                addUtilities(utilities, {})
            }
        } else {
            return function ({
                addUtilities,
                // @ts-expect-error -- `matchUtilities` exists.
                matchUtilities,
                e,
                theme,
                variants,
            }) {
                let fontMetrics = theme('fontMetrics', {}) as Record<
                    string,
                    FontMetrics
                >
                let fontFamily =
                    (theme('fontFamily', {}) as { [k: string]: unknown }) ?? {}

                // font-family
                matchUtilities(
                    {
                        font: (value: string | string[]) => {
                            function fallback(val: string | string[]) {
                                return {
                                    'font-family': val,
                                }
                            }

                            let family = normalizeThemeValue(
                                'fontFamily',
                                value,
                            )

                            let familyKey = Object.keys(fontFamily).find(
                                (key) => fontFamily[key] === value,
                            )

                            if (familyKey === undefined) return fallback(family)

                            let metrics = fontMetrics[familyKey]

                            if (metrics === undefined) return fallback(family)

                            let {
                                ascent,
                                descent,
                                lineGap,
                                unitsPerEm,
                                capHeight,
                            } = metrics
                            let ascentScale = ascent / unitsPerEm
                            let descentScale = Math.abs(descent) / unitsPerEm
                            let capHeightScale = capHeight / unitsPerEm
                            let lineGapScale = lineGap / unitsPerEm
                            let lineHeightScale =
                                (ascent + lineGap + Math.abs(descent)) /
                                unitsPerEm

                            return {
                                '--ascent-scale': round(ascentScale),
                                '--descent-scale': round(descentScale),
                                '--cap-height-scale': round(capHeightScale),
                                '--line-gap-scale': round(lineGapScale),
                                '--line-height-scale': round(lineHeightScale),
                                'font-family': family,
                            }
                        },
                    },
                    {
                        // @ts-expect-error -- `defaultValue` should be optional.
                        values: theme('fontFamily'),
                        type: ['lookup', 'generic-name', 'family-name'],
                        // @ts-expect-error -- `defaultValue` should be optional.
                        variants: variants('fontFamily'),
                    },
                )

                // font-size
                matchUtilities(
                    {
                        text: (
                            value: string | [string, string | FontSizeOptions],
                        ) => {
                            let [fontSize, options] = Array.isArray(value)
                                ? value
                                : [value]
                            let fontSizeActual = normalizeValue(
                                fontSize,
                                rootSize,
                            )
                            let { lineHeight, letterSpacing } = (isPlainObject(
                                options,
                            )
                                ? options
                                : {
                                      lineHeight: options,
                                      letterSpacing: undefined,
                                  }) as FontSizeOptions

                            return {
                                '--font-size-px': String(fontSizeActual),
                                'font-size': fontSize,
                                ...(lineHeight === undefined
                                    ? {}
                                    : {
                                          '--line-height-px': normalizeValue(
                                              lineHeight,
                                              rootSize,
                                              fontSizeActual,
                                          ),
                                          'line-height': lineHeight,
                                      }),
                                ...(letterSpacing === undefined
                                    ? {}
                                    : { 'letter-spacing': letterSpacing }),
                            }
                        },
                    },
                    {
                        // @ts-expect-error -- `defaultValue` should be optional.
                        values: theme('fontSize'),
                        type: [
                            'absolute-size',
                            'relative-size',
                            'length',
                            'percentage',
                        ],
                        // @ts-expect-error -- `defaultValue` should be optional.
                        variants: variants('fontSize'),
                    },
                )

                // line-height
                matchUtilities(
                    {
                        leading: (value: string | string[]) => {
                            let lineHeight = normalizeThemeValue(
                                'lineHeight',
                                value,
                            ) as string

                            let lineHeightActual = isRelativeValue(lineHeight)
                                ? `calc(${getRelativeValue(
                                      lineHeight,
                                  )} * var(--font-size-px))`
                                : normalizeValue(lineHeight, rootSize)

                            return {
                                '--line-height-offset': `calc((((var(--line-height-scale) * var(--font-size-px)) - ${lineHeightActual}) / 2) / var(--font-size-px))`,
                                'line-height': lineHeight,
                            }
                        },
                    },
                    {
                        // @ts-expect-error -- `defaultValue` should be optional.
                        values: theme('lineHeight'),
                        // @ts-expect-error -- `defaultValue` should be optional.
                        variants: variants('lineHeight'),
                    },
                )

                // leading-trim
                addUtilities(
                    {
                        [`.${e(className)}`]: {
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
            }
        }
    },
    ({ mode = 'modern' } = {}) => {
        if (mode === 'classic') return {}

        return {
            corePlugins: {
                fontFamily: false,
                fontSize: false,
                lineHeight: false,
            },
        }
    },
)
