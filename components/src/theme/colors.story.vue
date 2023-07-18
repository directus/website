<script setup lang="ts">
const colorWeights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
</script>

<template>
	<Story title="Theme / Colors" :layout="{ type: 'grid', width: '100%' }">
		<Variant title="Purple (Primary)">
			<div class="swatches">
				<span
					v-for="weight of colorWeights"
					:key="weight"
					:style="`--color: var(--purple-${weight})`"
					class="swatch"
					:class="{ highlight: weight === 400 }"
					:title="`--purple-${weight}`"
				/>
			</div>
		</Variant>

		<Variant title="Pink (Secondary)">
			<div class="swatches">
				<span
					v-for="weight of colorWeights"
					:key="weight"
					:style="`--color: var(--pink-${weight})`"
					class="swatch"
					:class="{ highlight: weight === 200 }"
					:title="`--pink-${weight}`"
				/>
			</div>
		</Variant>

		<Variant title="Green">
			<div class="swatches">
				<span
					v-for="weight of colorWeights"
					:key="weight"
					:style="`--color: var(--green-${weight})`"
					class="swatch"
					:class="{ highlight: weight === 300 }"
					:title="`--green-${weight}`"
				/>
			</div>
		</Variant>

		<Variant title="Orange">
			<div class="swatches">
				<span
					v-for="weight of colorWeights"
					:key="weight"
					:style="`--color: var(--orange-${weight})`"
					class="swatch"
					:class="{ highlight: weight === 500 }"
					:title="`--orange-${weight}`"
				/>
			</div>
		</Variant>

		<Variant title="Red">
			<div class="swatches">
				<span
					v-for="weight of colorWeights"
					:key="weight"
					:style="`--color: var(--red-${weight})`"
					class="swatch"
					:class="{ highlight: weight === 400 }"
					:title="`--red-${weight}`"
				/>
			</div>
		</Variant>
	</Story>
</template>

<style scoped>
.swatches {
	display: flex;
	gap: 10px;
	padding: 10px;
}

.swatch {
	border-radius: 8px;
	flex-basis: 1;
	height: 100px;
	width: 100px;
	background-color: var(--color);
	position: relative;
}

.swatch.highlight::after {
	content: '⭐️';
	position: absolute;
	bottom: 5px;
	right: 5px;
}
</style>
