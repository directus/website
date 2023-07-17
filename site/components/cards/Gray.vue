<script setup lang="ts">
import { CompButton } from '~/types';
export interface GrayCardProps {
	title?: string;
	description?: string;
	image?: string;

	button?: CompButton;
}

defineProps<GrayCardProps>();

const { fileUrl } = useFiles();
</script>

<template>
	<div class="gray-card">
		<div class="gray-card-header">
			<img :src="fileUrl(image)" :alt="title" height="50" />
			<div>
				<BaseHeading size="medium" :content="title" />
				<BaseText :content="description" />
			</div>
		</div>

		<div v-if="button" class="">
			<BaseButton :href="button.href" :variant="button.variant" :color="button.color" :pulse="button.pulse">
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
	align-items: start;
	padding: var(--space-16) var(--space-8);
	border-radius: var(--rounded-2xl);
	border: 1px solid var(--gray-300);

	background-color: var(--gray-100);

	> * + * {
		margin-top: var(--space-8);
	}

	.gray-card-header {
		> * + * {
			margin-top: var(--space-8);
		}
	}
}
</style>
