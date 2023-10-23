<template>
	<BaseContainer id="lw-container">
		<div id="page">
			<section id="header">
				<img src="https://leap-week-1.directus.app/assets/4717e5c2-3d2f-42f4-9784-9df430efb3ac.svg" alt="Leap Week" />
			</section>

			<div id="content">
				<div class="vid">
					<iframe
						id="video"
						:src="`https://www.youtube.com/embed/${global.youtube_id}`"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				</div>
				<iframe
					id="chat"
					:src="`https://www.youtube.com/live_chat?v=${global.youtube_id}&amp;embed_domain=directus.io`"
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
					<li v-for="index in 11 - resources.length" :key="index" class="ghost">
						<div>To be announced...</div>
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
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	.footer-container {
		background: #0a020d;
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
		background-image: url('https://leap-week-1.directus.app/assets/2ec597c4-3e6e-4c7e-b5f9-d845a71f3f6b.svg');
		background-size: cover;
		background-position: center bottom;
		background-repeat: no-repeat;
	}
}
</style>

<style scoped lang="scss">
#page {
	margin-bottom: 20em;
}
#header {
	margin-top: 4em;
	margin-bottom: 4em;
	& img {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}
}
#content {
	display: grid;
	grid-template-columns: auto 288px; // magic number aligns the gap between the second resource and the chat
	gap: 2em;
}
.vid {
	background: rgba(255, 255, 255, 0.12);
	border-radius: 16px;
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(1.8px);
	-webkit-backdrop-filter: blur(1.8px);
	border: 1px solid rgba(255, 255, 255, 0.33);
	padding: 0.75em 0.75em 0.3em;
	border-radius: 16px;
}
iframe#video {
	width: 100%;
	aspect-ratio: 16 / 9;
	border-radius: var(--rounded-md);
	// border: 0.75em solid rgba(112, 89, 190, 0.5);
}
iframe#chat {
	border-radius: var(--rounded-lg);
	height: 495px;
	width: 288px;
}

#resources {
	width: 100%;
	margin-top: 4em;
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
			--resource-width: 400px;
			padding: 0.75em;

			background: rgba(255, 255, 255, 0.12);
			border-radius: 16px;
			box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
			backdrop-filter: blur(1.8px);
			-webkit-backdrop-filter: blur(1.8px);
			border: 1px solid rgba(255, 255, 255, 0.33);
			&.new {
				animation: fadeIn 1s;
			}
			a {
				max-width: var(--resource-width);
				text-decoration: none;
				color: var(--foreground);
				img {
					max-width: var(--resource-width);
					border-radius: var(--rounded-md);
				}
				h3 {
					font-size: var(--font-size-lg);
					margin-top: 0.5rem;
					margin-bottom: -0.25rem;
					color: white;
				}
			}
			&:last-child {
				margin-right: 0;
			}
			&.ghost {
				display: flex;
				align-items: center;
				justify-content: center;
				background: rgba(255, 255, 255, 0.04);
				border-radius: 16px;
				box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
				backdrop-filter: blur(3.2px);
				-webkit-backdrop-filter: blur(3.2px);
				border: 1px solid rgba(255, 255, 255, 0.17);
				> div {
					width: var(--resource-width);
					text-align: center;
					color: rgba(255, 255, 255, 0.5);
				}
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
	#resources ol li.ghost {
		display: none;
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
