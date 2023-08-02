<script setup lang="ts">
export interface BaseCardProps {
	title: string;
	desc?: string;
	image?: string;
	href?: string;
	author?: string;
	date?: string;
	layout?: 'vertical' | 'horizontal';
}

withDefaults(defineProps<BaseCardProps>(), {
	layout: 'vertical',
});
</script>

<template>
	<div class="base-card">
		<NuxtLink :href="href">
			<div v-if="image" class="image">
				<BaseDirectusImage :uuid="image" :alt="title" />
			</div>
			<div class="content">
				<div>
					<!-- <BaseBadge v-bind="tag" /> -->
				</div>
				<h3 class="heading">{{ title }}</h3>
				<p v-if="desc" class="description">{{ desc }}</p>
				<div v-if="author" class="author">
					<span>{{ author }}</span>
					&nbsp;
					<span>•</span>
					&nbsp;
					<span class="date">{{ date }}</span>
				</div>
			</div>
		</NuxtLink>
	</div>
</template>

<style scoped>
.base-card {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.base-card * + * {
	margin-top: 8px;
}

.content {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.image {
	width: 100%;
	border-radius: var(--rounded-lg);
	aspect-ratio: 16 / 9;
	overflow: hidden;
}

.image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center center;
	transition: scale var(--duration-150) var(--ease-out);
}

.heading {
	font-size: var(--font-size-xl);
	line-height: var(--line-height-xl);
	font-weight: 600;
	margin-top: var(--space-3);
}

.description {
	color: var(--gray-500);
}

.author {
	color: var(--gray-500);
}

.base-card:hover .heading {
	text-decoration: underline;
}

.base-card:hover .image img {
	scale: 1.05;
}
</style>
