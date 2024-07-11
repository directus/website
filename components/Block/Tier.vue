<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_tier', props.uuid, {
			fields: [
				'name',
				'subtext',
				'price',
				'term',
				'term_tooltip',
				'cta',
				'description',
				'points',
				'highlight',
				'badge',
			],
		}),
	),
);
</script>

<template>
	<div v-if="block" class="block-tier" :class="[block.highlight ? 'highlight' : '']" dense>
		<div class="badge">
			<BaseBadge v-if="block.badge" color="primary-reverse">{{ block.badge }}</BaseBadge>
		</div>
		<h3>{{ block.name }}</h3>
		<small v-if="block.subtext">{{ block.subtext }}&nbsp;</small>
		<p class="price">
			<span class="value">{{ block.price }}</span>
			<br />
			<span class="term">{{ block.term }}&nbsp;</span>
			<span v-tooltip="block.term_tooltip" class="info">
				<BaseIcon v-if="block.term_tooltip" size="small" name="info" />
			</span>
		</p>
		<p v-if="block.description" class="description" :class="[block.highlight ? 'text-highlight' : '']">
			{{ block.description }}
		</p>
		<BlockButton v-if="block.cta" :uuid="block.cta" class="cta" size="large" block />
		<BaseDivider class="divider" />
		<ul v-if="block.points" class="points">
			<li v-for="{ content } in block.points" :key="content">
				<BaseIcon name="check" class="check" size="small" />
				{{ content }}
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
.block-tier {
	container-type: inline-size;
	inline-size: 100%;
	block-size: auto;
	padding: var(--space-8) var(--space-6);
	border-radius: var(--rounded-2xl);
	background: var(--gray-100);
}

.highlight {
	border: var(--primary) solid 1px;
	background: var(--primary-50);
}

.text-highlight {
	color: var(--primary-300) !important;
}

.price {
	margin-block-start: var(--space-2);
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
	font-size: var(--font-size-xl);
	line-height: var(--line-height-xl);
	font-weight: 600;
}

.term {
	color: var(--gray-500);
	font-size: var(--font-size-sm);
}

.description {
	color: var(--gray-500);
	font-size: var(--font-size-sm);
	margin-block-start: var(--space-2);
	text-wrap: balance;

	@media (width > 50rem) {
		min-height: var(--space-20);
	}
}

.cta {
	margin-block-start: var(--space-5);
}

.divider {
	margin-block: var(--space-5);
}

.badge {
	position: absolute;
	left: 0;
	top: calc(-1 * var(--space-4));
	width: 100%;
	display: flex;
	justify-content: center;
	> * {
		padding: var(--space-2) var(--space-3);
	}
}

.points {
	list-style: none;
	padding: 0;
	margin: 0;
	color: var(--gray-500);
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
