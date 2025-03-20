import directusConfig from '@directus/eslint-config';

export default [
	...directusConfig,
	{
		ignores: ['*.md'],
		rules: {
			'n/prefer-global/process': 'off',
		},
	},
];
