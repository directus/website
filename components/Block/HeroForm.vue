<script setup lang="ts">
import { BlockHeroForm } from '~/types';

defineProps<{
	data: BlockHeroForm;
}>();
</script>

<template>
	<div class="flex">
		<div>
			<BaseHeading size="title" :content="data.heading" />
			<BaseText :content="data.subheading" />
		</div>
		<div>
			{{ data.form }}
		</div>
	</div>
</template>

<style scoped>
@media (min-width: 768px) {
	.flex {
		display: flex;
	}
}
</style>
