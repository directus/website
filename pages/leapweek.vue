<template>
	<BaseContainer id="lw-container">
		<div id="page">
			<section id="header">
				<img src="https://marketing.directus.app/assets/768aa2db-5ad1-4654-921a-dbbc97c6a73e.png" alt="Leap Week" />
			</section>

			<div id="content">
				<iframe
					id="video"
					:src="`https://www.youtube.com/embed/${global.youtube_id}`"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
				<iframe
					id="chat"
					:src="`https://www.youtube.com/live_chat?v=${global.youtube_id}&amp;embed_domain=${url.host}`"
					frameborder="0"
					allowfullscreen="allowfullscreen"
				></iframe>
			</div>

			<div id="resources" :class="{ loadedResources }">
				<h2>Latest Resources</h2>
				<ol id="scrollable">
					<li v-for="resource of resources" :key="resource.id" :class="{ new: resource.isNew }">
						<a :href="resource.url">
							<img :src="`${directus_url}/assets/${resource.image}`" alt="" />
							<h3>{{ resource.title }}</h3>
						</a>
					</li>
				</ol>
			</div>
		</div>
	</BaseContainer>
</template>

<script setup>
import { createDirectus, staticToken, rest, realtime, readSingleton } from '@directus/sdk';

const directus_url = 'https://leap-week-1.directus.app';
const token = 'ZrsKy-ckUb32x8M18imjEMUO7b2QzDIW';

const directus = createDirectus(directus_url).with(staticToken(token)).with(rest()).with(realtime());

const loadedResources = ref(false);
const resources = ref([]);
const global = await directus.request(readSingleton('global'));
const url = useRequestURL();

onMounted(async () => {
	await directus.connect();

	directus.onWebSocket('message', async (message) => {
		if (message.type == 'auth' && message.status == 'ok') {
			await subscribe();
		}
	});

	async function subscribe() {
		const { subscription } = await directus.subscribe('timeline', {
			query: { fields: ['*'], limit: -1 },
			uid: 'timeline',
		});

		for await (const item of subscription) {
			if (item.event == 'init' && item.uid == 'timeline') {
				resources.value = item.data.filter((i) => i.live);
				loadedResources.value = true;
			}

			if (item.event == 'update' && item.uid == 'timeline') {
				const newItems = item.data
					.filter((it) => !resources.value.find((r) => r.id == it.id))
					.map((it) => ({ ...it, isNew: true }));

				resources.value = [...newItems, ...resources.value];
			}
		}
	}
});

useHead({
	bodyAttrs: { class: 'leap' },
});
</script>

<style>
body.leap .theme-provider {
	background-image: url('https://leap-week-1.directus.app/assets/d867d8c3-81e8-446c-8ffb-de41b5d62cd2.png&width=1920');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	.footer-container {
		background: var(--primary-900);
	}
	.group-title {
		color: white;
	}
	.footer-container .base-divider {
		border-color: var(--gray-600);
	}
	.footer {
		.logo img,
		.secondary .socials img:hover {
			filter: brightness(100);
		}
		a {
			color: var(--gray-200);
			&:hover {
				color: var(--gray-300);
			}
		}
	}
	#lw-container {
		flex: 1;
	}
}
</style>

<style scoped lang="scss">
#page {
	margin-bottom: 2em;
}
#header {
	margin-top: 2em;
	margin-bottom: 2em;
	& img {
		width: 320px;
		margin: 0 auto;
	}
}
#content {
	display: grid;
	grid-template-columns: auto 288px; // magic number aligns the gap between the second resource and the chat
	gap: 2em;
}
iframe#video {
	width: 100%;
	aspect-ratio: 16 / 9;
	border-radius: var(--rounded-lg);
}
iframe#chat {
	border-radius: var(--rounded-lg);
	height: 495px;
  width: 288px;
}

#resources {
	width: 100%;
	margin-top: 2em;
	opacity: 0;
	&.loadedResources {
		animation: fadeIn 1s;
		opacity: 1;
	}
	h2 {
		color: white;
		margin-bottom: 1em;
	}
	ol {
		list-style: none;
		overflow-x: scroll;
		display: flex;
		flex-wrap: nowrap;
		padding-left: 0;
		margin-top: 0;
		margin-bottom: 0;
		min-height: 280px; // avoid jumping when fading in
		li {
			flex: 0 0 auto;
			margin-right: 2em;
			display: flex;
			flex-direction: column;
			background: var(--gray-100);
			border-radius: var(--rounded-lg);
			padding: 0.75em;
			&.new {
				animation: fadeIn 1s;
			}
			a {
				--resource-width: 400px;
				max-width: var(--resource-width);
				text-decoration: none;
				color: var(--foreground);
				img {
					max-width: var(--resource-width);
					border-radius: var(--rounded-md);
				}
				h3 {
					line-height: 1.5;
					font-size: var(--font-size-lg);
					margin-top: 0.5rem;
					margin-bottom: -0.25rem;
				}
			}
			&:last-child {
				margin-right: 0;
			}
		}
	}
}

@media (width < 1280px) {
	#content {
		grid-template-columns: 1fr;
	}
	iframe#chat {
		width: 100%;
	}
}
@media (width <= 1088px) {
	#lw-container {
		margin-top: 90px;
	}
}
@media (width < 800px) {
	#resources ol {
		min-height: 235px; // avoid jumping when fading in
		li a {
			--resource-width: 320px;
		}
	}
}
@media (width < 600px) {
	#resources ol {
		overflow-x: auto;
		flex-direction: column;
		gap: 2em;
		li {
			margin-right: 0;
			a {
				--resource-width: 100%;
			}
		}
	}
}

@keyframes fadeIn {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
