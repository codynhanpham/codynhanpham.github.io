<script lang="ts" module>
    export type NavMenuProps = {
        isNavOpen?: boolean;
		forcedSmallScreen?: boolean;
        horizontalNavBarWidth?: number;
        verticalNavBarPaddingSize?: number;
        verticalNavBarBtnWidth?: number;
    }
</script>

<script lang="ts">
	
	import { LayoutUtils } from '$lib';

	import { cn } from '$lib/utils';

	import { Button } from "$lib/components/ui/button";

	import { NavMenuData } from '$lib/front-end/NavMenuData';
	import ModeToggle from '$lib/components/blocks/mode-toggle/mode-toggle.svelte';
	import { navLog, logNav, loadNavLog, saveNavLog, scrollY } from '$routes/appstate.svelte';

	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate, goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';

	import { slide } from 'svelte/transition';
	import { cubicIn } from 'svelte/easing';

	const isRootPage = $derived(page.url.pathname === '/');

	let isPageReady = $state(false);

    let {
        isNavOpen = $bindable(false),
		forcedSmallScreen = $bindable(false),
        horizontalNavBarWidth = $bindable(0),
        verticalNavBarPaddingSize = $bindable(0),
        verticalNavBarBtnWidth = $bindable(0),
    }: NavMenuProps = $props();

    let isSmallScreen = $state(false);
    let horizontalNavBar: HTMLElement | null;
    let horizontalNavBarResizeObserver: ResizeObserver;
    let windowVisualViewportHeight: number | null = $state(null);

	let clearScrollYAfterNavStack: string[] = []; // a queue of page paths whose scrollY state needs to be cleared after nav

	if (browser) {
		if (localStorage.getItem('isNavOpen') === null) {
			localStorage.setItem('isNavOpen', 'true');
			isNavOpen = true;
		} else {
			isNavOpen = localStorage.getItem('isNavOpen') === 'true' ? true : false;
		}

		if (sessionStorage.getItem('forcedSmallScreen') === null) {
			sessionStorage.setItem('forcedSmallScreen', 'false');
			forcedSmallScreen = false;
		} else {
			forcedSmallScreen = sessionStorage.getItem('forcedSmallScreen') === 'true' ? true : false;
		}
	}


	onMount(() => {
		windowVisualViewportHeight = window.visualViewport?.height || null;
		horizontalNavBarResizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				const width = entry.contentRect.width;
				horizontalNavBarWidth = width;
			}
		});
		horizontalNavBar = document.getElementById('horizontal-nav-bar');
		if (horizontalNavBar) {
			horizontalNavBarResizeObserver.observe(horizontalNavBar);
		}

		verticalNavBarBtnWidth = Math.min(LayoutUtils.rem2px(7), Math.ceil((window.innerWidth - LayoutUtils.rem2px(2.5)) / (NavMenuData.length)));
		horizontalNavBarWidth = LayoutUtils.getComputedStyleWidthPixel(horizontalNavBar);
		
		isSmallScreen = LayoutUtils.isSmallScreen() || forcedSmallScreen;
		if (isSmallScreen) {
			horizontalNavBarWidth = 0;
		}

		window.scrollTo(0, 0);

		window.addEventListener('resize', () => {
			isSmallScreen = LayoutUtils.isSmallScreen() || forcedSmallScreen;		
			horizontalNavBarWidth = LayoutUtils.getComputedStyleWidthPixel(horizontalNavBar);
			verticalNavBarBtnWidth = Math.min(LayoutUtils.rem2px(7), Math.ceil((window.innerWidth - LayoutUtils.rem2px(2.5)) / (NavMenuData.length)));
		});
		window.visualViewport?.addEventListener('resize', () => {
			windowVisualViewportHeight = window.visualViewport?.height || null;
		});

		
		loadNavLog();

		isPageReady = true;

		return () => {
			horizontalNavBarResizeObserver.disconnect();
		};
	});

	afterNavigate(({ from, to }) => {
		if (from === null) {
			logNav(page.url.pathname);
			return;
		}

		const scrollYKeys = Object.keys(scrollY);
		for (const key of clearScrollYAfterNavStack) {
			if (scrollYKeys.includes(key)) {
				scrollY[key] = 0;
			}
		}
		clearScrollYAfterNavStack = [];

		// A soft-bounce before logging
		setTimeout(() => {
			if (!to || !to.route || !to.route.id) {
				return;
			}
			if (from.route.id !== page.url.pathname && page.url.pathname === to.route.id) {
				logNav(page.url.pathname);
			}
		}, 1000);
	});

    
	$effect(() => {
		if (typeof localStorage === 'undefined') {
			return;
		}
		localStorage.setItem('isNavOpen', isNavOpen === true ? 'true' : 'false');
	});
    
	
	$effect(() => {
		horizontalNavBarWidth
		if (horizontalNavBar === null) {
			return;
		}
		if ((isSmallScreen || forcedSmallScreen) && horizontalNavBar) {
			horizontalNavBarResizeObserver.unobserve(horizontalNavBar);
		}
		else {
			horizontalNavBar = document.getElementById('horizontal-nav-bar');
			if (horizontalNavBar) {
				horizontalNavBarResizeObserver.observe(horizontalNavBar);
			}
		}
		horizontalNavBarWidth = LayoutUtils.getComputedStyleWidthPixel(horizontalNavBar);
	});

</script>



