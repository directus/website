export const useSlider = ({ duration, length }: { duration: number; length: Ref<number> | number }) => {
	const active = ref(0);
	const direction = ref('next');
	const progress = ref(0);

	watch(active, (newActive, oldActive) => {
		direction.value = newActive > oldActive ? 'next' : 'prev';
	});

	let timeout: NodeJS.Timeout | null = null;

	const next = () => {
		active.value = (unref(active) + 1) % unref(length);
	};

	let waited = 0;

	const loop = () => {
		timeout = setTimeout(() => {
			waited += 1000;
			progress.value = Math.round((waited / duration) * 100);

			if (waited >= duration) {
				next();
				waited = 0;
				progress.value = 0;
			}

			loop();
		}, 1000);
	};

	const stop = () => {
		if (timeout) clearTimeout(timeout);
	};

	return { active, direction, progress, loop, stop };
};
