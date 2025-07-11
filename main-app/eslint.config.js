import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import checkFile from 'eslint-plugin-check-file'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                __BUILD_TIMESTAMP__: 'readonly',
                __DEBUG_MODE__: 'readonly'
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        settings: {
            react: {
                version: 'detect' // Automatically detect React version
            }
        },
        plugins: {
            'check-file': checkFile,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'simple-import-sort': simpleImportSort,
            react: react,
            import: importPlugin
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true }
            ],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
            ],
            // Import sorting rules
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'sort-imports': 'off',
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-duplicates': 'error',
            'testing-library/prefer-screen-queries': 'off',
            '@next/next/no-html-link-for-pages': 'off',
            'tailwindcss/classnames-order': 'off',
            'tailwindcss/no-custom-classname': 'off',
            'n/no-missing-import': 'off',
            'no-missing-import': 'off',
            'react/no-unknown-property': ['error', { ignore: ['css', 'scss'] }],
            'no-undef': 'error',
            semi: ['error', 'never'],
            'no-use-before-define': 'off'
        }
    },
    // Specific configuration for Electron main process files
    {
        files: ['electron/**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        rules: {
            // Disable React-specific rules for Electron files
            'react-refresh/only-export-components': 'off'
        }
    }
)
