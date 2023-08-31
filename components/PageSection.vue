<script setup lang="ts">
import type { PageBlock } from '~/types/schema';

interface PageSectionProps {
	background?: PageBlock['background'];
	navOffset?: 'none' | 'x-small' | 'small' | 'normal';
	negativeMargin?: boolean;
	offsetNegativeMargin?: boolean;
	spacing?: 'none' | 'x-small' | 'small' | 'medium' | 'large';
}

withDefaults(defineProps<PageSectionProps>(), {
	background: 'pristine-white',
	negativeMargin: false,
	offsetNegativeMargin: false,
	navOffset: 'normal',
	spacing: 'medium',
});
</script>

<template>
	<div
		class="page-section"
		:class="[
			`bg-${background}`,
			`space-${spacing}`,
			`nav-offset-${navOffset}`,
			{ offset: offsetNegativeMargin, negative: negativeMargin },
		]"
	>
		<ArtLines v-if="background === 'pristine-white-lines'" />
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.page-section {
	padding-block: var(--padding-base);

	--negative-offset: var(--space-20);
	--negative: calc(-1 * var(--space-8));

	@media (width > 50rem) {
		--negative-offset: var(--space-36);
		--negative: calc(-1 * var(--space-16));
	}

	@media (width > 68rem) {
		--negative-offset: var(--space-48);
		--negative: calc(-1 * var(--space-36));
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
			--padding-base: var(--space-48);
		}

		@media (width > 68rem) {
			--padding-base: var(--space-56);
		}
	}

	&.nav-offset-none {
		--nav-offset: var(--space-28);

		@media (width > 50rem) {
			--nav-offset: var(--space-28);
		}

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
}

.header-container + .page-section {
	/* Extra padding block start for the fixed NavHeader on mobile */
	padding-block-start: var(--nav-offset);
}

.bg-pristine-white {
	background-color: var(--white);
}

.bg-simple-gray {
	background-color: var(--gray-100);
}

.bg-easy-gray {
	background: linear-gradient(180deg, var(--white), var(--gray-50) 100%);
}

.bg-pristine-white-lines {
	position: relative;
}

.bg-dark-night {
	background-color: var(--gray-50);

	--black: var(--white);
	--gray-50: #0f172a;
	--gray-100: #1e293b;
	--gray-200: #334155;
	--gray-300: #475569;
	--gray-400: #64748b;
	--gray-500: #94a3b8;
	--gray-600: #cbd5e1;
	--gray-700: #e2e8f0;
	--gray-800: #f1f5f9;
	--gray-900: #f8fafc;

	:deep(.base-button.color-secondary.outline) {
		--background-color: color-mix(in srgb, transparent, var(--white) 10%);
		--border-color: var(--gray-400);
		--background-color-hover: color-mix(in srgb, transparent, var(--white) 10%);
		--border-color-hover: var(--gray-600);
	}
}

.bg-colorful {
	background: url('~/assets/svg/gradient.svg');
	background-size: cover;
}

.bg-pristine-white + .bg-pristine-white-lines,
.bg-pristine-white + .bg-simple-gray,
.bg-pristine-white-lines + .bg-simple-gray,
.bg-simple-gray + .bg-pristine-white,
.bg-simple-gray + .bg-pristine-white-lines,
.bg-simple-gray + .bg-easy-gray,
.bg-easy-gray + .bg-pristine-white,
.bg-easy-gray + .bg-pristine-white-lines,
.bg-pristine-white + .bg-easy-gray,
.bg-pristine-white-lines + .bg-easy-gray {
	border-block-start: 1px solid var(--gray-200);
}
</style>
