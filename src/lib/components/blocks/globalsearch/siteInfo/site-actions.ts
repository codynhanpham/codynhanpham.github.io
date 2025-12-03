import type { SearchResultsData, SearchResultOptions } from '../search-results.svelte';
import { setClientForcedSmallScreen, isClientForcedSmallScreen } from '$routes/+layout.svelte';

import { resetMode, setMode } from 'mode-watcher';

import {
	Fullscreen,
	Moon,
	MoveUp,
	MoveDown,
	RefreshCw,
	Sun,
	SunMoon,
	TabletSmartphone,
} from '@lucide/svelte/icons';

function toggleFullscreen() {
    if (typeof document === 'undefined') {
		return;
	}
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		document.documentElement.requestFullscreen();
	}
}

export const siteActions: SearchResultsData = [
	// ---- THEME ---- //
	{
		heading: 'Theme',
		items: [
			{
				title: 'Dark Theme',
				description: 'Switch to dark mode',
				keywords: ['theme:', 'dark mode'],
				icon: Moon,
				onClick: () => {
					setMode('dark');
				}
			},
			{
				title: 'Light Theme',
				description: 'Switch to light mode',
				keywords: ['theme:', 'light mode'],
				icon: Sun,
				onClick: () => {
					setMode('light');
				}
			},
			{
				title: 'System Theme',
				description: 'Use system default theme',
				keywords: ['theme:', 'system mode default', 'system default'],
				icon: SunMoon,
				onClick: () => {
					resetMode();
				}
			}
		]
	},
	{
		heading: 'Browser',
		items: [
			{
				title: 'Toggle Fullscreen',
				description: 'Toggle fullscreen mode',
				keywords: ['browser:', 'fullscreen'],
				icon: Fullscreen,
				onClick: () => {
					toggleFullscreen();
				}
			},
			// {
			// 	title: 'Small Screen Layout',
			// 	description: 'Toggle the forcing of small screen (mobile) layout for this session. No effect if you are already in small screen mode.',
			// 	keywords: ['browser:', 'mobile'],
			// 	icon: TabletSmartphone,
			// 	onClick: () => {
			// 		setClientForcedSmallScreen(!isClientForcedSmallScreen());
			// 	}
			// },
			{
				title: 'Reload Page',
				description: 'Trigger a hard reload of the page',
				keywords: ['browser:', 'reload', 'refresh', 'f5'],
				icon: RefreshCw,
				onClick: () => {
					window.location.href = window.location.href;
				}
			},
			{
				title: 'Back top Top',
				description: undefined,
				keywords: ['browser:', 'top', 'scroll'],
				icon: MoveUp,
				onClick: () => {
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}
			},
			{
				title: 'Scroll to Bottom',
				description: undefined,
				keywords: ['browser:', 'bot', 'scroll'],
				icon: MoveDown,
				onClick: () => {
					window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
				}
			}
		]
	}
];
