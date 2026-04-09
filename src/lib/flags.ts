// Feature flag definitions using Vercel Flags SDK for SvelteKit
import { flag } from 'flags/sveltekit';

// Boolean flag: toggle new design on/off
export const showNewDesign = flag<boolean>({
	key: 'show-new-design',
	description: 'Show the new design of the page',
	defaultValue: false,
	options: [
		{ value: true, label: 'New Design' },
		{ value: false, label: 'Old Design' }
	],
	decide() {
		return this.defaultValue as boolean;
	}
});

// String flag: campaign banner text with variants
export const bannerText = flag<string>({
	key: 'banner-text',
	description: 'Campaign banner text variant',
	defaultValue: 'none',
	options: [
		{ value: 'spring', label: 'Spring Campaign' },
		{ value: 'summer', label: 'Summer Campaign' },
		{ value: 'none', label: 'No Banner' }
	],
	decide() {
		return this.defaultValue as string;
	}
});
