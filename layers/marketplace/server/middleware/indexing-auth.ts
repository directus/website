import { createError } from 'h3';
import { consola } from 'consola';

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW = 20 * 1000; // 20 seconds in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 1; // Max requests per window

function getRateLimitKey(event: any): string {
	return getRequestIP(event, { xForwardedFor: true }) || 'unknown';
}

function checkRateLimit(key: string): { allowed: boolean; resetTime: number; remaining: number } {
	const now = Date.now();
	const entry = rateLimitStore.get(key);

	if (!entry || now > entry.resetTime) {
		rateLimitStore.set(key, {
			count: 1,
			resetTime: now + RATE_LIMIT_WINDOW,
		});

		return {
			allowed: true,
			resetTime: now + RATE_LIMIT_WINDOW,
			remaining: RATE_LIMIT_MAX_REQUESTS - 1,
		};
	}

	if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
		// Rate limit exceeded
		return {
			allowed: false,
			resetTime: entry.resetTime,
			remaining: 0,
		};
	}

	// Increment counter
	entry.count++;
	rateLimitStore.set(key, entry);

	return {
		allowed: true,
		resetTime: entry.resetTime,
		remaining: RATE_LIMIT_MAX_REQUESTS - entry.count,
	};
}

// Clean up expired entries periodically (optional optimization)
setInterval(() => {
	const now = Date.now();

	for (const [key, entry] of rateLimitStore.entries()) {
		if (now > entry.resetTime) {
			rateLimitStore.delete(key);
		}
	}
}, RATE_LIMIT_WINDOW);

export default defineEventHandler(async (event) => {
	const url = getRequestURL(event);

	if (!url.pathname.includes('/api/search/indexing/')) {
		return;
	}

	// Apply rate limiting first
	const rateLimitKey = getRateLimitKey(event);
	const rateLimit = checkRateLimit(rateLimitKey);

	// Set rate limit headers
	setHeader(event, 'X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
	setHeader(event, 'X-RateLimit-Remaining', rateLimit.remaining.toString());
	setHeader(event, 'X-RateLimit-Reset', Math.ceil(rateLimit.resetTime / 1000).toString());

	if (!rateLimit.allowed) {
		consola.warn(`[RATE LIMIT] ${rateLimitKey} exceeded rate limit for indexing endpoints`);
		throw createError({
			statusCode: 429,
			statusMessage: 'Too Many Requests',
			data: {
				error: 'Rate limit exceeded',
				resetTime: Math.ceil(rateLimit.resetTime / 1000),
			},
		});
	}

	const config = useRuntimeConfig();
	const requiredApiKey = config.indexingApiKey;

	if (!requiredApiKey) {
		consola.warn('TYPESENSE_INDEXING_API_KEY not configured - indexing endpoints are unprotected!');
		return;
	}

	const apiKey = getHeader(event, 'x-api-key') || getHeader(event, 'authorization')?.replace('Bearer ', '');

	if (!apiKey || apiKey !== requiredApiKey) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Invalid or missing API key',
		});
	}

	consola.info(
		`[INDEXING] ${event.node.req.method} ${event.node.req.url} - API Key: ...${apiKey.slice(-4)} - Rate Limit: ${rateLimit.remaining} remaining`,
	);
});
