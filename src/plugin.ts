import { createStyleObject } from '@capsizecss/core'
import type { FontMetrics } from '@capsizecss/core'
import type { NestedObject } from '@navith/tailwindcss-plugin-author-types'
import plugin from 'tailwindcss/plugin'

import { isPlainObject, makeCssSelectors, normalizeValue } from './utils'

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
            // @ts-expect-error -- `matchUtilities` exists.
            return function ({ matchUtilities, theme }) {
                matchUtilities(
                    {
                        text: (
                            value: string | [string, string | FontSizeOptions],
                        ) => {
                            let [fontSize, options] = Array.isArray(value)
                                ? value
                                : [value]
                            let { lineHeight, letterSpacing } = isPlainObject(
                                options,
                            )
                                ? (options as FontSizeOptions)
                                : {
                                      lineHeight: options,
                                      letterSpacing: undefined,
                                  }

                            /** @todo Add custom properties here. */
                            return {
                                'font-size': fontSize,
                                ...(lineHeight === undefined
                                    ? {}
                                    : { 'line-height': lineHeight }),
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
                    },
                )
            }
        }
    },
)
