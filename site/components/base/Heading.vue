<script setup lang="ts">
import { computed, toRefs, unref } from 'vue';
// import BaseIcon from '../base-icon/base-icon.vue';

export interface BaseHeadingProps {
	size?: 'title' | 'large' | 'medium' | 'small';
	tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'strong';
	icon?: string;
	align?: 'start' | 'center' | 'end';
	content: string;
	font?: 'display' | 'body';
}

const props = withDefaults(defineProps<BaseHeadingProps>(), {
	font: 'display',
	size: 'large',
	tag: 'h2',
	align: 'start',
});

const { tag, size } = toRefs(props);

const iconSize = computed(() => {
	return unref(size);
});
</script>

<template>
	<component
		:is="tag"
		:class="[
			'base-heading',
			size,
			{
				display: font === 'display',
				body: font === 'body',
			},
		]"
	>
		<BaseIcon v-if="icon && size !== 'title'" :name="icon" :size="iconSize" :weight="700" />
		<span v-html="content"></span>
	</component>
</template>

<style scoped>
.display {
	font-family: var(--family-display);
}

.body {
	font-family: var(--family-body);
}
.base-heading {
	color: currentColor;
	font-weight: 700;
	margin: 0;
	text-align: v-bind(align);
}

.base-heading :deep(em) {
	font-style: normal;
	background: linear-gradient(88deg, #745eff 0%, #fe97dc 100%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.base-heading .base-icon {
	vertical-align: middle;
}

.title {
	font-size: 96px;
	line-height: 96px;
}

.large {
	font-size: 40px;
	line-height: 48px;
}

.medium {
	font-size: 24px;
	line-height: 32px;
}

.medium .base-icon {
	vertical-align: -4px;
	margin-right: 4px;
}

.small {
	font-size: 15px;
	line-height: 26px;
}

.small .base-icon {
	vertical-align: -2px;
	margin-right: 2px;
}
</style>
