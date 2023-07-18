<template>
	<component :is="tag" class="base-heading" :class="size">
		<BaseIcon v-if="icon && size !== 'title'" :name="icon" :size="iconSize" :weight="700" />
		<slot />
	</component>
</template>

<script setup lang="ts">
import { computed, toRefs, unref } from 'vue';
import BaseIcon from '../base-icon/base-icon.vue';

export interface BaseHeadingProps {
	size?: 'title' | 'large' | 'medium' | 'small';
	tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'strong';
	icon?: string;
	align?: 'start' | 'center' | 'end';
}

const props = withDefaults(defineProps<BaseHeadingProps>(), {
	size: 'large',
	tag: 'h2',
	align: 'start',
});

const { tag, size } = toRefs(props);

const iconSize = computed(() => {
	return unref(size);
});
</script>

<style scoped>
.base-heading {
	font-family: var(--family-display);
	color: currentColor;
	font-weight: 600;
	margin: 0;
	text-align: v-bind(align);
}

.base-icon {
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
	font-size: 14px;
	line-height: 26px;
	text-transform: uppercase;
}

.small .base-icon {
	vertical-align: -2px;
	margin-right: 2px;
}
</style>
