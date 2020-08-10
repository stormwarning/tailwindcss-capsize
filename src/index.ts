export const sum = (a: number, b: number) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('boop')
    }
    return a + b
}
