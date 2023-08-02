<script setup lang="ts">
import type { CompProps } from './types';

const props = defineProps<CompProps>();

const { $directus, $readItem } = useNuxtApp();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('comp_heading', props.uuid, {
			fields: ['heading', 'preheading', 'subheading'],
		})
	)
);
</script>

<template>
	<<<<<<< Updated upstream
	<div class="comp-heading-container">
		<BaseBadge v-if="comp?.preheading" class="badge" caps border>{{ comp.preheading }}</BaseBadge>
		<BaseHeading v-if="comp?.heading" class="heading" :content="comp.heading" />
		<BaseText v-if="comp?.subheading" class="subheading" :content="comp.subheading" />
	</div>
	=======
	<div>
		<BaseBadge v-if="comp?.preheading" caps>{{ comp.preheading }}</BaseBadge>
	</div>
	<BaseHeading v-if="comp?.heading" :content="comp.heading" tag="h3" />
	<BaseText v-if="comp?.subheading" :content="comp.subheading" />
	>>>>>>> Stashed changes
</template>

<style lang="scss" scoped>
.comp-heading-container {
	container-type: inline-size;
}

.badge + .heading {
	margin-block-start: var(--space-4);

	@container (width > 35rem) {
		margin-block-start: var(--space-7);
	}
}

.heading + .subheading {
	margin-block-start: var(--space-4);

	@container (width > 35rem) {
		margin-block-start: var(--space-7);
	}
}
</style>
