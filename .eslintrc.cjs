/** @type {import('eslint').Linter.Config} */
const config = {
	extends: [
		'@zazen',
		'@zazen/eslint-config/node',
		'@zazen/eslint-config/typescript',
	],
	env: {
		node: true,
	},
	rules: {
		/**
		 * @todo [@zazen/eslint-config@>6.7.0] Remove this rule when it's included in the base config.
		 */
		'unicorn/switch-case-braces': ['error', 'avoid'],
	},
	overrides: [
		{
			// Jest config
			files: [
				'**/__tests__/**/*.{js,ts,tsx}',
				'**/*.@(spec|test).{js,ts,tsx}',
			],
			env: {
				jest: true,
			},
			rules: {
				'import/no-extraneous-dependencies': 'off',
			},
		},
		{
			files: ['**/*.d.ts'],
			rules: {
				// Prevent conflicts with `import/no-mutable-exports`.
				'prefer-let/prefer-let': 'off',
			},
		},
	],
}

module.exports = config
