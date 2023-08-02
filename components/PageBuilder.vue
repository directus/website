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

const components: Record<BlockType, ReturnType<typeof resolveComponent>> = {
	block_cardgroup: resolveComponent('BlockCardGroup'),
	block_columns: resolveComponent('BlockColumns'),
	block_featuregrid: 'div',
	block_hero_form: resolveComponent('BlockHeroForm'),
	block_hero_headline: resolveComponent('BlockHeroHeadline'),
	block_hero_rotator: resolveComponent('BlockHeroRotator'),
	block_logocloud: resolveComponent('BlockLogoCloud'),
	block_media_fullwidth: resolveComponent('BlockMediaFullWidth'),
	block_pageheader: resolveComponent('BlockPageHeader'),
	block_richtext: resolveComponent('BlockRichText'),
	block_separator: resolveComponent('BlockSeparator'),
	block_showcase: resolveComponent('BlockShowcase'),
	block_testimonial_slider: resolveComponent('BlockTestimonialSlider'),
	block_richtext: resolveComponent('BlockRichText'),
	block_floating_page: resolveComponent('BlockFloatingPage'),
};
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
			<component :is="components[block.collection]" :uuid="block.item" />
		</BaseContainer>
	</PageSection>
</template>
