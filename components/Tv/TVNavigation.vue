<template>
	<BaseContainer>
		<nav>
			<ul>
				<li class="logo">
					<a href="/tv"><img src="~/assets/svg/logomark-white.svg" alt="Directus" /></a>
				</li>
				<li><a href="/">Website</a></li>
				<li><a href="https://docs.directus.io">Docs</a></li>
				<li><a href="/demo">Book a Demo</a></li>
			</ul>
			<BaseButton
				label="Subscribe"
				class="subscribe"
				type="button"
				color="white"
				size="large"
				outline
				icon-start="account_circle"
			/>
		</nav>
	</BaseContainer>
</template>

<style lang="scss" scoped>
nav {
	display: flex;
	justify-content: space-between;
	padding: 3em 0;
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
			}
		}
	}
	.subscribe {
		--background-color: rgba(255, 255, 255, 0.12);
		color: white;
		&:hover {
			color: inherit !important;
			--background-color: rgba(255, 255, 255, 0.25);
		}
	}
}

@media (width > 60rem) {
	nav ul li:not(.logo) {
		display: block;
	}
}
</style>
