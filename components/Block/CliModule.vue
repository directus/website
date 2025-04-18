<script setup lang="ts">
import type { BlockProps } from './types';

const { $directus, $readItem } = useNuxtApp();

const props = defineProps<BlockProps>();

const { data: block } = await useAsyncData(props.uuid, () =>
	$directus.request(
		$readItem('block_cli_module', props.uuid, {
			fields: ['prefix', 'command'],
		}),
	),
);

const isCopied = ref(false);

const copyToClipboard = async () => {
	if (!block.value) return;

	try {
		await navigator.clipboard.writeText(`${block.value.prefix}${block.value.command}`);
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
	<div v-if="block" class="cli-module" @click="copyToClipboard">
		<div class="command">
			<code class="prefix">{{ block.prefix }}</code>
			<code class="command-text">{{ block.command }}</code>
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
.cli-module {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 470px;
	height: 44px;
	border-radius: 8px;
	padding: 9px 24px;
	background: var(--colors-background--inverted, #172940);
	border: 1px solid transparent;
	box-shadow: 0px 0px 10px 2px #6644ff33;
	transition: all 300ms ease-out;
	cursor: pointer;

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
	font-size: var(--font-size-lg);
	line-height: var(--line-height-sm);
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

	.base-icon {
		--base-icon-color: var(--white);
		font-size: 20px;
		line-height: 20px;
	}
}
</style>
