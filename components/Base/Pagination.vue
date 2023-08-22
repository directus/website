<script lang="ts" setup>
export interface BasePaginationProps {
	perPage: number;
	total: number;
}

const props = defineProps<BasePaginationProps>();

const { perPage, total } = toRefs(props);

const active = defineModel<number>({ default: 0 });

const pages = computed(() => Math.ceil(unref(total) / unref(perPage)));
</script>

<template>
	<div class="base-pagination">
		<button @click="active = active - 1">Prev</button>
		<button v-for="index in pages" :key="index" :class="{ active: active === index }" @click="active = index">
			{{ index }}
		</button>
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
}
</style>
