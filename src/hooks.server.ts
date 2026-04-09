// Server hook: integrates Flags SDK with SvelteKit
// Creates the /.well-known/vercel/flags endpoint for Flags Explorer
import { createHandle } from 'flags/sveltekit';
import { env } from '$env/dynamic/private';
import * as flags from '$lib/flags';

export const handle = createHandle({
	secret: env.FLAGS_SECRET ?? '',
	flags
});
