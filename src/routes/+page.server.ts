// Server load function: evaluates feature flags and passes to client
import { showNewDesign, bannerText } from '$lib/flags';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [isNewDesign, banner] = await Promise.all([showNewDesign(), bannerText()]);

	return {
		showNewDesign: isNewDesign,
		bannerText: banner
	};
};
