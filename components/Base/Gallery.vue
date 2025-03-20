<script setup lang="ts">
const props = defineProps<{
	images: {
		uuid: string;
		alt?: string;
	}[];
}>();

const selectedImage = ref(props.images.length > 0 ? props.images[0].uuid : null);
</script>

<template>
	<div class="gallery">
		<BaseMedia aspect="16-9" class="gallery-selected">
			<BaseDirectusImage v-if="selectedImage" :uuid="selectedImage" alt="" :width="800" loading="lazy" />
		</BaseMedia>
		<!-- Show thumnbails ONLY if there are more than one image -->
		<BaseCardGroup v-if="images.length > 1" grid="4" class="gallery-thumbnails">
			<button
				v-for="image in images"
				:key="image.uuid as string"
				type="button"
				class="gallery-image"
				:class="selectedImage === image.uuid ? 'selected' : ''"
				@click="selectedImage = image.uuid"
			>
				<BaseDirectusImage :uuid="image.uuid" :alt="image.alt ?? ''" :width="225" :height="125" loading="lazy" />
			</button>
		</BaseCardGroup>
	</div>
</template>

<style lang="scss" scoped>
.gallery-selected {
	background-color: var(--gray-50);
	border-radius: var(--rounded-lg);
}

.gallery-image {
	cursor: pointer;
	width: 100%;
	overflow: hidden;
	border-radius: var(--rounded-lg);
	border: 2px solid transparent;

	&.selected {
		border: 2px solid var(--primary);
	}

	&:focus {
		outline: var(--primary) auto 1px;
	}

	img {
		width: 100%;
		height: 100%;
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
