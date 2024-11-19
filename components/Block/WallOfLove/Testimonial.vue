<script setup lang="ts">
import type { BlockProps } from '../types';

const { $directus, $readItem } = useNuxtApp();

interface TestimonialsProps extends BlockProps {
	uuid: string;
}

const props = defineProps<TestimonialsProps>();

import placeholderAvatar from '~/assets/svg/placeholder-avatar.svg';
import starIcon from '~/assets/svg/star.svg';

const {
	public: { directusUrl },
} = useRuntimeConfig();

const { data: block } = useAsyncData(`testimonials-${props.uuid}`, () =>
	$directus.request(
		$readItem('testimonials', props.uuid, {
			fields: ['id', 'company', 'name', 'role', 'quote', 'logo', 'avatar', 'avatar_url'],
		}),
	),
);

const avatarImageUrl = computed(() => {
	if (block.value) {
		if (block.value.avatar_url) {
			return block.value.avatar_url;
		} else if (block.value.avatar) {
			const url = new URL(`/assets/${block.value.avatar}`, directusUrl as string);
			return url.toString();
		}
	}

	return placeholderAvatar;
});

const logoImageUrl = computed(() => {
	if (block.value && block.value.logo) {
		const url = new URL(`/assets/${block.value.logo}`, directusUrl as string);
		return url.toString();
	}

	return null;
});
</script>

<template>
	<div v-if="block" class="testimonial-card">
		<div class="header">
			<img :src="avatarImageUrl" alt="Avatar" class="avatar" />
			<div class="info">
				<strong>{{ block.name }}</strong>
				<div class="role">{{ block.role }}</div>
			</div>
		</div>
		<BaseText class="quote" :content="block.quote" align="start" color="foreground"></BaseText>
		<div class="footer">
			<img v-if="logoImageUrl" :src="logoImageUrl" alt="Company Logo" class="company-logo" />
			<div v-else class="logo-placeholder"></div>
			<div class="stars">
				<img v-for="index in 5" :key="index" :src="starIcon" alt="Star" class="star-icon" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.testimonial-card {
	border-radius: var(--rounded-xl);
	border: 1px solid #d3dae4;
	background: #fff;
	display: flex;
	min-width: 358px;
	min-height: 330px;
	padding: var(--space-8);
	flex-direction: column;
	gap: var(--space-8);

	@media (max-width: 768px) {
		padding: var(--space-6);
	}

	@media (max-width: 480px) {
		padding: var(--space-4);
	}

	.header {
		display: flex;
		align-items: center;
		margin-bottom: var(--space-3);
		justify-content: left;

		.avatar {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			margin-right: var(--space-3);

			@media (max-width: 480px) {
				width: 40px;
				height: 40px;
			}
		}

		.info {
			display: flex;
			flex-direction: column;

			strong {
				font-size: var(--font-size-lg);

				@media (max-width: 480px) {
					font-size: var(--font-size-base);
				}
			}

			.role {
				font-size: var(--font-size-sm);

				@media (max-width: 480px) {
					font-size: var(--font-size-xs);
				}
			}
		}
	}

	.quote {
		margin-bottom: var(--space-3);
		font-style: italic;
		flex-grow: 1;

		:deep(> *) {
			quotes: auto;

			&::before {
				content: open-quote;
				position: absolute;
				translate: -0.7ch 0;
			}

			&::after {
				content: close-quote;
			}
		}
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		margin-top: var(--space-4);

		.company-logo {
			max-height: 40px;
			max-width: 150px;
			width: auto;

			@media (max-width: 768px) {
				max-width: 150px;
			}

			@media (max-width: 480px) {
				max-width: 100px;
			}
		}

		.logo-placeholder {
			width: 40px;
			height: 40px;
			border-radius: var(--rounded);
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
</style>
