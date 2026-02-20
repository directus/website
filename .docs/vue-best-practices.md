# Vue Component Best Practices

Conventions and patterns for Vue components in this project.

## Component Structure

Every component should follow this order:

```vue
<script setup lang="ts">
// 1. Imports (auto-imported by Nuxt, so usually minimal)
// 2. Props
// 3. Emits
// 4. Composables
// 5. Reactive state
// 6. Computed properties
// 7. Functions
// 8. Lifecycle hooks / watchers
</script>

<template>
  <!-- Single root element preferred -->
</template>

<style lang="scss" scoped>
/* Styles always scoped */
</style>
```

## Props

Use `defineProps<T>()` with TypeScript interfaces. Use `withDefaults()` when defaults are needed.

```vue
<script setup lang="ts">
// Props destructure is enabled in this project
const { title, variant = 'default' } = defineProps<{
	title: string;
	variant?: 'default' | 'compact';
}>();
</script>
```

## Styling

- Always use `<style lang="scss" scoped>`
- Use CSS custom properties from `app/assets/css/vars.css` for colors, spacing, fonts
- Use `--space-*` tokens for spacing (not hardcoded `px`/`rem` values)
- Responsive breakpoints: `50rem` (tablet), `68rem` (desktop)

```scss
.container {
	padding: var(--space-4);

	@media (width > 50rem) {
		padding: var(--space-6);
	}

	@media (width > 68rem) {
		padding: var(--space-8);
	}
}
```

## Base Components

Always use existing Base components instead of raw HTML for common patterns:

| Component | Use for |
|-----------|---------|
| `BaseButton` | Buttons and button-like links |
| `BaseCard` | Card layouts |
| `BaseContainer` | Page-width containers |
| `BaseHeading` | Section headings |
| `BaseText` | Body text blocks |
| `BaseIcon` | Icons |
| `BaseBadge` | Badges and tags |
| `BaseMedia` | Images and video |

## Data Fetching

Block components receive a `uuid` prop and fetch their own data:

```vue
<script setup lang="ts">
const { uuid } = defineProps<{ uuid: string }>();

const { data: block } = useAsyncData(uuid, () => {
	// fetch from Directus API
});
</script>
```

## Composables

Prefer [VueUse](https://vueuse.org) over writing custom composables for common browser APIs:

| Instead of | Use |
|------------|-----|
| Custom `ResizeObserver` | `useResizeObserver` |
| Custom `IntersectionObserver` | `useIntersectionObserver` |
| Custom keyboard listeners | `useEventListener` / `useMagicKeys` |
| Custom `matchMedia` | `useMediaQuery` |
| Custom scroll listener | `useScroll` / `useElementVisibility` |
| Custom `localStorage` wrapper | `useLocalStorage` |
| Custom clipboard handling | `useClipboard` |
| Custom debounce/throttle | `useDebounceFn` / `useThrottleFn` |

VueUse is auto-imported by Nuxt — no import statements needed.

## Common Mistakes to Avoid

- Missing `scoped` on `<style>` tags — styles leak globally
- Using `console.log` or `debugger` — ESLint will reject these
- Nested ternaries — use `if`/`else` or computed properties instead
- Hardcoded colors/spacing — use CSS custom properties
- Creating new primitives when a Base component exists
- Using `any` type — provide proper TypeScript types
- Inline styles — use scoped SCSS instead
