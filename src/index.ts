import capsize from 'capsize'
import { TailwindPlugin } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

import { makeCssSelectors, getValueAndUnit } from './utils'

// eslint-disable-next-line
// @ts-ignore
export default plugin(function ({ addUtilities, theme }) {
    /** @todo Get root font size from plugin config */

    let fontMetrics = theme('fontMetrics', {})
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
                let [lineHeightRem] = getValueAndUnit(lineHeight[leading])

                utilities[
                    makeCssSelectors(fontFamily, sizeName, leading)
                ] = capsize({
                    fontMetrics: fontConfig,
                    fontSize,
                    leading: lineHeightRem,
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
}) as TailwindPlugin
