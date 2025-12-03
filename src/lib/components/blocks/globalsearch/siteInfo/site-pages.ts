import type { SearchResultsData, SearchResultOptions } from '../search-results.svelte';
import { RenderIcon } from '$lib/components/ui/simple-icons/simple-icons.svelte';
import { setGlobalSearchData, blurGlobalSearchInput } from '../globalsearch.svelte';

import {
	Briefcase,
	CircleUserRound,
	ExternalLink,
	House,
	Lightbulb,
	ScrollText,
} from '@lucide/svelte/icons';


function forceCleanUpSearchBarAfterClick() {
	setGlobalSearchData({
		value: '',
		searchResults: undefined,
	});
	blurGlobalSearchInput();
}


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
				keywords: ['nav:', 'profile', 'me', 'life', 'work', 'personal', 'social media'],
				icon: CircleUserRound
			}
		]
	},
	{
		heading: "External Links",
		items: [
			// current employer website
			{
				title: 'Oviedo Lab @ WashU',
				description: 'Current full-time job (their website is also made by yours truly)',
				href: 'https://oviedolab.org/',
				keywords: ['social:', 'external:', 'employment day-time job' , 'research lab', 'hysell oviedo', 'washington university in saint louis', 'auditory processing', 'neuroscience brain cortex'],
				icon: "oviedoLab",
				style: {
					icon: "width: calc(var(--spacing) * 7.5); height: calc(var(--spacing) * 7.5);"
				},
				secondaryIcon: ExternalLink,
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://oviedolab.org/', '_blank');
				},
			},


			{
				title: 'GitHub',
				description: '$  git checkout --detach codynhanpham',
				href: 'https://github.com/codynhanpham',
				keywords: ['social:', 'git', 'profile', 'social media'],
				icon: "github",
				secondaryIcon: ExternalLink,
				style: {
					description: "font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;"
				},
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://github.com/codynhanpham', '_blank');
				},
			},
			{
				title: 'ORCID',
				description: 'Scientific Publications',
				href: 'https://orcid.org/0009-0000-4898-4684',
				keywords: ['social:', 'cid', 'orcid.org', 'publications profile', 'papers', 'scholar', 'professional resume'],
				icon: "orcid",
				secondaryIcon: ExternalLink,
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://orcid.org/0009-0000-4898-4684', '_blank');
				},
			},

			// linkedin x / twitter instagram facebook youtube bluesky
			{
				title: 'LinkedIn',
				description: undefined,
				href: 'https://www.linkedin.com/in/codynhanpham/',
				keywords: ['social:', 'linkedin', 'profile', 'social media'],
				icon: "linkedin",
				secondaryIcon: ExternalLink,
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://www.linkedin.com/in/codynhanpham/', '_blank');
				},
			},
			{
				title: 'X / Twitter',
				description: undefined,
				href: 'https://x.com/codynhanpham',
				keywords: ['social:', 'twitter', 'twt', 'x', 'profile', 'social media'],
				icon: "x",
				secondaryIcon: ExternalLink,
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://x.com/codynhanpham', '_blank');
				},
			},
			{
				title: 'Instagram',
				description: undefined,
				href: 'https://www.instagram.com/codynhanpham/',
				keywords: ['social:', 'instagram', 'ig', 'profile', 'social media'],
				icon: "instagram",
				secondaryIcon: ExternalLink,
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://www.instagram.com/codynhanpham/', '_blank');
				},
			},
			{
				title: 'Facebook',
				description: undefined,
				href: 'https://www.facebook.com/codynhanpham/',
				keywords: ['social:', 'facebook', 'fb', 'profile', 'social media'],
				icon: "facebook",
				secondaryIcon: ExternalLink,
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://www.facebook.com/codynhanpham/', '_blank');
				},
			},
			{
				title: 'YouTube',
				description: undefined,
				href: 'https://youtube.com/codynhanpham',
				keywords: ['social:', 'youtube', 'yt', 'profile', 'social media'],
				icon: "youtube",
				secondaryIcon: ExternalLink,
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://youtube.com/codynhanpham', '_blank');
				},
			},
			{
				title: 'Bluesky',
				description: undefined,
				href: 'https://bsky.app/profile/codynhanpham.bsky.social',
				keywords: ['social:', 'bluesky', 'bsky', 'profile', 'social media'],
				icon: "bluesky",
				secondaryIcon: ExternalLink,
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://bsky.app/profile/codynhanpham.bsky.social', '_blank');
				},
			}
		]
	}
];
