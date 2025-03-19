<script setup>
import { createDirectus, rest, readItems, readSingleton } from '@directus/sdk';

const {
	public: { tvUrl, baseUrl },
} = useRuntimeConfig();

const directus = createDirectus(tvUrl).with(rest());

const { data: live } = await useAsyncData('live', () => directus.request(readSingleton('live')));

const { data: globals } = await useAsyncData('globals', () =>
	directus.request(readSingleton('globals', { fields: ['realtime_public_user_token'] })),
);

const { data: shows } = await useAsyncData('shows', () =>
	directus.request(
		readItems('shows', {
			filter: { id: { _in: live.value.offline_featured } },
		}),
	),
);

definePageMeta({
	layout: 'tv',
});

const seoTitle = 'Directus TV Live';
const seoDesc = 'Live events from the team at Directus.';

useSeoMeta({
	title: seoTitle,
	ogTitle: seoTitle,
	description: seoDesc,
	ogDescription: seoDesc,
	ogImage: `${tvUrl}/assets/${unref(globals).og}`,
	twitterCard: 'summary_large_image',
	ogUrl: `${baseUrl}/tv`,
});

const isChatOpen = ref(true);
</script>

<template>
	<TVNavigation />
	<div class="main">
		<BaseContainer v-if="!live.show_player" class="offline">
			<p class="notice">We're offline at the moment, but why not enjoy some on-demand shows here on Directus TV.</p>
			<ul>
				<li v-for="show in shows" :key="show.id">
					<TVShow
						:slug="show.slug"
						:tile="show.tile"
						:title="show.title"
						:description="show.one_liner"
						:overlay="show.card_text"
					/>
				</li>
			</ul>
		</BaseContainer>
		<div v-else>
			<BaseContainer class="player">
				<template v-if="live.vimeo_id">
					<iframe
						:src="`https://vimeo.com/event/${live.vimeo_id}/embed${live.interaction ? '/interaction' : ''}`"
						frameborder="0"
						allow="fullscreen; picture-in-picture"
						allowfullscreen
					></iframe>
				</template>
				<template v-else-if="live.youtube_id">
					<div class="player-container">
						<iframe
							class="stream"
							:src="`https://www.youtube.com/embed/${live.youtube_id}`"
							allow="autoplay"
							allowfullscreen
							frameborder="0"
							referrerpolicy="strict-origin-when-cross-origin"
						></iframe>
						<transition name="chat-toggle">
							<div v-show="isChatOpen" class="chat">
								<iframe
									:src="`https://www.youtube.com/live_chat?v=${live.youtube_id}&embed_domain=localhost`"
									allow="autoplay"
									allowfullscreen
									frameborder="0"
									referrerpolicy="strict-origin-when-cross-origin"
								></iframe>
							</div>
						</transition>
					</div>
				</template>
			</BaseContainer>

			<BaseContainer>
				<div class="nav">
					<BaseButton
						label="Back to Directus TV"
						class="secondary"
						href="/tv"
						icon-start="arrow_back"
						color="white"
						size="small"
						outline
					/>
					<!-- Vimeo already has chat baked in to events so only show for YouTube -->
					<BaseButton
						v-if="live.youtube_id"
						color="primary"
						:icon="isChatOpen ? 'visibility_off' : 'visibility'"
						:label="isChatOpen ? 'Hide Chat' : 'Show Chat'"
						@click="isChatOpen = !isChatOpen"
					/>
				</div>

				<div class="details">
					<BaseHeading :content="live.title" size="medium" />
					<BaseText :content="live.description" color="foreground" />
				</div>
			</BaseContainer>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.main {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}
.offline {
	p.notice {
		text-align: center;
		font-size: 1.5rem;
		line-height: 1.5;
		margin-top: 2rem;
		margin-bottom: 2rem;
	}
	ul {
		--show-gap: 20px;
		margin-top: 2rem;
		margin-bottom: 2rem;
		padding-left: 0;
		list-style-type: none;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--show-gap);
	}
	li {
		width: var(--show-size);
	}
	@media (width > 40rem) {
		ul {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (width > 60rem) {
		ul {
			grid-template-columns: repeat(4, 1fr);
			--show-gap: 20px;
		}
	}
}

.player {
	grid-template-columns:
		[full-start] minmax(0, 1fr)
		[standard-start] 0
		[narrow-start] minmax(1rem, 75rem)
		[narrow-end] 0
		[standard-end] minmax(0, 1fr)
		[full-end];
	iframe {
		width: 100%;
		aspect-ratio: 16/9;
		background: black;
		border-radius: 8px;
	}
}

.details {
	margin-top: 2rem;
	margin-bottom: 4rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.player-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;

	.stream {
		flex-grow: 1;
		flex-shrink: 1;
		flex-basis: auto;
		aspect-ratio: 16/9;
		transition: flex-grow 0.4s ease;
	}

	.chat {
		flex-basis: 300px;
		flex-shrink: 0;
		height: 400px;
		max-height: 65vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: visible;

		iframe {
			width: 100%;
			height: 100%;
			border-radius: 8px;
			min-height: 380px;
		}
	}

	.chat-toggle-enter-active,
	.chat-toggle-leave-active {
		transition: all 0.4s ease;
		overflow: hidden;
	}

	.chat-toggle-enter-from,
	.chat-toggle-leave-to {
		opacity: 0;
		height: 0;
		margin-bottom: 0;
	}

	@media (width > 60rem) {
		flex-direction: row;

		.chat {
			height: auto;
			max-height: none;
			min-height: 450px;
		}

		.chat-toggle-enter-from,
		.chat-toggle-leave-to {
			width: 0;
			flex-basis: 0;
			margin-right: 0;
		}
	}
}
.nav {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: var(--space-4);
	align-items: center;
	margin-top: 2rem;
	a {
		--background-color: rgba(255, 255, 255, 0.12);
		color: white;
		outline: 2px solid white;
		&:hover {
			color: white !important;
			--background-color: rgba(255, 255, 255, 0.25);
		}
	}
}
</style>
