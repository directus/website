<script setup lang="ts">
interface BaseBylineProps {
	name?: string;
	title?: string;
	image?: string;
	links?: [
		{
			service: string;
			url: string;
		},
	];
}

defineProps<BaseBylineProps>();
</script>

<template>
	<address rel="author" class="base-byline">
		<BaseDirectusImage
			v-if="image"
			:width="44"
			:height="44"
			class="avatar"
			:uuid="image"
			:alt="name ?? ''"
			provider="directusTv"
		/>

		<div>
			<p v-if="name" class="name">{{ name }}</p>
			<p v-if="title" class="title">{{ title }}</p>
			<div v-if="links" class="share-icons">
				<template v-for="{ service, url } in links" :key="service">
					<NuxtLink :href="url" target="_blank">
						<img :src="dynamicAsset(`/svg/social/${service}.svg`)" :alt="service" />
					</NuxtLink>
				</template>
			</div>
		</div>
	</address>
</template>

<style scoped lang="scss">
.base-byline {
	--color: var(--foreground);
	--title-color: var(--gray-400);
	--text-shadow: none;

	color: var(--color);
	display: flex;
	gap: var(--space-2);
	font-style: normal;
	align-items: start;

	.avatar {
		border-radius: var(--rounded-full);
		inline-size: var(--space-11);
		block-size: var(--space-11);
		object-fit: cover;
		background: var(--gray-100);
	}

	div {
		text-shadow: var(--text-shadow);
	}

	.name,
	.title {
		margin: 0;
	}

	.title {
		color: var(--title-color);
		font-size: var(--font-size-sm);
		line-height: var(--line-height-sm);
		text-wrap: balance;
	}

	.share-icons {
		display: flex;
		align-items: center;
		gap: var(--space-5);

		img {
			margin-block-start: var(--space-1);
			width: var(--space-6);
			height: auto;
			filter: brightness(1);
			transition: filter var(--duration-150) var(--ease-out);

			&:hover {
				transition: none;
				filter: brightness(50);
			}
		}
	}
}
</style>
