<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_showcase', props.uuid, {
			fields: [
				{
					items: ['id', 'heading', 'icon', 'subheading', { blocks: ['id', 'collection', 'item'] }],
				},
			],
		})
	)
);

const sections = computed(() => unref(block)?.items?.length ?? 0);

const {
	active: activeShowcase,
	progress,
	loop,
	stop,
	playing,
} = useSlider({ duration: 10000, length: unref(block)?.items?.length ?? 0 });

loop();
</script>

<template>
	<div v-if="block?.items" class="block-showcase" @pointerenter="stop" @pointerleave="loop">
		<template v-for="(item, index) in block.items ?? []" :key="item.id">
			<button :class="{ active: activeShowcase === index, paused: !playing }" @click="activeShowcase = index">
				<div class="timer-bar">
					<span />
				</div>
				<BaseHeading
					v-if="item.heading"
					font="body"
					size="medium"
					:icon="item.icon ?? undefined"
					:content="item.heading"
				/>
				<BaseText v-if="item.subheading" align="start" :content="item.subheading" />
			</button>

			<BaseBlock
				v-for="nested in item.blocks"
				:key="nested.id"
				:type="nested.collection"
				:uuid="nested.item"
				:class="{ active: activeShowcase === index }"
				class="block"
			/>
		</template>
	</div>
</template>

<style scoped lang="scss">
.block-showcase {
	@container (width > 50rem) {
		display: grid;
		grid-template-columns: repeat(v-bind(sections), 1fr);
		gap: var(--space-8);
	}
}

.block {
	@container (width > 50rem) {
		display: none;
		grid-column: 1 / span v-bind(sections);

		&.active {
			display: block;
		}
	}

	& + .block {
		margin-block-start: var(--space-4);

		@container (width > 35rem) {
			margin-block-start: var(--space-8);
		}
	}
}

button {
	display: block;
	inline-size: 100%;
	margin-block-end: var(--space-8);
	cursor: pointer;

	.block + & {
		margin-block-start: var(--space-8);
	}

	.timer-bar {
		background-color: var(--gray-200);
		block-size: var(--space-05);
		margin-block-end: var(--space-4);

		span {
			display: block;
			opacity: 0;
			background-color: var(--primary);
			inline-size: 100%;
			block-size: 100%;
			scale: 0 1;
			transform-origin: 0%;
			transition: scale 1s linear;
		}
	}

	&:hover {
		.timer-bar {
			background-color: var(--gray-300);
		}
	}

	&.active .timer-bar span {
		opacity: 1;
		scale: calc(v-bind(progress) / 100 + 0.1) 1;
	}

	&.paused.active .timer-bar {
		background-color: var(--foreground);
		transition: background-color var(--duration-150) var(--ease-in);

		span {
			opacity: 0;
		}
	}

	@container (width > 50rem) {
		order: 2;
		margin-block-end: 0;

		.block + & {
			margin-block-start: 0;
		}
	}
}
</style>
