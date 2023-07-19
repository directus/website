// // Explicitly define the fields to fetch for each block type in the page builder. Should be kept in sync with the page builder block types.

// export const blockHeroHeadline = {
// 	block_hero_headline: [
// 		'id',
// 		'heading',
// 		'subheading',
// 		{
// 			button_group: [
// 				{
// 					buttons: [
// 						'id',
// 						'label',
// 						'variant',
// 						'button_group',
// 						'page',
// 						'type',
// 						'resource',
// 						'external_url',
// 						'color',
// 						'pulse',
// 					],
// 				},
// 			],
// 		},
// 	],
// };

// export const blockMediaFullwidth = {
// 	block_media_fullwidth: [
// 		'id',
// 		'type',
// 		{ video: ['id', 'title', 'url'] },
// 		{ image: ['id', 'title', 'description'] },
// 		'embed',
// 	],
// };

// export const blockLogocloud = {
// 	block_logocloud: [
// 		'id',
// 		'type',
// 		{
// 			logos: [{ directus_files_id: ['id', 'title', 'description'] }],
// 		},
// 	],
// };

// export const blockColumns = {
// 	block_columns: [
// 		'id',
// 		{
// 			col_one: [
// 				'id',
// 				'collection',
// 				{
// 					item: ['*.*'],
// 				},
// 			],
// 		},
// 		{
// 			col_two: [
// 				'id',
// 				'collection',
// 				{
// 					item: ['*.*'],
// 				},
// 			],
// 		},
// 	],
// };

// export const blockPageheader = {
// 	block_pageheader: [
// 		'id',
// 		'heading',
// 		'subheading',
// 		{
// 			button_group: [
// 				{
// 					buttons: [
// 						'id',
// 						'label',
// 						'variant',
// 						'button_group',
// 						'page',
// 						'type',
// 						'resource',
// 						'external_url',
// 						'color',
// 						'pulse',
// 					],
// 				},
// 			],
// 		},
// 	],
// };

// export const blockHeroForm = {
// 	block_heroform: ['id', 'heading', 'subheading', { form: ['id', 'title', 'hubspot_form_id'] }],
// };

// export const blockFeaturegrid = { block_featuregrid: ['id', 'features'] };

// export const blockShowcase = {
// 	block_showcase: [
// 		'id',
// 		{
// 			items: [
// 				'id',
// 				'type',
// 				{
// 					image: ['id', 'title', 'description'],
// 				},
// 				{
// 					video: ['id', 'title', 'url'],
// 				},
// 				'icon',
// 				'heading',
// 				'subheading',
// 			],
// 		},
// 	],
// };

// export const blockCardgroup = {
// 	block_cardgroup: [
// 		'id',
// 		'variant',
// 		{
// 			cards: [
// 				'id',
// 				'title',
// 				'description',
// 				'image_size',
// 				'image_background_color',
// 				'image',
// 				{
// 					button: ['*'],
// 				},
// 			],
// 		},
// 	],
// };

// /** @TODO: Add fields for hero rotator */
// export const blockHeroRotator = { block_hero_rotator: [] };

// // * Combine all block fields into a single array *

// export const pageBlockFields = [
// 	'id',
// 	'title',
// 	'permalink',
// 	'status',
// 	{
// 		sections: [
// 			'id',
// 			'title',
// 			'background',
// 			{
// 				blocks: [
// 					'id',
// 					'collection',
// 					{
// 						item: {
// 							...blockHeroHeadline,
// 							...blockLogocloud,
// 							...blockMediaFullwidth,
// 							...blockColumns,
// 							...blockCardgroup,
// 							...blockFeaturegrid,
// 							...blockHeroForm,
// 							...blockPageheader,
// 							...blockShowcase,
// 						},
// 					},
// 				],
// 			},
// 		],
// 	},
// ];
