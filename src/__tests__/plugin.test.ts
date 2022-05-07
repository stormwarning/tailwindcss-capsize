import { diffStringsUnified } from 'jest-diff'
import postcss from 'postcss'
import { format } from 'prettier'
import tailwindcss from 'tailwindcss'

// Need to test this how consumers will use it, using `require()`.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const capsizePlugin = require('../../dist')

const THEME_CONFIG = {
    screens: {
        sm: '640px',
    },
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
    describe('in "modern" mode', () => {
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
                .process('@tailwind utilities', {
                    from: undefined,
                })
                .then((result) => {
                    expect(result.css).toMatchCss(`
                    .font-sans {
                      --ascent-scale: 0.9688;
                      --descent-scale: 0.2415;
                      --cap-height-scale: 0.7273;
                      --line-gap-scale: 0;
                      --line-height-scale: 1.2102;
                      font-family: Inter, sans-serif;
                    }

                    .text-sm {
                      --font-size-px: 14;
                      font-size: 14px;
                    }

                    .text-md {
                      --font-size-px: 24;
                      font-size: 1.5rem;
                    }

                    .leading-sm {
                      --line-height-offset: calc(
                        (((var(--line-height-scale) * var(--font-size-px)) - 20) / 2) /
                          var(--font-size-px)
                      );
                      line-height: 20px;
                    }

                    .leading-md {
                      --line-height-offset: calc(
                        (((var(--line-height-scale) * var(--font-size-px)) - 40) / 2) /
                          var(--font-size-px)
                      );
                      line-height: 2.5rem;
                    }

                    .capsize::before {
                      display: table;
                      content: "";
                      margin-bottom: calc(
                        (
                          (
                            var(--ascent-scale) - var(--cap-height-scale) +
                              var(--line-gap-scale) / 2
                          ) - var(--line-height-offset)
                        ) * -1em
                      );
                    }

                    .capsize::after {
                      display: table;
                      content: "";
                      margin-top: calc(
                        (
                          (var(--descent-scale) + var(--line-gap-scale) / 2) -
                            var(--line-height-offset)
                        ) * -1em
                      );
                    }

                    @media (min-width: 640px) {
                      .sm\\:font-sans {
                        --ascent-scale: 0.9688;
                        --descent-scale: 0.2415;
                        --cap-height-scale: 0.7273;
                        --line-gap-scale: 0;
                        --line-height-scale: 1.2102;
                        font-family: Inter, sans-serif;
                      }

                      .sm\\:text-sm {
                        --font-size-px: 14;
                        font-size: 14px;
                      }

                      .sm\\:text-md {
                        --font-size-px: 24;
                        font-size: 1.5rem;
                      }

                      .sm\\:leading-sm {
                        --line-height-offset: calc(
                          (((var(--line-height-scale) * var(--font-size-px)) - 20) / 2) /
                            var(--font-size-px)
                        );
                        line-height: 20px;
                      }

                      .sm\\:leading-md {
                        --line-height-offset: calc(
                          (((var(--line-height-scale) * var(--font-size-px)) - 40) / 2) /
                            var(--font-size-px)
                        );
                        line-height: 2.5rem;
                      }
                    }
                `)
                })
        })

        it('generates utility classes with a custom root size', async () => {
            return await postcss(
                tailwindcss({
                    theme: {
                        ...THEME_CONFIG,
                        screens: {},
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
                .process('@tailwind utilities', {
                    from: undefined,
                })
                .then((result) => {
                    expect(result.css).toMatchCss(`
                    .font-sans {
                      --ascent-scale: 0.9688;
                      --descent-scale: 0.2415;
                      --cap-height-scale: 0.7273;
                      --line-gap-scale: 0;
                      --line-height-scale: 1.2102;
                      font-family: Inter, sans-serif;
                    }

                    .text-sm {
                      --font-size-px: 14;
                      font-size: 14px;
                    }

                    .text-md {
                      --font-size-px: 18;
                      font-size: 1.5rem;
                    }

                    .leading-sm {
                      --line-height-offset: calc(
                        (((var(--line-height-scale) * var(--font-size-px)) - 20) / 2) /
                          var(--font-size-px)
                      );
                      line-height: 20px;
                    }

                    .leading-md {
                      --line-height-offset: calc(
                        (((var(--line-height-scale) * var(--font-size-px)) - 30) / 2) /
                          var(--font-size-px)
                      );
                      line-height: 2.5rem;
                    }

                    .capsize::before {
                      display: table;
                      content: "";
                      margin-bottom: calc(
                        (
                            (
                                var(--ascent-scale) - var(--cap-height-scale) +
                                  var(--line-gap-scale) / 2
                              ) - var(--line-height-offset)
                          ) * -1em
                      );
                    }

                    .capsize::after {
                      display: table;
                      content: "";
                      margin-top: calc(
                        (
                            (var(--descent-scale) + var(--line-gap-scale) / 2) -
                              var(--line-height-offset)
                          ) * -1em
                      );
                    }
                `)
                })
        })

        it('works with unitless or percentage line-height values', async () => {
            return await postcss(
                tailwindcss({
                    theme: {
                        ...THEME_CONFIG,
                        screens: {},
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
                .process('@tailwind utilities', {
                    from: undefined,
                })
                .then((result) => {
                    expect(result.css).toMatchCss(`
                    .font-sans {
                      --ascent-scale: 0.9688;
                      --descent-scale: 0.2415;
                      --cap-height-scale: 0.7273;
                      --line-gap-scale: 0;
                      --line-height-scale: 1.2102;
                      font-family: Inter, sans-serif;
                    }

                    .text-sm {
                      --font-size-px: 16;
                      font-size: 1rem;
                    }

                    .leading-sm {
                      --line-height-offset: calc(
                        (
                          (
                            (var(--line-height-scale) * var(--font-size-px)) -
                              calc(1 * var(--font-size-px))
                          ) / 2
                        ) / var(--font-size-px)
                      );
                      line-height: 100%;
                    }

                    .leading-md {
                      --line-height-offset: calc(
                        (
                          (
                            (var(--line-height-scale) * var(--font-size-px)) -
                              calc(1.5 * var(--font-size-px))
                          ) / 2
                        ) / var(--font-size-px)
                      );
                      line-height: 1.5;
                    }

                    .capsize::before {
                      display: table;
                      content: "";
                      margin-bottom: calc(
                        (
                          (
                            var(--ascent-scale) - var(--cap-height-scale) +
                              var(--line-gap-scale) / 2
                          ) - var(--line-height-offset)
                        ) * -1em
                      );
                    }

                    .capsize::after {
                      display: table;
                      content: "";
                      margin-top: calc(
                        (
                          (var(--descent-scale) + var(--line-gap-scale) / 2) -
                            var(--line-height-offset)
                        ) * -1em
                      );
                    }
                    `)
                })
        })

        it('works with default line-height values', async () => {
            return await postcss(
                tailwindcss({
                    theme: {
                        ...THEME_CONFIG,
                        screens: {},
                        fontSize: {
                            base: ['1rem', '1.5rem'],
                        },
                        lineHeight: {},
                    },
                    corePlugins: false,
                    plugins: [capsizePlugin],
                }),
            )
                .process('@tailwind utilities', {
                    from: undefined,
                })
                .then((result) => {
                    expect(result.css).toMatchCss(`
                    .font-sans {
                      --ascent-scale: 0.9688;
                      --descent-scale: 0.2415;
                      --cap-height-scale: 0.7273;
                      --line-gap-scale: 0;
                      --line-height-scale: 1.2102;
                      font-family: Inter, sans-serif;
                    }

                    .text-base {
                      --font-size-px: 16;
                      font-size: 1rem;
                      --line-height-offset: calc(
                        (((var(--line-height-scale) * var(--font-size-px)) - 24) / 2) /
                          var(--font-size-px)
                      );
                      line-height: 1.5rem;
                    }

                    .capsize::before {
                      display: table;
                      content: "";
                      margin-bottom: calc(
                        (
                          (
                            var(--ascent-scale) - var(--cap-height-scale) +
                              var(--line-gap-scale) / 2
                          ) - var(--line-height-offset)
                        ) * -1em
                      );
                    }

                    .capsize::after {
                      display: table;
                      content: "";
                      margin-top: calc(
                        (
                          (var(--descent-scale) + var(--line-gap-scale) / 2) -
                            var(--line-height-offset)
                        ) * -1em
                      );
                    }
                    `)
                })
        })

        it('generates utility classes with a custom activation class', async () => {
            return await postcss(
                tailwindcss({
                    theme: {
                        ...THEME_CONFIG,
                        screens: {},
                        fontSize: {
                            sm: '1rem',
                        },
                        lineHeight: {
                            md: '1.5',
                        },
                    },
                    corePlugins: false,
                    plugins: [capsizePlugin({ className: 'leading-trim' })],
                }),
            )
                .process('@tailwind utilities', {
                    from: undefined,
                })
                .then((result) => {
                    expect(result.css).toMatchCss(`
                    .font-sans {
                      --ascent-scale: 0.9688;
                      --descent-scale: 0.2415;
                      --cap-height-scale: 0.7273;
                      --line-gap-scale: 0;
                      --line-height-scale: 1.2102;
                      font-family: Inter, sans-serif;
                    }

                    .text-sm {
                      --font-size-px: 16;
                      font-size: 1rem;
                    }

                    .leading-md {
                      --line-height-offset: calc(
                        (
                          (
                            (var(--line-height-scale) * var(--font-size-px)) -
                              calc(1.5 * var(--font-size-px))
                          ) / 2
                        ) / var(--font-size-px)
                      );
                      line-height: 1.5;
                    }

                    .leading-trim::before {
                      display: table;
                      content: "";
                      margin-bottom: calc(
                        (
                          (
                            var(--ascent-scale) - var(--cap-height-scale) +
                              var(--line-gap-scale) / 2
                          ) - var(--line-height-offset)
                        ) * -1em
                      );
                    }

                    .leading-trim::after {
                      display: table;
                      content: "";
                      margin-top: calc(
                        (
                          (var(--descent-scale) + var(--line-gap-scale) / 2) -
                            var(--line-height-offset)
                        ) * -1em
                      );
                    }
                    `)
                })
        })
    })

    describe('in "classic" mode', () => {
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
                    plugins: [capsizePlugin({ mode: 'classic' })],
                }),
            )
                .process('@tailwind utilities', {
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
                    plugins: [capsizePlugin({ rootSize: 12, mode: 'classic' })],
                }),
            )
                .process('@tailwind utilities', {
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
                    plugins: [capsizePlugin({ mode: 'classic' })],
                }),
            )
                .process('@tailwind utilities', {
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

        it('generates utility classes with a custom activation class', async () => {
            return await postcss(
                tailwindcss({
                    theme: {
                        ...THEME_CONFIG,
                        fontSize: {
                            sm: '1rem',
                        },
                        lineHeight: {
                            md: '1.5',
                        },
                    },
                    corePlugins: false,
                    plugins: [
                        capsizePlugin({
                            className: 'leading-trim',
                            mode: 'classic',
                        }),
                    ],
                }),
            )
                .process('@tailwind utilities', {
                    from: undefined,
                })
                .then((result) => {
                    expect(result.css).toMatchCss(`
                    .font-sans.text-sm.leading-md.leading-trim::before,
                    .font-sans .text-sm.leading-md.leading-trim::before,
                    .font-sans .text-sm .leading-md.leading-trim::before,
                    .text-sm .font-sans.leading-md.leading-trim::before,
                    .text-sm .font-sans .leading-md.leading-trim::before {
                        content: '';
                        margin-bottom: -0.3864em;
                        display: table;
                    }

                    .font-sans.text-sm.leading-md.leading-trim::after,
                    .font-sans .text-sm.leading-md.leading-trim::after,
                    .font-sans .text-sm .leading-md.leading-trim::after,
                    .text-sm .font-sans.leading-md.leading-trim::after,
                    .text-sm .font-sans .leading-md.leading-trim::after {
                        content: '';
                        margin-top: -0.3864em;
                        display: table;
                    }
                `)
                })
        })
    })
})
