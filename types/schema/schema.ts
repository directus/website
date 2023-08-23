import type {
	BlockAccordion,
	BlockAccordionContent,
	BlockAccordionGroup,
	BlockAccordionGroupItems,
	BlockButton,
	BlockButtonGroup,
	BlockButtonGroupBlockButton,
	BlockCard,
	BlockCardGroup,
	BlockCardGroupBlockCard,
	BlockCardGroupDynamic,
	BlockCode,
	BlockColumns,
	BlockCta,
	BlockForm,
	BlockHeader,
	BlockLogoCloud,
	BlockLogoCloudLogo,
	BlockMedia,
	BlockMetric,
	BlockMetricGroup,
	BlockMetricGroupItems,
	BlockPaper,
	BlockPaperBlocks,
	BlockQuote,
	BlockResourceSlider,
	BlockResourceSliderResources,
	BlockRichText,
	BlockSeparator,
	BlockShowcase,
	BlockSignature,
	BlockTable,
	BlockTestimonialSlider,
	BlockTestimonialSliderItems,
	BlockTier,
	BlockTierGroup,
	BlockTierGroupBlockTier,
	BlockPageNav
} from './blocks/index.js';
import type { Form, Resource, ResourceBlock, SiteBanner, Team } from './content/index.js';
import type { Globals, Navigation, Redirect, Seo } from './meta/index.js';
import type { ContentType, Page, PageBlock } from './routes/index.js';
import type { File, User } from './system/index.js';

/** Directus Schema for SDK */
export interface Schema {
	// Routes
	content_types: ContentType[];
	pages: Page[];
	pages_blocks: PageBlock[];

	// Content
	forms: Form[];
	resources: Resource[];
	resources_blocks: ResourceBlock[];
	site_banners: SiteBanner[];
	team: Team[];

	// Blocks
	block_accordion_content: BlockAccordionContent[];
	block_accordion_group_items: BlockAccordionGroupItems[];
	block_accordion_group: BlockAccordionGroup[];
	block_accordion: BlockAccordion[];
	block_button_group_block_button: BlockButtonGroupBlockButton[];
	block_button_group: BlockButtonGroup[];
	block_button: BlockButton[];
	block_card_group_block_card: BlockCardGroupBlockCard[];
	block_card_group_dynamic: BlockCardGroupDynamic[];
	block_card_group: BlockCardGroup[];
	block_card: BlockCard[];
	block_code: BlockCode[];
	block_columns: BlockColumns[];
	block_cta: BlockCta[];
	block_form: BlockForm[];
	block_header: BlockHeader[];
	block_logocloud_logo: BlockLogoCloudLogo[];
	block_logocloud: BlockLogoCloud[];
	block_media: BlockMedia[];
	block_metric_group_items: BlockMetricGroupItems[];
	block_metric_group: BlockMetricGroup[];
	block_metric: BlockMetric[];
	block_page_nav: BlockPageNav[];
	block_paper_blocks: BlockPaperBlocks[];
	block_paper: BlockPaper[];
	block_quote: BlockQuote[];
	block_resource_slider_resources: BlockResourceSliderResources[];
	block_resource_slider: BlockResourceSlider[];
	block_richtext: BlockRichText[];
	block_separator: BlockSeparator[];
	block_showcase: BlockShowcase[];
	block_signature: BlockSignature[];
	block_table: BlockTable[];
	block_testimonial_slider_items: BlockTestimonialSliderItems[];
	block_testimonial_slider: BlockTestimonialSlider[];
	block_tier_group_block_tier: BlockTierGroupBlockTier[];
	block_tier_group: BlockTierGroup[];
	block_tier: BlockTier[];

	// Meta
	globals: Globals;
	navigation: Navigation[];
	redirects: Redirect[];
	seo: Seo[];

	// System
	directus_files: File[];
	directus_users: User[];
}