<!-- Large Screen Nav -->
{#if !isSmallScreen && !forcedSmallScreen && browser}
	<div
		in:slide={{ duration: 75, delay: 1, axis: 'x', easing: cubicIn }}
		id="horizontal-nav-bar"
		style={windowVisualViewportHeight !== null ? `height: ${Math.round(windowVisualViewportHeight)}px;` : ''}
		class={cn(
			"fixed top-0 left-0 h-full overflow-y-auto flex flex-col gap-2 w-max max-w-1/2 pt-14 z-[9997] isolate",
			"bg-sidebar/0",
		)}
	>
		<nav class="w-full px-2 py-2 flex flex-col gap-1.5">
			{#each NavMenuData as navItem}
				<Button
					variant="ghost"
					href={navItem.href}
					data-sveltekit-noscroll
					class={cn(
						"flex items-center justify-start gap-3 py-2 hover:bg-sidebar-accent dark:hover:bg-sidebar-accent border border-transparent !px-2",
						(isRootPage && navItem.href === '/') || (page.url.pathname.startsWith(navItem.href) && navItem.href !== '/') ? 
							'bg-primary/85 hover:bg-primary/85 text-primary-foreground hover:text-primary-foreground dark:hover:bg-primary/85' : 'hover:border-border')}

					ondblclick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						goto(navItem.href);
						// Set scrollY state of all child pages of this nav item to 0
						for (const key in scrollY) {
							if (key.startsWith(navItem.href)) {
								clearScrollYAfterNavStack.push(key);
							}
						}
					}}
					onclick={(event) => {
						if ((isRootPage && navItem.href === '/') || (page.url.pathname.startsWith(navItem.href) && navItem.href !== '/')) {
							// if current scroll position is not at top, scroll to top
							if (window.scrollY > 0) {
								event.preventDefault();
								event.stopPropagation();
								window.scrollTo({ top: 0, behavior: 'smooth' });
							}
						}
						else if ((!page.url.pathname.startsWith(navItem.href) && navItem.href !== '/')) {
							// find the last route of this main nav
							const lastRoute = navLog.lastMainNav[navItem.href] || undefined;
							if (lastRoute === undefined) {
								return;
							}
							event.preventDefault();
							event.stopPropagation();
							goto(lastRoute);
						}
					}}
				>
					{@const Icon = navItem.icon}
					<Icon class={cn("size-5")} />
					<span class={cn("text-base font-semibold select-none mr-0.5", !isNavOpen ? "hidden": "")}>{navItem.name}</span>
				</Button>
			{/each}
		</nav>

		<div class="mt-auto min-h-fit w-full px-2 py-2 flex flex-col gap-1.5">
			<ModeToggle isNavOpen={isNavOpen} />
		</div>
	</div>
{/if}


<!-- Small Screen Nav -->
{#if (isSmallScreen || forcedSmallScreen) && browser}
	<nav class="fixed bottom-0 left-0 w-full h-12.5 bg-sidebar/65 backdrop-blur-lg flex flex-row items-center justify-center gap-2 px-2 py-0 z-[9999] isolate">
		<div class="mx-auto p-0 w-fit flex flex-row items-center justify-around gap-2">
		{#each NavMenuData as navItem}
			<Button
				variant="ghost"
				href={navItem.href}
				data-sveltekit-noscroll
				style={"width: " + verticalNavBarBtnWidth + "px;"}
				class={cn(
					"relative h-[calc(100%-0.25rem)] flex flex-col items-center justify-around gap-0 mx-0 px-0 py-1 hover:bg-sidebar-accent dark:hover:bg-sidebar-accent border border-transparent",
					(isRootPage && navItem.href === '/') || (page.url.pathname.startsWith(navItem.href) && navItem.href !== '/') ? 
						'bg-primary/85 hover:bg-primary/85 text-primary-foreground hover:text-primary-foreground dark:hover:bg-primary/85 rounded-r-xl rounded-bl-xl rounded-tl-sm' : 'hover:border-border'
				)}
				ondblclick={(event) => {
					event.preventDefault();
					event.stopPropagation();
					goto(navItem.href);
					// Set scrollY state of all child pages of this nav item to 0
					for (const key in scrollY) {
						if (key.startsWith(navItem.href)) {
							clearScrollYAfterNavStack.push(key);
						}
					}
				}}
				onclick={(event) => {
					if ((isRootPage && navItem.href === '/') || (page.url.pathname.startsWith(navItem.href) && navItem.href !== '/')) {
						// if current scroll position is not at top, scroll to top
						if (window.scrollY > 0) {
							event.preventDefault();
							event.stopPropagation();
							window.scrollTo({ top: 0, behavior: 'smooth' });
						}
					}
					else if ((!page.url.pathname.startsWith(navItem.href) && navItem.href !== '/')) {
						// find the last route of this main nav
						const lastRoute = navLog.lastMainNav[navItem.href] || undefined;
						if (lastRoute === undefined) {
							return;
						}
						event.preventDefault();
						event.stopPropagation();
						goto(lastRoute);
					}
				}}
			>
				{@const Icon = navItem.icon}
				<Icon class={cn(
					"size-6",
					(isRootPage && navItem.href === '/') || (page.url.pathname.startsWith(navItem.href) && navItem.href !== '/') ? 
						'' : ''
				)} />
				<span
					style={"max-width: " + (0.97 * verticalNavBarBtnWidth) + "px;"}
					class={cn("mx-0.5 text-[0.645rem] font-semibold min-h-fit select-none overflow-clip text-ellipsis ignorespanclip")}
				>
					{navItem.name}
				</span>
			</Button>
		{/each}
		</div>
	</nav>
{/if}