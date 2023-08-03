<script setup lang="ts">
import type { BlockType, PageSection } from '~/types/schema';

interface PageBuilderProps {
	sections: PageBuilderSection[];
}

export interface PageBuilderSection {
	id: string;
	background: PageSection['background'];
	blocks: PageSectionBlock[];
	negative_top_margin: boolean;
}

export interface PageSectionBlock {
	id: string;
	collection: BlockType;
	item: string;
}

defineProps<PageBuilderProps>();
</script>

<template>
	<PageSection
		v-for="(section, i) in sections"
		:key="section.id"
		:background="section.background"
		:offset-negative-margin="sections[i + 1]?.negative_top_margin"
		:negative-margin="section.negative_top_margin"
	>
		<BaseContainer v-for="block in section.blocks" :key="block.id">
			<BaseBlock :type="block.collection" :uuid="block.item" />
		</BaseContainer>
	</PageSection>
</template>
