import capsize from 'capsize'
import { TailwindPlugin } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

import { makeCssSelectors, getValueAndUnit } from './utils'

export default plugin(function ({ addUtilities, theme }) {
    const spacing = theme('spacing', {})
    // We assume the spacing 1 to be the grid's row height, as it is by default in Tailwind
    const [gridRowHeightRem] = getValueAndUnit(spacing['1'])

    let fontMetrics = theme('fontMetrics', {})
    let lineHeight = theme('lineHeight', {})
    let fontSize = theme('fontSize', {})

    const multiplierLeadings = Object.keys(lineHeight).filter(
        (leading) => !lineHeight[leading].endsWith('rem'),
    )
    const remLeadings = Object.keys(lineHeight).filter((leading) =>
        lineHeight[leading].endsWith('rem'),
    )

    let utilities = {} as { [property: string]: any }

    Object.keys(fontMetrics).forEach((fontFamily) => {
        let fontConfig = fontMetrics[fontFamily]

        Object.keys(fontSize).forEach((sizeName) => {
            const [fontSizeRem] = getValueAndUnit(fontSize[sizeName])

            multiplierLeadings.forEach((leading) => {
                let [lineHeightMultiplier] = getValueAndUnit(
                    lineHeight[leading],
                )
                utilities[
                    makeCssSelectors(fontFamily, sizeName, leading)
                ] = capsize({
                    fontMetrics: fontConfig,
                    fontSize,
                    leading: lineHeightMultiplier,
                })
            })

            remLeadings.forEach((leading) => {
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

    utilities['.baseline-debug-stripe'] = {
        background: `repeating-linear-gradient(0, #68d391,#68d391 ${gridRowHeightRem}rem, #c6f6d5 ${gridRowHeightRem}rem, #c6f6d5 ${
            2 * gridRowHeightRem
        }rem)`,
    }
    utilities['.baseline-debug-line'] = {
        background:
            'linear-gradient(rgba(255, 0, 0, 0.15), rgba(255, 0, 0, 0.15) 1px, transparent 1px)',
        backgroundSize: `1px ${gridRowHeightRem}rem`,
    }

    addUtilities(utilities)
}) as TailwindPlugin
