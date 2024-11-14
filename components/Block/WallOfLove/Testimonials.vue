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
	border-radius: var(--Large, 12px);
	border: 1px solid var(--Border-Normal, #d3dae4);
	background: #fff;
	display: flex;
	min-width: 358px;
	min-height: 330px;
	padding: 32px;
	flex-direction: column;
	gap: 32px;

	@media (max-width: 768px) {
		padding: 24px;
	}

	@media (max-width: 480px) {
		padding: 16px;
	}

	.header {
		display: flex;
		align-items: center;
		margin-bottom: 12px;
		justify-content: center;

		.avatar {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			margin-right: 12px;

			@media (max-width: 480px) {
				width: 40px;
				height: 40px;
			}
		}

		.info {
			display: flex;
			flex-direction: column;

			strong {
				font-size: 1.1em;

				@media (max-width: 480px) {
					font-size: 1em;
				}
			}

			.role {
				font-size: 0.9em;
				color: #666;

				@media (max-width: 480px) {
					font-size: 0.8em;
				}
			}
		}
	}

	.quote {
		margin-bottom: 12px;
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
		gap: 8px;
		margin-top: 16px;

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
			border-radius: 4px;
		}

		.stars {
			display: flex;
			gap: 4px;

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
