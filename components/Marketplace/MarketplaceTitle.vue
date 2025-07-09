<script setup lang="ts">
import type { MarketplaceExtension } from '~/types/marketplace';

defineProps<{
	extension: MarketplaceExtension;
}>();
</script>

<template>
	<div class="extension-title">
		<BaseHeading v-if="extension?.name" class="heading" tag="h1" size="large" :content="extension?.name" />
		<BaseText
			v-if="extension?.description"
			size="small"
			type="subtext"
			:content="extension?.description"
			class="mt-4"
		/>
	</div>
</template>

<style scoped>
.extension-title {
	> * + * {
		margin-block-start: var(--space-4);
	}
}
</style>
