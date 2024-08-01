<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_quote', props.uuid, {
			fields: ['company_logo', 'person_image', 'person_name', 'person_title', 'quote', 'button'],
		}),
	),
);
</script>

<template>
	<BasePanel v-if="block && block.quote">
		<template #header>
			<BaseDirectusImage
				v-if="block.company_logo"
				class="company-logo"
				:height="40"
				:uuid="block.company_logo as string"
				alt=""
			/>
		</template>

		<BaseQuote
			:quote="block.quote"
			:person-image="(block.person_image as string) ?? undefined"
			:person-name="block.person_name ?? undefined"
			:person-title="block.person_title ?? undefined"
		/>

		<template #footer>
			<BlockButton v-if="block.button" :uuid="block.button?.toString()" />
		</template>
	</BasePanel>
</template>

<style scoped lang="scss">
.company-logo {
	height: var(--space-11); // match byline size
	width: auto;
	max-width: var(--space-36);
}
</style>
