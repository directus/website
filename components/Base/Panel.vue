<script setup lang="ts">
import type { BaseButtonProps } from '../Base/Button.vue';

export interface BasePanelProps {
	title?: string;
	description?: string;
	image?: string;
	button?: Pick<BaseButtonProps, 'label' | 'href' | 'variant'>;
}

defineProps<BasePanelProps>();
</script>

<template>
	<div class="base-panel-container">
		<div class="base-panel">
			<div class="base-panel-header">
				<slot name="header" />
			</div>

			<div class="base-panel-content">
				<slot />
			</div>

			<div class="base-panel-footer">
				<slot name="footer" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.base-panel-container {
	container-type: inline-size;
	height: 100%;
	border-radius: var(--rounded-lg);
	background: linear-gradient(172deg, rgba(228, 234, 241, 0.25) 0%, rgba(228, 234, 241, 0) 100%);
	border: 1px solid var(--gray-200);
	backdrop-filter: blur(4px);
}

.base-panel {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: var(--space-7);
	padding: var(--space-7);
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	@container (width > 35rem) {
		gap: var(--space-10);
		padding: var(--space-10);
	}
}
</style>
