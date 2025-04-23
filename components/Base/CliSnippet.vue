<script setup lang="ts">
const props = defineProps<{
	command: string;
}>();

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
</script>

<template>
	<div
		class="cli-snippet"
		@click="copyToClipboard"
		v-capture="{
			name: 'marketing.website.cli_snippet.copy.click',
			properties: {
				command: command,
			},
		}"
	>
		<div class="command">
			<code class="prefix">{{ commandParts.prefix }}</code>
			<code class="command-text">{{ commandParts.command }}</code>
		</div>
		<div class="copy-status">
			<template v-if="isCopied">
				<span>Copied!</span>
			</template>
			<BaseIcon v-else name="content_copy" size="small" />
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
	gap: 4px;
	font-family: var(--family-monospace);
	font-weight: 500;
	font-size: var(--font-size-md);
	line-height: var(--line-height-sm);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 1;
	min-width: 0;
}
.prefix {
	color: #ff69b4;
}
.command-text {
	color: var(--white);
}
.copy-status {
	color: var(--white);
	font-family: var(--family-body);
	font-size: var(--font-size-sm);
	font-weight: 500;
	min-width: 50px;
	text-align: right;
	flex-shrink: 0;
	.base-icon {
		--base-icon-color: var(--white);
		font-size: 20px;
		line-height: 20px;
	}
}

@media (max-width: 480px) {
	.cli-snippet {
		padding: 8px 12px;
		height: 40px;
		gap: 8px;
	}
	.command {
		font-size: var(--font-size-sm);
	}
	.copy-status {
		min-width: 40px;
		.base-icon {
			font-size: 18px;
			line-height: 18px;
		}
	}
}
</style>
