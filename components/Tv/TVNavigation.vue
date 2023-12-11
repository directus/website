<template>
	<BaseContainer>
		<nav>
			<ul>
				<li class="logo">
					<a href="/rabbit-hole"><img src="~/assets/svg/rabbit-hole.svg" alt="The Rabbit Hole by Directus" /></a>
				</li>
				<li><a href="/">Website</a></li>
				<li><a href="https://docs.directus.io">Docs</a></li>
				<li><a href="/demo">Book a Demo</a></li>
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
			/>
		</nav>
	</BaseContainer>
</template>

<script setup>
defineProps({
	buttonClass: String,
});
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

@media (width > 60rem) {
	nav ul li:not(.logo) {
		display: block;
	}
}
</style>
