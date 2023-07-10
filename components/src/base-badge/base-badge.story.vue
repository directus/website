<script setup lang="ts">
import { reactive } from 'vue';
import BaseBadge from './base-badge.vue';

const state = reactive({
	size: 'medium',
	label: 'Badge',
	color: 'primary',
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
			<HstSelect
				v-model="state.color"
				title="Color"
				:options="{
					primary: 'Primary',
					gray: 'Gray',
				}"
			/>
			<HstText v-model="state.label" title="Icon" />
			<HstToggle v-model="state.caps" title="Caps" />
			<HstToggle v-model="state.border" title="Border" />
		</template>

		<BaseBadge :size="state.size" :color="state.color" :label="state.label" :caps="state.caps" :border="state.border" />
	</Story>
</template>
