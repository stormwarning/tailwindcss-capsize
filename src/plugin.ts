import { createStyleObject } from '@capsizecss/core'
import type { FontMetrics } from '@capsizecss/core'
import type { NestedObject } from '@navith/tailwindcss-plugin-author-types'
import plugin from 'tailwindcss/plugin'

import { makeCssSelectors, normalizeValue } from './utils'

export interface PluginOptions {
    /** The root font-size, in pixels */
    rootSize?: number
    /** Custom utility classname */
    className?: string
}

export default plugin.withOptions<Partial<PluginOptions>>(
    ({ rootSize = 16, className = 'capsize' } = {}) => {
        return function ({ addUtilities, theme }) {
            let fontMetrics = theme('fontMetrics', {}) as Record<
                string,
                FontMetrics
            >
            let lineHeight = theme('lineHeight', {}) as Record<string, string>
            let fontSize = theme('fontSize', {}) as Record<string, string>
            let utilities: NestedObject = {}

            Object.keys(fontMetrics).forEach((fontFamily) => {
                let fontConfig = fontMetrics[fontFamily]

                Object.keys(fontSize).forEach((sizeName) => {
                    Object.keys(lineHeight).forEach((leading) => {
                        let fs = normalizeValue(fontSize[sizeName], rootSize)
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
    },
)
