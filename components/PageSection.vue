<script setup lang="ts">
import type { PageSection } from '~/types/schema';

interface PageSectionProps {
	background: PageSection['background'];
}

withDefaults(defineProps<PageSectionProps>(), {
	background: 'white',
});
</script>

<template>
	<div class="page-section" :class="[`bg-${background}`]">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.page-section {
	padding-block: var(--space-12);

	&:first-of-type {
		/* Extra padding block start for the fixed NavHeader on mobile */
		padding-block-start: var(--space-32);
	}
}

@media (width > 50rem) {
	.page-section {
		padding-block: var(--space-24);

		&:first-of-type {
			/* Extra padding block start for the fixed NavHeader on mobile */
			padding-block-start: var(--space-44);
		}
	}
}

@media (width > 80rem) {
	.page-section {
		padding-block: var(--space-28);

		&:first-of-type {
			padding-block-start: var(--space-28);
		}
	}
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
