<script setup lang="ts">
import type { File } from 'types/schema';

export interface LogoTitleProps {
	logos: {
		id: string;
		title: string | null;
		external_url: string | null;
		resource: null | {
			type: string;
			slug: string;
		};
		page: null | {
			permalink: string;
		};
		directus_files_id: {
			id: string;
			description: string | null;
		};
	}[];
}

const props = defineProps<LogoTitleProps>();

const nuxtLinkComponent = resolveComponent('NuxtLink');

const isLink = (logo: LogoTitleProps['logos'][number]) => !!logo.external_url || !!logo.resource || !!logo.page;
</script>

<template>
	<ul class="block-logocloud-title">
		<li v-for="logo in props.logos" :key="logo.id" :class="{ 'has-link': isLink(logo) }" class="block-image">
			<component
				:is="isLink(logo) ? nuxtLinkComponent : 'div'"
				:href="logo.external_url ?? logo.page?.permalink ?? resourcePermalink(logo.resource as any) ?? undefined"
			>
				<BaseDirectusImage
					class="image"
					:uuid="(logo.directus_files_id as File).id"
					:alt="(logo.directus_files_id as File).description ?? ''"
				/>

				<span>{{ logo.title }}</span>
			</component>
		</li>
	</ul>
</template>

<style scoped lang="scss">
.block-logocloud-title {
	display: grid;
	gap: var(--space-5);
	padding: 0;
	margin: 0;
	list-style: none;
	grid-template-columns: repeat(var(--columns), 1fr);

	--columns: 1;

	@container (width > 30rem) {
		--columns: 2;
	}

	@container (width > 40rem) {
		--columns: 3;
	}
}

li {
	border-radius: var(--rounded-2xl);
	background: var(--gray-100);
	border: 1px solid var(--gray-100);
	font-family: var(--family-display);
	padding: var(--space-4) var(--space-1);

	> * {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		text-decoration: none;
		color: var(--foreground);
		padding-left: var(--space-2);
	}

	&.has-link {
		border-color: var(--gray-100);
		transition: border-color var(--duration-150) var(--ease-out);

		&:hover {
			border-color: var(--gray-400);
			transition: none;
		}
	}

	.image {
		block-size: var(--space-9);
		inline-size: var(--space-14);
		object-fit: contain;
		object-position: center center;
	}
}
</style>
