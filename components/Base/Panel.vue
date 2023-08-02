<script setup lang="ts">
import type { BaseButtonProps } from '../Base/Button.vue';

export interface CardGrayProps {
	title?: string;
	description?: string;
	image?: string;
	button?: Pick<BaseButtonProps, 'label' | 'href' | 'variant'>;
}

defineProps<CardGrayProps>();
</script>

<template>
	<div class="base-panel">
		<div class="base-panel-header">
			<BaseDirectusImage v-if="image" :uuid="image" :alt="title ?? ''" height="50" />

			<div>
				<BaseHeading v-if="title" size="medium" :content="title" />
				<BaseText v-if="description" :content="description" />
			</div>
		</div>

		<div v-if="button">
			<BaseButton :href="button.href" :variant="button.variant">
				{{ button.label }}
			</BaseButton>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.base-panel {
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

.base-panel > * + * {
	margin-top: var(--space-8);
}

.base-panel .base-panel-header > * + * {
	margin-top: var(--space-8);
}
</style>
