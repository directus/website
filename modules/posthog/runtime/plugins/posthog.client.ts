import { defineNuxtPlugin, useCookie, useRouter, useRuntimeConfig, useState } from '#app';
import { posthog, type PostHog, type JsonType, type PostHogConfig } from 'posthog-js';
import { defu } from 'defu';

export default defineNuxtPlugin({
	name: 'posthog',
	enforce: 'pre',
	setup: async () => {
		const config = useRuntimeConfig().public.posthog;

		if (config.disabled) {
			return {
				provide: {
					posthog: null as PostHog | null,
				},
			};
		}

		const posthogFeatureFlags = useState<Record<string, boolean | string> | undefined>('ph-feature-flags');
		const posthogFeatureFlagPayloads = useState<Record<string, JsonType> | undefined>('ph-feature-flag-payloads');

		const clientOptions = defu<PostHogConfig, Partial<PostHogConfig>[]>(config.clientOptions ?? {}, {
			api_host: config.host,
			ui_host: '<ph_app_host>',
			capture_pageview: false,
			bootstrap: {
				featureFlags: posthogFeatureFlags.value,
				featureFlagPayloads: posthogFeatureFlagPayloads.value,
			},
			loaded: (posthog) => {
				if (import.meta.env.MODE === 'development') posthog.debug();
			},
		});

		const identity = useCookie(`ph_${config.publicKey}_posthog`, { default: () => '' }) as any;

		clientOptions.bootstrap.distinctID = identity.value?.distinct_id ?? undefined;

		const posthogClient = posthog.init(config.publicKey, clientOptions);

		if (config.capturePageViews) {
			// Make sure that pageviews are captured with each route change
			const router = useRouter();

			router.beforeEach(() => {
				posthog.capture('$pageview');
			});
		}

		posthog.onFeatureFlags((flags, featureFlags) => {
			posthogFeatureFlags.value = featureFlags;

			posthogFeatureFlagPayloads.value = flags.reduce<Record<string, JsonType>>((acc, flag) => {
				acc[flag] = posthog.getFeatureFlagPayload(flag);
				return acc;
			}, {});
		});

		return {
			provide: {
				posthog: (posthogClient ? posthogClient : null) as PostHog | null,
			},
		};
	},
});

declare module '#app' {
	interface NuxtApp {
		$posthog: PostHog | null;
	}
}

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$posthog: PostHog | null;
	}
}
