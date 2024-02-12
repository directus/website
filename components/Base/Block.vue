<script setup lang="ts">
import type { BlockType } from '~/types/schema';

export interface BaseBlockProps {
	type: BlockType;
	uuid: string;
	width?: 'full' | 'standard' | 'narrow';
}

withDefaults(defineProps<BaseBlockProps>(), {
	width: 'standard',
});

const components: Record<BlockType, ReturnType<typeof resolveComponent>> = {
	block_accordion_group: resolveComponent('LazyBlockAccordionGroup'),
	block_accordion: resolveComponent('LazyBlockAccordion'),
	block_button_group: resolveComponent('LazyBlockButtonGroup'),
	block_button: resolveComponent('LazyBlockButton'),
	block_card_group_dynamic: resolveComponent('LazyBlockCardGroupDynamic'),
	block_card_group: resolveComponent('LazyBlockCardGroup'),
	block_card: resolveComponent('LazyBlockCard'),
	block_code: resolveComponent('LazyBlockCode'),
	block_columns: resolveComponent('LazyBlockColumns'),
	block_cta: resolveComponent('LazyBlockCta'),
	block_form: resolveComponent('LazyBlockForm'),
	block_header: resolveComponent('LazyBlockHeader'),
	block_logocloud: resolveComponent('LazyBlockLogoCloud'),
	block_media: resolveComponent('LazyBlockMedia'),
	block_metric_group: resolveComponent('LazyBlockMetricGroup'),
	block_metric: resolveComponent('LazyBlockMetric'),
	block_page_nav: resolveComponent('LazyBlockPageNav'),
	block_paper: resolveComponent('LazyBlockPaper'),
	block_quote: resolveComponent('LazyBlockQuote'),
	block_resource_slider: resolveComponent('LazyBlockResourceSlider'),
	block_richtext: resolveComponent('LazyBlockRichText'),
	block_separator: resolveComponent('LazyBlockSeparator'),
	block_showcase: resolveComponent('LazyBlockShowcase'),
	block_signature: resolveComponent('LazyBlockSignature'),
	block_table: resolveComponent('LazyBlockTable'),
	block_testimonial_slider: resolveComponent('LazyBlockTestimonialSlider'),
	block_tier_group: resolveComponent('LazyBlockTierGroup'),
	block_tier: resolveComponent('LazyBlockTier'),
};
</script>

<template>
	<div class="block-container" :class="width">
		<component :is="components[type]" :uuid="uuid" />
	</div>
</template>

<style lang="scss" scoped>
.block-container {
	container-type: inline-size;

	&.narrow {
		grid-column: narrow;
	}

	&.full {
		grid-column: full;
	}
}
</style>
