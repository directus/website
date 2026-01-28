<script setup lang="ts">
import { computed, toRef } from 'vue';
import {
	DialogRoot,
	DialogTrigger,
	DialogPortal,
	DialogOverlay,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogClose,
	useForwardPropsEmits,
	type DialogRootProps,
} from 'radix-vue';
import { reactivePick } from '@vueuse/core';

export interface ModalProps extends DialogRootProps {
	title?: string;
	description?: string;
	content?: any;
	overlay?: boolean;
	transition?: boolean;
	fullscreen?: boolean;
	portal?: boolean;
	close?: boolean | Record<string, any>;
	preventClose?: boolean;
}

const props = withDefaults(defineProps<ModalProps>(), {
	close: true,
	portal: true,
	overlay: true,
	transition: true,
	modal: true,
});

const emits = defineEmits(['update:open', 'openChange']);
const slots = defineSlots();

const rootProps = useForwardPropsEmits(reactivePick(props, 'open', 'defaultOpen', 'modal'), emits);
const contentProps = toRef(() => props.content);

const contentEvents = computed(() => {
	if (props.preventClose) {
		return {
			pointerDownOutside: (e: Event) => e.preventDefault(),
			interactOutside: (e: Event) => e.preventDefault(),
		};
	}

	return {};
});
</script>

<template>
	<DialogRoot v-slot="{ open }" v-bind="rootProps">
		<DialogTrigger v-if="!!slots.default" as-child>
			<slot :open="open" />
		</DialogTrigger>

		<DialogPortal :disabled="!portal">
			<DialogOverlay v-if="overlay" :class="{ 'modal-overlay': true, 'modal-overlay--hidden': !transition }" />

			<DialogContent
				:class="{
					modal: true,
					'modal--fullscreen': fullscreen,
					'modal--no-transition': !transition,
				}"
				v-bind="contentProps"
				v-on="contentEvents"
			>
				<ThemeProvider variant="light">
					<slot name="content">
						<div
							v-if="
								!!slots.header || title || !!slots.title || description || !!slots.description || close || !!slots.close
							"
							class="modal-header"
						>
							<slot name="header">
								<DialogTitle v-if="title || !!slots.title" class="modal-title">
									<slot name="title">
										{{ title }}
									</slot>
								</DialogTitle>

								<DialogDescription v-if="description || !!slots.description" class="modal-description">
									<slot name="description">
										{{ description }}
									</slot>
								</DialogDescription>

								<DialogClose as-child>
									<BaseButton icon="close" aria-label="Close" color="primary" class="modal-close" />
								</DialogClose>
							</slot>
						</div>

						<div v-if="!!slots.body" class="modal-body">
							<slot name="body" />
						</div>

						<div v-if="!!slots.footer" class="modal-footer">
							<slot name="footer" />
						</div>
					</slot>
				</ThemeProvider>
			</DialogContent>
		</DialogPortal>
	</DialogRoot>
</template>

<style scoped lang="scss">
.modal-overlay {
	position: fixed;
	inset: 0;
	background-color: color-mix(in srgb, #0e1c2f 90%, transparent);
	z-index: 50;
}

.modal-overlay--hidden {
	display: none;
}

@media (prefers-reduced-motion: no-preference) {
	.modal-overlay {
		transition: opacity var(--duration-150) var(--ease-out);
	}

	.modal-overlay[data-state='open'] {
		animation: overlayShow var(--duration-150) var(--ease-in);
	}

	.modal-overlay[data-state='closed'] {
		animation: overlayHide var(--duration-150) var(--ease-in);
	}
}

.modal {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	min-width: var(--space-80);
	max-width: 85rem;
	width: 100%;
	background-color: var(--background);
	border-radius: var(--rounded-2xl);
	box-shadow: var(--shadow-lg);
	z-index: 50;
}

.modal--fullscreen {
	max-width: 100vw;
	max-height: 100vh;
	border-radius: 0;
}

.modal--no-transition {
	transition: none;
}

@media (prefers-reduced-motion: no-preference) {
	.modal {
		transition:
			opacity var(--duration-150) var(--ease-out),
			transform var(--duration-150) var(--ease-out);
	}

	.modal[data-state='open'] {
		animation: modalShow var(--duration-150) var(--ease-out);
	}

	.modal[data-state='closed'] {
		animation: modalHide var(--duration-150) var(--ease-in);
	}
}

.modal-header {
	display: flex;
	padding: var(--space-6);
	border-bottom: 1px solid var(--gray-200);
	position: relative;
	background-color: var(--background);
	padding-inline-end: var(--space-12);
}

.modal-title {
	margin: 0;
	font-size: var(--font-size-xl);
	line-height: var(--line-height-xl);
	font-weight: 600;
	color: var(--foreground);
}

.modal-description {
	margin-block-start: var(--space-2);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
	color: var(--gray-400);
}

.modal-body {
	padding: var(--space-6);
	background-color: var(--background);
}

.modal-close {
	position: absolute;
	top: var(--space-4);
	right: var(--space-4);
}

.modal-footer {
	padding: var(--space-6);
	border-top: 1px solid var(--gray-200);
}

@keyframes overlayShow {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes overlayHide {
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
}

@keyframes modalShow {
	from {
		opacity: 0;
		transform: translate(-50%, -48%) scale(0.96);
	}
	to {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}
}

@keyframes modalHide {
	from {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}
	to {
		opacity: 0;
		transform: translate(-50%, -48%) scale(0.96);
	}
}
</style>
