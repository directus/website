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
					items: [
						'id',
						{
							block_quote_id: ['company_logo', 'person_image', 'person_name', 'person_title', 'quote'],
						},
					],
				},
			],
		})
	)
);

const activeQuote = ref(0);
const direction = ref('next');

watch(activeQuote, (newActive, oldActive) => {
	direction.value = newActive > oldActive ? 'next' : 'prev';
});

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
	<BasePanel v-if="comp" class="testimonial-slider" @pointerenter="stop" @pointerleave="loop">
		<template #header>
			<div class="logos">
				<TransitionGroup :name="direction">
					<template v-for="(item, index) in comp.items">
						<BaseDirectusImage
							v-if="item.block_quote_id.company_logo"
							v-show="activeQuote === index"
							:key="item.id"
							class="company-logo"
							height="25"
							:uuid="item.block_quote_id.company_logo"
							alt=""
						/>

						<div v-else v-show="activeQuote === index" :key="`${item.id}-no-logo`" class="company-logo" />
					</template>
				</TransitionGroup>
			</div>
		</template>

		<div class="slides">
			<TransitionGroup :name="direction">
				<BaseQuote
					v-for="(item, index) in comp.items"
					v-show="activeQuote === index"
					:key="item.id"
					class="slide"
					:quote="item.block_quote_id.quote"
					:person-image="item.block_quote_id.person_image ?? undefined"
					:person-name="item.block_quote_id.person_name ?? undefined"
					:person-title="item.block_quote_id.person_title ?? undefined"
				/>
			</TransitionGroup>
		</div>

		<template #footer>
			<div class="buttons">
				<button
					v-for="(item, index) in comp.items"
					:key="item.id"
					:class="{ active: activeQuote === index }"
					@click="activeQuote = index"
				>
					{{ index }}
				</button>
			</div>
		</template>
	</BasePanel>
</template>

<style lang="scss" scoped>
.testimonial-slider {
	height: var(--space-96);
}

.slides {
	position: relative;
	height: var(--space-48);
	display: flex;
	flex-direction: column;
	justify-content: center;

	.slide {
		width: 100%;
	}
}

.logos {
	position: relative;
	height: var(--space-6);
}

.company-logo {
	height: 100%;
}

.title {
	color: var(--gray-400);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
}

.person {
	display: flex;
	gap: var(--space-2);

	.avatar {
		border-radius: var(--rounded-full);
		inline-size: var(--space-11);
		block-size: var(--space-11);
	}
}

.buttons {
	display: flex;
	gap: var(--space-3);

	button {
		width: var(--space-2);
		height: var(--space-2);
		border-radius: var(--rounded-full);
		background-color: var(--gray-200);
		font-size: 0;
		cursor: pointer;
		transition: width var(--duration-300) var(--ease-out);
		transition-property: width, background-color;

		&:not(.active):hover {
			background-color: var(--gray-500);
			transition-property: width;
		}

		&.active {
			background-color: var(--black);
			width: var(--space-4);
		}
	}
}

.next-enter-active,
.next-leave-active,
.prev-enter-active,
.prev-leave-active {
	transition: all var(--duration-500) var(--ease-out);
}

.next-enter-from,
.prev-leave-to {
	opacity: 0;
	transform: translateX(var(--space-8));
}

.next-leave-to,
.prev-enter-from {
	opacity: 0;
	transform: translateX(calc(-1 * var(--space-8)));
}

.next-leave-active,
.prev-leave-active {
	position: absolute;
	top: 0;
	left: 0;
}
</style>
