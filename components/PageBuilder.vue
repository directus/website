<script setup lang="ts">
import type { BlockType, PageSection } from '~/types/schema';

interface PageBuilderProps {
	sections: PageBuilderSection[];
}

export interface PageBuilderSection {
	id: string;
	background: PageSection['background'];
	blocks: PageSectionBlock[];
}

export interface PageSectionBlock {
	id: string;
	collection: BlockType;
	item: string;
}

defineProps<PageBuilderProps>();

const components: Record<BlockType, ReturnType<typeof resolveComponent>> = {
	block_cardgroup: resolveComponent('BlockCardGroup'),
	block_columns: resolveComponent('BlockColumns'),
	block_featuregrid: 'div',
	block_hero_form: 'div',
	block_hero_headline: resolveComponent('BlockHeroHeadline'),
	block_hero_rotator: 'div',
	block_logocloud: 'div',
	block_media_fullwidth: resolveComponent('BlockMediaFullWidth'),
	block_pageheader: 'div',
	block_separator: 'div',
	block_showcase: resolveComponent('BlockShowcase'),
};
</script>

<template>
	<div class="content">
		<PageSection v-for="section in sections" :key="section.id" :background="section.background">
			<BlockContainer v-for="block in section.blocks" :key="block.id">
				<component :is="components[block.collection]" :uuid="block.item" />
			</BlockContainer>
		</PageSection>
	</div>
</template>

<style scoped>
.content {
	margin-inline: auto;
}
</style>
