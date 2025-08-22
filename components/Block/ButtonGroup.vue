<script setup lang="ts">
import type { BlockProps } from './types';
import usePostHogFeatureFlag from '../../modules/posthog/runtime/composables/usePostHogFeatureFlag';
import type { ButtonGroupWithExperiment } from '~/types/schema';

const { $directus, $readItem } = useNuxtApp();
const { getFeatureFlag } = usePostHogFeatureFlag();

const props = defineProps<BlockProps>();

const { data: block } = (await useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_button_group', props.uuid, {
			fields: [
				'alignment',
				'style',
				'experiment_enabled',
				{
					experiment: ['id', 'feature_flag'],
					experiment_variant: ['id', 'key', 'experiment'],
				},
				{
					buttons: ['id', 'block_button_id'],
				},
				{
					variants: [
						'id',
						'alignment',
						'style',
						{
							buttons: ['id', 'block_button_id'],
							experiment_variant: ['id', 'key'],
						},
					],
				},
			],
		}),
	),
)) as { data: Ref<ButtonGroupWithExperiment | null> };

const activeButtonGroup = computed(() => {
	const blockData = block.value;

	if (!blockData?.experiment_enabled || !blockData.experiment || !blockData.experiment_variant) {
		return blockData;
	}

	const featureFlag = getFeatureFlag(blockData.experiment.feature_flag);

	if (!featureFlag.value) {
		return blockData;
	}

	if (featureFlag.value && typeof featureFlag.value === 'string') {
		if (blockData.experiment_variant.key === featureFlag.value) {
			return blockData;
		}

		if (blockData.variants?.length) {
			for (const variant of blockData.variants) {
				if (variant.experiment_variant?.key === featureFlag.value) {
					return variant;
				}
			}
		}
	}

	return blockData;
});
</script>

<template>
	<BaseButtonGroup
		v-if="activeButtonGroup"
		:align="activeButtonGroup.alignment ?? undefined"
		:container-style="activeButtonGroup.style"
	>
		<BlockButton
			v-for="buttonItem in activeButtonGroup.buttons"
			:key="typeof buttonItem === 'string' || typeof buttonItem === 'number' ? String(buttonItem) : buttonItem.id"
			:uuid="
				typeof buttonItem === 'string' || typeof buttonItem === 'number'
					? String(buttonItem)
					: (buttonItem.block_button_id as string)
			"
		/>
	</BaseButtonGroup>
</template>
