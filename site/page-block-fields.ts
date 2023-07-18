// Explicitly define the fields to fetch for each block type in the page builder. Should be kept in sync with the page builder block types.

export const block_hero_headline = [
	'id',
	'heading',
	'subheading',
	{
		button_group: [
			{
				buttons: [
					'id',
					'label',
					'variant',
					'button_group',
					'page',
					'type',
					'resource',
					'external_url',
					'color',
					'pulse',
				],
			},
		],
	},
];

export const block_media_fullwidth = [
	'id',
	'type',
	{ video: ['id', 'title', 'url'] },
	{ image: ['id', 'title', 'description'] },
	'embed',
];

export const block_logocloud = [
	'id',
	'type',
	{
		logos: [{ directus_files_id: ['id', 'title', 'description'] }],
	},
];

export const block_columns = [
	'id',
	{
		col_one: [
			'id',
			'collection',
			{
				item: ['*.*'],
			},
		],
	},
	{
		col_two: [
			'id',
			'collection',
			{
				item: ['*.*'],
			},
		],
	},
];

export const block_pageheader = [
	'id',
	'heading',
	'subheading',
	{
		button_group: [
			{
				buttons: [
					'id',
					'label',
					'variant',
					'button_group',
					'page',
					'type',
					'resource',
					'external_url',
					'color',
					'pulse',
				],
			},
		],
	},
];

export const block_hero_form = ['id', 'heading', 'subheading', { form: ['id', 'title', 'hubspot_form_id'] }];

export const block_featuregrid = ['id', 'features'];

export const block_showcase = [
	'id',
	{
		items: [
			'id',
			'type',
			{
				image: ['id', 'title', 'description'],
			},
			{
				video: ['id', 'title', 'url'],
			},
			'icon',
			'heading',
			'subheading',
		],
	},
];

export const block_cardgroup = [
	'id',
	'variant',
	{
		cards: [
			'id',
			'title',
			'description',
			'image_size',
			'image_background_color',
			'image',
			{
				button: ['*'],
			},
		],
	},
];

/** @TODO: Add fields for hero rotator */
export const block_hero_rotator = [];

// * Combine all block fields into a single array *

export const page_block_fields = [
	'id',
	'title',
	'permalink',
	'status',
	{
		sections: [
			'id',
			'title',
			'background',
			{
				blocks: [
					'id',
					'collection',
					{
						item: [
							block_hero_headline,
							block_logocloud,
							block_media_fullwidth,
							block_columns,
							block_cardgroup,
							block_featuregrid,
							block_hero_form,
							block_pageheader,
							block_showcase,
						],
					},
				],
			},
		],
	},
];

export function flattenFieldTree(fields: any[]) {
	// Flatten the field tree into a single array of strings using dot notation
	const flattenedFields: string[] = [];

	function flatten(fields: any[], prefix = '') {
		fields.forEach((field) => {
			if (typeof field === 'string') {
				flattenedFields.push(prefix + field);
			} else if (Array.isArray(field)) {
				flatten(field, prefix);
			} else if (typeof field === 'object') {
				const key = Object.keys(field)[0];
				flatten(field[key], prefix + key + '.');
			}
		});
	}

	flatten(fields);

	return flattenedFields;
}
