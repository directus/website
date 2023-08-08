<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_quote', props.uuid, {
			fields: ['company_logo', 'person_image', 'person_name', 'person_title', 'quote'],
		})
	)
);
</script>

<template>
	<BasePanel v-if="comp && comp.quote">
		<template #header>
			<BaseDirectusImage v-if="comp.company_logo" class="company-logo" height="25" :uuid="comp.company_logo" alt="" />
		</template>

		<BaseQuote
			:quote="comp.quote"
			:person-image="comp.person_image ?? undefined"
			:person-name="comp.person_name ?? undefined"
			:person-title="comp.person_title ?? undefined"
		/>
	</BasePanel>
</template>
