import { diffStringsUnified } from 'jest-diff'
import postcss from 'postcss'
import { format } from 'prettier'
import tailwindcss from 'tailwindcss'

import capsizePlugin from '../dist'

const THEME_CONFIG = {
    fontFamily: {
        sans: ['Inter', 'sans-serif'],
    },
    fontMetrics: {
        sans: {
            capHeight: 2048,
            ascent: 2728,
            descent: -680,
            lineGap: 0,
            unitsPerEm: 2816,
        },
    },
}

expect.extend({
    toMatchCss: (receivedCss: string, expectedCss: string) => {
        let strip = (str: string) => str.replace(/[;\s]/g, '')

        if (strip(receivedCss) === strip(expectedCss)) {
            return {
                message: () =>
                    `expected ${receivedCss} not to match CSS ${expectedCss}`,
                pass: true,
            }
        } else {
            let receivedCssFormatted = format(receivedCss, { parser: 'css' })
            let expectedCssFormatted = format(expectedCss, { parser: 'css' })
            let diff = diffStringsUnified(
                receivedCssFormatted,
                expectedCssFormatted,
            )

            return {
                message: () => `expected CSS to match:\n${diff}`,
                pass: false,
            }
        }
    },
})

describe('Plugin', () => {
    it('generates utility classes with a default root size', async () => {
        return await postcss(
            tailwindcss({
                theme: {
                    ...THEME_CONFIG,
                    fontSize: {
                        sm: '14px',
                        md: '1.5rem',
                    },
                    lineHeight: {
                        sm: '20px',
                        md: '2.5rem',
                    },
                },
                corePlugins: false,
                plugins: [capsizePlugin],
            }),
        )
            .process('@tailwind components; @tailwind utilities', {
                from: undefined,
            })
            .then((result) => {
                expect(result.css).toMatchCss(`
                    .font-sans.text-sm.leading-sm.capsize::before,
                    .font-sans .text-sm.leading-sm.capsize::before,
                    .font-sans .text-sm .leading-sm.capsize::before,
                    .text-sm .font-sans.leading-sm.capsize::before,
                    .text-sm .font-sans .leading-sm.capsize::before {
                        content: '';
                        margin-bottom: -0.3506em;
                        display: table;
                    }

                    .font-sans.text-sm.leading-sm.capsize::after,
                    .font-sans .text-sm.leading-sm.capsize::after,
                    .font-sans .text-sm .leading-sm.capsize::after,
                    .text-sm .font-sans.leading-sm.capsize::after,
                    .text-sm .font-sans .leading-sm.capsize::after {
                        content: '';
                        margin-top: -0.3506em;
                        display: table;
                    }

                    .font-sans.text-sm.leading-md.capsize::before,
                    .font-sans .text-sm.leading-md.capsize::before,
                    .font-sans .text-sm .leading-md.capsize::before,
                    .text-sm .font-sans.leading-md.capsize::before,
                    .text-sm .font-sans .leading-md.capsize::before {
                        content: '';
                        margin-bottom: -1.0649em;
                        display: table;
                    }

                    .font-sans.text-sm.leading-md.capsize::after,
                    .font-sans .text-sm.leading-md.capsize::after,
                    .font-sans .text-sm .leading-md.capsize::after,
                    .text-sm .font-sans.leading-md.capsize::after,
                    .text-sm .font-sans .leading-md.capsize::after {
                        content: '';
                        margin-top: -1.0649em;
                        display: table;
                    }

                    .font-sans.text-md.leading-sm.capsize::before,
                    .font-sans .text-md.leading-sm.capsize::before,
                    .font-sans .text-md .leading-sm.capsize::before,
                    .text-md .font-sans.leading-sm.capsize::before,
                    .text-md .font-sans .leading-sm.capsize::before {
                        content: '';
                        margin-bottom: -0.053em;
                        display: table;
                    }

                    .font-sans.text-md.leading-sm.capsize::after,
                    .font-sans .text-md.leading-sm.capsize::after,
                    .font-sans .text-md .leading-sm.capsize::after,
                    .text-md .font-sans.leading-sm.capsize::after,
                    .text-md .font-sans .leading-sm.capsize::after {
                        content: '';
                        margin-top: -0.053em;
                        display: table;
                    }

                    .font-sans.text-md.leading-md.capsize::before,
                    .font-sans .text-md.leading-md.capsize::before,
                    .font-sans .text-md .leading-md.capsize::before,
                    .text-md .font-sans.leading-md.capsize::before,
                    .text-md .font-sans .leading-md.capsize::before {
                        content: '';
                        margin-bottom: -0.4697em;
                        display: table;
                    }

                    .font-sans.text-md.leading-md.capsize::after,
                    .font-sans .text-md.leading-md.capsize::after,
                    .font-sans .text-md .leading-md.capsize::after,
                    .text-md .font-sans.leading-md.capsize::after,
                    .text-md .font-sans .leading-md.capsize::after {
                        content: '';
                        margin-top: -0.4697em;
                        display: table;
                    }
                `)
            })
    })

    it('generates utility classes with a custom root size', async () => {
        return await postcss(
            tailwindcss({
                theme: {
                    ...THEME_CONFIG,
                    fontSize: {
                        sm: '14px',
                        md: '1.5rem',
                    },
                    lineHeight: {
                        sm: '20px',
                        md: '2.5rem',
                    },
                },
                corePlugins: false,
                plugins: [capsizePlugin({ rootSize: 12 })],
            }),
        )
            .process('@tailwind components; @tailwind utilities', {
                from: undefined,
            })
            .then((result) => {
                expect(result.css).toMatchCss(`
                    .font-sans.text-sm.leading-sm.capsize::before,
                    .font-sans .text-sm.leading-sm.capsize::before,
                    .font-sans .text-sm .leading-sm.capsize::before,
                    .text-sm .font-sans.leading-sm.capsize::before,
                    .text-sm .font-sans .leading-sm.capsize::before {
                        content: '';
                        margin-bottom: -0.3506em;
                        display: table;
                    }

                    .font-sans.text-sm.leading-sm.capsize::after,
                    .font-sans .text-sm.leading-sm.capsize::after,
                    .font-sans .text-sm .leading-sm.capsize::after,
                    .text-sm .font-sans.leading-sm.capsize::after,
                    .text-sm .font-sans .leading-sm.capsize::after {
                        content: '';
                        margin-top: -0.3506em;
                        display: table;
                    }

                    .font-sans.text-sm.leading-md.capsize::before,
                    .font-sans .text-sm.leading-md.capsize::before,
                    .font-sans .text-sm .leading-md.capsize::before,
                    .text-sm .font-sans.leading-md.capsize::before,
                    .text-sm .font-sans .leading-md.capsize::before {
                        content: '';
                        margin-bottom: -0.7078em;
                        display: table;
                    }

                    .font-sans.text-sm.leading-md.capsize::after,
                    .font-sans .text-sm.leading-md.capsize::after,
                    .font-sans .text-sm .leading-md.capsize::after,
                    .text-sm .font-sans.leading-md.capsize::after,
                    .text-sm .font-sans .leading-md.capsize::after {
                        content: '';
                        margin-top: -0.7078em;
                        display: table;
                    }

                    .font-sans.text-md.leading-sm.capsize::before,
                    .font-sans .text-md.leading-sm.capsize::before,
                    .font-sans .text-md .leading-sm.capsize::before,
                    .text-md .font-sans.leading-sm.capsize::before,
                    .text-md .font-sans .leading-sm.capsize::before {
                        content: '';
                        margin-bottom: -0.1919em;
                        display: table;
                    }

                    .font-sans.text-md.leading-sm.capsize::after,
                    .font-sans .text-md.leading-sm.capsize::after,
                    .font-sans .text-md .leading-sm.capsize::after,
                    .text-md .font-sans.leading-sm.capsize::after,
                    .text-md .font-sans .leading-sm.capsize::after {
                        content: '';
                        margin-top: -0.1919em;
                        display: table;
                    }

                    .font-sans.text-md.leading-md.capsize::before,
                    .font-sans .text-md.leading-md.capsize::before,
                    .font-sans .text-md .leading-md.capsize::before,
                    .text-md .font-sans.leading-md.capsize::before,
                    .text-md .font-sans .leading-md.capsize::before {
                        content: '';
                        margin-bottom: -0.4697em;
                        display: table;
                    }

                    .font-sans.text-md.leading-md.capsize::after,
                    .font-sans .text-md.leading-md.capsize::after,
                    .font-sans .text-md .leading-md.capsize::after,
                    .text-md .font-sans.leading-md.capsize::after,
                    .text-md .font-sans .leading-md.capsize::after {
                        content: '';
                        margin-top: -0.4697em;
                        display: table;
                    }
                `)
            })
    })

    it('works with unitless or percentage line-height values', async () => {
        return await postcss(
            tailwindcss({
                theme: {
                    ...THEME_CONFIG,
                    fontSize: {
                        sm: '1rem',
                    },
                    lineHeight: {
                        sm: '100%',
                        md: '1.5',
                    },
                },
                corePlugins: false,
                plugins: [capsizePlugin],
            }),
        )
            .process('@tailwind components; @tailwind utilities', {
                from: undefined,
            })
            .then((result) => {
                expect(result.css).toMatchCss(`
                    .font-sans.text-sm.leading-sm.capsize::before,
                    .font-sans .text-sm.leading-sm.capsize::before,
                    .font-sans .text-sm .leading-sm.capsize::before,
                    .text-sm .font-sans.leading-sm.capsize::before,
                    .text-sm .font-sans .leading-sm.capsize::before {
                        content: '';
                        margin-bottom: -0.1364em;
                        display: table;
                    }

                    .font-sans.text-sm.leading-sm.capsize::after,
                    .font-sans .text-sm.leading-sm.capsize::after,
                    .font-sans .text-sm .leading-sm.capsize::after,
                    .text-sm .font-sans.leading-sm.capsize::after,
                    .text-sm .font-sans .leading-sm.capsize::after {
                        content: '';
                        margin-top: -0.1364em;
                        display: table;
                    }

                    .font-sans.text-sm.leading-md.capsize::before,
                    .font-sans .text-sm.leading-md.capsize::before,
                    .font-sans .text-sm .leading-md.capsize::before,
                    .text-sm .font-sans.leading-md.capsize::before,
                    .text-sm .font-sans .leading-md.capsize::before {
                        content: '';
                        margin-bottom: -0.3864em;
                        display: table;
                    }

                    .font-sans.text-sm.leading-md.capsize::after,
                    .font-sans .text-sm.leading-md.capsize::after,
                    .font-sans .text-sm .leading-md.capsize::after,
                    .text-sm .font-sans.leading-md.capsize::after,
                    .text-sm .font-sans .leading-md.capsize::after {
                        content: '';
                        margin-top: -0.3864em;
                        display: table;
                    }
                `)
            })
    })
})
