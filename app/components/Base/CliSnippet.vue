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
const el = ref<HTMLElement | null>(null);

const onMouseMove = (e: MouseEvent) => {
	if (!el.value) return;
	const rect = el.value.getBoundingClientRect();
	el.value.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
	el.value.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

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
		ref="el"
		class="cli-snippet"
		@click="handleClick"
		@mousemove="onMouseMove"
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
	background: transparent;
	border: 1px solid color-mix(in srgb, var(--foreground, currentColor) 20%, transparent);
	transition: border-color 200ms ease-out;
	cursor: pointer;
	gap: 12px;
	position: relative;
	&::before {
		content: '';
		position: absolute;
		inset: -1px;
		border-radius: inherit;
		padding: 1px;
		background: radial-gradient(
			circle 80px at var(--mouse-x, 50%) var(--mouse-y, 50%),
			var(--primary),
			transparent 100%
		);
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask-composite: exclude;
		-webkit-mask-composite: xor;
		opacity: 0;
		pointer-events: none;
	}

	&:hover {
		border-color: color-mix(in srgb, var(--foreground, currentColor) 40%, transparent);
	}

	@media (prefers-reduced-motion: no-preference) {
		&::before {
			transition: opacity 300ms ease-out;
		}

		&:hover::before {
			opacity: 1;
		}
	}

	&:active {
		border-color: color-mix(in srgb, var(--foreground, currentColor) 60%, transparent);
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
	color: color-mix(in srgb, var(--foreground, currentColor) 45%, transparent);
	flex-shrink: 0;
}

.command-text {
	color: color-mix(in srgb, var(--foreground, currentColor) 75%, transparent);
	white-space: nowrap;
}

.copy-status {
	display: flex;
	align-items: center;
	justify-content: center;
	color: color-mix(in srgb, var(--foreground, currentColor) 45%, transparent);
	font-family: var(--family-body);
	font-size: var(--font-size-sm);
	font-weight: 500;
	width: 24px;
	height: 24px;
	flex-shrink: 0;
	cursor: pointer;
	position: relative;

	.base-icon {
		--base-icon-color: color-mix(in srgb, var(--foreground, currentColor) 45%, transparent);
		font-size: 20px;
		line-height: 20px;
	}

	.copied-text {
		position: absolute;
		right: calc(100% + 6px);
		top: 50%;
		transform: translateY(-50%);
		white-space: nowrap;
		background: color-mix(in srgb, var(--foreground, currentColor) 10%, transparent);
		color: var(--foreground, currentColor);
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
