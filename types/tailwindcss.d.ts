declare module 'tailwindcss'

declare module 'tailwindcss/plugin' {
    import { CreatePlugin } from '@navith/tailwindcss-plugin-author-types'

    let createPlugin: CreatePlugin
    export default createPlugin
}
