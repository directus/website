<script lang="ts" setup>
export interface BasePaginationProps {
	perPage: number;
	total: number;
	disabled?: boolean;
}

const props = defineProps<BasePaginationProps>();

const { perPage, total } = toRefs(props);

const active = defineModel<number>({ default: 1 });

const pages = computed(() => Math.ceil(unref(total) / unref(perPage)));

const range = computed(() => {
	const current = unref(active);
	let range;

	if (current === 1) range = [1, 2, 3, 4, 5];
	if (current === 2) range = [2, 3, 4, 5];

	if (current === unref(pages) - 1) range = [current - 3, current - 2, current - 1, current, current + 1];
	if (current === unref(pages)) range = [current - 4, current - 3, current - 2, current - 1, current];

	range = [current - 2, current - 1, current, current + 1, current + 2];

	return range.filter((index) => index > 0 && index <= unref(pages));
});
</script>

<template>
	<div class="base-pagination">
		<button :disabled="disabled || active === 1" @click="active = active - 1">
			Prev
		</button>
		<button v-if="range.at(0) !== 1" :disabled="disabled" @click="active = 1">
			1
		</button>
		<span v-if="range.at(0) !== 1 && range.at(0) !== 2 && pages > 5">...</span>
		<button
			v-for="index in range"
			:key="index"
			:disabled="disabled"
			:class="{ active: active === index }"
			@click="active = index"
		>
			{{ index }}
		</button>
		<span v-if="range.at(-1) !== pages && pages > 5">...</span>
		<button v-if="range.at(-1) !== pages" :disabled="disabled" @click="active = pages">
			{{ pages }}
		</button>
		<button :disabled="disabled || active === pages" @click="active = active + 1">
			Next
		</button>
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

		&:not(:is(.active, :disabled)):hover {
			border-color: var(--foreground);
			transition: none;
		}

		&:disabled {
			color: var(--gray-400);
			cursor: not-allowed;
		}

		&.active {
			background-color: var(--primary);
			color: var(--background);
			border-color: var(--primary);
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
