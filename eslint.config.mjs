import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import parser from 'vue-eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['**/node_modules', '**/dist'],
	},
	...compat.extends('eslint:recommended', 'prettier'),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint,
			prettier,
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},

			ecmaVersion: 2022,
			sourceType: 'module',
		},

		rules: {
			'no-console': 'error',
			'no-debugger': 'error',
			'prettier/prettier': 'error',

			'padding-line-between-statements': [
				'error',
				{
					blankLine: 'always',

					prev: [
						'block',
						'block-like',
						'cjs-export',
						'class',
						'export',
						'import',
						'multiline-block-like',
						'multiline-const',
						'multiline-expression',
						'multiline-let',
						'multiline-var',
					],

					next: '*',
				},
				{
					blankLine: 'always',
					prev: ['const', 'let'],
					next: ['block', 'block-like', 'cjs-export', 'class', 'export', 'import'],
				},
				{
					blankLine: 'always',
					prev: '*',

					next: ['multiline-block-like', 'multiline-const', 'multiline-expression', 'multiline-let', 'multiline-var'],
				},
				{
					blankLine: 'any',
					prev: ['export', 'import'],
					next: ['export', 'import'],
				},
			],

			'lines-between-class-members': [
				'error',
				'always',
				{
					exceptAfterSingleLine: true,
				},
			],

			'no-nested-ternary': 'error',
			curly: ['error', 'multi-line'],
		},
	},
	...compat
		.extends('plugin:vue/vue3-recommended', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier')
		.map((config) => ({
			...config,
			files: ['**/*.ts', '**/*.vue'],
		})),
	{
		files: ['**/*.ts', '**/*.vue'],

		languageOptions: {
			parser: parser,
			ecmaVersion: 5,
			sourceType: 'script',

			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},

		rules: {
			'no-console': 'error',
			'no-debugger': 'error',
			'prettier/prettier': 'error',

			'padding-line-between-statements': [
				'error',
				{
					blankLine: 'always',

					prev: [
						'block',
						'block-like',
						'cjs-export',
						'class',
						'export',
						'import',
						'multiline-block-like',
						'multiline-const',
						'multiline-expression',
						'multiline-let',
						'multiline-var',
					],

					next: '*',
				},
				{
					blankLine: 'always',
					prev: ['const', 'let'],
					next: ['block', 'block-like', 'cjs-export', 'class', 'export', 'import'],
				},
				{
					blankLine: 'always',
					prev: '*',

					next: ['multiline-block-like', 'multiline-const', 'multiline-expression', 'multiline-let', 'multiline-var'],
				},
				{
					blankLine: 'any',
					prev: ['export', 'import'],
					next: ['export', 'import'],
				},
			],

			'lines-between-class-members': [
				'error',
				'always',
				{
					exceptAfterSingleLine: true,
				},
			],

			'no-nested-ternary': 'error',
			curly: ['error', 'multi-line'],
			'vue/multi-word-component-names': 'off',
			'vue/require-default-prop': 'off',
			'no-undef': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',

			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
		},
	},
];
