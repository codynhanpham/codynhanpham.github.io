import type { SearchResultsData, SearchResultOptions } from '../search-results.svelte';
import { RenderIcon } from '$lib/components/ui/simple-icons/simple-icons.svelte';
import { setGlobalSearchData, blurGlobalSearchInput, forceCleanUpSearchBarAfterClick } from '../globalsearch.svelte';

import { socialLinks } from '$content/about/social-links';

import {
	Briefcase,
	CircleUserRound,
	ExternalLink,
	House,
	Lightbulb,
	ScrollText,
} from '@lucide/svelte/icons';


export const sitePages: SearchResultsData = [
	{
		heading: "Main Navigation",
		items: [
			{
				title: 'Home',
				description: 'Navigate back to Home',
				href: '/',
				keywords: ['nav:', 'dashboard', 'root', 'main'],
				icon: House
			},
			{
				title: 'Projects',
				description: 'Projects contributed to over the years',
				href: '/projects',
				keywords: ['nav:', 'program', 'creation', 'publications'],
				icon: Lightbulb
			},
			{
				title: 'Professional',
				description: 'Real work, real impact: the Timeline',
				href: '/works',
				keywords: ['nav:', 'employ', 'employment', 'work', 'resume', 'timeline', 'cv', 'curriculum vitae', 'history', 'papers' , 'publications'],
				icon: Briefcase
			},
			{
				title: 'Resume',
				description: 'The journey highlights, on a single page',
				href: '/works/resume',
				keywords: ['highlights', 'employment', 'work', 'resume', 'cv', 'curriculum vitae', 'timeline'],
				icon: ScrollText
			},
			{
				title: 'About',
				description: 'Even more about me',
				href: '/about',
				keywords: ['nav:', 'profile', 'me', 'life', 'work', 'personal', 'social media', 'man cnp', 'man codynhanpham'],
				icon: CircleUserRound
			}
		]
	},

	...socialLinks,
];
