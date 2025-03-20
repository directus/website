<script setup lang="ts">
import type { Testimonial } from '~/types/schema';
import placeholderAvatar from '~/assets/svg/placeholder-avatar.svg';
import starIcon from '~/assets/svg/star.svg';

const props = defineProps<{ testimonialData: Testimonial }>();

const {
	public: { directusUrl },
} = useRuntimeConfig();

const avatarImageUrl = computed(() => {
	if (props.testimonialData.avatar_url) {
		return props.testimonialData.avatar_url;
	}
	else if (props.testimonialData.avatar) {
		const url = new URL(`/assets/${props.testimonialData.avatar}`, directusUrl as string);
		return url.toString();
	}

	return placeholderAvatar;
});

const logoImageUrl = computed(() => {
	if (props.testimonialData.logo) {
		const url = new URL(`/assets/${props.testimonialData.logo}`, directusUrl as string);
		return url.toString();
	}

	return null;
});
</script>

<template>
	<div class="testimonial-card">
		<div class="header">
			<img :src="avatarImageUrl" alt="Avatar" class="avatar">
			<div class="info">
				<strong>{{ props.testimonialData.name }}</strong>
				<div class="role">
					{{ props.testimonialData.role }}
				</div>
			</div>
		</div>
		<BaseText class="quote" :content="props.testimonialData.quote" align="start" color="foreground" />
		<div class="footer">
			<img v-if="logoImageUrl" :src="logoImageUrl" alt="Company Logo" class="company-logo">
			<div v-else class="logo-placeholder" />
			<div class="stars">
				<img v-for="index in 5" :key="index" :src="starIcon" alt="Star" class="star-icon">
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.testimonial-card {
	border-radius: var(--rounded-xl);
	border: 1px solid var(--gray-200);
	background: var(--background);
	padding: var(--space-8);
	display: flex;
	flex-direction: column;
	color: var(--foreground);
	gap: var(--space-8);
	height: 100%;
	box-sizing: border-box;

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
		flex-grow: 1;

		:deep(> *:not(p)) {
			position: relative;
			display: inline;
			quotes: auto;
			font-family: var(--family-display) !important;

			&::before {
				content: open-quote;
				margin-right: 0.2ch;
			}

			&::after {
				content: close-quote;
				margin-left: 0.2ch;
			}
		}

		:deep(p) {
			position: relative;
			display: inline;
			font-family: var(--family-display) !important;

			&[data-no-quotes='false'] {
				quotes: auto;

				&::before {
					content: open-quote;
					margin-right: 0.2ch;
				}

				&::after {
					content: close-quote;
					margin-left: 0.2ch;
				}
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
</style>
