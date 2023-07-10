<script setup lang="ts">
import { reactive } from 'vue';
import BaseBadge from './base-badge.vue';

const state = reactive({
	size: 'medium',
	label: 'Badge',
	caps: false,
	border: false,
});
</script>

<template>
	<Story title="Base / Badge">
		<template #controls>
			<HstSelect
				v-model="state.size"
				title="Size"
				:options="{
					small: 'Small',
					medium: 'Medium',
					large: 'Large',
				}"
			/>
			<HstText v-model="state.label" title="Icon" />
			<HstToggle v-model="state.caps" title="Caps" />
			<HstToggle v-model="state.border" title="Border" />
		</template>

		<BaseBadge :size="state.size" :label="state.label" :caps="state.caps" :border="state.border" />
	</Story>
</template>
