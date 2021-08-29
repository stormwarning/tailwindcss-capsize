import capsize from 'capsize'
import plugin from 'tailwindcss/plugin'

import { PluginOptions } from './types'
import { makeCssSelectors, normalizeValue } from './utils'

interface FontMetrics {
    ascent: number
    descent: number
    lineGap: number
    unitsPerEm: number
    capHeight: number
}

module.exports = plugin.withOptions<Partial<PluginOptions>>(
    ({ rootSize = 16 } = {}) => {
        return function ({ addUtilities, theme }) {
            /** @todo Improve these types maybe? */
            let fontMetrics = theme('fontMetrics', {}) as Record<
                string,
                FontMetrics
            >
            let lineHeight = theme('lineHeight', {}) as Record<string, string>
            let fontSize = theme('fontSize', {}) as Record<string, string>
            let utilities = {} as { [property: string]: any }

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
                            padding,
                        } = capsize({
                            fontMetrics: fontConfig,
                            fontSize: fs,
                            leading: lh,
                        })

                        utilities[
                            makeCssSelectors(fontFamily, sizeName, leading)
                        ] = {
                            padding,
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
