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

// interface CapsizeStyles {
//     fontSize: string
//     lineHeight: string
//     padding: string
//     '::before': {
//         content: string
//         marginTop: string
//         display: string
//         height: number
//     }
//     '::after': {
//         content: string
//         marginBottom: string
//         display: string
//         height: number
//     }
// }

export interface PluginOptions {
    /** The root font-size, in pixels */
    rootSize?: number
}

export default plugin.withOptions(({ rootSize = 16 }: PluginOptions) => {
    return function ({ addUtilities, theme }) {
        /** @todo Improve these types maybe? */
        let fontMetrics = theme('fontMetrics', {}) as Record<
            string,
            FontMetrics
        >
        let lineHeight = theme('lineHeight', {}) as Record<string, string>
        let fontSize = theme('fontSize', {}) as Record<string, string>

        // let leadings = Object.values(lineHeight).filter((leading) => {
        //     if (lineHeight[leading]) {
        //         return (
        //             lineHeight[leading].endsWith('rem') ||
        //             lineHeight[leading].endsWith('px')
        //         )
        //     }
        // })

        let utilities = {} as { [property: string]: any }

        Object.keys(fontMetrics).forEach((fontFamily) => {
            let fontConfig = fontMetrics[fontFamily]

            Object.keys(fontSize).forEach((sizeName) => {
                Object.keys(lineHeight).forEach((leading) => {
                    let fs = normalizeValue(fontSize[sizeName], rootSize)
                    let lh = normalizeValue(lineHeight[leading], rootSize)

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

        addUtilities(utilities, {})
    }
})
