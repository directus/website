<script setup lang="ts">
export interface BaseTextProps {
	/**
	 * The alignment of the text.
	 */
	align?: 'start' | 'center' | 'end';

	size?: 'x-small' | 'small' | 'medium' | 'large';

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
			v-links
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

	overflow-wrap: break-word;
	word-break: break-word;
	min-width: 0;
	overflow-x: auto;

	&.color-foreground {
		color: var(--gray-700);
	}

	&.color-subdued {
		color: var(--gray-400);
	}

	:deep(a) {
		text-decoration: none;
		color: var(--primary);
		word-break: break-word;
		overflow-wrap: break-word;

		&:hover {
			text-decoration: underline;
		}
	}

	:deep(code) {
		background-color: var(--gray-100);
		padding-inline: var(--space-1);
		border-radius: var(--rounded);
		font-family: var(--family-code);
		font-size: 0.875em;

		white-space: pre-wrap;
		word-break: break-all;
		overflow-wrap: break-word;
		max-width: 100%;
		display: inline;
	}

	/* Handle pre-formatted code blocks */
	:deep(pre) {
		background-color: var(--gray-100);
		padding: var(--space-4);
		border-radius: var(--rounded-lg);
		font-family: var(--family-code);
		font-size: 0.875em;
		overflow-x: auto;
		white-space: pre;
		max-width: 100%;

		code {
			background: none;
			padding: 0;
			white-space: pre;
			word-break: normal;
		}
	}

	:deep(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875em;
		table-layout: auto;
		display: table;
		margin-block: var(--space-4);
	}

	:deep(th, td) {
		padding: var(--space-2) var(--space-3);
		text-align: left;
		border-bottom: 1px solid var(--gray-200);
		word-break: break-word;
		overflow-wrap: break-word;
		white-space: normal;
		vertical-align: top;

		&:first-child {
			min-width: 120px;
		}
	}

	:deep(th) {
		background-color: var(--gray-50);
		font-weight: 600;
		border-bottom: 2px solid var(--gray-300);
	}

	:deep(p) {
		margin-bottom: var(--space-4);
		overflow-wrap: break-word;
		word-break: break-word;
	}

	:deep(blockquote) {
		color: var(--gray-500);
		border-left: 4px solid var(--gray-300);
		margin: var(--space-4) 0;
		padding-left: var(--space-4);
		font-style: italic;
		overflow-wrap: break-word;
	}

	:deep(ul, ol) {
		margin-block: var(--space-5);
		ul,
		ol {
			margin-block: var(--space-0);
		}
		> li {
			margin-block: var(--space-3);
		}
	}

	:deep(p + p) {
		margin-block-start: var(--space-5);
	}

	:deep(:is(h1, h2, h3, h4)) {
		color: var(--foreground);
	}

	:deep(* + :is(h1, h2, h3, h4)) {
		margin-block-start: var(--space-10);
	}

	:deep(:is(h1, h2, h3, h4) + :is(h1, h2, h3, h4, p)) {
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
	&.size-x-small {
		--font-size: var(--font-size-xs);
		--line-height: var(--line-height-xs);
		--font-weight: 400;
	}

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

	&.size-x-small {
		--font-size: var(--font-size-sm);
		--line-height: var(--line-height-sm);
		--font-weight: 400;
	}

	&.size-small {
		--font-size: var(--font-size-lg);
		--line-height: var(--line-height-lg);
		--font-weight: 400;
	}
}
</style>
