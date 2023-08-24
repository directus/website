<script setup lang="ts">
import type { BlockType, PageBlock } from '~/types/schema';

interface PageBuilderProps {
	sections: PageBuilderSection[];
}

export interface PageBuilderSection {
	background: PageBlock['background'];
	blocks: PageSectionBlock[];
	negativeTopMargin: boolean;
}

export interface PageSectionBlock {
	id: number;
	collection: BlockType;
	item: string;
	spacing: 'none' | 'small' | 'medium' | 'large';
	width: 'standard' | 'narrow';
	key: string | null;
}

defineProps<PageBuilderProps>();
</script>

<template>
	<PageSection
		v-for="(section, i) in sections"
		:key="i"
		:background="section.background"
		:offset-negative-margin="sections[i + 1]?.negativeTopMargin"
		:negative-margin="section.negativeTopMargin"
	>
		<BaseContainer
			v-for="block in section.blocks"
			:id="block.key ?? undefined"
			:key="block.id"
			:spacing="block.spacing"
		>
			<BaseBlock :type="block.collection" :uuid="block.item" :width="block.width" />
		</BaseContainer>
	</PageSection>
</template>
