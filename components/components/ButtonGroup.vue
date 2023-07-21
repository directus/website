<script setup lang="ts">
import { CompButtonGroup } from '~~/types';

defineProps<{
	data: CompButtonGroup;
}>();
</script>

<template>
	<BaseButtonGroup class="buttons">
		<!-- TODO: Routing for internal pages or external links -->
		<BaseButton
			v-for="(button, idx) in data.buttons"
			:key="idx"
			:href="button.href"
			:variant="button.variant"
			:color="button.color"
			:pulse="button.pulse"
		>
			{{ button.label }}
		</BaseButton>
	</BaseButtonGroup>
</template>
