<template>
	<section
		id="hero"
		:style="`background-image: linear-gradient(-75deg, rgba(9,23,41,0) 25%, rgba(9,23,41) 100%), url(${directusUrl}/assets/${cover}`"
	>
		<TVNavigation />
		<BaseContainer>
			<div class="featured">
				<img :src="`${directusUrl}/assets/${logo}`" :alt="title" />
				<h2>{{ title }}</h2>
				<p>{{ description }}</p>

				<BaseButton
					v-for="button in buttons"
					:key="button.href"
					:label="button.text"
					:class="button.type"
					:href="button.href"
					:icon-start="button.icon"
					color="white"
					size="large"
					outline
				/>
			</div>
		</BaseContainer>
	</section>
</template>

<script setup>
const directusUrl = process.env.DIRECTUS_TV_URL;

defineProps({
	cover: String,
	logo: String,
	title: String,
	description: String,
	buttons: Array,
});
</script>

<style lang="scss" scoped>
#hero {
	background-size: cover;
	background-position: center;
}

.featured {
	margin: 7rem 0 10em;
	line-height: 1.75;
	img {
		width: 100%;
		max-width: 300px;
		margin-bottom: 2rem;
	}
	h2 {
		font-size: 1rem;
		font-weight: bold;
	}
	p {
		font-weight: light;
	}
	.primary {
		--background-color: white;
		outline: 0.5rem solid rgba(255, 255, 255, 0.25);
		margin: 2rem 3rem 2rem 0;
		&:hover {
			outline-color: rgba(255, 255, 255, 0.5);
		}
	}

	.secondary {
		--background-color: rgba(255, 255, 255, 0.12);
		color: white;
		outline: 2px solid white;
		&:hover {
			color: inherit;
			--background-color: rgba(255, 255, 255, 0.25);
		}
	}
}

@media (width > 60rem) {
	.featured {
		width: 50%;
	}
}
</style>
