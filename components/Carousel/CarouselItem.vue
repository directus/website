<script setup lang="ts">
import { useCarousel } from './useCarousel';
import type { WithClassAsProps } from './interface';

const props = defineProps<WithClassAsProps>();

const { orientation } = useCarousel();
</script>

<template>
	<div role="group" aria-roledescription="slide" :class="props.class">
		<slot />
	</div>
</template>
