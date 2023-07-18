<template>
	<Story title="Base / Heading / Dynamic" auto-props-disabled>
		<template #controls>
			<HstSelect
				v-model="state.size"
				title="Size"
				:options="{
					small: 'Small',
					medium: 'Medium',
					large: 'Large',
					title: 'Title',
				}"
			/>

			<HstSelect
				v-model="state.align"
				title="Align"
				:options="{
					start: 'Start',
					center: 'Center',
					end: 'Right',
				}"
			/>

			<HstText v-model="state.icon" title="Icon" />
		</template>

		<BaseHeading :size="state.size" :icon="state.icon" :align="state.align">
			The quick brown fox jumps over the lazy dog
		</BaseHeading>
	</Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import BaseHeading from './base-heading.vue';

const state = reactive({
	size: 'large',
	tag: 'h2',
	icon: undefined,
	align: 'start',
});
</script>
