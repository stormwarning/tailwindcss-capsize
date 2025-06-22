import zazen from '@zazen/eslint-config'
import zazenNode from '@zazen/eslint-config/node'
import zazenStylistic from '@zazen/eslint-config/stylistic'
import zazenTypeScript from '@zazen/eslint-config/typescript'
import { defineConfig } from 'eslint/config'

const config = defineConfig([
	...zazen,
	...zazenNode,
	...zazenTypeScript,

	{
		name: 'project:rules',
		settings: {
			'import-x/ignore': ['node_modules'],
			node: {
				version: '20',
			},
		},
		rules: {
			'import-x/no-anonymous-default-export': ['error', { allowObject: true }],
		},
	},
	{
		name: 'project:rules:configs',
		files: ['**/*.config.{js,mjs}'],
		rules: {
			'import-x/no-extraneous-dependencies': [
				'error',
				{ devDependencies: true },
			],
		},
	},

	zazenStylistic,
])

export default config
