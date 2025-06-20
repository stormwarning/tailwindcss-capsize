import fs from 'node:fs/promises'
import path from 'node:path'

import tailwind from '@tailwindcss/postcss'
import postcss from 'postcss'
// @ts-expect-error -- Trying to import a type in a CJS module I guess.
import type { Config } from 'tailwindcss'
import { expect } from 'vitest'

export const css = String.raw
export const html = (strings: string[] | ArrayLike<string>) => String.raw({ raw: strings })

export async function run(input: string, config: Config, options?: Record<string, unknown>) {
	let { currentTestName } = expect.getState()
	let configFile = `
		const capsizePlugin = require('../src/index.js')
		const config = ${JSON.stringify(config, null, 4)}
		module.exports = { ...config, plugins: [capsizePlugin${options ? `(${JSON.stringify(options)})` : ''}] }
		`

	await fs.writeFile('__tests__/tailwind.config.js', configFile, 'utf8')

	return postcss(tailwind).process(input, {
		// eslint-disable-next-line unicorn/prefer-module
		from: `${path.resolve(__filename)}?test=${currentTestName}`,
	})
}
