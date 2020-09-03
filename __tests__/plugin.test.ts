import merge from 'lodash.merge'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'

import capsizePlugin from '../dist'
import { PluginOptions } from '../src/types'

const generatePluginCss = async (
    config: Record<string, unknown>,
    pluginOptions: PluginOptions,
) => {
    return postcss(
        tailwindcss(
            merge(
                {
                    theme: {
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
                    plugins: [capsizePlugin(pluginOptions)],
                },
                config,
            ),
        ),
    )
        .process('@tailwind components; @tailwind utilities', {
            from: undefined,
        })
        .then((result) => {
            return result.css
        })
}

expect.extend({
    toMatchCss: (received, argument) => {
        let stripped = (str: string) => str.replace(/[;\s]/g, '')

        if (stripped(received) === stripped(argument)) {
            return {
                message: () =>
                    `expected ${received} not to match CSS ${argument}`,
                pass: true,
            }
        } else {
            return {
                message: () => `expected ${received} to match CSS ${argument}`,
                pass: false,
            }
        }
    },
})

describe('Plugin', () => {
    it('generates utility classes with a default root size', () => {
        return generatePluginCss({}, {}).then((css) => {
            // eslint-disable-next-line
            // @ts-ignore
            expect(css).toMatchCss(`
                .font-sans.text-sm.leading-sm.capsize,
                .font-sans .text-sm.leading-sm.capsize,
                .font-sans .text-sm .leading-sm.capsize,
                .text-sm .font-sans.leading-sm.capsize,
                .text-sm .font-sans .leading-sm.capsize {
                    padding: 0.05px 0;
                }

                .font-sans.text-sm.leading-sm.capsize::before,
                .font-sans .text-sm.leading-sm.capsize::before,
                .font-sans .text-sm .leading-sm.capsize::before,
                .text-sm .font-sans.leading-sm.capsize::before,
                .text-sm .font-sans .leading-sm.capsize::before {
                    content: '';
                    margin-top: -0.3542em;
                    display: block;
                    height: 0;
                }

                .font-sans.text-sm.leading-sm.capsize::after,
                .font-sans .text-sm.leading-sm.capsize::after,
                .font-sans .text-sm .leading-sm.capsize::after,
                .text-sm .font-sans.leading-sm.capsize::after,
                .text-sm .font-sans .leading-sm.capsize::after {
                    content: '';
                    margin-bottom: -0.3542em;
                    display: block;
                    height: 0;
                }

                .font-sans.text-sm.leading-md.capsize,
                .font-sans .text-sm.leading-md.capsize,
                .font-sans .text-sm .leading-md.capsize,
                .text-sm .font-sans.leading-md.capsize,
                .text-sm .font-sans .leading-md.capsize {
                    padding: 0.05px 0;
                }

                .font-sans.text-sm.leading-md.capsize::before,
                .font-sans .text-sm.leading-md.capsize::before,
                .font-sans .text-sm .leading-md.capsize::before,
                .text-sm .font-sans.leading-md.capsize::before,
                .text-sm .font-sans .leading-md.capsize::before {
                    content: '';
                    margin-top: -1.0685em;
                    display: block;
                    height: 0;
                }

                .font-sans.text-sm.leading-md.capsize::after,
                .font-sans .text-sm.leading-md.capsize::after,
                .font-sans .text-sm .leading-md.capsize::after,
                .text-sm .font-sans.leading-md.capsize::after,
                .text-sm .font-sans .leading-md.capsize::after {
                    content: '';
                    margin-bottom: -1.0685em;
                    display: block;
                    height: 0;
                }

                .font-sans.text-md.leading-sm.capsize,
                .font-sans .text-md.leading-sm.capsize,
                .font-sans .text-md .leading-sm.capsize,
                .text-md .font-sans.leading-sm.capsize,
                .text-md .font-sans .leading-sm.capsize {
                    padding: 0.05px 0;
                }

                .font-sans.text-md.leading-sm.capsize::before,
                .font-sans .text-md.leading-sm.capsize::before,
                .font-sans .text-md .leading-sm.capsize::before,
                .text-md .font-sans.leading-sm.capsize::before,
                .text-md .font-sans .leading-sm.capsize::before {
                    content: '';
                    margin-top: -0.0551em;
                    display: block;
                    height: 0;
                }

                .font-sans.text-md.leading-sm.capsize::after,
                .font-sans .text-md.leading-sm.capsize::after,
                .font-sans .text-md .leading-sm.capsize::after,
                .text-md .font-sans.leading-sm.capsize::after,
                .text-md .font-sans .leading-sm.capsize::after {
                    content: '';
                    margin-bottom: -0.0551em;
                    display: block;
                    height: 0;
                }

                .font-sans.text-md.leading-md.capsize,
                .font-sans .text-md.leading-md.capsize,
                .font-sans .text-md .leading-md.capsize,
                .text-md .font-sans.leading-md.capsize,
                .text-md .font-sans .leading-md.capsize {
                    padding: 0.05px 0;
                }

                .font-sans.text-md.leading-md.capsize::before,
                .font-sans .text-md.leading-md.capsize::before,
                .font-sans .text-md .leading-md.capsize::before,
                .text-md .font-sans.leading-md.capsize::before,
                .text-md .font-sans .leading-md.capsize::before {
                    content: '';
                    margin-top: -0.4718em;
                    display: block;
                    height: 0;
                }

                .font-sans.text-md.leading-md.capsize::after,
                .font-sans .text-md.leading-md.capsize::after,
                .font-sans .text-md .leading-md.capsize::after,
                .text-md .font-sans.leading-md.capsize::after,
                .text-md .font-sans .leading-md.capsize::after {
                    content: '';
                    margin-bottom: -0.4718em;
                    display: block;
                    height: 0;
                }
            `)
        })
    })

    it('generates utility classes with a custom root size', () => {
        return generatePluginCss({}, { rootSize: 12 }).then((css) => {
            // eslint-disable-next-line
            // @ts-ignore
            expect(css).toMatchCss(`
                    .font-sans.text-sm.leading-sm.capsize,
                    .font-sans .text-sm.leading-sm.capsize,
                    .font-sans .text-sm .leading-sm.capsize,
                    .text-sm .font-sans.leading-sm.capsize,
                    .text-sm .font-sans .leading-sm.capsize {
                        padding: 0.05px 0;
                    }

                    .font-sans.text-sm.leading-sm.capsize::before,
                    .font-sans .text-sm.leading-sm.capsize::before,
                    .font-sans .text-sm .leading-sm.capsize::before,
                    .text-sm .font-sans.leading-sm.capsize::before,
                    .text-sm .font-sans .leading-sm.capsize::before {
                        content: '';
                        margin-top: -0.3542em;
                        display: block;
                        height: 0;
                    }

                    .font-sans.text-sm.leading-sm.capsize::after,
                    .font-sans .text-sm.leading-sm.capsize::after,
                    .font-sans .text-sm .leading-sm.capsize::after,
                    .text-sm .font-sans.leading-sm.capsize::after,
                    .text-sm .font-sans .leading-sm.capsize::after {
                        content: '';
                        margin-bottom: -0.3542em;
                        display: block;
                        height: 0;
                    }

                    .font-sans.text-sm.leading-md.capsize,
                    .font-sans .text-sm.leading-md.capsize,
                    .font-sans .text-sm .leading-md.capsize,
                    .text-sm .font-sans.leading-md.capsize,
                    .text-sm .font-sans .leading-md.capsize {
                        padding: 0.05px 0;
                    }

                    .font-sans.text-sm.leading-md.capsize::before,
                    .font-sans .text-sm.leading-md.capsize::before,
                    .font-sans .text-sm .leading-md.capsize::before,
                    .text-sm .font-sans.leading-md.capsize::before,
                    .text-sm .font-sans .leading-md.capsize::before {
                        content: '';
                        margin-top: -0.7114em;
                        display: block;
                        height: 0;
                    }

                    .font-sans.text-sm.leading-md.capsize::after,
                    .font-sans .text-sm.leading-md.capsize::after,
                    .font-sans .text-sm .leading-md.capsize::after,
                    .text-sm .font-sans.leading-md.capsize::after,
                    .text-sm .font-sans .leading-md.capsize::after {
                        content: '';
                        margin-bottom: -0.7114em;
                        display: block;
                        height: 0;
                    }

                    .font-sans.text-md.leading-sm.capsize,
                    .font-sans .text-md.leading-sm.capsize,
                    .font-sans .text-md .leading-sm.capsize,
                    .text-md .font-sans.leading-sm.capsize,
                    .text-md .font-sans .leading-sm.capsize {
                        padding: 0.05px 0;
                    }

                    .font-sans.text-md.leading-sm.capsize::before,
                    .font-sans .text-md.leading-sm.capsize::before,
                    .font-sans .text-md .leading-sm.capsize::before,
                    .text-md .font-sans.leading-sm.capsize::before,
                    .text-md .font-sans .leading-sm.capsize::before {
                        content: '';
                        margin-top: -0.1947em;
                        display: block;
                        height: 0;
                    }

                    .font-sans.text-md.leading-sm.capsize::after,
                    .font-sans .text-md.leading-sm.capsize::after,
                    .font-sans .text-md .leading-sm.capsize::after,
                    .text-md .font-sans.leading-sm.capsize::after,
                    .text-md .font-sans .leading-sm.capsize::after {
                        content: '';
                        margin-bottom: -0.1947em;
                        display: block;
                        height: 0;
                    }

                    .font-sans.text-md.leading-md.capsize,
                    .font-sans .text-md.leading-md.capsize,
                    .font-sans .text-md .leading-md.capsize,
                    .text-md .font-sans.leading-md.capsize,
                    .text-md .font-sans .leading-md.capsize {
                        padding: 0.05px 0;
                    }

                    .font-sans.text-md.leading-md.capsize::before,
                    .font-sans .text-md.leading-md.capsize::before,
                    .font-sans .text-md .leading-md.capsize::before,
                    .text-md .font-sans.leading-md.capsize::before,
                    .text-md .font-sans .leading-md.capsize::before {
                        content: '';
                        margin-top: -0.4725em;
                        display: block;
                        height: 0;
                    }

                    .font-sans.text-md.leading-md.capsize::after,
                    .font-sans .text-md.leading-md.capsize::after,
                    .font-sans .text-md .leading-md.capsize::after,
                    .text-md .font-sans.leading-md.capsize::after,
                    .text-md .font-sans .leading-md.capsize::after {
                        content: '';
                        margin-bottom: -0.4725em;
                        display: block;
                        height: 0;
                    }
                `)
        })
    })
})
