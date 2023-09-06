<template>
	<div class="base-panel-container">
		<div class="base-panel">
			<div class="base-panel-header">
				<slot name="header" />
			</div>

			<div class="base-panel-content">
				<slot />
			</div>

			<div class="base-panel-footer">
				<slot name="footer" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.base-panel-container {
	container-type: inline-size;
	block-size: 100%;
	border-radius: var(--rounded-2xl);
	background: var(--gray-100);
}

.base-panel {
	block-size: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: var(--space-5) var(--space-7);
	padding: var(--space-5) var(--space-7);
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	@container (width > 35rem) {
		gap: var(--space-10);
		padding: var(--space-10);
	}

	@container (width > 50rem) {
		.base-panel-header,
		.base-panel-footer {
			&:empty {
				display: none;
			}
		}
	}
}
</style>
