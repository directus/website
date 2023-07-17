<script setup lang="ts">
import { Page } from '~~/types';

// Map the page builder collection names to the components
// https://nuxt.com/docs/guide/directory-structure/components#dynamic-components
const map = (collection: string) => {
	const mapping = {
		block_hero_form: resolveComponent('BlocksHeroForm'),
		block_hero_headline: resolveComponent('BlocksHeroHeadline'),
		block_hero_rotator: resolveComponent('BlocksHeroRotator'),
		block_media_fullwidth: resolveComponent('BlocksMediaFullWidth'),
		block_separator: resolveComponent('BaseDivider'),
		block_logocloud: resolveComponent('BlocksLogoCloud'),
		block_pageheader: resolveComponent('BlocksPageHeader'),
		block_featuregrid: resolveComponent('BlocksFeatureGrid'),
		block_columns: resolveComponent('BlocksColumns'),
		block_showcase: resolveComponent('BlocksShowcase'),
		block_cardgroup: resolveComponent('BlocksCardGroup'),
	};

	return mapping[collection] || 'div';
};

defineProps<{
	page: Page;
}>();
</script>

<template>
	<div id="content">
		<PageSection v-for="section in page.sections" :key="section.id" :section="section">
			<template v-for="block in section.blocks" :key="block.id">
				<BlockContainer>
					<component :is="map(block.collection)" :data="block.item" />
				</BlockContainer>
			</template>
		</PageSection>
	</div>
</template>

<style scoped>
#content {
	margin-left: auto;
	margin-right: auto;
}
</style>
