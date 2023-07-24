import { File } from '~/types/schema';

export const getFileUrl = (fileId: string | File | null | undefined) => {
	const config = useRuntimeConfig();

	if (typeof fileId === 'object') {
		fileId = fileId?.id;
	}

	return `${config.public.directusUrl}/assets/${fileId}?token=${config.public.directusToken}`; /* TODO Drop the token when we make assets public. */
};
