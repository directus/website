<script setup lang="ts">
import type { BlockType, PageBlock, Experiment, ExperimentVariant } from '~/types/schema';

interface PageBuilderProps {
	spacingTop?: 'none' | 'x-small' | 'small' | 'normal';
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
	experiment?: Experiment | string | null;
	experiment_variant?: ExperimentVariant | string | null;
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
		:nav-offset="i === 0 ? spacingTop : 'none'"
		:spacing="section.spacing"
		:is-first-section="i === 0"
	>
		<BaseContainer
			v-for="(block, blockIndex) in section.blocks"
			:id="block.key ?? undefined"
			:key="block.id"
			:spacing="block.spacing"
		>
			<BaseBlock
				:type="block.collection"
				:uuid="block.item"
				:width="block.width"
				:isFirstBlock="i === 0 && blockIndex === 0"
			/>
		</BaseContainer>
	</PageSection>
</template>
