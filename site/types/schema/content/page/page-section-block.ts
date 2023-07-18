import type { PageSection } from './page-section.js';
import type {
	BlockColumns,
	BlockPageheader,
	BlockLogocloud,
	BlockFeaturegrid,
	BlockShowcase,
	BlockMediaFullwidth,
	BlockHeroForm,
	BlockHeroHeadline,
	BlockHeroRotator,
} from './block/index.js';

export interface PageSectionBlock {
	id: string;
	sort: number | null;
	page_sections_id: string | PageSection | null;
	item:
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
	collection: string | null;
	/** Title is only for internal use. */
	title: string | null;
}
