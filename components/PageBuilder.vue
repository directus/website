<script setup lang="ts">
import { Page } from '~~/types';

// Map the page builder collection names to the components
// https://nuxt.com/docs/guide/directory-structure/components#dynamic-components
const map = {
	block_name: resolveComponent('BlockComponentName'),
};

defineProps<{
	page: Page;
}>();
</script>

<template>
	<div id="content" class="mx-auto">
		<template v-for="(block, blockIdx) in page.blocks" :key="blockIdx">
			<component :is="map[block.collection]" :data="block.item" />
		</template>
	</div>
</template>
