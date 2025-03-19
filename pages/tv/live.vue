<script setup>
import { createDirectus, rest, realtime, readItems, readSingleton, authentication } from '@directus/sdk';

const {
	public: { tvUrl, baseUrl },
} = useRuntimeConfig();

const directus = createDirectus(tvUrl).with(rest()).with(realtime()).with(authentication());
const live = await directus.request(readSingleton('live'));
const globals = await directus.request(readSingleton('globals', { fields: ['realtime_public_user_token'] }));

const shows = await directus.request(
	readItems('shows', {
		filter: { id: { _in: live.offline_featured } },
	}),
);

const highlights = ref([]);
const highlightsLoaded = ref(false);

onMounted(async () => {
	await directus.connect();
	directus.sendMessage({ type: 'auth', access_token: globals.realtime_public_user_token });

	directus.onWebSocket('message', async (message) => {
		if (message.type === 'auth' && message.status === 'ok') {
			await subscribe();
		}
	});

	async function subscribe() {
		const { subscription } = await directus.subscribe('live', {
			query: { fields: ['highlights'] },
			uid: 'highlights',
		});

		for await (const item of subscription) {
			if (item.event === 'init' && item.uid === 'highlights') {
				highlights.value = item.data[0].highlights.filter((highlight) => highlight.show).reverse();
				highlightsLoaded.value = true;
			}

			if (item.event === 'update' && item.uid === 'highlights') {
				highlights.value = item.data[0].highlights.filter((highlight) => highlight.show).reverse();
			}
		}
	}
});

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
						<div class="chat" :class="{ collapsed: !isChatOpen }">
							<iframe
								:src="`https://www.youtube.com/live_chat?v=${live.youtube_id}&embed_domain=localhost`"
								allow="autoplay"
								allowfullscreen
								frameborder="0"
								referrerpolicy="strict-origin-when-cross-origin"
							></iframe>
						</div>
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
					<!-- Vimeo already has chat baked in to events -->
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

				<div v-if="highlights.length" class="highlights">
					<h2>Live Highlights</h2>
					<ol v-if="highlights.length">
						<li v-for="(highlight, index) in highlights" :key="highlight.label">
							<a :href="highlight.url" target="_blank">
								<BaseBadge v-if="index === 0" label="Latest" color="gray" />
								<span>{{ highlight.label }}</span>
							</a>
						</li>
					</ol>
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

.highlights {
	margin-top: 2rem;
	ol {
		padding-left: 0;
		list-style-type: none;
		display: flex;
		flex-direction: column;
		gap: 1em;
		a {
			display: block;
			background: rgba(255, 255, 255, 0.12);
			border-radius: 8px;
			box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
			backdrop-filter: blur(1.8px);
			-webkit-backdrop-filter: blur(1.8px);
			border: 1px solid rgba(255, 255, 255, 0.33);
			color: white;
			text-decoration: none;
			padding: 1rem;
			display: flex;
			gap: 1rem;
			.base-badge {
				display: none;
			}
		}
		li:not(:first-child) {
			opacity: 0.5;
		}
	}
	@media (width > 60rem) {
		ol a {
			font-size: 1.25rem;
			.base-badge {
				display: block !important;
			}
		}
	}
}

.player-container {
	display: flex;
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
		height: 100%;
		transition: flex-basis 0.4s ease;

		&.collapsed {
			flex-basis: 0;
		}

		iframe {
			width: 100%;
			height: 100%;
			border-radius: 8px;
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
