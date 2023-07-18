import type { Article, Career, CaseStudy, Form, Page, Report, SiteBanner, Video } from './content/index.js';
import type { Globals, Navigation, Redirect, Seo } from './meta/index.js';
import type { ContentType, Event, Partner, Team } from './routes/index.js';

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

	// Meta
	navigation: Navigation[];
	globals: Globals;
	redirects: Redirect[];
	seo: Seo[];
}
