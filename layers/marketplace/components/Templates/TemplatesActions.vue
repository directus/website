<script setup lang="ts">
import type { Template, Creator } from '~/types/marketplace';
import { userName } from '~/utils/userName';

defineProps<{
	template: Template;
	buttons: any[];
}>();
</script>

<template>
	<div class="template-actions">
		<BaseButtonGroup v-if="buttons && buttons.length" align="left" class="action-buttons">
			<BaseButton
				v-for="button in buttons"
				:key="button.label"
				:label="button.label"
				:href="button.href"
				:color="button.color ?? undefined"
				:outline="button.outline ?? false"
				:target="button.target ?? undefined"
				:icon="button.icon ?? undefined"
				size="large"
				block
				@click="button.click"
			/>
		</BaseButtonGroup>

		<div v-if="template?.template_status !== 'available'" class="request-template">
			<h3 v-text="'Template Not Ready Yet 🚧'" />
			<p>Add your email below and we'll notify you once it's live.</p>
			<BaseHsForm form-id="938bd868-251b-4ebf-bd8b-175d085226bb" :instance-id="$attrs.class?.toString()" />
		</div>

		<dl class="meta">
			<div v-if="template?.creator" class="row flex-list">
				<dt class="subdued">By</dt>
				<NuxtLink :href="`/creators/${(template?.creator as Creator)?.slug as string}`" class="author-link">
					<BaseByline
						:image="(template?.creator as Creator)?.avatar as string"
						:name="userName(template?.creator as Creator)"
					/>
				</NuxtLink>
			</div>
			<div v-if="template?.framework" class="row">
				<dt class="subdued">Framework</dt>
				<dd>
					<BaseBadge :href="`/templates?framework=${template?.framework}`">{{ template?.framework }}</BaseBadge>
				</dd>
			</div>
			<div v-if="template?.use_cases" class="row">
				<dt class="subdued">Use Cases</dt>
				<dd class="flex-list">
					<BaseBadge v-for="use_case in template.use_cases" :key="use_case" :href="`/templates?use_cases=${use_case}`">
						{{ use_case }}
					</BaseBadge>
				</dd>
			</div>
		</dl>
	</div>
</template>

<style scoped lang="scss">
.request-template {
	margin-block-start: var(--space-0);

	background-color: var(--primary-50);
	border: transparent;
	border-radius: var(--rounded-2xl);
	padding: var(--space-4);
	margin-block-start: var(--space-10);

	h3 {
		text-wrap: balance;
		color: var(--primary-500);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-md);
	}

	p {
		color: var(--gray-700);
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
		margin-block-end: var(--space-4);
		text-wrap: balance;
	}

	> * + * {
		margin-block-start: var(--space-4);
	}
}

.subdued {
	color: var(--gray-600);
}

.flex-list {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: var(--space-2);
}

.meta {
	> * + * {
		margin-block-start: var(--space-4);
	}

	.author-link {
		text-decoration: none;
		color: var(--gray-900);

		&:hover {
			text-decoration: underline;
		}
	}

	dd {
		width: 100%;
		margin-inline-start: 0;
		margin-block-start: 0;
	}
}
</style>
