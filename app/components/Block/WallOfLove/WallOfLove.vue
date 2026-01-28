<script setup lang="ts">
import useVisualEditing from '~/composables/useVisualEditing';

const { $directus, $readItem } = useNuxtApp();
const { autoApply, setAttr, isVisualEditingEnabled } = useVisualEditing();

const props = defineProps<{ uuid: string }>();

const { data: block, refresh } = useAsyncData(`wall-of-love-${props.uuid}`, () =>
	$directus.request(
		$readItem('block_wall_of_love', props.uuid, {
			fields: [
				'id',
				'heading',
				{
					testimonials: [
						{
							testimonials_id: ['id', 'company', 'name', 'role', 'quote', 'logo', 'avatar', 'avatar_url', 'card_width'],
						},
					],
				},
			],
		}),
	),
);

const showAll = ref(false);

const displayedTestimonials = computed(() => {
	return showAll.value ? block.value?.testimonials : block.value?.testimonials?.slice(0, 6);
});

const toggleShowAll = () => {
	showAll.value = !showAll.value;

	if (!showAll.value) {
		const wallOfLoveElement = document.querySelector('.wall-of-love');

		if (wallOfLoveElement) {
			wallOfLoveElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
};

autoApply(`[data-block-id="${props.uuid}"]`, refresh);
</script>

<template>
	<div
		v-if="block"
		class="wall-of-love"
		:data-block-id="props.uuid"
		:data-directus="
			isVisualEditingEnabled
				? setAttr({
						collection: 'block_wall_of_love',
						item: block.id,
						fields: ['heading', 'testimonials'],
						mode: 'modal',
					})
				: undefined
		"
	>
		<h2 class="wall-heading">{{ block.heading }}</h2>
		<div class="testimonial-container" :class="{ expanded: showAll }">
			<BlockWallOfLoveTestimonial
				v-for="testimonial in displayedTestimonials"
				:key="testimonial.testimonials_id.id"
				:testimonial-data="testimonial.testimonials_id"
				:class="[
					'testimonial-item',
					`size-${testimonial.testimonials_id.card_width || 'flexible'}`,
					testimonial.testimonials_id.quote.length > 400 ? 'long-quote' : '',
				]"
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
		color: var(--gray-500);
		font-size: var(--font-size-2xl);
		font-weight: 600;
		line-height: var(--line-height-2xl);
	}

	.testimonial-container {
		margin-top: var(--space-8);
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
		justify-content: center;
		width: 100%;
		position: relative;
		align-items: stretch;
		max-height: calc(2 * 300px + var(--space-4) / 2);
		overflow: hidden;
		transition: max-height 0.3s ease;

		&.expanded {
			max-height: none;
			overflow: visible;
		}

		.fade-out {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100px; /* Height of the fade effect */
			background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9));
			pointer-events: none;
			z-index: 1;
		}
	}

	.testimonial-item {
		display: flex;
		min-width: 300px;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		height: auto; /* Ensure cards maintain their height */
		box-sizing: border-box;
		padding: var(--space-8); /* Restore proper padding inside the cards */
		background: var(--background); /* Ensure cards have background */
		border: 1px solid var(--gray-200);
		border-radius: var(--rounded-xl);

		& p {
			font-family: var(--family-display) !important;
		}

		&.size-small {
			flex: 1 1 calc(20% - 16px);
		}

		&.size-medium {
			flex: 1 1 calc(30% - 16px);
		}

		&.size-large {
			flex: 1 1 calc(40% - 16px);
		}

		&.size-flexible {
			flex: 1 1 calc(33.333% - 16px);
		}

		&.long-quote {
			flex: 1 1 calc(60% - 16px);
		}

		.footer {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--space-2);
			margin-top: var(--space-4);

			.company-logo {
				max-height: 40px;
				max-width: 120px;
				width: auto;

				@media (max-width: 480px) {
					max-height: 30px;
					max-width: 100px;
				}
			}

			.stars {
				display: flex;
				gap: var(--space-1);

				.star-icon {
					width: 16px;
					height: 16px;

					@media (max-width: 480px) {
						width: 14px;
						height: 14px;
					}
				}
			}
		}
	}

	/* Tablet adjustments */
	@media (max-width: 768px) {
		.testimonial-item {
			flex: 1 1 calc(50% - 16px);
		}

		.testimonial-item.long-quote {
			flex: 1 1 calc(100% - 16px);
		}
	}

	/* Mobile adjustments */
	@media (max-width: 480px) {
		.testimonial-item {
			flex: 1 1 100%;
		}
	}

	.see-more-button {
		margin: var(--space-4) auto;
		align-self: center;
		position: relative;
		z-index: 2;
	}
}
</style>
