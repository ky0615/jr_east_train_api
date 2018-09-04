module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        "ecmaVersion": 2017
    },
    env: {
        browser: true,
        node: true
    },
    extends: [
        // 'standard',
    ],
    // required to lint *.vue files
    plugins: [
        'node'
    ],
    // add your custom rules here
    rules: {
        'semi': ['error', 'never', { 'beforeStatementContinuationChars': 'never' }],
        'semi-spacing': ['error', { 'after': true, 'before': false }],
        'semi-style': ['error', 'first'],
        'no-extra-semi': 'error',
        'no-unexpected-multiline': 'error',
        'no-unreachable': 'error',
        'quotes': ['error', 'single'],
        'space-before-blocks': ['error', 'always'],
        'space-before-function-paren': 'error',
        'no-dupe-keys': 'warn',
        'indent': [0],

        'key-spacing': [
            'error', {
                'beforeColon': false,
                'afterColon': true
            }
        ],

        'keyword-spacing': [
            'error', {
                'before': true,
                'after': true,
            }
        ],

        'no-trailing-spaces': 'error',
        'block-spacing': 'error',
        'arrow-spacing': 'error'

    },
    globals: {}
}
