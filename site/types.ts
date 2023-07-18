/** Directus Schema for SDK */
export interface Schema {
	// Routes
	pages: Page[];
	articles: Articles[];
	team: Team[];
	events: Event[];
	content_types: ContentType[];
	partners: Partner[];

	// Content
	forms: Form[];
	site_banners: SiteBanner[];
	careers: Career[];
	videos: Video[];
	reports: Report[];
	case_studies: CaseStudy[];

	// Meta
	navigation: Navigation[];
	globals: Globals[];
	redirects: Redirect[];
	seo: SEO[];
}

// ** Page Builder Types **
export interface Page {
	id?: string;
	status?: string;
	sort?: number | null;
	user_created?: string | User | null;
	date_created?: string | null;
	user_updated?: string | User | null;
	date_updated?: string | null;
	title?: string | null;
	seo?: string | SEO | null;
	/** Start with a slash (/page) and do NOT add a trailing slash (/page/) */
	permalink?: string;
	sections?: (string | PageSection)[];
}

export interface PageSectionBlock {
	id?: string;
	sort?: number | null;
	page_sections_id?: string | PageSection | null;
	item?:
		| (
				| string
				| BlockColumns
				| BlockPageheader
				| BlockLogocloud
				| BlockFeaturegrid
				| BlockShowcase
				| BlockMediaFullwidth
				| BlockHeroForm
				| BlockHeroHeadline
				| BlockHeroRotator
		  )[]
		| null;
	collection?: string | null;
	/** Title is only for internal use. */
	title?: string | null;
}

export interface PageSection {
	id?: string;
	sort?: number | null;
	user_created?: string | User | null;
	date_created?: string | null;
	user_updated?: string | User | null;
	date_updated?: string | null;
	background?: string | null;
	page?: string | Page | null;
	/** Title is only for internal use. */
	title?: string | null;
	blocks?: (string | PageSectionBlock)[];
}

export interface BlockColumns {
	id?: string;
	col_one?: (string | BlockColumnsColOne)[];
	col_two?: (string | BlockColumnsColTwo)[];
}

export interface BlockColumnsColOne {
	id?: string;
	block_columns_id?: (string | BlockColumns) | null;
	item?: (string | { [key: string]: any })[] | null;
	sort?: number | null;
	collection?: string | null;
}

export interface BlockColumnsColTwo {
	id?: string;
	block_columns_id?: (string | BlockColumns) | null;
	item?: (string | { [key: string]: any })[] | null;
	sort?: number | null;
	collection?: string | null;
}

export interface BlockHeroForm {
	id?: string;
	form?: (string | Form) | null;
	heading?: string | null;
	subheading?: string | null;
}

export interface BlockHeroHeadline {
	id?: string;
	/** Use italics to make text gradient. */
	heading?: string | null;
	subheading?: string | null;
	button_group?: (string | CompButtonGroup) | null;
}

export interface BlockHeroRotator {
	id?: string;
}

export interface BlockLogocloud {
	id?: string;
	/** How do we want to display the logos? */
	type?: string | null;
	logos?: (number | BlockLogocloudLogos)[];
}

export interface BlockLogocloudLogos {
	id?: number;
	block_logocloud_id?: (string | BlockLogocloud) | null;
	directus_files_id?: (string | File) | null;
	sort?: number | null;
}

export interface BlockMediaFullwidth {
	id?: string;
	type?: string | null;
	image?: (string | File) | null;
	video?: (string | Video) | null;
	embed?: string | null;
}

export interface BlockPageheader {
	id?: string;
	heading?: string | null;
	preheading?: string | null;
	alignment?: string | null;
	subheading?: string | null;
	buttons?: (string | CompButtonGroup) | null;
	block_content?: string;
	block_styling?: string;
}

export interface BlockSeparator {
	id?: string;
}

export interface BlockFeaturegrid {
	id?: string;
	features?: { [key: string]: any } | null;
}

export interface BlockHeroForm {
	id?: string;
	form?: string | Form | null;
	heading?: string | null;
	subheading?: string | null;
}

export interface BlockHeroHeadline {
	id?: string;
	heading?: string | null;
	subheading?: string | null;
	button_group?: string | CompButtonGroup | null;
}

export interface BlockHeroRotator {
	id?: string;
}

