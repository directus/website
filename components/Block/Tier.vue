<script setup lang="ts">
import type { BlockProps } from './types';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<BlockProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_tier', props.uuid, {
			fields: [
				'id',
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
				'tier_type',
				'cards',
			],
		}),
	),
);

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<div
		v-if="block"
		class="block-tier"
		:class="[block.highlight ? 'highlight' : '', block.tier_type === 'full_width' ? 'full-width' : '']"
		:data-block-id="props.uuid"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_tier',
						item: block.id,
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
							'tier_type',
							'cards',
						],
						mode: 'modal',
					})
				: undefined
		"
		dense
	>
		<div v-if="block.badge" class="badge">
			<BaseBadge color="primary-reverse">{{ block.badge }}</BaseBadge>
		</div>
		<div class="content">
			<h3 v-if="block.name">{{ block.name }}</h3>
			<small v-if="block.subtext">{{ block.subtext }}&nbsp;</small>
			<p v-if="block.price || block.term" class="price">
				<span v-if="block.price" class="value">{{ block.price }}</span>
				<br />
				<span v-if="block.term" class="term">{{ block.term }}&nbsp;</span>
				<span v-if="block.term_tooltip" v-tooltip="block.term_tooltip" class="info">
					<BaseIcon size="small" name="info" />
				</span>
			</p>
			<p v-if="block.description" class="description" :class="[block.highlight ? 'text-highlight' : '']">
				{{ block.description }}
			</p>
			<div style="display: flex; margin-block-start: var(--space-2)">
				<BlockButton v-if="block.cta" :uuid="block.cta as string" class="cta" size="large" block />
			</div>
			<template v-if="block.points">
				<BaseDivider v class="divider" />
				<ul class="points">
					<li v-for="{ content } in block.points" :key="content">
						<BaseIcon name="check" class="check" size="small" />
						<div v-html="content" />
					</li>
				</ul>
			</template>
		</div>
		<!-- Card Options -->
		<template v-if="block.tier_type === 'full_width' && block.cards">
			<div
				v-for="(card, cardIdx) in block.cards"
				:key="cardIdx"
				class="card"
				:class="[block.highlight ? 'card-highlight' : '']"
			>
				<div class="">
					<BaseBadge v-if="card.badge">{{ card.badge }}</BaseBadge>
					<BaseHeading :icon="card.icon ?? undefined" :content="card.title ?? ''" size="medium" class="card-title" />
					<BaseText
						v-if="card.description"
						:content="card.description"
						color="foreground"
						size="medium"
						class="card-text"
					/>
				</div>
				<BaseButton
					v-if="card.button_url"
					:href="card.button_url"
					:label="card.button_label ?? 'Learn More'"
					color="primary"
					outline
					icon="arrow_forward"
				/>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.block-tier {
	position: relative;
	// container-type: inline-size;
	// inline-size: 100%;
	// block-size: auto;
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
		min-height: var(--space-16);
	}
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

.content {
	container-type: inline-size;
	inline-size: 100%;

	width: 100%;
	display: flex;
	flex-direction: column;

	@container (width > 64rem) {
		max-width: var(--space-80);
	}
}

.full-width {
	grid-column: 1 / -1;
	display: flex;
	flex-direction: column;
	gap: var(--space-6);

	@container (width > 50rem) {
		flex-direction: row;
		justify-content: space-between;
	}
}

.card {
	position: relative;
	width: 100%;
	border: 1px solid var(--gray-200);
	border-radius: var(--rounded-lg);
	padding: var(--space-6);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.card-highlight {
	border-color: var(--primary-100);
}

.card-title {
	margin-block-start: var(--space-4);
}

:deep(.card-text ul) {
	padding-inline-start: var(--space-4);
}
@media (max-width: 768px) {
	.info {
		display: none;
	}
}
</style>
