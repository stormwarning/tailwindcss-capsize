/**
 * Cribbed with ❤️ from tailwind-container-queries.
 * @see https://github.com/tailwindlabs/tailwindcss-container-queries/blob/main/jest/custom-matchers.js
 */

import { diff } from 'jest-diff'
// eslint-disable-next-line import/default
import prettier from 'prettier'
import { expect } from 'vitest'

expect.extend({
	async toMatchFormattedCss(received: string, argument: string) {
		async function format(input: string) {
			return prettier.format(input.replaceAll('\n', ''), {
				parser: 'css',
				printWidth: 100,
			})
		}

		function stripped(value: string) {
			return value
				.replace(/\/\* ! tailwindcss .* \*\//, '')
				.replaceAll(/\s/g, '')
				.replaceAll(';', '')
		}

		let options = {
			comment: 'stripped(received) === stripped(argument)',
			isNot: this.isNot,
			promise: this.promise,
		}

		let formattedReceived = await format(received)
		let formattedArgument = await format(argument)

		let didPass = stripped(formattedReceived) === stripped(formattedArgument)

		let message = didPass
			? () =>
					this.utils.matcherHint('toMatchCss', undefined, undefined, options) +
					'\n\n' +
					`Expected: not ${this.utils.printExpected(formattedReceived)}\n` +
					`Received: ${this.utils.printReceived(formattedArgument)}`
			: () => {
					let actual = formattedReceived
					let expected = formattedArgument

					let diffString = diff(expected, actual, {
						expand: this.expand,
					})

					return (
						this.utils.matcherHint('toMatchCss', undefined, undefined, options) +
						'\n\n' +
						(diffString?.includes('- Expect')
							? `Difference:\n\n${diffString}`
							: `Expected: ${this.utils.printExpected(expected)}\n` +
								`Received: ${this.utils.printReceived(actual)}`)
					)
				}

		return { actual: received, message, pass: didPass }
	},
})
