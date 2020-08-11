import capsize from 'capsize'
import plugin from 'tailwindcss/plugin'

import { makeCssSelectors, normalizeValue } from './utils'

interface FontMetrics {
    ascent: number
    descent: number
    lineGap: number
    unitsPerEm: number
    capHeight: number
}

interface CapsizeStyles {
    fontSize: string
    lineHeight: string
    padding: string
    '::before': {
        content: string
        marginTop: string
        display: string
        height: number
    }
    '::after': {
        content: string
        marginBottom: string
        display: string
        height: number
    }
}

interface PluginOptions {
    /** The root font-size, in pixels */
    rootSize?: number
}

export default plugin.withOptions(function (options: PluginOptions) {
    let { rootSize } = options

    return function ({ addUtilities, theme }) {
        let fontMetrics: FontMetrics = theme('fontMetrics', {})
        let lineHeight = theme('lineHeight', {})
        let fontSize = theme('fontSize', {})

        let remLeadings = Object.keys(lineHeight).filter((leading) =>
            lineHeight[leading].endsWith('rem'),
        )

        let utilities = {} as { [property: string]: any }

        Object.keys(fontMetrics).forEach((fontFamily) => {
            let fontConfig = fontMetrics[fontFamily]

            Object.keys(fontSize).forEach((sizeName) => {
                remLeadings.forEach((leading) => {
                    /** @todo Strip unit and convert to px */
                    let fs = normalizeValue(fontSize[sizeName], rootSize)
                    let lh = normalizeValue(remLeadings[leading], rootSize)

                    utilities[
                        makeCssSelectors(fontFamily, sizeName, leading)
                    ] = capsize({
                        fontMetrics: fontConfig,
                        fontSize: fs,
                        leading: lh,
                    })
                })
            })
        })

        // utilities['.baseline-debug-stripe'] = {
        //     background: `repeating-linear-gradient(0, #68d391,#68d391 ${gridRowHeightRem}rem, #c6f6d5 ${gridRowHeightRem}rem, #c6f6d5 ${
        //         2 * gridRowHeightRem
        //     }rem)`,
        // }
        // utilities['.baseline-debug-line'] = {
        //     background:
        //         'linear-gradient(rgba(255, 0, 0, 0.15), rgba(255, 0, 0, 0.15) 1px, transparent 1px)',
        //     backgroundSize: `1px ${gridRowHeightRem}rem`,
        // }

        addUtilities(utilities)
    }
})
