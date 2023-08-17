<script setup lang="ts">
import type { BlockType } from '~/types/schema';

export interface BaseBlockProps {
	type: BlockType;
	uuid: string;
}

defineProps<BaseBlockProps>();

const components: Record<BlockType, ReturnType<typeof resolveComponent>> = {
	block_accordion_group: resolveComponent('BlockAccordionGroup'),
	block_accordion: resolveComponent('BlockAccordion'),
	block_button_group: resolveComponent('BlockButtonGroup'),
	block_button: resolveComponent('BlockButton'),
	block_card_group: resolveComponent('BlockCardGroup'),
	block_card: resolveComponent('BlockCard'),
	block_columns: resolveComponent('BlockColumns'),
	block_cta: resolveComponent('BlockCta'),
	block_featuregrid: 'div',
	block_form: resolveComponent('BlockForm'),
	block_header: resolveComponent('BlockHeader'),
	block_logocloud: resolveComponent('BlockLogoCloud'),
	block_media: resolveComponent('BlockMedia'),
	block_metric_group: resolveComponent('BlockMetricGroup'),
	block_metric: resolveComponent('BlockMetric'),
	block_paper: resolveComponent('BlockPaper'),
	block_quote: resolveComponent('BlockQuote'),
	block_resource_slider: resolveComponent('BlockResourceSlider'),
	block_richtext: resolveComponent('BlockRichText'),
	block_separator: resolveComponent('BlockSeparator'),
	block_showcase: resolveComponent('BlockShowcase'),
	block_signature: resolveComponent('BlockSignature'),
	block_table: resolveComponent('BlockTable'),
	block_testimonial_slider: resolveComponent('BlockTestimonialSlider'),
	block_tier_group: resolveComponent('BlockTierGroup'),
	block_tier: resolveComponent('BlockTier'),
};
</script>

<template>
	<div class="block-container">
		<component :is="components[type]" :uuid="uuid" />
	</div>
</template>

<style lang="scss" scoped>
.block-container {
	container-type: inline-size;
}
</style>
