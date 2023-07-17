import { File } from '~~/types';

export default function useFiles() {
	const config = useRuntimeConfig();

	function fileUrl(fileId: string | File | null | undefined) {
		if (typeof fileId === 'object') {
			fileId = fileId?.id;
		}

		return `${config.public.directusUrl}/assets/${fileId}?token=${config.public.directusToken}`;
	}

	return {
		fileUrl,
	};
}
