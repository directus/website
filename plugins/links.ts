export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive('links', {
		mounted(el: HTMLElement) {
			const anchors = [...el.querySelectorAll('a')];

			for (const anchor of anchors) {
				const href = anchor.getAttribute('href');

				if (!href) return;

				const url = new URL(href, window.location.origin);

				const isLocal = url.hostname === 'directus.io';

				if (isLocal) {
					anchor.addEventListener('click', (e) => {
						const { pathname, searchParams, hash } = new URL(anchor.href);

						navigateTo({
							path: pathname,
							hash,
							query: Object.fromEntries(searchParams.entries()),
						});

						e.preventDefault();
					});
				}
				else {
					anchor.setAttribute('target', '_blank');
					anchor.setAttribute('rel', 'noopener noreferrer');
				}
			}
		},
	});
});
