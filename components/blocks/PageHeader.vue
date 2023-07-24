<script setup lang="ts">
import { BlockPageheader } from '~/types';

defineProps<{
	data: BlockPageheader;
}>();
</script>

<template>
	<div class="page-header">
		<BaseBadge v-if="data.preheading" caps size="large" :label="data.preheading" />
		<BaseHeading v-if="data.heading" :align="data.alignment" :content="data.heading" />
		<BaseText v-if="data.subheading" :align="data.alignment" :content="data.subheading" />
		<BaseButtonGroup v-if="data.button_group" class="buttons">
			<!-- TODO: Routing for internal pages or external links -->
			<BaseButton
				v-for="(button, idx) in data.button_group?.buttons"
				:key="idx"
				:href="button.href"
				:variant="button.variant"
				:color="button.color"
				:pulse="button.pulse"
			>
				{{ button.label }}
			</BaseButton>
		</BaseButtonGroup>
	</div>
</template>

<style scoped>
.page-header {
	> * + * {
		margin-top: var(--space-4);
	}
}

.buttons {
	width: 100%;
	margin-left: auto;
	margin-right: auto;
	display: flex;
	justify-content: center;
}
</style>
