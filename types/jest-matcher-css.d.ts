declare namespace jest {
    interface Matchers<R> {
        toMatchCss: (received: any, argument: any) => R
    }
}
