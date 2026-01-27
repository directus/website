<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		command: string;
		size?: 'x-small' | 'small' | 'medium' | 'large';
	}>(),
	{
		size: 'medium',
	},
);

const isCopied = ref(false);

const commandParts = computed(() => {
	const firstSpaceIndex = props.command.indexOf(' ');
	if (firstSpaceIndex === -1) return { prefix: props.command, command: '' };
	return {
		prefix: props.command.slice(0, firstSpaceIndex + 1),
		command: props.command.slice(firstSpaceIndex + 1),
	};
});

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(props.command);
		isCopied.value = true;

		setTimeout(() => {
			isCopied.value = false;
		}, 2000);
	} catch {
		// Silently fail if copy doesn't work
	}
};

const handleClick = () => {
	// Check if there's a text selection
	const selection = window.getSelection();

	if (selection && selection.toString().length > 0) {
		return; // Don't copy if user is selecting text
	}

	copyToClipboard();
};
</script>

<template>
	<div
		class="cli-snippet"
		@click="handleClick"
		v-capture="{
			name: 'marketing.website.cli_snippet.copy.click',
			properties: {
				command: command,
			},
		}"
	>
		<div class="command" :class="size">
			<code class="prefix">{{ commandParts.prefix }}</code>
			<code class="command-text">{{ commandParts.command }}</code>
		</div>
		<div class="copy-status" @click="copyToClipboard">
			<BaseIcon name="content_copy" size="small" />
			<span v-if="isCopied" class="copied-text">Copied!</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.cli-snippet {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	max-width: 470px;
	height: 44px;
	border-radius: 8px;
	padding: 9px 24px;
	background: var(--colors-background--inverted, #172940);
	border: 1px solid transparent;
	box-shadow: 0px 0px 10px 2px #6644ff33;
	transition: all 300ms ease-out;
	cursor: pointer;
	gap: 12px;
	position: relative;
	&:hover {
		box-shadow:
			0px 0px 10px 2px #6644ff33,
			0px 0px 10px 1px #ffade44d;
		border-color: #745eff;
	}
	&:active {
		border-color: var(--colors-primary, #6644ff);
	}
}

.command {
	display: flex;
	align-items: center;
	gap: 4px;
	font-family: var(--family-monospace);
	font-weight: 500;
	overflow-x: auto;
	overflow-y: hidden;
	flex: 1;
	min-width: 0;
	user-select: text;
	cursor: text;

	/* Hide scrollbar completely */
	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* IE and Edge */

	&::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}
}

.command.x-small {
	font-size: var(--font-size-xs);
	line-height: var(--line-height-xs);
}

.command.small {
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
}

.command.medium {
	font-size: var(--font-size-md);
	line-height: var(--line-height-md);
}

.command.large {
	font-size: var(--font-size-lg);
	line-height: var(--line-height-lg);
}

.prefix {
	color: #ff69b4;
	flex-shrink: 0;
}

.command-text {
	color: var(--white);
	white-space: nowrap;
}

.copy-status {
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--white);
	font-family: var(--family-body);
	font-size: var(--font-size-sm);
	font-weight: 500;
	width: 24px;
	height: 24px;
	flex-shrink: 0;
	cursor: pointer;
	position: relative;

	.base-icon {
		--base-icon-color: var(--white);
		font-size: 20px;
		line-height: 20px;
	}

	.copied-text {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		white-space: nowrap;
		background: var(--colors-background--inverted, #172940);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: var(--font-size-xs);
		z-index: 10;
	}
}

@media (max-width: 480px) {
	.cli-snippet {
		padding: 9px 16px;
		height: 44px;
		gap: 8px;
	}
	.command {
		font-size: var(--font-size-sm);
	}
	.copy-status {
		width: 20px;
		height: 20px;

		.base-icon {
			font-size: 18px;
			line-height: 18px;
		}

		.copied-text {
			font-size: var(--font-size-xs);
		}
	}
}
</style>
