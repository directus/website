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
		<small>{{ block.subtext }}&nbsp;</small>
		<p class="price">
			<span class="value">{{ priceValue }}</span>
			<span>{{ priceText }}&nbsp;</span>
			<span class="term">{{ block.term }}&nbsp;</span>
			<BaseIcon v-if="block.term_tooltip" size="small" name="info" :title="block.term_tooltip" class="info" />
		</p>
		<p v-if="block.description" class="description">{{ block.description }}</p>
		<BlockButton v-if="block.cta" :uuid="block.cta" class="cta" />
		<BaseDivider class="divider" />
		<ul v-if="block.points" class="points">
			<li v-for="{ content } in block.points" :key="content">
				<BaseIcon name="check" class="check" size="small" />
				{{ content }}
			</li>
		</ul>
	</BasePanel>
</template>

<style lang="scss" scoped>
.block-tier {
	inline-size: 100%;
	max-inline-size: var(--space-96);
	block-size: auto;
}

h3 {
	font-size: var(--font-size-2xl);
	line-height: var(--line-height-2xl);
	font-family: var(--family-display);
	font-weight: 600;
}

small {
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	color: var(--gray-400);
}

.price {
	font-family: var(--family-display);
}

.info {
	--base-icon-color: var(--gray-400);
	transition: var(--duration-150) var(--ease-out);

	cursor: help;
	vertical-align: sub;

	&:hover {
		--base-icon-color: var(--black);
		transition: none;
	}
}

.value {
	font-size: var(--font-size-2xl);
	line-height: var(--line-height-2xl);
	font-weight: 600;
}

.term {
	color: var(--gray-400);
}

.description {
	color: var(--gray-400);
	margin-block-start: var(--space-2);
}

.cta {
	margin-block-start: var(--space-5);
}

.divider {
	margin-block: var(--space-5);
}

.points {
	list-style: none;
	padding: 0;
	margin: 0;
	color: var(--gray-400);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);

	li {
		display: flex;
		align-items: center;
	}

	li + li {
		margin-block-start: var(--space-1);
	}

	.check {
		--base-icon-color: var(--purple-400);
		margin-inline-end: var(--space-3);
	}
}
</style>
