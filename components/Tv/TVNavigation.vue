<template>
	<BaseContainer>
		<nav>
			<ul>
				<li class="logo">
					<a href="/rabbit-hole"><img src="~/assets/svg/rabbit-hole.svg" alt="The Rabbit Hole by Directus" /></a>
				</li>
				<li><NuxtLink href="/">Website</NuxtLink></li>
				<li><a href="https://docs.directus.io">Docs</a></li>
				<li><NuxtLink href="/demo">Book a Demo</NuxtLink></li>
			</ul>
			<BaseButton
				label="Subscribe"
				class="subscribe"
				:class="buttonClass"
				type="button"
				color="white"
				size="large"
				outline
				icon-start="account_circle"
				@click="openModal"
			/>
		</nav>
	</BaseContainer>
	<dialog ref="modal">
		<button @click="closeModal">Close</button>
		<p>Subscribe modal!</p>
	</dialog>
</template>

<script setup>
const modal = ref(null);

defineProps({
	buttonClass: String,
});

const openModal = () => modal.value.showModal();
const closeModal = () => modal.value.close();
</script>

<style lang="scss" scoped>
nav {
	display: flex;
	justify-content: space-between;
	padding: 1em 0;
	ul {
		padding-left: 0;
		list-style-type: none;
		display: flex;
		align-items: center;
		gap: 3em;
		margin: 0;
		li {
			img {
				height: 3rem;
			}
			a {
				color: white;
				text-decoration: none;
			}
			&:not(.logo) {
				display: none;
				padding-bottom: 1.75rem;
			}
		}
	}
	.subscribe {
		--background-color: white;
		margin: 2rem 3rem 2rem 0;
	}
}

dialog {
	background: var(--tv-background);
	color: white;
	border: 1px solid black;
	border-radius: var(--rounded-lg);
	&::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}
}

@media (width > 60rem) {
	nav ul li:not(.logo) {
		display: block;
	}
}
</style>
