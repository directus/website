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
	BlockPageNav,
	BlockPaper,
	BlockPaperBlocks,
	BlockQuote,
	BlockResourceSlider,
	BlockResourceSliderResources,
	BlockRichText,
	BlockSeparator,
	BlockShowcase,
	BlockShowcaseItem,
	BlockShowcaseItemBlock,
	BlockSignature,
	BlockTable,
	BlockTestimonialSlider,
	BlockTestimonialSliderItems,
	BlockTier,
	BlockTierGroup,
	BlockTierGroupBlockTier,
	BlockDirectory,
	BlockCarousel,
	BlockCarouselCards,
	BlockMasonryGrid,
	BlockMasonryGridCard,
	BlockWallOfLove,
} from './blocks/index.js';
import type {
	Form,
	Resource,
	ResourceBlock,
	ResourcesResources,
	SiteBanner,
	Team,
	Event,
	Feature,
	DeveloperArticle,
	DeveloperArticleDocTag,
	DocTag,
	AgencyPartner,
	Project,
	Creator,
	Template,
	Extension,
	Testimonial,
	InternalFormConfig,
	InternalFormConfigProduct,
	Product,
} from './content/index.js';
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
	resources_resources: ResourcesResources[];
	site_banners: SiteBanner[];
	team: Team[];
	events: Event[];
	features: Feature[];
	testimonials: Testimonial[];
	internal_form_config: InternalFormConfig[];
	internal_form_config_products: InternalFormConfigProduct[];
	products: Product[];

	// Partner Program
	agency_partners: AgencyPartner[];
	projects: Project[];

	// Docs & Developer Blog
	developer_articles: DeveloperArticle[];
	developer_articles_doc_tags: DeveloperArticleDocTag[];
	doc_tags: DocTag[];

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
	block_showcase_item: BlockShowcaseItem[];
	block_showcase_item_block: BlockShowcaseItemBlock[];
	block_signature: BlockSignature[];
	block_table: BlockTable[];
	block_testimonial_slider_items: BlockTestimonialSliderItems[];
	block_testimonial_slider: BlockTestimonialSlider[];
	block_tier_group_block_tier: BlockTierGroupBlockTier[];
	block_tier_group: BlockTierGroup[];
	block_tier: BlockTier[];
	block_directory: BlockDirectory[];
	block_carousel: BlockCarousel[];
	block_carousel_cards: BlockCarouselCards[];
	block_masonry_grid: BlockMasonryGrid[];
	block_masonry_grid_card: BlockMasonryGridCard[];
	block_wall_of_love: BlockWallOfLove[];

	// Meta
	globals: Globals;
	navigation: Navigation[];
	redirects: Redirect[];
	seo: Seo[];

	// System
	directus_files: File[];
	directus_users: User[];

	// Marketplace
	creators: Creator[];
	templates: Template[];
	extensions: Extension[];
}
