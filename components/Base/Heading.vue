<script setup lang="ts">
export interface BaseHeadingProps {
	content: string;
	size?: 'title' | 'large' | 'medium' | 'small';
	tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'strong';
	icon?: string;
	align?: 'start' | 'center' | 'end';
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
	const headingSize = unref(size);
	if (headingSize === 'title') return 'large';
	return headingSize;
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

		<!-- eslint-disable-next-line vue/no-v-html -->
		<span v-html="content" />
	</component>
</template>

<style scoped lang="scss">
.display {
	font-family: var(--family-display);
}

.body {
	font-family: var(--family-body);
}

.base-heading {
	color: currentColor;
	font-weight: 700;
	text-align: v-bind(align);
	text-wrap: balance; /* Experimental */
	letter-spacing: -0.02em;
}

.base-heading :deep(em) {
	font-style: normal;
	background: linear-gradient(88deg, var(--purple-300) 0%, var(--pink-200) 100%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.base-heading .base-icon {
	vertical-align: middle;
}

.title {
	font-size: var(--font-size-5xl);
	line-height: var(--line-height-5xl);

	@media (width > 50rem) {
		font-size: var(--font-size-7xl);
		line-height: var(--line-height-7xl);
	}

	@media (width > 75rem) {
		font-size: var(--font-size-8xl);
		line-height: var(--line-height-8xl);
	}
}

.large {
	font-size: var(--font-size-2xl);
	line-height: var(--line-height-2xl);

	@media (width > 50rem) {
		font-size: var(--font-size-4xl);
		line-height: var(--line-height-4xl);
	}

	@media (width > 75rem) {
		font-size: var(--font-size-5xl);
		line-height: var(--line-height-5xl);
	}
}

.medium {
	font-size: var(--font-size-base);
	line-height: var(--line-height-base);

	@media (width > 50rem) {
		font-size: var(--font-size-xl);
		line-height: var(--line-height-xl);
	}

	@media (width > 75rem) {
		font-size: var(--font-size-2xl);
		line-height: var(--line-height-2xl);
	}
}

.medium .base-icon {
	vertical-align: -4px;
	margin-right: var(--space-1);
}

.small {
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);

	@media (width > 50rem) {
		font-size: var(--font-size-base);
		line-height: var(--line-height-base);
	}

	@media (width > 75rem) {
		font-size: var(--font-size-lg);
		line-height: var(--line-height-lg);
	}
}

.small .base-icon {
	vertical-align: -2px;
	margin-right: var(--space-05);
}
</style>