export interface BlockLogocloud {
	id?: string;
	type?: string | null;
	logos?: (number | BlockLogocloudLogo)[];
}

export interface BlockLogocloudLogo {
	id?: number;
	block_logocloud_id?: string | BlockLogocloud | null;
	directus_files_id?: string | File | null;
	sort?: number | null;
}

export interface BlockMediaFullwidth {
	id?: string;
	type?: string | null;
	image?: string | File | null;
	video?: string | Video | null;
	embed?: string | null;
}

export interface BlockSeparator {
	id?: string;
}

export interface BlockShowcase {
	id?: string;
	items?: (string | BlockShowcase)[] | null;
}

export interface BlockShowcaseItem {
	id?: string;
	icon?: string | null;
	heading?: string | null;
	subheading?: string | null;
	type?: string | null;
	image?: string | File | null;
	embed?: string | null;
	video?: string | Video | null;
	block_showcase?: string | BlockShowcase | null;
	sort?: number | null;
}

export interface CompButtonGroup {
	id?: string;
	buttons?: (string | CompButtons)[];
}

export interface CompButtons {
	id?: string;
	sort?: number | null;
	label?: string | null;
	variant?: string;
	button_group?: string | CompButtonGroup | null;
	page?: string | Page | null;
	type?: string | null;
	resource?: string | Resource | null;
	external_url?: string | null;
}

export interface CompHeading {
	id?: string;
	preheading?: string | null;
	heading?: string | null;
	subheading?: string | null;
}

export interface CompMedia {
	id?: string;
	type?: string | null;
	embed?: string | null;
	video?: string | Video | null;
	image?: string | File | null;
}

export interface CompMetrics {
	id?: string;
	data?: { [key: string]: any } | null;
}

export interface CompQuote {
	id?: string;
	quote?: string | null;
	person_name?: string | null;
	person_title?: string | null;
	person_image?: string | File | null;
	company_logo?: string | File | null;
}

// ** Content Types **

export interface Articles {
	/** This also doubles as the URL slug */
	id?: string;
	status?: string;
	user_created?: (string | User) | null;
	date_created?: string | null;
	title?: string;
	summary?: string;
	body?: string | null;
	category?: string;
	image?: string | File;
	/** Overrides the article detail page, taking users directly to this URL. */
	url?: string | null;
	publish_date?: string | null;
	show_mast_image?: boolean | null;
}

export interface Blog {
	id?: number;
	main?: string | Articles | null;
	featured?: (number | BlogFeatured)[];
	popular?: (number | BlogPopular)[];
}

export interface BlogFeatured {
	id?: number;
	blog_id?: number | Blog | null;
	articles_id?: string | Articles | null;
	sort?: number | null;
}

export interface BlogPopular {
	id?: number;
	blog_id?: number | Blog | null;
	articles_id?: string | Articles | null;
	sort?: number | null;
}

export interface Career {
	id?: string;
	status?: string;
	sort?: number | null;
	title?: string;
	summary?: string;
	body?: string | null;
	date_created?: string | null;
	category?: string;
	employment?: string;
	slug?: string;
	apply?: string | null;
}

export interface CaseStudy {
	id?: string;
}

export interface EventInfo {
	[key: string]: any;
}

export interface Event {
	id?: number;
	status?: string;
	name?: string | null;
	start_time?: string | null;
	cover?: string | File | null;
	link_text?: string | null;
	link_url?: string | null;
	description?: string | null;
	location?: string | null;
}

export interface ContentType {
	id?: string;
	sort?: number | null;
	title?: string | null;
	color?: string | null;
	slug?: string | null;
	seo?: string | SEO | null;
}

export interface Form {
	id?: string;
	sort?: number | null;
	user_created?: string | User | null;
	date_created?: string | null;
	user_updated?: string | User | null;
	date_updated?: string | null;
	type?: string | null;
	title?: string | null;
	hubspot_form_id?: string | null;
}

export interface Globals {
	id?: string;
	user_updated?: string | User | null;
	date_updated?: string | null;
	/** This data is used for the contact forms to properly route leads to the right sales reps. */
	reps?: { [key: string]: any } | null;
	title?: string | null;
	description?: string | null;
	url?: string | null;
	social_links?: { service: string; url: string } | null;
	og_image?: string | File | null;
	social?: string;
	sales?: string;
	seo?: string;
}

