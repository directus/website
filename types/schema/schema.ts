import type {
	Article,
	BlockCardGroup,
	BlockMediaFullWidth,
	Career,
	CaseStudy,
	ComponentButton,
	Form,
	Page,
	Report,
	SiteBanner,
	Video,
} from './content/index.js';
import type { Globals, Navigation, Redirect, Seo } from './meta/index.js';
import type { ContentType, Event, Partner, Team } from './routes/index.js';
import type { File, User } from './system/index.js';

/** Directus Schema for SDK */
export interface Schema {
	// Routes
	pages: Page[];
	articles: Article[];
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

	// Blocks
	block_media_fullwidth: BlockMediaFullWidth[];
	block_cardgroup: BlockCardGroup[];

	// Components
	comp_button: ComponentButton[];

	// Meta
	navigation: Navigation[];
	globals: Globals;
	redirects: Redirect[];
	seo: Seo[];

	// System
	directus_users: User[];
	directus_files: File[];
}
