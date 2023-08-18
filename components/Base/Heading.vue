<script setup lang="ts">
export interface BaseHeadingProps {
	content: string;
	size?: 'title' | 'large' | 'medium' | 'small';
	tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'strong' | 'p';
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
	<div class="base-heading-container">
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
			<span class="content" v-html="content" />
		</component>
	</div>
</template>

<style lang="scss" scoped>
.base-heading-container {
	container-type: inline-size;
}

.content {
	:deep(> *) {
		margin: 0;
	}
}

.display {
	font-family: var(--family-display);
}

.body {
	font-family: var(--family-body);
}

.base-heading {
	color: var(--black);
	font-weight: 600;
	margin: 0;
	text-align: v-bind(align);
}

.base-heading :deep(em) {
	font-style: normal;
	background: linear-gradient(143deg, var(--purple-500) 0%, var(--pink-200) 100%);
	background: linear-gradient(88deg, var(--purple-300) 0%, var(--pink-200) 100%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	position: relative;
	z-index: 1;
}

.base-heading .base-icon {
	vertical-align: middle;
}

.small {
	font-size: var(--font-size-base);
	line-height: var(--line-height-base);

	.base-icon {
		vertical-align: -2px;
		margin-right: var(--space-05);
	}
}

.medium {
	font-size: var(--font-size-lg);
	line-height: var(--line-height-lg);

	@container (width > 20rem) {
		font-size: var(--font-size-xl);
		line-height: var(--line-height-xl);
	}

	@container (width > 30rem) {
		font-size: var(--font-size-2xl);
		line-height: var(--line-height-2xl);
	}

	.base-icon {
		vertical-align: -4px;
		margin-right: var(--space-1);
	}
}

.large {
	font-size: var(--font-size-3xl);
	line-height: var(--line-height-3xl);
	font-weight: 700;

	@container (width > 25rem) {
		font-size: var(--font-size-4xl);
		line-height: var(--line-height-4xl);
	}
}

.title {
	font-size: clamp(var(--font-size-4xl), 10cqi, var(--font-size-8xl));
	line-height: 1;
	font-weight: 700;
	background: linear-gradient(180deg, var(--black) 0%, var(--gray-500) 100%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;

	/* Offset required for text clip background to render behind full text */
	padding-block-end: var(--space-3);
	margin-block-end: calc(-1 * var(--space-3));
}
</style>
