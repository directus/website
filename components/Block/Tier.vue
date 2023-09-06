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
			<span v-tooltip="block.term_tooltip" class="info">
				<BaseIcon v-if="block.term_tooltip" size="small" name="info" />
			</span>
		</p>
		<p v-if="block.description" class="description">{{ block.description }}</p>
		<BlockButton v-if="block.cta" :uuid="block.cta" class="cta" size="large" />
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
	display: block;
	margin-block-start: var(--space-1);
	margin-block-end: calc(-1 * var(--space-1));
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	color: var(--gray-400);
}

.info {
	display: inline-block;
	font-size: 0;
	line-height: 0;
	vertical-align: sub;

	.base-icon {
		--base-icon-color: var(--gray-400);
		transition: var(--duration-150) var(--ease-out);

		cursor: help;

		&:hover {
			--base-icon-color: var(--foreground);
			transition: none;
		}
	}
}

.value {
	font-family: var(--family-display);
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
		--base-icon-color: var(--primary);
		margin-inline-end: var(--space-3);
	}
}
</style>
