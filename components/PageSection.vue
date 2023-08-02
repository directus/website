<script setup lang="ts">
import type { PageSection } from '~/types/schema';

interface PageSectionProps {
	background: PageSection['background'];
	negativeMargin: boolean;
	offsetNegativeMargin?: boolean;
}

withDefaults(defineProps<PageSectionProps>(), {
	background: 'white',
});
</script>

<template>
	<div class="page-section" :class="[`bg-${background}`, { offset: offsetNegativeMargin, negative: negativeMargin }]">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.page-section {
	--padding-base: var(--space-12);
	--block-margin: var(--space-20);
	--nav-offset: var(--space-32);
	--negative-offset: var(--space-20);
	--negative: calc(-1 * var(--space-8));

	padding-block: var(--padding-base);

	:deep(.base-container + .base-container) {
		margin-block-start: var(--block-margin);
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

	@media (width > 50rem) {
		--padding-base: var(--space-24);
		--block-margin: var(--space-20);
		--nav-offset: var(--space-44);
		--negative-offset: var(--space-36);
		--negative: calc(-1 * var(--space-16));
	}

	@media (width > 80rem) {
		--padding-base: var(--space-28);
		--block-margin: var(--space-20);
		--nav-offset: var(--space-28);
		--negative-offset: var(--space-48);
		--negative: calc(-1 * var(--space-36));
	}
}

.header-container + .page-section {
	/* Extra padding block start for the fixed NavHeader on mobile */
	padding-block-start: var(--nav-offset);
}

.bg-white {
	background-color: var(--white);
}

.bg-pink-light {
	background-color: var(--pink-50);
}

.bg-pink-dark {
	background-color: var(--pink-50);
}

.bg-lines {
	background-color: var(--white);
	background-image: url('~/assets/svg/waves.svg');
	background-repeat: no-repeat;
	background-size: cover;
}

.bg-gradient-pink-to-white {
	background-image: linear-gradient(to bottom, var(--pink-100), var(--white));
}

.bg-gradient-purple-to-white {
	background-image: linear-gradient(to bottom, var(--purple-100), var(--white));
}

.bg-purple-light {
	background-color: var(--purple-50);
}
</style>