export interface HomeReleaseTile {
	id?: number;
	title?: string | null;
	badge?: string | null;
	description?: string | null;
	button_text?: string | null;
	button_url?: string | null;
	show_tile?: boolean | null;
	background?: string | File | null;
	only_image?: string | File | null;
	only_image_alt?: string | null;
	only_image_url?: string | null;
}

export interface Navigation {
	id?: string;
	status?: string;
	user_created?: string | User | null;
	date_created?: string | null;
	user_updated?: string | User | null;
	date_updated?: string | null;
	title?: string | null;
	navigationItems?: NavigationItem[];
}

export interface NavigationItem {
	id?: string;
	sort?: number | null;
	title?: string | null;
	navigation?: string | Navigation | null;
	has_children?: boolean | null;
	type?: string | null;
	open_in_new_tab?: boolean | null;
	page?: string | Page | null;
	url?: string | null;
	parent?: string | Navigation | null;
	description?: string | null;
	image?: string | File | null;
	/** Add this item to far right and make it huge. <strong>Use only 1 per submenu</strong> */
	callout?: boolean | null;
	children?: NavigationItem[];
}

export interface Partner {
	id?: string;
	status?: string;
	sort?: number | null;
	user_created?: string | User | null;
	date_created?: string | null;
	user_updated?: string | User | null;
	date_updated?: string | null;
}

export interface Redirect {
	id?: string;
	user_created?: string | User | null;
	date_created?: string | null;
	user_updated?: string | User | null;
	date_updated?: string | null;
	url_old?: string;
	url_new?: string;
	response_code?: string | null;
}

export interface Report {
	id?: string;
}

export interface Resource {
	id?: string;
	status?: string;
	sort?: number | null;
	user_created?: string | User | null;
	date_created?: string | null;
	user_updated?: string | User | null;
	date_updated?: string | null;
	video?: string | Video | null;
	type?: string | null;
	title?: string | null;
	date_published?: string | null;
	author?: string | Team | null;
	slug?: string | null;
}

export interface SEO {
	id?: string;
	/** This entries title, defaults to title. Max 70 characters including the site name. */
	title?: string | null;
	/** This entries meta description. Max 160 characters. */
	meta_description?: string | null;
	/** Instruct crawlers not to index this entry. */
	no_index?: boolean | null;
	/** Instruct crawlers not to follow links on this page. */
	no_follow?: boolean | null;
	/** Where should the canonical URL for this entry point to. */
	canonical_url?: string | null;
	/** Valid values range from 0.0 to 1.0. This value does not affect how your pages are compared to pages on other sites, it only lets the search engines know which pages you deem most important for the crawlers. */
	sitemap_priority?: number | null;
	/** How often to instruct search engines to crawl. */
	sitemap_change_frequency?: string | null;
	/** This item's OG image. Defaults to global site OG image. The recommended size is 1200px x 630px. The image will be focal cropped to this dimension. */
	og_image?: string | File | null;
	json_ld?: string | null;
	pages?: (string | Page)[];
	content_types?: (string | ContentType)[];
}

export interface Site {
	[key: string]: any;
}

export interface SiteBanner {
	id?: string;
	status?: string;
	sort?: number | null;
	user_created?: string | User | null;
	date_created?: string | null;
	user_updated?: string | User | null;
	date_updated?: string | null;
	/** Keep the content as short as possible. */
	content?: string | null;
	show_button?: boolean | null;
	button_text?: string | null;
	button_url?: string | null;
	button?: string;
}

export interface Team {
	id?: string;
	status?: string;
	sort?: number | null;
	user_created?: string | User | null;
	date_created?: string | null;
	user_updated?: string | User | null;
	date_updated?: string | null;
	name?: string | null;
	job_title?: string | null;
	bio?: string | null;
	image?: string | File | null;
	links?: { [key: string]: any } | null;
	slug?: string;
	type?: string | null;
}

export interface UserGroup {
	id?: number;
	name?: string | null;
	cover?: string | File | null;
	link_url?: string | null;
}

export interface Video {
	id?: string;
	transcript?: string | null;
	url?: string | null;
	thumbnail?: string | File | null;
	type?: string | null;
	file?: string | File | null;
}

