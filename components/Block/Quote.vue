<script setup lang="ts">
import type { BlockProps } from './types';
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<BlockProps>();

const { data: block, refresh } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_quote', props.uuid, {
			fields: ['id', 'company_logo', 'person_image', 'person_name', 'person_title', 'quote', 'button'],
		}),
	),
);

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<BasePanel v-if="block && block.quote" :data-block-id="props.uuid">
		<template #header>
			<BaseDirectusImage
				v-if="block.company_logo"
				class="company-logo"
				:height="40"
				:uuid="block.company_logo as string"
				alt=""
				:data-directus="
					isVisualEditingEnabled
						? setAttr({
								collection: 'block_quote',
								item: block.id,
								fields: 'company_logo',
								mode: 'modal',
							})
						: undefined
				"
			/>
		</template>

		<BaseQuote
			:quote="block.quote"
			:person-image="(block.person_image as string) ?? undefined"
			:person-name="block.person_name ?? undefined"
			:person-title="block.person_title ?? undefined"
			:data-directus="
				isVisualEditingEnabled
					? setAttr({
							collection: 'block_quote',
							item: block.id,
							fields: ['quote', 'person_image', 'person_name', 'person_title'],
							mode: 'modal',
						})
					: undefined
			"
		/>

		<template #footer>
			<BlockButton
				v-if="block.button"
				:uuid="block.button?.toString()"
				:data-directus="
					isVisualEditingEnabled
						? setAttr({
								collection: 'block_quote',
								item: block.id,
								fields: 'button',
								mode: 'popover',
							})
						: undefined
				"
			/>
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
