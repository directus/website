<script setup lang="ts">
import type { BaseButtonProps } from '../Base/Button.vue';

export interface CardGrayProps {
	title?: string;
	description?: string;
	image?: string;
	button?: Pick<BaseButtonProps, 'label' | 'href' | 'variant'>;
}

const props = defineProps<CardGrayProps>();

const fileUrl = computed(() => getFileUrl(props.image));
</script>

<template>
	<div class="gray-card">
		<div class="gray-card-header">
			<img :src="fileUrl" :alt="title" height="50" />

			<div>
				<BaseHeading size="medium">{{ title }}</BaseHeading>
				<BaseText>{{ description }}</BaseText>
			</div>
		</div>

		<div v-if="button">
			<BaseButton :href="button.href" :variant="button.variant">
				{{ button.label }}
			</BaseButton>
		</div>
	</div>
</template>

<style scoped>
.gray-card {
	display: flex;
	justify-content: space-between;
	height: 100%;
	flex-direction: column;
	align-items: flex-start;
	padding: var(--space-16) var(--space-8);
	border-radius: var(--rounded-2xl);
	border: 1px solid var(--gray-300);

	background-color: var(--gray-100);
}

.gray-card > * + * {
	margin-top: var(--space-8);
}

.gray-card .gray-card-header > * + * {
	margin-top: var(--space-8);
}
</style>
