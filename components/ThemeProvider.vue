<script lang="ts" setup>
export interface ThemeProviderProps {
	variant?: 'light' | 'dark' | null;
	on?: 'background' | 'colorful';
}

const props = withDefaults(defineProps<ThemeProviderProps>(), {
	on: 'background',
});

const { variant } = toRefs(props);

const parentTheme = inject('theme', null);

const currentTheme = computed(() => unref(variant) ?? unref(parentTheme));

provide('theme', currentTheme);
</script>

<template>
	<div v-if="variant" class="theme-provider" :class="[variant, `on-${on}`]"><slot /></div>
	<slot v-else />
</template>

<style lang="scss" scoped>
.theme-provider {
	color: var(--foreground);
}

.light {
	--primary: var(--primary-400);
	--secondary: #fe97dc;
	--danger: #dd3f53;
	--background: var(--white);
	--foreground: var(--black);

	--primary-50: #f0ecff;
	--primary-100: #d1c7ff;
	--primary-200: #a38fff;
	--primary-300: #7557ff;
	--primary-400: #6644ff;
	--primary-500: #5c3de6;
	--primary-600: #4730b3;
	--primary-700: #332280;
	--primary-800: #1f144c;
	--primary-900: #0a0719;

	--white: #ffffff;
	--gray-50: #f8fafc;
	--gray-100: #f1f5f9;
	--gray-200: #e2e8f0;
	--gray-300: #cbd5e1;
	--gray-400: #94a3b8;
	--gray-500: #64748b;
	--gray-600: #475569;
	--gray-700: #334155;
	--gray-800: #1e293b;
	--gray-900: #0f172a;
	--black: #0e1c2f;

	--shadow-base:
		0px 30px 30px -30px rgba(30, 41, 59, 0.1), 0px 2px 4px 0px rgba(30, 41, 59, 0.05),
		0px -2px 5px 0px rgba(30, 41, 59, 0.05);
	--shadow-lg: 0px 10px 40px -10px rgba(14, 28, 47, 0.25), 0px 2px 4px 0px rgba(14, 28, 47, 0.05);

	&.on-colorful {
		--gray-50: #f2eaf0;
		--gray-100: #f6e9f2;
		--gray-200: #efd6e7;
		--gray-300: #d3b2c8;
		--gray-400: #b796ac;
		--gray-500: #8f647f;
		--gray-600: #7f526d;
		--gray-700: #6f415a;
		--gray-800: #51283a;
		--gray-900: #331621;
	}
}

.dark {
	--primary: var(--primary-700);
	--secondary: #fe97dc;
	--danger: #dd3f53;
	--background: var(--gray-50);
	--foreground: var(--white);

	--primary-50: #0a0719;
	--primary-100: #1f144c;
	--primary-200: #332280;
	--primary-300: #4730b3;
	--primary-400: #5c3de6;
	--primary-500: #6644ff;
	--primary-600: #7557ff;
	--primary-700: #a38fff;
	--primary-800: #d1c7ff;
	--primary-900: #f0ecff;

	--black: #0e1c2f;
	--gray-50: #0f172a;
	--gray-100: #1e293b;
	--gray-200: #334155;
	--gray-300: #475569;
	--gray-400: #64748b;
	--gray-500: #94a3b8;
	--gray-600: #cbd5e1;
	--gray-700: #e2e8f0;
	--gray-800: #f1f5f9;
	--gray-900: #f8fafc;
	--white: #ffffff;

	--shadow-base:
		0px 30px 30px -30px rgba(30, 41, 59, 0.1), 0px 2px 4px 0px rgba(30, 41, 59, 0.05),
		0px -2px 5px 0px rgba(30, 41, 59, 0.05);
	--shadow-lg: 0px 10px 40px -10px rgba(14, 28, 47, 0.25), 0px 2px 4px 0px rgba(14, 28, 47, 0.05);
}
</style>
