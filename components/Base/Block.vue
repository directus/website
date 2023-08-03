<script setup lang="ts">
import type { BlockType } from '~/types/schema';

export interface BaseBlockProps {
	type: BlockType;
	uuid: string;
}

defineProps<BaseBlockProps>();

const components: Record<BlockType, ReturnType<typeof resolveComponent>> = {
	block_button_group: resolveComponent('BlockButtonGroup'),
	block_button: resolveComponent('BlockButton'),
	block_card_group: resolveComponent('BlockCardGroup'),
	block_card: resolveComponent('BlockCard'),
	block_columns: resolveComponent('BlockColumns'),
	block_featuregrid: 'div',
	block_hero_form: resolveComponent('BlockHeroForm'),
	block_hero_rotator: resolveComponent('BlockHeroRotator'),
	block_logocloud: resolveComponent('BlockLogoCloud'),
	block_media: resolveComponent('BlockMedia'),
	block_metrics: resolveComponent('BlockMetrics'),
	block_header: resolveComponent('BlockHeader'),
	block_quote: resolveComponent('BlockQuote'),
	block_richtext: resolveComponent('BlockRichText'),
	block_separator: resolveComponent('BlockSeparator'),
	block_showcase: resolveComponent('BlockShowcase'),
	block_testimonial_slider: resolveComponent('BlockTestimonialSlider'),
};
</script>

<template>
	<component :is="components[type]" :uuid="uuid" />
</template>
