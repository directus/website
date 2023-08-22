<script lang="ts" setup>
export interface BasePaginationProps {
	perPage: number;
	total: number;
}

const props = defineProps<BasePaginationProps>();

const { perPage, total } = toRefs(props);

const active = defineModel<number>({ default: 1 });

const pages = computed(() => Math.ceil(unref(total) / unref(perPage)));

const range = computed(() => {
	const current = unref(active);

	if (current === 1) return [1, 2, 3, 4, 5];
	if (current === 2) return [2, 3, 4, 5];

	if (current === unref(pages) - 1) return [current - 3, current - 2, current - 1, current, current + 1];
	if (current === unref(pages)) return [current - 4, current - 3, current - 2, current - 1, current];

	return [current - 2, current - 1, current, current + 1, current + 2];
});
</script>

<template>
	<div class="base-pagination">
		<button @click="active = active - 1">Prev</button>
		<button v-if="range.at(0) !== 1" @click="active = 1">1</button>
		<span v-if="range.at(0) !== 1 && range.at(0) !== 2">...</span>
		<button v-for="index in range" :key="index" :class="{ active: active === index }" @click="active = index">
			{{ index }}
		</button>
		<span v-if="range.at(-1) !== pages">...</span>
		<button v-if="range.at(-1) !== pages" @click="active = pages">{{ pages }}</button>
		<button @click="active = active + 1">Next</button>
	</div>
</template>

<style scoped lang="scss">
.base-pagination {
	display: flex;
	gap: var(--space-2);

	button {
		border: 1px solid var(--gray-200);
		border-radius: var(--rounded-lg);
		cursor: pointer;
		transition: border-color var(--duration-150) var(--ease-out);
		display: flex;
		align-items: center;
		justify-content: center;

		&:not(:first-child, :last-child) {
			inline-size: var(--space-11);
			block-size: var(--space-11);
		}

		&:first-child,
		&:last-child {
			padding-inline: var(--space-4);
		}

		&:not(.active):hover {
			border-color: var(--black);
			transition: none;
		}

		&.active {
			background-color: var(--purple-400);
			color: var(--white);
		}
	}

	span {
		inline-size: var(--space-11);
		block-size: var(--space-11);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
		font-weight: 600;
	}
}
</style>
