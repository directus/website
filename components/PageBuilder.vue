<script setup lang="ts">
import type { BlockType, PageBlock } from '~/types/schema';

interface PageBuilderProps {
	spacingTop?: 'small' | 'normal';
	sections: PageBuilderSection[];
}

export interface PageBuilderSection {
	background: PageBlock['background'];
	spacing: 'none' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
	negativeTopMargin: boolean;
	blocks: PageSectionBlock[];
}

export interface PageSectionBlock {
	id: number;
	collection: BlockType;
	item: string;
	spacing: 'none' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
	width: 'full' | 'standard' | 'narrow';
	key: string | null;
}

withDefaults(defineProps<PageBuilderProps>(), {
	spacingTop: 'normal',
});
</script>

<template>
	<PageSection
		v-for="(section, i) in sections"
		:key="i"
		:background="section.background"
		:offset-negative-margin="sections[i + 1]?.negativeTopMargin"
		:negative-margin="section.negativeTopMargin"
		:nav-offset="spacingTop"
		:spacing="section.spacing"
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
