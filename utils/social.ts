export const socialIcons = {
	github: 'mdi:github',
	discord: 'mdi:discord',
	youtube: 'mdi:youtube',
	docker: 'mdi:docker',
	npm: 'mdi:npm',
	x: 'fa6-brands:x-twitter',
	mastodon: 'mdi:mastodon',
	linkedin: 'mdi:linkedin',
};

export const getSocialIcon = (service: string) => {
	return socialIcons[service as keyof typeof socialIcons];
};
