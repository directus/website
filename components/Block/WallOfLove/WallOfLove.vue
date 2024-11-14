<script setup lang="ts">
import { computed, ref } from 'vue';
import Testimonials from './Testimonials.vue';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<{ uuid: string }>();

const { data: block } = useAsyncData(`wall-of-love-${props.uuid}`, () =>
	$directus.request(
		$readItem('block_wall_of_love', props.uuid, {
			fields: ['id', 'heading', { testimonials: ['testimonials_id'] }],
		}),
	),
);

const showAll = ref(false);

const displayedTestimonials = computed(() => {
	if (!block.value || !block.value.testimonials) return [];
	return showAll.value ? block.value.testimonials : block.value.testimonials.slice(0, 6);
});

const toggleShowAll = () => {
	showAll.value = !showAll.value;
};
</script>

<template>
	<div v-if="block" class="wall-of-love">
		<h2 class="wall-heading">{{ block.heading }}</h2>
		<div class="testimonial-container">
			<Testimonials
				v-for="testimonial in displayedTestimonials"
				:key="testimonial.testimonials_id"
				:uuid="testimonial.testimonials_id"
				class="testimonial-item"
			/>
			<!-- Fading effect -->
			<div v-if="!showAll && block.testimonials && block.testimonials.length > 6" class="fade-out"></div>
		</div>

		<BaseButton
			v-if="block.testimonials && block.testimonials.length > 6"
			size="large"
			type="button"
			color="secondary"
			icon="arrow_forward"
			class="see-more-button"
			outline
			:label="showAll ? 'See Less Testimonials' : 'See More Testimonials'"
			@click="toggleShowAll"
		/>
	</div>
</template>

<style lang="scss" scoped>
.wall-of-love {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;

	.wall-heading {
		color: var(--Foreground-Normal, #455466);
		font-family: Poppins;
		font-size: 24px;
		font-style: normal;
		font-weight: 600;
		line-height: 32px;
	}

	.testimonial-container {
		margin-top: 32px;
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		justify-content: center;
		width: 100%;
		position: relative;
	}

	.testimonial-item {
		flex: 1 1 calc(33.333% - 16px);
		min-width: 300px;
		box-sizing: border-box;
	}

	@media (max-width: 768px) {
		.testimonial-item {
			flex: 1 1 calc(50% - 16px);
		}
	}

	@media (max-width: 480px) {
		.testimonial-item {
			flex: 1 1 100%;
		}
	}

	.fade-out {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 450px;
		background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9));
		pointer-events: none;
		z-index: 1;
	}

	.see-more-button {
		margin: 16px auto;
		align-self: center;
		position: relative;
		z-index: 2;
	}
}
</style>
