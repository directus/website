<script setup lang="ts">
const props = defineProps<{
	images: {
		src: string;
		alt?: string;
	}[];
}>();

const selectedImage = ref(props.images.length ? props.images[0].src : null);

watch(
	() => props.images,
	(newImages) => {
		if (newImages.length && !newImages.find((img) => img.src === selectedImage.value)) {
			selectedImage.value = newImages[0].src;
		}
	},
);
</script>
<template>
	<div class="gallery">
		<BaseMedia aspect="16-9" class="gallery-selected">
			<img v-if="selectedImage" :src="selectedImage" :alt="''" :width="800" loading="lazy" />
		</BaseMedia>
		<!-- Show thumnbails ONLY if there are more than one image -->
		<BaseCardGroup v-if="images.length > 1" grid="4" class="gallery-thumbnails">
			<button
				v-for="image in images"
				:key="image.src"
				type="button"
				class="gallery-image"
				:class="selectedImage === image.src ? 'selected' : ''"
				@click="selectedImage = image.src"
			>
				<img :src="image.src" :alt="image.alt ?? ''" :width="225" :height="125" loading="lazy" />
			</button>
		</BaseCardGroup>
	</div>
</template>

<style lang="scss" scoped>
.gallery-selected {
	background-color: var(--gray-50);
	border-radius: var(--rounded-lg);
	overflow: hidden;
	border: 1px solid var(--gray-200);
	width: 100%;
	height: 100%;

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}

.gallery-image {
	cursor: pointer;
	width: 100%;
	overflow: hidden;
	border-radius: var(--rounded-lg);
	border: 2px solid transparent;
	background: none;
	padding: 0;

	border: 1px solid var(--gray-200);

	&.selected {
		border: 2px solid var(--primary);
	}

	&:focus {
		outline: var(--primary) auto 1px;
	}

	img {
		width: 200px;
		height: 100px;
		object-fit: cover;
		transition: scale var(--duration-300) var(--ease-out);

		&:hover {
			scale: 1.03;
		}
	}
}

.gallery-thumbnails {
	margin-block-start: var(--space-4);
}
</style>
