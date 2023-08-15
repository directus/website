<script setup lang="ts">
export interface BaseTextProps {
	/**
	 * The alignment of the text.
	 */
	align?: 'start' | 'center' | 'end';

	size?: 'small' | 'medium' | 'large';

	type?: 'default' | 'subtext';

	color?: 'foreground' | 'subdued';

	content: string;
}

withDefaults(defineProps<BaseTextProps>(), {
	type: 'default',
	color: 'subdued',
});
</script>

<template>
	<div class="base-text-container">
		<!-- eslint-disable vue/no-v-html -->
		<div
			class="base-text"
			:class="[`align-${align}`, `size-${size}`, `type-${type}`, `color-${color}`]"
			v-html="content"
		/>
	</div>
</template>

<style lang="scss" scoped>
.base-text-container {
	container-type: inline-size;
}

.base-text {
	font-family: var(--family-body);
	max-inline-size: 50rem;
	font-size: var(--font-size-base);
	line-height: var(--line-height-base);

	&.color-foreground {
		color: var(--black);
	}

	&.color-subdued {
		color: var(--gray-400);
	}

	:deep(a) {
		color: inherit;
		transition: color var(--duration-150) var(--ease-out);

		&:hover {
			transition: none;
			color: var(--black);
		}
	}

	:deep(ul, ol) {
		margin-block: var(--space-5);
	}

	:deep(p + p) {
		margin-block-start: var(--space-5);
	}

	:deep(p + :is(h1, h2, h3, h4)) {
		margin-block-start: var(--space-10);
	}

	:deep(:is(h1, h2, h3, h4) + p) {
		margin-block-start: var(--space-5);
	}
}

.align-start {
	text-align: start;
}

.align-center {
	text-align: center;
}

.align-end {
	text-align: end;
}

.type-default {
	&.size-small {
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
		font-weight: 400;
	}

	&.size-large {
		@container (width > 35rem) {
			font-size: var(--font-size-lg);
			line-height: var(--line-height-lg);
		}
	}
}

.type-subtext {
	font-family: var(--family-display);
	font-size: var(--font-size-xl);
	line-height: var(--line-height-xl);

	&.size-small {
		font-size: var(--font-size-lg);
		line-height: var(--line-height-lg);
		font-weight: 400;
	}
}
</style>
