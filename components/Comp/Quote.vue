<script setup lang="ts">
import type { CompProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<CompProps>();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('comp_quote', props.uuid, {
			fields: ['company_logo', 'person_image', 'person_name', 'person_title', 'quote'],
		})
	)
);
</script>

<template>
	<BasePanel v-if="comp">
		<template #header>
			<BaseDirectusImage v-if="comp.company_logo" class="company-logo" height="25" :uuid="comp.company_logo" alt="" />
		</template>

		<!-- eslint-disable-next-line vue/no-v-html -->
		<div class="quote" v-html="comp.quote" />

		<div class="person">
			<BaseDirectusImage
				v-if="comp.person_image"
				width="64"
				height="64"
				class="avatar"
				:uuid="comp.person_image"
				:alt="comp.person_name ?? ''"
			/>

			<div>
				<p class="name">{{ comp.person_name }}</p>
				<p class="title">{{ comp.person_title }}</p>
			</div>
		</div>

		<template #footer></template>
	</BasePanel>
</template>

<style lang="scss" scoped>
.quote {
	color: var(--gray-800);
	font-family: var(--family-display);

	font-size: var(--font-size-l);
	line-height: var(--line-height-l);
	margin-block-end: var(--space-4);

	@container (width > 35rem) {
		font-size: var(--font-size-xl);
		line-height: var(--line-height-xl);
		font-weight: 400;
		margin-block-end: var(--space-7);
	}

	@container (width > 50rem) {
		font-size: var(--font-size-3xl);
		line-height: var(--line-height-3xl);
		font-weight: 300;
		margin-block-end: var(--space-10);
	}
}

.title {
	color: var(--gray-400);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
}
</style>
