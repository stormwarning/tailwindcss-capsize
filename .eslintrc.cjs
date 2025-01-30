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
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/lines-between-class-members': 'off',
		'@typescript-eslint/padding-line-between-statements': 'off',

		'n/file-extension-in-import': ['error', 'always'],
	},
	overrides: [
		{
			// Jest config
			files: ['**/__tests__/**/*.{js,ts,tsx}', '**/*.@(spec|test).{js,ts,tsx}'],
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

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
module.exports = config
