<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: comp } = useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_floating_page', props.uuid, {
			fields: [
				'id',
				'content',
				'heading',
				'button',
				'person_image',
				'person_name',
				'person_title',
				{ button: ['page', 'external_url', 'variant', 'label', 'color', 'pulse', 'type', 'resource'] },
			],
		})
	)
);
</script>

<template>
	<div v-if="comp" class="floating-page">
		<div v-if="comp.heading" class="heading">
			<CompHeading :uuid="comp.heading" />
		</div>
		<BaseText v-if="comp.content" class="content" :content="comp?.content" />
		<div class="footer">
			<div class="person">
				<img
					v-if="comp?.person_image"
					width="96"
					height="96"
					class="avatar"
					:src="getFileUrl(comp?.person_image)"
					:alt="comp?.person_name ?? 'undefined'"
					loading="lazy"
				/>
				<div>
					<p v-if="comp?.person_name" class="signature">{{ comp?.person_name }}</p>
					<p v-if="comp?.person_title" class="title">{{ comp?.person_title }}</p>
				</div>
			</div>
			<div v-if="comp?.button">
				<BaseButton
					:href="comp.button.external_url ?? comp.button.page ?? ' undefined'"
					:variant="comp.button.variant"
					:color="comp.button.color"
					:pulse="comp.button.pulse"
					trailing-icon="arrow_forward"
				>
					{{ comp.button.label }}
				</BaseButton>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.floating-page {
	padding-inline: var(--space-8);
	padding-block: var(--space-8);
	margin-inline: auto;
	box-shadow: var(--shadow-lg);
	border-radius: var(--rounded-2xl);

	> * + * {
		margin-block-start: var(--space-8);
	}

	@media (width > 50rem) {
		padding-inline: var(--space-12);
		padding-block: var(--space-10);
	}

	@media (width > 75rem) {
		padding-inline: var(--space-20);
		padding-block: var(--space-14);
	}
}

.content {
	font-family: var(--family-display);
}

.footer {
	> * + * {
		margin-block-start: var(--space-8);
	}

	@media (width > 50rem) {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-8);
		justify-content: space-between;
		align-items: center;

		> * + * {
			margin-block-start: 0;
		}
	}
}

.person {
	display: inline-flex;
	align-items: center;
	gap: var(--space-4);

	p {
		margin: 0;
	}

	.avatar {
		border-radius: var(--rounded-full);
	}

	.signature {
		font-family: var(--family-signature);
		font-size: var(--font-size-3xl);
	}

	.title {
		font-size: var(--font-size-sm);
		font-style: italic;
		color: var(--gray-500);
		margin-block-start: var(--space-1);
	}
}
</style>
