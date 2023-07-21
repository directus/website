<script setup lang="ts">
import { BlockHeroHeadline } from '~/types';

defineProps<{
	data: BlockHeroHeadline;
}>();
</script>

<template>
	<div class="hero-headline">
		<BaseHeading size="title" align="center" :content="data.heading" />
		<BaseText align="center" :content="data.subheading" />
		<BaseButtonGroup class="buttons">
			<!-- TODO: Routing for internal pages or external links -->
			<BaseButton
				v-for="(button, idx) in data.button_group?.buttons"
				:key="idx"
				:href="button.href"
				:variant="button.variant"
				:color="button.color"
				:pulse="button.pulse"
			>
				{{ button.label }}
			</BaseButton>
		</BaseButtonGroup>
	</div>
</template>

<style scoped>
.hero-headline {
	padding-top: var(--space-12);
	padding-bottom: var(--space-12);
	> * + * {
		margin-top: var(--space-8);
	}
	max-width: 64rem;
	margin-left: auto;
	margin-right: auto;
	.base-text {
		margin-left: auto;
		margin-right: auto;
		max-width: 48rem;
	}
}
.buttons {
	width: 100%;
	margin-left: auto;
	margin-right: auto;
	display: flex;
	justify-content: center;
}
</style>
