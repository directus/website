<script setup lang="ts">
import type { WithClassAsProps } from './interface';

const props = defineProps<WithClassAsProps>();
</script>

<template>
	<div role="group" aria-roledescription="slide" :class="props.class">
		<slot />
	</div>
</template>
