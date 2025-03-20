import type { JsonType } from 'posthog-js';
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig, useState } from '#app';
import { getCookie } from 'h3';
import { PostHog } from 'posthog-node';

export default defineNuxtPlugin({
	name: 'posthog-server',
	enforce: 'pre',
	setup: async () => {
		const config = useRuntimeConfig().public.posthog;

		const event = useRequestEvent();
		const cookie = event ? getCookie(event, `ph_${config.publicKey}_posthog`) : undefined;
		const identity = JSON.parse(cookie ?? '{}');
		const distinctId = identity?.distinct_id ?? undefined;

		if (config.disabled) {
			return {
				provide: {
					serverPosthog: null as PostHog | null,
				},
			};
		}

		if (config.publicKey.length === 0) {
			// PostHog public key is not defined. Skipping PostHog setup.
			// User has already been warned on dev startup
			return {};
		}

		const posthog = new PostHog(config.publicKey, { host: config.host });

		const { featureFlags, featureFlagPayloads } = await posthog.getAllFlagsAndPayloads(distinctId);

		useState<Record<string, boolean | string> | undefined>('ph-feature-flags', () => featureFlags);
		useState<Record<string, JsonType> | undefined>('ph-feature-flag-payloads', () => featureFlagPayloads);

		return {
			provide: {
				serverPosthog: posthog,
			},
		};
	},
});
