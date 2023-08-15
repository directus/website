<script setup lang="ts">
export interface BaseTextProps {
	/**
	 * The alignment of the text.
	 */
	align?: 'start' | 'center' | 'end';

	size?: 'small' | 'medium' | 'large';

	type?: 'normal' | 'subtext';

	content: string;
}

defineProps<BaseTextProps>();
</script>

<template>
	<div class="base-text-container">
		<!-- eslint-disable-next-line vue/no-v-html -->
		<div class="base-text" :class="[`align-${align}`, `size-${size}`, `type-${type}`]" v-html="content" />
	</div>
</template>

<style lang="scss" scoped>
.base-text-container {
	container-type: inline-size;
}

.base-text {
	font-family: var(--family-body);
	color: var(--gray-400);
	max-inline-size: 50rem;

	:deep(a) {
		color: inherit;
		transition: color var(--duration-150) var(--ease-out);

		&:hover {
			transition: none;
			color: var(--purple-400);
		}
	}

	/* @TODO: Add styling for all base elements */
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

.type-normal {
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

	&.size-large {
		@container (width > 35rem) {
			font-size: var(--font-size-2xl);
			line-height: var(--line-height-2xl);
		}
	}
}
</style>
