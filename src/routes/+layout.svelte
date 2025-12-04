<script lang="ts" module>
	let isSmallScreen = $state(false);
	export function isClientSmallScreen() {
		return isSmallScreen;
	}

	
	let forcedSmallScreen = $state(false);
	export function isClientForcedSmallScreen() {
		return forcedSmallScreen;
	}
	export function setClientForcedSmallScreen(value: boolean) {
		forcedSmallScreen = value;
	}

	let loadingbarProgress: number | null = $state(null);
	// Track animation ID, only one at a time
	let currentLoadingBarAnimationId: number | null = null;
	export function cancelLoadingbarAnimationProgress() {
		if (currentLoadingBarAnimationId !== null) {
			cancelAnimationFrame(currentLoadingBarAnimationId);
		}
		currentLoadingBarAnimationId = null;
	}
	export function setLoadingbarProgress(value: number | null, duration: number = 0, callback?: () => void): Promise<void> {
		return new Promise<void>((resolve) => {
			// Cancel any ongoing animation
			if (currentLoadingBarAnimationId !== null) {
				cancelAnimationFrame(currentLoadingBarAnimationId);
				currentLoadingBarAnimationId = null;
			}
			
			// Any other value than null will render the loading bar
			if (value === null) {
				loadingbarProgress = null;
				if (callback) callback();
				resolve();
				return;
			}
			
			if (duration <= 0) {
				// Instant update if no duration
				loadingbarProgress = value;
				if (callback) callback();
				resolve();
				return;
			}
			else if (loadingbarProgress === null) {
				// Set to 0 with the intention of animating it to the target value
				loadingbarProgress = 0;
			}

			// Animate from current value to target value
			const startValue = loadingbarProgress;
			const targetValue = value;
			const startTime = performance.now();
			
			const easeOutCirc = function (x: number): number {
				return Math.sqrt(1 - Math.pow(x - 1, 2));
			}
			
			const animateProgress = (currentTime: number) => {
				const elapsedTime = currentTime - startTime;
				const progress = Math.min(elapsedTime / duration, 1);
				const easedProgress = easeOutCirc(progress);
				
				// Calculate interpolated value between start and target
				loadingbarProgress = startValue + (targetValue - startValue) * easedProgress;
				
				if (progress < 1 && currentLoadingBarAnimationId !== null) {
					currentLoadingBarAnimationId = requestAnimationFrame(animateProgress);
				} else {
					if (currentLoadingBarAnimationId !== null) {
						cancelAnimationFrame(currentLoadingBarAnimationId);
					}
					// Animation complete
					currentLoadingBarAnimationId = null;
					if (callback) callback();
					resolve();
				}
			};
			
			currentLoadingBarAnimationId = requestAnimationFrame(animateProgress);
		});
	}

	export function getLoadingbarProgress(): number | null {
		return loadingbarProgress;
	}
	export function clearLoadingbarProgress() {
		loadingbarProgress = null;
	}
</script>

