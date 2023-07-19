<script setup lang="ts">
import type { BlockType, PageSection } from '~/types/schema';

interface PageBuilderProps {
	sections: PageBuilderSection[];
}

export interface PageBuilderSection {
	id: string;
	background: PageSection['background'];
	blocks: PageBuilderSectionBlock[];
}

export interface PageBuilderSectionBlock {
	id: string;
	collection: BlockType;
	item: string;
}

defineProps<PageBuilderProps>();

const components: Record<BlockType, ReturnType<typeof resolveComponent>> = {
	block_hero_form: resolveComponent('BlockHeroForm'),
	block_cardgroup: 'div',
	block_columns: 'div',
	block_featuregrid: 'div',
	block_hero_headline: 'div',
	block_hero_rotator: 'div',
	block_logocloud: 'div',
	block_media_fullwidth: 'div',
	block_pageheader: 'div',
	block_separator: 'div',
	block_showcase: 'div',
};
</script>

<template>
	<div class="content">
		<PageSection v-for="section in sections" :key="section.id" :background="section.background">
			<BlockContainer v-for="block in section.blocks" :key="block.id">
				<component :is="components[block.collection]" :id="block.item" />
			</BlockContainer>
		</PageSection>
	</div>
</template>

<style scoped>
.content {
	margin-inline: auto;
}
</style>
