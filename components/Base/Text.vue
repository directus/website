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
	align: 'start',
	size: 'medium',
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
	--font-size: var(--font-size-base);
	--line-height: var(--line-height-base);
	--font-weight: 500;

	font-size: var(--font-size);
	line-height: var(--line-height);
	font-weight: var(--font-weight);

	font-family: var(--family-body);
	max-inline-size: 50rem;

	&.color-foreground {
		color: var(--gray-700);
	}

	&.color-subdued {
		color: var(--gray-400);
	}

	:deep(ul, ol) {
		margin-block: var(--space-5);
	}

	:deep(p + p) {
		margin-block-start: var(--space-5);
	}

	:deep(:is(h1, h2, h3, h4)) {
		color: var(--black);
	}

	:deep(* + :is(h1, h2, h3, h4)) {
		margin-block-start: var(--space-10);
	}

	:deep(:is(h1, h2, h3, h4) + :is(h1, h2, h3, h4, p)) {
		margin-block-start: var(--space-5);
	}

	:deep(a) {
		text-decoration: none;
		color: var(--purple-400);

		&:hover {
			text-decoration: underline;
		}
	}

	:deep(code) {
		max-inline-size: 100%;
		display: inline-block;
		word-wrap: normal;
		white-space: pre-wrap;
		position: relative;
		background-color: var(--gray-100);
		padding-inline: var(--space-1);
		border-radius: var(--rounded);
	}

	:deep(blockquote) {
		color: var(--gray-500);
		border-left: 1px solid var(--gray-300);
		margin-inline: 0;
		padding-inline: var(--space-5);
		padding-block: var(--space-2);
		font-style: italic;
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
		--font-size: var(--font-size-sm);
		--line-height: var(--line-height-sm);
		--font-weight: 400;
	}

	&.size-large {
		@container (width > 35rem) {
			--font-size: var(--font-size-lg);
			--line-height: var(--line-height-lg);
		}
	}
}

.type-subtext {
	font-family: var(--family-display);
	--font-size: var(--font-size-xl);
	--line-height: var(--line-height-2xl);

	&.size-small {
		--font-size: var(--font-size-lg);
		--line-height: var(--line-height-lg);
		--font-weight: 400;
	}
}
</style>
