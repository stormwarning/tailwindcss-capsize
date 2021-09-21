type FontSizeValue = [string, Record<'lineHeight', string>]

export function normalizeValue(
    value: string | FontSizeValue,
    root: number,
    fs?: number,
): number {
    value = Array.isArray(value) ? value[0] : value

    if (value.endsWith('px')) return parseInt(value.replace('px', ''))
    if (value.endsWith('rem'))
        return root * parseFloat(value.replace('rem', ''))

    let isPercentValue = value.endsWith('%')
    let isUnitlessValue = /[0-9]$/.test(value)

    if ((isPercentValue || isUnitlessValue) && fs != null) {
        let multiplier = isPercentValue
            ? parseInt(value.replace('%', '')) / 100
            : parseFloat(value)
        return fs * multiplier
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
): string {
    return (
        `.font-${fontFamily}.text-${sizeName}.leading-${leading}.capsize,` +
        `.font-${fontFamily} .text-${sizeName}.leading-${leading}.capsize,` +
        `.font-${fontFamily} .text-${sizeName} .leading-${leading}.capsize,` +
        `.text-${sizeName} .font-${fontFamily}.leading-${leading}.capsize,` +
        `.text-${sizeName} .font-${fontFamily} .leading-${leading}.capsize`
    )
}
