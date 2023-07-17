<script setup lang="ts">
import { CompQuote } from '~~/types';

defineProps<{
	data: CompQuote;
}>();

const { fileUrl } = useFiles();
</script>

<template>
	<div class="comp-quote">
		<img class="company-logo" height="25" :src="fileUrl(data.company_logo)" />
		<BaseText :content="data.quote" />
		<div class="avatar">
			<img width="64" height="64" :src="fileUrl(data.person_image)" />
			<div>
				<p>{{ data.person_name }}</p>
				<p>{{ data.person_title }}</p>
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

	> * + * {
		margin-top: var(--space-4);
	}
}

.avatar {
	display: flex;
	align-items: center;

	> * + * {
		margin-left: var(--space-4);
	}
}
</style>