<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	
	import { LayoutUtils } from '$lib';
	import { scrollY } from './appstate.svelte';
	import { navLog, saveNavLog } from './appstate.svelte';

	import { cn } from '$lib/utils';

	import {
		Menu,
	} from '@lucide/svelte/icons';

	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Toggle } from "$lib/components/ui/toggle";
	
	import GlobalSearch, { isSearchboxActive, GlobalSearchData } from '$lib/components/blocks/globalsearch/globalsearch.svelte';
	import Logo from '$lib/front-end/assets/logo.svelte';

	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { onMount, tick } from 'svelte';
	import { beforeNavigate, afterNavigate, goto, onNavigate } from '$app/navigation';

	import { slide, fade, blur } from 'svelte/transition';
	import { linear, cubicOut } from 'svelte/easing';
	import NavMenu from '$lib/front-end/NavMenu.svelte';

	import { toast } from "svelte-sonner";


	// WASM lib to be available in all routes
	import __wbg_init from "lib-wasm";
	onMount(() => { __wbg_init({ module_or_path: "/assets/lib_wasm_bg.wasm" }); });

	
	let { children } = $props();

	let remsize = $derived(LayoutUtils.rem2px(1));
	let windowVisualViewportHeight: number | null = $state(null);
	
	let isPageReady = $state(false);

	let isNavOpen = $state(false);
	let horizontalNavBarWidth = $state(0);

	let contentWrapperElement: HTMLElement | null = $state(null);
	let contentElemRect = $state({ width: 0, height: 0, x: 0, y: 0 });
	function checkElemRectSize(elem: HTMLElement | null) {
		if (typeof window === 'undefined' || elem === null) {
			return { width: 0, height: 0, x: 0, y: 0 };
		}
		const rect = elem.getBoundingClientRect();
		const paddingTop = rect.top + window.scrollY;
		let viewportVisualHeight = window.innerHeight;
		if (windowVisualViewportHeight !== null) {
			viewportVisualHeight = windowVisualViewportHeight;
		}
		const visualHeight = viewportVisualHeight - (window.document.body.scrollHeight - rect.height);
		return { width: rect.width, height: visualHeight, x: rect.left, y: paddingTop };
	}
	
	$effect(() => {
		if (typeof window === 'undefined' || contentWrapperElement === null) {
			return;
		}
		isNavOpen;
		horizontalNavBarWidth;
		windowVisualViewportHeight;
		tick().then(() => {
			contentElemRect = checkElemRectSize(contentWrapperElement);
		});
	});


	onMount(() => {
		windowVisualViewportHeight = window.visualViewport?.height || null;
		window.scrollTo(0, 0);

		isSmallScreen = LayoutUtils.isSmallScreen();

		if (sessionStorage.getItem('forcedSmallScreen') === null) {
			sessionStorage.setItem('forcedSmallScreen', 'false');
			forcedSmallScreen = false;
		} else {
			forcedSmallScreen = sessionStorage.getItem('forcedSmallScreen') === 'true' ? true : false;
		}

		const sidebarColor = getComputedStyle(document.documentElement).getPropertyValue('--sidebar');
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', sidebarColor);

		
		window.addEventListener('resize', () => {
			isSmallScreen = LayoutUtils.isSmallScreen();
			contentElemRect = checkElemRectSize(contentWrapperElement);
		});
		window.visualViewport?.addEventListener('resize', () => {
			windowVisualViewportHeight = window.visualViewport?.height || null;
		});

		window.addEventListener('pageshow', (event) => {
			if (event.persisted) {
				// Browser back/forward navigation was cached so the load sequence was skipped. Manually set the page as ready to accompany beforeNavigate
				isPageReady = true;
			}
		});


		isPageReady = true;
		tick().then(() => {
			contentWrapperElement = document.getElementById('main-content-wrapper');
			contentElemRect = checkElemRectSize(contentWrapperElement);
		});



		// Load Google Analytics after page renders
		const script = document.createElement('script');
		script.async = true;
		script.src = 'https://www.googletagmanager.com/gtag/js?id=G-BFS77G1W4V';
		document.head.appendChild(script);
		
		script.onload = () => {
			(window as any).dataLayer = (window as any).dataLayer || [];
			function gtag(...args: any[]){
				(window as any).dataLayer.push(arguments);
			}
			(window as any).gtag = gtag;
			gtag('js', new Date());
			gtag('config', 'G-BFS77G1W4V');
		};



		/// Show WIP toast for now! Page is still under development
		toast('🚧 Page Under Construction 🚧', {
			description:
				"The website is undergoing a big rewrite and update. Expect blank pages, missing page data, broken links, and never-ending loading indicators. Most pages from the old site can be looked up using the search box for now! Sorry for the inconvenience <3",
			duration: Number.POSITIVE_INFINITY,
			// style:
			// 	'display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 0.5rem; padding: 1rem;',
			// class: '!bg-background/70 backdrop-blur-sm !border-border',
			classes: {
				toast: 'flex flex-col items-center justify-center gap-2 py-4 !h-fit !bg-background/85 backdrop-blur-2xl border !border-border text-xs !text-foreground [&_button]:!bg-primary [&_button]:!text-primary-foreground [&_button]:!hover:bg-primary/80 [&_button]:!font-semibold',
				title: '!font-bold !text-sm !text-foreground mb-2',
				description: '!font-normal !text-xs !text-muted-foreground',
			},
			cancel: {
				label: 'Got it!',
				onClick: () => {},
			}
		});


	});
	

	beforeNavigate(async({ to }) => {
		if (!to || !to.route) {
			for (const key in scrollY) {
				scrollY[key] = 0;
			}
			for (const key in navLog.lastMainNav) {
				navLog.lastMainNav[key] = undefined;
			}
			saveNavLog();

			isPageReady = false;
			return;
		}
		if (page.url.pathname === to.route.id) {
			if (window.scrollY > 0) {
				window.scrollTo({ top: 0, behavior: 'smooth' });
				return;
			}
		}

		scrollY[page.url.pathname] = window.scrollY;
		// After 350 ms of no update, very slowly animate the loading bar from 0% to 85%
		loadingbarProgress = -1;
		setTimeout(async () => {
			// No progress was made
			if (loadingbarProgress === -1) {
				await setLoadingbarProgress(87, 180_000);
			};
		}, 350);
	});

	afterNavigate(async () => {
		window.scrollTo(0, 0); // make sure the default scroll position is 0 (top)
		if (!scrollY[page.url.pathname]) {
			scrollY[page.url.pathname] = 0;
		} else {
			window.scrollTo(0, scrollY[page.url.pathname]);
		}
		isPageReady = true;
		
		// Load so fast that no progressbar is needed
		if (loadingbarProgress === -1) {
			loadingbarProgress = null;
		}
		// Some progress was initiated, so animate to 100%
		else if (loadingbarProgress !== null && loadingbarProgress !== -1) {
			await setLoadingbarProgress(100, 420);
			setTimeout(() => {
				clearLoadingbarProgress();
			}, 150); // hold the 100% state for 150 ms before clearing
		}

		// Just in case after loaded for 5 full seconds but loadingbar still dangling
		setTimeout(async () => {
			if (loadingbarProgress === null) return;
			await setLoadingbarProgress(100, 100);
			setTimeout(() => {
				clearLoadingbarProgress();
			}, 100);
		}, 5000);
	});


	$effect(() => {
		if (typeof sessionStorage === 'undefined') {
			return;
		}
		sessionStorage.setItem('forcedSmallScreen', forcedSmallScreen === true ? 'true' : 'false');
	});
