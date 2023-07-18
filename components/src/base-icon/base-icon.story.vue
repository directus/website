<template>
	<Story title="Base / Icon">
		<template #controls>
			<HstText v-model="state.name" title="Name" />
			<HstSlider v-model="state.weight" :step="100" :min="100" :max="700" title="Weight" />
			<HstSelect
				v-model="state.size"
				title="Size"
				:options="{
					small: 'Small',
					medium: 'Medium',
					large: 'Large',
				}"
			/>
		</template>

		<BaseIcon :name="state.name" :weight="state.weight" :size="state.size" />
	</Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import BaseIcon from './base-icon.vue';

const state = reactive({
	name: 'search',
	weight: 500,
	size: 'medium' as 'small' | 'medium' | 'large',
});
</script>
