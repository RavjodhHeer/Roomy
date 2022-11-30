/* eslint-disable no-undef */
module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'settings': {
        'react': {
            'version' : 'detect'
        },
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 12,
        'sourceType': 'module'
    },
    'plugins': [
        'react'
    ],
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'react/prop-types': 0,
        'no-unused-vars': 0
    }
};
