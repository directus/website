<script setup lang="ts">
export interface BaseQuoteProps {
	quote: string;
	personImage?: string;
	personName?: string;
	personTitle?: string;
}

defineProps<BaseQuoteProps>();
</script>

<template>
	<div class="base-quote">
		<!-- eslint-disable-next-line vue/no-v-html -->
		<blockquote class="quote" v-html="quote" />

		<div class="person">
			<BaseDirectusImage
				v-if="personImage"
				width="44"
				height="44"
				class="avatar"
				:uuid="personImage"
				:alt="personName ?? ''"
			/>

			<div>
				<p v-if="personName" class="name">{{ personName }}</p>
				<p v-if="personTitle" class="title">{{ personTitle }}</p>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.base-quote {
	container-type: inline-size;
}

.quote {
	color: var(--gray-800);
	font-family: var(--family-display);
	font-size: var(--font-size-l);
	line-height: var(--line-height-l);
	margin: 0;
	margin-block-end: var(--space-4);
	max-width: 58rem;

	:deep(> *) {
		quotes: auto;

		&::before {
			content: open-quote;
			position: absolute;
			translate: -0.7ch 0;
		}

		&::after {
			content: close-quote;
		}
	}

	@container (width > 30rem) {
		font-size: var(--font-size-2xl);
		line-height: var(--line-height-2xl);
		font-weight: 400;
		margin-block-end: var(--space-7);
	}

	@container (width > 50rem) {
		font-size: var(--font-size-3xl);
		line-height: var(--line-height-3xl);
		font-weight: 300;
		margin-block-end: var(--space-10);
	}
}

.title {
	color: var(--gray-400);
	font-size: var(--font-size-sm);
	line-height: var(--line-height-sm);
}

.person {
	display: flex;
	gap: var(--space-2);

	.avatar {
		border-radius: var(--rounded-full);
		inline-size: var(--space-11);
		block-size: var(--space-11);
	}
}
</style>
