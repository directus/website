<script setup lang="ts">
export interface OgProps {
	title: string;
	imageUuid?: string;
	authorName?: string;
	authorImage?: string;
	badgeLabel?: string;
}

defineProps<OgProps>();
</script>

<template>
	<div class="og-image">
		<div class="wrapper">
			<!-- Left Side -->
			<div class="left">
				<div>
					<img src="~~/assets/svg/logo-dark.svg" />
				</div>

				<div class="title">
					<BaseBadge v-if="badgeLabel" :label="badgeLabel" border caps />
					<BaseHeading :content="title" size="title" />
				</div>

				<div>
					<div v-if="authorName || authorImage" class="author">
						<img width="72" height="72" :src="authorImage" />
						<span>{{ authorName }}</span>
					</div>
				</div>
			</div>

			<!-- Right Side - Image -->
			<div class="right">
				<svg class="divider" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
					<polygon points="0,100 50,0 90,0 0,0" />
				</svg>
				<BaseDirectusImage :uuid="imageUuid" />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.og-image {
	position: relative;
	width: 1200px;
	height: 630px;
	overflow: hidden;
	background-color: var(--white);
}

.wrapper {
	display: flex;
	position: relative;
	width: 100%;
	height: 100%;
}

.divider {
	position: absolute;
	left: 0;
	height: 100%;
	width: 100%;
	max-width: 300px;
	fill: var(--white);
	z-index: 1;
}

.left {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	width: 100%;
	height: 100%;
	padding: var(--space-8);
}

.title {
	> * + * {
		margin-block-start: var(--space-4);
	}
}

.author {
	display: flex;
	align-items: center;
	gap: var(--space-4);
	font-size: var(--font-size-xl);

	img {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		object-fit: cover;
	}
}

.right {
	position: relative;
	width: 100%;
	height: 100%;
	max-width: 600px;

	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}
</style>
