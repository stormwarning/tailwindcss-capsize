import path from 'node:path'

import postcss from 'postcss'
import tailwind, { type Config } from 'tailwindcss'
import { expect } from 'vitest'

export const css = (strings: string[] | ArrayLike<string>) => String.raw({ raw: strings })

/**
 * @todo [tailwindcss@>=3.0.0] Use `Config` type when it's available.
 */
export function run(input: string, config: unknown) {
	let { currentTestName } = expect.getState()

	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
	return postcss(tailwind(config)).process(input, {
		// eslint-disable-next-line unicorn/prefer-module
		from: `${path.resolve(__filename)}?test=${currentTestName}`,
	})
}
