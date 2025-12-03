import { mdsvex } from 'mdsvex';
import { enhancedImages } from 'mdsvex-enhanced-images';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
/**
 * @import {ElementContent} from 'hast'
 */
import {fromHtmlIsomorphic} from 'hast-util-from-html-isomorphic';

import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { join } from "path";
const dirname = import.meta.dirname;

const linkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link-icon lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

/** @type {import('@sveltejs/kit').Config} */
/** @type {Array<ElementContent>} */
const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex({
			smartypants: {
				quotes: true,
				ellipses: true,
				backticks: false,
				dashes: "oldschool",
			},
			layout: {
				resume: join(dirname, "src/content/layouts/resume/resume.svelte"),
			},
			extensions: ['.svx'],
			remarkPlugins: [
				enhancedImages,
			],
			rehypePlugins: [
				[rehypeExternalLinks, { rel: ['nofollow', 'noopener', 'noreferrer'], target: '_blank' }],
				rehypeSlug,
				[rehypeAutolinkHeadings, {
					behavior: 'append',
					content: fromHtmlIsomorphic(
						linkSvg,
						{fragment: true}
					).children 
				}],
			],
		})
	],
	kit: {
		adapter: adapter(
			{
				pages: 'build',
				assets: 'build',
				fallback: '404.html',
				precompress: false,
				strict: true,
			}
		),
		alias: {
			'$src': 'src',
			'$lib': 'src/lib',
			'$routes': 'src/routes',
			'$content': 'src/content',
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
