export const useSlider = ({ duration, length }: { duration: number; length: Ref<number> | number }) => {
	const active = ref(0);
	const direction = ref('next');
	const progress = ref(0);
	const playing = ref(false);

	let timeout: NodeJS.Timeout | null = null;

	const next = () => {
		active.value = (unref(active) + 1) % unref(length);
	};

	let waited = 0;

	const loop = () => {
		playing.value = true;

		timeout = setTimeout(() => {
			waited += 1000;
			progress.value = Math.ceil((waited / duration) * 100);

			if (waited >= duration) {
				next();
			}

			loop();
		}, 1000);
	};

	const stop = () => {
		playing.value = false;
		if (timeout) clearTimeout(timeout);
	};

	watch(active, (newActive, oldActive) => {
		direction.value = newActive > oldActive ? 'next' : 'prev';
		progress.value = 0;
		waited = 0;
	});

	return { active, direction, progress, loop, stop, playing };
};
