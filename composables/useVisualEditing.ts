import { apply as applyVisualEditing, setAttr } from '@directus/visual-editing';
import type { PrimaryKey } from '@directus/types';

interface ApplyOptions {
	directusUrl: string;
	elements?: HTMLElement[] | HTMLElement;
	onSaved?: (data: { collection?: string; item?: PrimaryKey | null; payload?: Record<string, any> }) => void;
	customClass?: string;
}

export default function useVisualEditing() {
	const isVisualEditingEnabled = useState('visual-editing-enabled', () => false);
	const route = useRoute();

	const {
		public: { enableVisualEditing, directusUrl },
	} = useRuntimeConfig();

	onMounted(() => {
		if (enableVisualEditing && route.query['visual-editing'] === 'true') {
			isVisualEditingEnabled.value = true;
		} else if (route.query['visual-editing'] === 'false') {
			isVisualEditingEnabled.value = false;
		}
	});

	const apply = (options: Pick<ApplyOptions, 'elements' | 'onSaved' | 'customClass'>) => {
		if (!isVisualEditingEnabled.value) return;

		applyVisualEditing({
			...options,
			directusUrl: directusUrl as string,
		});
	};

	const autoApply = (elementSelector: string, refreshCallback?: () => Promise<void>) => {
		onMounted(() => {
			if (!isVisualEditingEnabled.value) return;

			const el = document.querySelector(elementSelector) as HTMLElement;
			if (!el) return;

			apply({
				elements: el,
				customClass: 'visual-editing-button-class',
				onSaved: async () => {
					await refreshCallback?.();
					await nextTick();
					apply({ elements: el });
				},
			});
		});
	};

	return {
		isVisualEditingEnabled,
		apply,
		autoApply,
		setAttr,
	};
}
