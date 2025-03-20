<script setup>
import { createItem, updateItem } from '@directus/sdk';

const props = defineProps({
	episodeId: {
		type: String,
		required: true,
	},
});
const { $directusTv } = useNuxtApp();
const ariaId = useId();

const visitorId = useCookie('visitor_id', {
	default: () => {
		if (import.meta.client && window.crypto) {
			return window.crypto.randomUUID();
		}

		return null;
	},
});

const loading = ref(false);
const error = ref(null);
const success = ref(false);

const reaction = reactive({
	comments: '',
});

const textarea = ref(null);

const isOpen = ref(false);

const ratingMessages = {
	dislike: 'Woof! 🤦‍♂️ How can we do better?',
	like: 'Nice! 👍 Anything we can improve upon?',
	love: `Awesome! The whole team is rejoicing in celebration! 🥳🎉🎊 Anything you'd like to say to them?`,
};

async function submitReaction(type) {
	isOpen.value = true;
	loading.value = true;

	if (type) {
		reaction.type = type;
	}

	try {
		if (reaction.id) {
			const response = await $directusTv.request(
				updateItem('tv_episode_reactions', reaction.id, {
					episode: props.episodeId,
					type: reaction.type,
					comments: reaction.comments,
					visitor_id: visitorId.value,
				}),
			);

			if (response.comments) {
				success.value = true;

				await setTimeout(() => {
					isOpen.value = false;
				}, 2000);
			}
		}
		else {
			const data = await $directusTv.request(
				createItem('tv_episode_reactions', {
					episode: props.episodeId,
					type: reaction.type,
					comments: reaction.comments,
					visitor_id: visitorId.value,
				}),
			);

			reaction.id = data.id;
		}
	}
	catch (error_) {
		error.value = error_;
	}
	finally {
		loading.value = false;
	}
}

watch(isOpen, (value) => {
	if (value) {
		setTimeout(() => {
			textarea.value.focus();
		}, 100);
	}
});

onKeyStroke('Escape', () => {
	isOpen.value = false;
});
</script>

<template>
	<div>
		<VDropdown :aria-id class="reactions" :triggers="[]" :shown="isOpen" :auto-hide="false">
			<button
				v-tooltip="`I do not like this`"
				class="feedback-button"
				:aria-pressed="reaction.type === 'dislike'"
				@click="() => submitReaction('dislike')"
			>
				<BaseIcon name="thumb_down" />
			</button>
			<button
				v-tooltip="'I like this'"
				class="feedback-button"
				:aria-pressed="reaction.type === 'like'"
				@click="() => submitReaction('like')"
			>
				<BaseIcon name="thumb_up" />
			</button>
			<button
				v-tooltip="'I freaking love this'"
				:aria-pressed="reaction.type === 'love'"
				class="feedback-button"
				@click="() => submitReaction('love')"
			>
				<BaseIcon name="favorite" />
			</button>
			<template #popper>
				<ThemeProvider variant="dark">
					<div class="popover">
						<template v-if="!success">
							<p>{{ ratingMessages[reaction.type] }}</p>
							<textarea ref="textarea" v-model="reaction.comments" class="input" placeholder="Give us your feedback" />
							<BaseButton
								type="button"
								:loading="loading"
								:disabled="loading"
								color="primary"
								label="Send Your Feedback"
								@click="submitReaction(reaction.type)"
							/>
						</template>
						<template v-else-if="error">
							<p>Whoops! There was an error submitting your feedback.</p>
						</template>
						<template v-else-if="success">
							<p>Thank you for your feedback!</p>
						</template>
						<button class="close-button" @click="() => (isOpen = false)">
							<BaseIcon name="close" />
						</button>
					</div>
				</ThemeProvider>
			</template>
		</VDropdown>
	</div>
</template>

<style lang="scss" scoped>
.reactions {
	display: flex;
	align-content: center;
	border-radius: var(--rounded-full);
	background: var(--gray-100);
	padding: var(--space-1);
	gap: var(--space-1);
}

.feedback-button {
	transition: background-color 0.2s;
	background: none;
	border: none;
	cursor: pointer;
	padding: var(--space-2);
	border-radius: var(--rounded-full);

	&:hover {
		background: var(--gray-200);
	}

	&[aria-pressed='true'] {
		background: var(--primary-500);
		color: var(--white);
	}
}

.popover {
	position: relative;
	width: 350px;
	padding: var(--space-5);
	background-color: var(--gray-100);
	border-radius: var(--rounded-xl);
	border: 2px solid var(--gray-200);
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
	box-shadow: var(--shadow-lg);

	button {
		width: auto;
	}

	.close-button {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--space-2);
		border-radius: var(--rounded-full);
		&:hover {
			background: var(--gray-200);
		}
	}
}

.input {
	color: var(--gray-900);
	width: 100%;
	height: 100px;
	border-radius: 4px;
	padding: 0.375rem 0.75rem;
	background-color: var(--gray-50);
	border: 1px solid var(--gray-200);
	&:focus {
		border-color: var(--primary);
		outline: none;
		box-shadow: 0px 0px var(--space-1) 0px var(--primary-100);
	}
}
</style>

<style lang="css">
.v-popper--theme-dropdown {
	.v-popper__inner {
		background-color: transparent !important;
		border: none !important;
		border-radius: 6px;
	}

	.v-popper__arrow-container {
		.v-popper__arrow-outer {
			border-color: #334155;
		}
		.v-popper__arrow-inner {
			border-color: #334155;
		}
	}
}
</style>
