export const socialIcons = {
	github: 'mdi:github',
	discourse: 'mdi:forum-outline',
	youtube: 'mdi:youtube',
	docker: 'mdi:docker',
	npm: 'mdi:npm',
	x: 'fa6-brands:x-twitter',
	linkedin: 'mdi:linkedin',
	twitter: 'mdi:twitter',
};

export const getSocialIcon = (service: string) => {
	return socialIcons[service as keyof typeof socialIcons] ?? 'mdi:link';
};
