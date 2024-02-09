import path from 'node:path'

import postcss from 'postcss'
import tailwind, { type Config } from 'tailwindcss'
import { expect } from 'vitest'

export const css = (strings: string[] | ArrayLike<string>) => String.raw({ raw: strings })
export const html = (strings: string[] | ArrayLike<string>) => String.raw({ raw: strings })

export function run(input: string, config: Config) {
	let { currentTestName } = expect.getState()

	return postcss(tailwind(config)).process(input, {
		// eslint-disable-next-line unicorn/prefer-module
		from: `${path.resolve(__filename)}?test=${currentTestName}`,
	})
}
