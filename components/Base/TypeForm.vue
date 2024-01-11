<script setup lang="ts">
export interface BaseHsFormProps {
	formId: string;
	labels?: boolean;
	inline?: boolean;
	align?: 'left' | 'center';
	routeToMeetingLinkOnSuccess?: boolean;
}

const props = withDefaults(defineProps<BaseHsFormProps>(), {
	labels: true,
	inline: false,
	align: 'center',
});

const { formId } = toRefs(props);

const { $directus, $readSingleton } = useNuxtApp();

const renderTypeForm = () => {
	// @ts-ignore -- Typeform is not typed
	window.tf?.createWidget(unref(formId), {});
};

useHead({
	script: [
		{
			src: 'https://embed.typeform.com/next/embed.js',
			// defer: true,
			onload: renderTypeForm,
		},
	],
});

const generatedId = computed(() => `typeform-${unref(formId)}`);

const { theme } = useTheme();

onMounted(renderTypeForm);

watch(formId, renderTypeForm);
</script>

<template>
	<div>
		<div :id="generatedId" :data-tf-widget="formId" :data-tf-height="550" />
	</div>
</template>

<style scoped lang="scss"></style>
