<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_tier', props.uuid, {
			fields: ['name', 'subtext', 'price', 'term', 'term_tooltip', 'cta', 'description', 'points'],
		})
	)
);

const priceValue = computed(() => unref(block)?.price.split(' ')[0]);
const priceText = computed(() => unref(block)?.price.substring(unref(priceValue)?.length ?? 0));
</script>

<template>
	<BasePanel v-if="block" class="block-tier" dense>
		<h3>{{ block.name }}</h3>
		<small>{{ block.subtext }}</small>
		<p>
			{{ priceValue }}
			<span>{{ priceText }}</span>
			<span>{{ block.term }}</span>
			<BaseIcon v-if="block.term_tooltip" name="info" :title="block.term_tooltip" />
		</p>
		<BlockButton v-if="block.cta" :uuid="block.cta" />
		<BaseDivider />
		<ul v-if="block.points">
			<li v-for="{ content } in block.points" :key="content">{{ content }}</li>
		</ul>
	</BasePanel>
</template>

<style lang="scss" scoped>
.block-tier {
	inline-size: 100%;
	max-inline-size: var(--space-96);
	block-size: auto;
}
</style>
