const cssRegex = /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/

export function getValueAndUnit(value) {
    if (typeof value !== 'string') return [value, '']
    const matchedValue = value.match(cssRegex)
    if (matchedValue) return [parseFloat(value), matchedValue[2]]
    return [value, undefined]
}

export function makeCssSelectors(fontFamily, sizeName, leading) {
    return (
        `.font-${fontFamily}.text-${sizeName}.leading-${leading}.baseline, ` +
        `.font-${fontFamily} .text-${sizeName}.leading-${leading}.baseline, ` +
        `.font-${fontFamily} .text-${sizeName} .leading-${leading}.baseline ,` +
        `.text-${sizeName} .font-${fontFamily}.leading-${leading}.baseline, ` +
        `.text-${sizeName} .font-${fontFamily} .leading-${leading}.baseline`
    )
}
