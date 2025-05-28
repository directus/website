<script setup lang="ts">
import type { PageBlock } from '~/types/schema';

interface PageSectionProps {
	background?: PageBlock['background'];
	navOffset?: 'none' | 'x-small' | 'small' | 'normal';
	negativeMargin?: boolean;
	offsetNegativeMargin?: boolean;
	spacing?: 'none' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
	isFirstSection?: boolean;
}

withDefaults(defineProps<PageSectionProps>(), {
	background: 'pristine-white',
	negativeMargin: false,
	offsetNegativeMargin: false,
	navOffset: 'normal',
	spacing: 'medium',
	isFirstSection: false,
});

const { height: headerHeight } = useHeaderHeight();
</script>

<template>
	<ThemeProvider
		:variant="background === 'dark-night' ? 'dark' : 'light'"
		:on="background === 'colorful' ? 'colorful' : 'background'"
		class="page-section"
		:class="[
			`bg-${background}`,
			`space-${spacing}`,
			`nav-offset-${navOffset}`,
			{
				offset: offsetNegativeMargin,
				negative: negativeMargin,
				'first-section': isFirstSection,
			},
		]"
	>
		<ArtLines v-if="background === 'pristine-white-lines'" />
		<slot />
	</ThemeProvider>
</template>

<style lang="scss" scoped>
.page-section {
	background-color: var(--background);
	padding-block-end: var(--padding-base);
	padding-block-start: var(--nav-offset);

	--negative-offset: var(--space-32);
	--negative: calc(-1 * var(--space-8));

	@media (width > 50rem) {
		--negative-offset: var(--space-48);
		--negative: calc(-1 * var(--space-16));
	}

	@media (width > 68rem) {
		--negative-offset: var(--space-64);
		--negative: calc(-1 * var(--space-36));
	}

	&.first-section {
		:deep(> .base-container:first-child) {
			padding-block-start: 0;
		}
	}

	&.offset {
		padding-block-end: var(--negative-offset);
	}

	&.negative {
		padding-block-start: 0;

		:deep(> :first-child) {
			position: relative;
			inset-block-start: var(--negative);
			margin-block-end: var(--negative);
		}
	}

	&.space-none {
		--padding-base: 0;
	}

	&.space-x-small {
		--padding-base: var(--space-3);

		@media (width > 50rem) {
			--padding-base: var(--space-6);
		}

		@media (width > 68rem) {
			--padding-base: var(--space-7);
		}
	}

	&.space-small {
		--padding-base: var(--space-6);

		@media (width > 50rem) {
			--padding-base: var(--space-12);
		}

		@media (width > 68rem) {
			--padding-base: var(--space-14);
		}
	}

	&.space-medium {
		--padding-base: var(--space-12);

		@media (width > 50rem) {
			--padding-base: var(--space-24);
		}

		@media (width > 68rem) {
			--padding-base: var(--space-28);
		}
	}

	&.space-large {
		--padding-base: var(--space-24);

		@media (width > 50rem) {
			--padding-base: var(--space-40);
		}

		@media (width > 68rem) {
			--padding-base: var(--space-48);
		}
	}

	&.space-x-large {
		--padding-base: var(--space-24);

		@media (width > 50rem) {
			--padding-base: var(--space-40);
		}

		@media (width > 68rem) {
			--padding-base: var(--space-48);
		}
	}

	&.nav-offset-none {
		--nav-offset: calc(v-bind(headerHeight) * 1px);
		padding-block-start: 0;

		@media (width > 68rem) {
			--nav-offset: 0;
		}
	}

	&.nav-offset-x-small {
		--nav-offset: var(--space-28);

		@media (width > 50rem) {
			--nav-offset: var(--space-28);
		}

		@media (width > 68rem) {
			--nav-offset: var(--space-5);
		}
	}

	&.nav-offset-small {
		--nav-offset: var(--space-28);

		@media (width > 50rem) {
			--nav-offset: var(--space-28);
		}

		@media (width > 68rem) {
			--nav-offset: var(--space-14);
		}
	}

	&.nav-offset-normal {
		--nav-offset: var(--space-32);

		@media (width > 50rem) {
			--nav-offset: var(--space-44);
		}

		@media (width > 68rem) {
			--nav-offset: var(--space-28);
		}
	}

	&:has(:last-child:is(.base-container > .base-divider)) {
		padding-block-end: 0;
	}

	.header-container + .page-section {
		padding-block-start: var(--nav-offset);
	}
}

.bg-simple-gray {
	background-color: var(--gray-100);
}

.bg-pristine-white-lines {
	position: relative;
}

.bg-dark-night {
	:deep(.base-button.color-secondary.outline) {
		--background-color: color-mix(in srgb, transparent, var(--background) 10%);
		--border-color: var(--gray-400);
		--background-color-hover: color-mix(in srgb, transparent, var(--background) 10%);
		--border-color-hover: var(--gray-600);
	}
}

.bg-colorful {
	background: url('~/assets/svg/gradient.svg');
	background-size: cover;
}

.bg-colorful-muted {
	background: linear-gradient(to bottom, #fe97dc15, #745eff15);
}

.bg-pristine-white + .bg-pristine-white-lines {
	border-block-start: 1px solid var(--gray-200);
}
</style>