export interface WebsiteTestimonial {
	id?: string;
	status?: string;
	title?: string | null;
	subtitle?: string | null;
	image?: string | File | null;
	text?: string | null;
	sort?: number | null;
	large_image?: boolean | null;
}

// ** Directus System Types **

export interface File {
	/** Unique identifier for the file. */
	id?: string;
	/** Where the file is stored. Either `local` for the local filesystem or the name of the storage adapter (for example `s3`). */
	storage?: string;
	/** Name of the file on disk. By default, Directus uses a random hash for the filename. */
	filename_disk?: string;
	/** How you want to the file to be named when it's being downloaded. */
	filename_download?: string;
	/** Title for the file. Is extracted from the filename on upload, but can be edited by the user. */
	title?: string;
	/** MIME type of the file. */
	type?: string;
	/** Virtual folder where this file resides in. */
	folder?: (string | Folder) | null;
	/** Who uploaded the file. */
	uploaded_by?: string | User;
	/** When the file was uploaded. */
	uploaded_on?: string;
	modified_by?: (string | User) | null;
	modified_on?: string;
	/** Character set of the file. */
	charset?: string | null;
	/** Size of the file in bytes. */
	filesize?: number;
	/** Width of the file in pixels. Only applies to images. */
	width?: number | null;
	/** Height of the file in pixels. Only applies to images. */
	height?: number | null;
	/** Duration of the file in seconds. Only applies to audio and video. */
	duration?: number | null;
	/** Where the file was embedded from. */
	embed?: string | null;
	/** Description for the file. */
	description?: string | null;
	/** Where the file was created. Is automatically populated based on EXIF data for images. */
	location?: string | null;
	/** Tags for the file. Is automatically populated based on EXIF data for images. */
	tags?: string[] | null;
	/** IPTC, EXIF, and ICC metadata extracted from file */
	metadata?: { [key: string]: any } | null;
	storage_divider?: string;
}

export interface Folder {
	/** Unique identifier for the folder. */
	id?: string;
	/** Name of the folder. */
	name?: string;
	/** Unique identifier of the parent folder. This allows for nested folders. */
	parent?: (string | Folder) | null;
}

export interface User {
	/** Unique identifier for the user. */
	id?: string;
	/** First name of the user. */
	first_name?: string;
	/** Last name of the user. */
	last_name?: string;
	/** Unique email address for the user. */
	email?: string;
	/** Password of the user. */
	password?: string;
	/** The user's location. */
	location?: string | null;
	/** The user's title. */
	title?: string | null;
	/** The user's description. */
	description?: string | null;
	/** The user's tags. */
	tags?: string[] | null;
	/** The user's avatar. */
	avatar?: (string | File) | null;
	/** The user's language used in Directus. */
	language?: string;
	/** What theme the user is using. */
	theme?: 'light' | 'dark' | 'auto';
	/** The 2FA secret string that's used to generate one time passwords. */
	tfa_secret?: string | null;
	/** Status of the user. */
	status?: 'active' | 'invited' | 'draft' | 'suspended' | 'deleted';
	/** Unique identifier of the role of this user. */
	role?: string | Role;
	/** Static token for the user. */
	token?: string | null;
	last_access?: string | null;
	/** Last page that the user was on. */
	last_page?: string | null;
	provider?: string;
	external_identifier?: string | null;
	auth_data?: { [key: string]: any } | null;
	github?: string | null;
	linkedin?: string | null;
	start_date?: string | null;
	pronouns?: string | null;
	nickname?: string | null;
	birthday?: string | null;
	personal_email?: string | null;
	classification?: string | null;
	timezone?: string | null;
	phone?: string | null;
	email_notifications?: boolean | null;
	company_info?: string;
	preferences_divider?: string;
	admin_divider?: string;
}

export interface Role {
	/** Unique identifier for the role. */
	id?: string;
	/** Name of the role. */
	name?: string;
	/** The role's icon. */
	icon?: string;
	/** Description of the role. */
	description?: string | null;
	/** Array of IP addresses that are allowed to connect to the API as a user of this role. */
	ip_access?: string[];
	/** Whether or not this role enforces the use of 2FA. */
	enforce_tfa?: boolean;
	/** Admin role. If true, skips all permission checks. */
	admin_access?: boolean;
	/** The users in the role are allowed to use the app. */
	app_access?: boolean;
	users?: (string | User)[];
}
