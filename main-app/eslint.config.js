import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
    // Ignore patterns (from .eslintignore)
    {
        ignores: [
            'node_modules/**',
            '**/node_modules/**',
            'dist/**',
            '**/dist/**',
            'build/**',
            '**/build/**',
            '.next/**',
            '**/.next/**',
            'coverage/**'
        ]
    },
    // Base configuration for all files
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2020
            }
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin
        },
        rules: {
            // Base rules for all projects
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-unused-vars': 'off', // Turning off the base rule as it can report incorrect errors
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ],
            'react/prop-types': 'off', // Since we're using TypeScript
            'react/react-in-jsx-scope': 'off' // Not needed in React 17+
        },
        settings: {
            react: {
                version: 'detect'
            }
        }
    }
]
