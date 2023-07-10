<script setup lang="ts">
import { reactive } from 'vue';
import BaseButton from './base-button.vue';

const state = reactive({
	label: 'Button',
	size: 'medium',
	variant: 'solid',
	color: 'primary',
});
</script>

<template>
	<Story title="Base / Button">
		<template #controls>
			<HstText v-model="state.label" title="Label" />
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
				v-model="state.variant"
				title="Variant"
				:options="{
					solid: 'Solid',
					frosted: 'Frosted',
					gradient: 'Gradient',
					ghost: 'Ghost',
					link: 'Link',
				}"
			/>
			<HstSelect
				v-model="state.color"
				title="Color"
				:options="{
					primary: 'Primary',
					white: 'White',
					danger: 'Danger',
					success: 'Success',
				}"
			/>
		</template>

		<BaseButton :label="state.label" :size="state.size" :variant="state.variant" :color="state.color" />
	</Story>
</template>
