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
	<div :class="[`bg-${background}`]">
		<slot />
	</div>
</template>

<style scoped>
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
	background-position: cover;
	overflow: hidden;
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