</script>


<svelte:head>
    <meta name="author" content="Cody Nhan Pham">

	<title>Cody Nhan Pham</title>
</svelte:head>


<ModeWatcher defaultMode={"dark"} />
<Toaster />

<!-- Show loading animation -->
{#if !isPageReady}
	<div 
        out:fade={{ duration: 300, easing: cubicOut, delay: 50 }}
        class="fixed w-[200%] h-[200%] flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sidebar z-[99999] isolate"
    >
        <Logo class="size-20" animate={!isPageReady ? "loading" : "spin-fast"} />
    </div>
{/if}

<!-- Loading bar -->
{#if loadingbarProgress !== null}
	<div
		in:slide={{ duration: 50, easing: cubicOut, axis: 'x' }}
		out:fade={{ duration: 100, easing: linear }}
		style="width: {loadingbarProgress}%;"
		class="fixed top-13 left-0 h-0.5 max-w-full bg-primary/50 backdrop-blur-sm z-[99998] isolate"
	>
	</div>

{/if}


<!-- Search + Title Bar -->
{#if isPageReady}
	<div
		in:fade={{ duration: 100, easing: cubicOut, delay: 0 }}
		class="fixed top-0 left-0 w-full h-13 z-[9999] isolate"
	>
		<div class="h-full flex items-center justify-between gap-2 px-2">
			{#if !isSmallScreen && !forcedSmallScreen}
				<Toggle bind:pressed={isNavOpen} aria-label="toggle bold" class="text-current hover:text-current data-[state=on]:bg-transparent data-[state=on]:text-current data-[state=on]:hover:bg-accent data-[state=on]:hover:text-current">
					<Menu class="size-4" />
				</Toggle>
			{/if}

			<div class={cn("flex-1 flex items-center justify-between gap-4 px-2", isSmallScreen ? 'md:pl-0' : 'sm:pl-0')}>
				{#if !isSmallScreen || !isSearchboxActive()}
				<div
					out:slide={{ axis: 'x', duration: 50, easing: linear }} in:slide={{ axis: 'x', duration: 100, easing: linear, delay: 50 }}
				>
					<div in:fade={{ duration: 150, easing: linear, delay: 50 }}>
							<Button
								variant="ghost"
								class={cn(
									"group mt-1 h-11 w-fit !px-2.5 !py-2 !pt-2.5 select-none",
								)}
								aria-label="Home"
								href="/"
								onclick={async (event) => {
									event.preventDefault();
									event.stopPropagation();
									isPageReady = true;
									setLoadingbarProgress(87, 180000);
									for (const key in scrollY) {
										scrollY[key] = 0;
									}

									for (const key in navLog.lastMainNav) {
										navLog.lastMainNav[key] = undefined;
									}
									saveNavLog();
									await goto('/', { invalidateAll: true });
									await setLoadingbarProgress(100, 100);
									setTimeout(() => {
										clearLoadingbarProgress();
										for (const key in scrollY) {
											scrollY[key] = 0;
										}
									}, 150);
								}}
							>
								<Logo class="size-10 group-hover:animate-pulse" />
							</Button>
						</div>
					</div>
					
				{/if}

				<div class="w-full h-9"> <!-- h-9 : height here must be 9 !!!! -->
					<div class="max-w-prose mx-auto sm:max-w-2/3 lg:max-w-prose">
						<GlobalSearch />
					</div>
				</div>
			</div>
		</div>
		
	</div>

	{#if isSmallScreen}
	<div class="fixed top-0 left-0 w-full h-13 z-[9998] isolate overflow-hidden">
		<div class="w-full h-[100%] bg-sidebar/70 backdrop-blur-xl"></div>
	</div>
	{/if}
{/if}


<NavMenu bind:isNavOpen bind:horizontalNavBarWidth bind:forcedSmallScreen />




<!-- Main Content -->
{#if isPageReady}
	<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
		<mask id="contentpassthrough">
			<rect x={Math.ceil(contentElemRect.x || 0)} y={Math.ceil(contentElemRect.y || 0)} width={Math.floor(contentElemRect.width-0.5 || 0)} height={Math.floor(contentElemRect.height-0.5 || 0)} rx={remsize*0.5 +2} ry={remsize*0.5 +2} fill="#fff" />
		</mask>
	</svg>

	{#if !isSmallScreen}
	<div class="fixed top-0 left-0 w-full h-full z-[10] isolate overflow-hidden pointer-events-none">
		<div id="stainedglassexperience" class={cn("w-[100%] h-[100%] backdrop-blur-3xl bg-sidebar/50",

		)}></div>
	</div>
	{/if}


	<div
		in:fade={{ duration: 100, easing: cubicOut, delay: 0 }}
		style={"margin-left: " + Math.floor(horizontalNavBarWidth) + "px; " + "scrollbar-gutter: stable both-edges; "}
		class={cn(
			"flex-1 relative h-full min-h-dvh bg-sidebar flex flex-col",
			(isSmallScreen ? 'pb-12.5 pt-13' : 'pt-13.5 pr-2 pb-1.5'),
			"bg-sidebar",
	)}
	>
		<div
			id="main-content-wrapper"
			class={cn("bg-background flex w-full min-h-full flex-1 rounded-md mb-0.5 isolate")}
		>
			{@render children?.()}
		</div>
	</div>
{/if}


<style lang="postcss">
	#stainedglassexperience {
		mask:
			url(#contentpassthrough) center/contain no-repeat,
			linear-gradient(#fff 0 0);
		mask-composite: exclude;
	}
</style>