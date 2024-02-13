<template>
	<ThemeProvider variant="dark">
		<TVNavigation />
		<BaseContainer class="player">
			<iframe
				:src="`https://vimeo.com/event/${event.vimeo_id}/embed${event.interaction ? '/interaction' : ''}`"
				frameborder="0"
				allow="fullscreen; picture-in-picture"
				allowfullscreen
			></iframe>
		</BaseContainer>

		<BaseContainer>
			<div class="details">
				<h1>{{ event.title }}</h1>
				<p>{{ event.description }}</p>
				<BaseButton
					v-if="event.show_gcal_link"
					label="Add to Google Calendar"
					class="calendar"
					:href="`https://www.google.com/calendar/render?action=TEMPLATE&text=Directus%3A%20${
						event.title
					}&dates=${urlDate(event.date_start)}Z/${urlDate(event.date_end)}Z&location=${baseUrl}/tv/live/${event.slug}`"
					color="primary"
					size="small"
				/>
			</div>

			<div v-if="highlights.length" class="highlights">
				<h2>Live Highlights</h2>
				<ol v-if="highlights.length">
					<li v-for="(highlight, index) in highlights" :key="highlight.title">
						<a :href="highlight.url">
							<BaseBadge v-if="index === 0" label="Latest" color="gray" />
							<span>{{ highlight.title }}</span>
						</a>
					</li>
				</ol>
			</div>
		</BaseContainer>
	</ThemeProvider>
</template>

<script setup>
import { createDirectus, rest, readSingleton, readItems, realtime, authentication } from '@directus/sdk';

const {
	public: { tvUrl, baseUrl },
} = useRuntimeConfig();

const route = useRoute();
const highlights = ref([]);
const highlightsLoaded = ref(false);

const directusUrl = process.env.DIRECTUS_TV_URL || tvUrl;
const directus = createDirectus(directusUrl).with(rest()).with(realtime()).with(authentication());

const global = await directus.request(readSingleton('globals', { fields: ['realtime_public_user_token'] }));

const [event] = await directus.request(
	readItems('events', {
		filter: { slug: { _eq: route.params.event } },
	}),
);

onMounted(async () => {
	await directus.connect();
	directus.sendMessage({ type: 'auth', access_token: global.realtime_public_user_token });

	directus.onWebSocket('message', async (message) => {
		if (message.type == 'auth' && message.status == 'ok') {
			await subscribe();
		}
	});

	async function subscribe() {
		const { subscription } = await directus.subscribe('events', {
			query: {
				fields: ['highlights'],
				filter: { slug: { _eq: route.params.event } },
			},
			uid: 'highlights',
		});

		for await (const item of subscription) {
			if (item.event == 'init' && item.uid == 'highlights') {
				highlights.value = item.data[0].highlights.filter((highlight) => highlight.show).reverse();
				highlightsLoaded.value = true;
			}

			if (item.event == 'update' && item.uid == 'highlights') {
				highlights.value = item.data[0].highlights.filter((highlight) => highlight.show).reverse();
			}
		}
	}
});

function urlDate(dateString) {
	return dateString.split('-').join('').split(':').join('');
}

definePageMeta({
	layout: 'tv',
});

useSeoMeta({
	title: `${event.title} | Directus TV`,
	ogTitle: `${event.title} | Directus TV`,
	description: event.description,
	ogDescription: event.description,
	ogImage: `${directusUrl}/assets/${event.tile}`,
	twitterCard: 'summary_large_image',
	ogUrl: `${baseUrl}/tv/live/${route.params.event}`,
});
</script>

<style lang="scss" scoped>
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
}
@media (width > 60rem) {
	.highlights ol a {
		font-size: 1.25rem;
		.base-badge {
			display: block !important;
		}
	}
}
</style>
