<script setup lang="ts">
import { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_testimonial_slider', props.uuid, {
			fields: [
				'id',
				{
					items: ['id', 'block_quote_id'],
				},
			],
		})
	)
);

const activeQuote = ref(0);

let timeout: NodeJS.Timeout | null = null;

const next = () => {
	const items = unref(comp)?.items;
	if (!items) return;
	activeQuote.value = (unref(activeQuote) + 1) % items.length;
};

const loop = () => {
	timeout = setTimeout(() => {
		next();
		loop();
	}, 20000);
};

const stop = () => {
	if (timeout) clearTimeout(timeout);
};

loop();
</script>

<template>
	<div v-if="comp" class="testimonial-slider" @pointerenter="stop" @pointerleave="loop">
		<TransitionGroup name="slide" class="slides" tag="div">
			<BlockQuote
				v-for="(item, index) in comp.items"
				v-show="activeQuote === index"
				:key="item.id"
				:uuid="item.block_quote_id"
			/>
		</TransitionGroup>

		<button v-for="(item, index) in comp.items" :key="item.id" @click="activeQuote = index">{{ index }}</button>
	</div>
</template>

<style lang="scss" scoped>
.slides {
	position: relative;

	:deep(> *) {
		height: var(--space-96);
		width: 100%;
		inset-block-start: 0;
		inset-inline-start: 0;
	}
}

.slide-enter-active,
.slide-leave-active {
	transition: all 0.5s ease;
}

.slide-enter-from {
	opacity: 0;
	transform: translateX(30px);
}

.slide-leave-to {
	opacity: 0;
	transform: translateX(-30px);
}

.slide-leave-active {
	position: absolute;
}
</style>
