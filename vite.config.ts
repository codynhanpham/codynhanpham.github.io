import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import wasmPack from "vite-plugin-wasm-pack";
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		exclude: ["@rollup/browser"]
	},
	plugins: [
		tailwindcss(),
		enhancedImages(), // must come before the SvelteKit plugin
		sveltekit(),
		wasmPack("./src/lib-wasm"),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		}),
	],
});
