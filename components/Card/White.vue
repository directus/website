<script setup lang="ts">
import type { BaseButtonProps } from '../Base/Button.vue';

export interface WhiteCardProps {
	title?: string;
	description?: string;
	image?: string;
	href?: string;
	button?: BaseButtonProps;
}

const props = defineProps<WhiteCardProps>();

const fileUrl = computed(() => getFileUrl(props.image));
</script>

<template>
	<NuxtLink :href="href" class="white-card">
		<div class="white-card-header">
			<img :src="fileUrl" :alt="title" height="50" />
		</div>
		<div class="white-card-body">
			<BaseHeading size="medium" :content="title" />
			<BaseText :content="description" />
		</div>
	</NuxtLink>
</template>

<style scoped>
.white-card {
	display: flex;
	height: 100%;
	flex-direction: column;
	align-items: start;

	border-radius: var(--rounded-2xl);
	overflow: hidden;
	border: 1px solid var(--gray-200);

	box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);

	background-color: var(--white);
}

.white-card > * + * {
	margin-top: var(--space-8);
}

.white-card .white-card-header {
	padding: var(--space-16) var(--space-8);
	display: flex;
	align-items: center;
	justify-content: center;
	height: 150px;
	width: 100%;

	background: linear-gradient(120deg, var(--purple-100) 0%, var(--white) 50%, var(--pink-100) 100%);
}

.white-card .white-card-header img {
	max-width: 72px;
	height: 72px;
}

.white-card .white-card-body {
	padding: var(--space-8) var(--space-8);
}

.white-card .button-group {
	flex-grow: 1;
	height: 100%;
}
</style>
