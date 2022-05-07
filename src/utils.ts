type FontSizeValue = [string, Record<'lineHeight', string>]

export function isRelativeValue(value: string) {
    let isPercentValue = value.endsWith('%')
    let isUnitlessValue = /[0-9]$/.test(value)

    return isPercentValue || isUnitlessValue
}

export function getRelativeValue(value: string) {
    let isPercentValue = value.endsWith('%')

    return isPercentValue
        ? parseInt(value.replace('%', '')) / 100
        : parseFloat(value)
}

export function normalizeValue(
    value: string | FontSizeValue,
    root: number,
    fs?: number,
): number {
    value = Array.isArray(value) ? value[0] : value

    if (value.endsWith('px')) return parseInt(value.replace('px', ''))
    if (value.endsWith('rem'))
        return root * parseFloat(value.replace('rem', ''))

    if (isRelativeValue(value) && fs !== undefined) {
        return fs * getRelativeValue(value)
    }

    return parseInt(value)
}

const cssRegex = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/

export function getValueAndUnit(value: string): [number, string | undefined] {
    if (typeof value !== 'string') return [value, '']
    let matchedValue = value.match(cssRegex)
    if (matchedValue != null) return [parseFloat(value), matchedValue[2]]
    return [parseInt(value), undefined]
}

export function makeCssSelectors(
    fontFamily: string,
    sizeName: string,
    leading: string,
    className: string,
): string {
    return (
        `.font-${fontFamily}.text-${sizeName}.leading-${leading}.${className},` +
        `.font-${fontFamily} .text-${sizeName}.leading-${leading}.${className},` +
        `.font-${fontFamily} .text-${sizeName} .leading-${leading}.${className},` +
        `.text-${sizeName} .font-${fontFamily}.leading-${leading}.${className},` +
        `.text-${sizeName} .font-${fontFamily} .leading-${leading}.${className}`
    )
}

export function isPlainObject(value: unknown) {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false
    }

    let prototype = Object.getPrototypeOf(value)
    return prototype === null || prototype === Object.prototype
}

type ThemeValue = string | string[] | ((p?: any) => string)

/**
 * Returns a value based on the core theme section.
 * Adapted from Tailwind internals.
 *
 * @see https://github.com/tailwindlabs/tailwindcss/blob/30ea5b14a631b6f68e56740c3d09bb54fcbad08a/src/util/transformThemeValue.js
 */
export function normalizeThemeValue(key: string, value: ThemeValue) {
    switch (key) {
        case 'fontSize':
        case 'lineHeight':
            if (typeof value === 'function') value = value({})
            if (Array.isArray(value)) value = value[0]

            return value

        case 'fontFamily':
            if (typeof value === 'function') value = value({})
            if (Array.isArray(value)) value = value.join(', ')

            return value

        default:
            if (typeof value === 'function') value = value({})

            return value
    }
}

export function round(value: number) {
    return parseFloat(value.toFixed(4)).toString()
}

/**
 * Takes a theme value for lineHeight and returns the `line-height` property,
 * as well as a `--line-height-offset` custom property.
 */
export function lineHeightProperties(lineHeight: string, rootSize: number) {
    if (lineHeight === undefined) return {}

    let lineHeightActual = isRelativeValue(lineHeight)
        ? `calc(${getRelativeValue(lineHeight)} * var(--font-size-px))`
        : normalizeValue(lineHeight, rootSize)

    return {
        '--line-height-offset': `calc((((var(--line-height-scale) * var(--font-size-px)) - ${lineHeightActual}) / 2) / var(--font-size-px))`,
        'line-height': lineHeight,
    }
}
