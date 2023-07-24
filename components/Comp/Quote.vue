<script setup lang="ts">
import { readItem } from '@directus/sdk';
import type { CompProps } from './types';

const { $directus } = useNuxtApp();

const props = defineProps<CompProps>();

const { data: comp } = useAsyncData(() =>
	$directus.request(
		readItem('comp_quote', props.uuid, {
			fields: ['company_logo', 'person_image', 'person_name', 'person_title', 'quote'],
		})
	)
);
</script>

<template>
	<div v-if="comp" class="comp-quote">
		<img class="company-logo" height="25" :src="getFileUrl(comp.company_logo)" />
		<BaseText :content="comp.quote" />
		<div class="avatar">
			<img width="64" height="64" :src="getFileUrl(comp.person_image)" />
			<div>
				<p>{{ comp.person_name }}</p>
				<p>{{ comp.person_title }}</p>
			</div>
		</div>
	</div>
</template>

<style>
.comp-quote {
	display: flex;
	flex-direction: column;
	align-items: start;
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
