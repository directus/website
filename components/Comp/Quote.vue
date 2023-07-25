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
	<div v-if="comp" class="comp-quote">
		<img class="company-logo" height="25" :src="getFileUrl(comp.company_logo)" />
		<BaseText v-if="comp.quote" :content="comp.quote" />
		<div class="avatar">
			<img width="64" height="64" :src="getFileUrl(comp.person_image)" />
			<div>
				<p>{{ comp.person_name }}</p>
				<p>{{ comp.person_title }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.comp-quote {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: var(--space-4) var(--space-8);
	background: var(--gray-100);
	border-radius: var(--rounded-lg);
}

.comp-quote > * + * {
	margin-top: var(--space-4);
}

.avatar {
	display: flex;
	align-items: center;
}

.avatar > * + * {
	margin-left: var(--space-4);
}
</style>
