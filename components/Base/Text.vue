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

	&.color-foreground {
		color: var(--gray-700);
	}

	&.color-subdued {
		color: var(--gray-400);
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

	:deep(a) {
		text-decoration: none;
		color: var(--primary);

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

	:deep(table, thead, tbody) {
		margin-block: var(--space-5);
		inline-size: 100%;
		display: flex;
		margin-inline: auto;
	}

	:deep(tr) {
		display: flex;
		align-items: center;
		font-size: 0.6rem;
		line-height: 0.6rem;

		@container (width > 20rem) {
			font-size: var(--font-size-sm);
			line-height: var(--line-height-sm);
		}
	}

	:deep(th) {
		padding-left: var(--space-2);
		flex-basis: var(--space-24);
		flex-grow: 1;

		&:first-child {
			flex-grow: 4;
			text-align: left;
		}

		&:not(:first-child) {
			text-align: end;
		}
	}

	:deep(td) {
		padding-left: var(--space-2);
		flex-basis: var(--space-24);
		flex-grow: 1;

		&:first-child {
			flex-grow: 4;
		}

		&:not(:first-child) {
			text-align: end;
		}
	}

	:deep(thead tr) {
		margin-block-end: var(--space-2);
	}

	:deep(tbody tr) {
		padding-block: var(--space-2);
		border-block-start: 1px solid var(--gray-200);

		&:last-child {
			border-block-end: 1px solid var(--gray-200);
		}
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
