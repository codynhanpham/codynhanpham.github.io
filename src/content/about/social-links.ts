import type { SearchResultsData, SearchResultOptions } from '$lib/components/blocks/globalsearch/search-results.svelte';
import { forceCleanUpSearchBarAfterClick } from '$lib/components/blocks/globalsearch/globalsearch.svelte';

import {
	ExternalLink,
} from '@lucide/svelte/icons';


export const socialLinks: SearchResultsData = [
    
	{
		heading: "External Links",
		items: [
			// current employer website
			{
				title: 'Oviedo Lab @ WashU',
				description: 'Current full-time job (their website is also made by yours truly)',
				href: 'https://oviedolab.org/',
				keywords: ['social:', 'link:', 'external:', 'employment day-time job' , 'research lab', 'hysell oviedo', 'washington university in saint louis', 'auditory processing', 'neuroscience brain cortex'],
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
				title: 'ORCID',
				description: 'Scientific Publications',
				href: 'https://orcid.org/0009-0000-4898-4684',
				keywords: ['social:', 'link:', 'external:', 'cid', 'orcid.org', 'publications profile', 'papers', 'academic', 'scholar', 'professional resume'],
				icon: "orcid",
				secondaryIcon: ExternalLink,
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://orcid.org/0009-0000-4898-4684', '_blank');
				},
			},
            {
				title: 'Google Scholar',
                shortTitle: 'Scholar',
				description: 'Scientific Publications',
				href: 'https://scholar.google.com/citations?user=ttIlQy8AAAAJ',
				keywords: ['social:', 'link:', 'external:', 'publications profile', 'papers', 'research', 'academic', 'scholar', 'professional resume'],
				icon: "googleScholar",
				secondaryIcon: ExternalLink,
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://scholar.google.com/citations?user=ttIlQy8AAAAJ', '_blank');
				},
            },

        ],
    },
    {
        heading: "Social Media",
        items: [
			{
				title: 'GitHub',
				description: '$  git checkout --detach codynhanpham',
				href: 'https://github.com/codynhanpham',
				keywords: ['social:', 'link:', 'git', 'profile', 'social media'],
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
				title: 'LinkedIn',
				description: undefined,
				href: 'https://www.linkedin.com/in/codynhanpham/',
				keywords: ['social:', 'link:', 'linkedin', 'profile', 'social media'],
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
				keywords: ['social:', 'link:', 'twitter', 'twt', 'x', 'profile', 'social media'],
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
				keywords: ['social:', 'link:', 'instagram', 'ig', 'profile', 'social media'],
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
				keywords: ['social:', 'link:', 'facebook', 'fb', 'profile', 'social media'],
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
				keywords: ['social:', 'link:', 'youtube', 'yt', 'profile', 'social media'],
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
				keywords: ['social:', 'link:', 'bluesky', 'bsky', 'profile', 'social media'],
				icon: "bluesky",
				secondaryIcon: ExternalLink,
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://bsky.app/profile/codynhanpham.bsky.social', '_blank');
				},
			},
			{
				title: 'MyAnimeList',
				shortTitle: 'MAL',
				description: undefined,
				href: 'https://myanimelist.net/profile/codynhanpham',
				keywords: ['social:', 'link:', 'anime', 'manga', 'otaku culture', 'japanese', 'weebu', 'profile', 'social media'],
				icon: "myanimelist",
				secondaryIcon: ExternalLink,
				onClick: (event: MouseEvent) => {
					forceCleanUpSearchBarAfterClick();
					event.preventDefault();
					window.open('https://myanimelist.net/profile/codynhanpham', '_blank');
				},
			}
		]
	}

]