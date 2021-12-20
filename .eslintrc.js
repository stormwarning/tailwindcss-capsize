module.exports = {
    extends: ['@zazen/eslint-config/typescript'],
    env: {
        node: true,
    },
    rules: {
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/space-before-function-paren': 'off',

        '@typescript-eslint/explicit-function-return-type': 'off',
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
        },
    ],
}
