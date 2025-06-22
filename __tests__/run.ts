import fs from 'node:fs/promises'
import path from 'node:path'

import tailwind from '@tailwindcss/postcss'
import postcss from 'postcss'
import type { Config } from 'tailwindcss'
import { expect } from 'vitest'

export const css = String.raw

export async function run(input: string, config: Config, options?: Record<string, unknown>) {
	let { currentTestName } = expect.getState()
	let configFile = `
		const capsizePlugin = require('../src/index.js')
		const config = ${JSON.stringify(config, undefined, 4)}
		module.exports = { ...config, plugins: [capsizePlugin${options ? `(${JSON.stringify(options)})` : ''}] }
		`

	await fs.writeFile('__tests__/tailwind.config.js', configFile, 'utf8')

	return postcss(tailwind).process(input, {
		// @ts-expect-error -- TS thinks this file is built to CJS.
		from: `${path.resolve(import.meta.filename)}?test=${currentTestName!}`,
	})
}
