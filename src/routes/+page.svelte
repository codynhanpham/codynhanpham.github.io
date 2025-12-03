<script lang="ts">
	import Logo from "$lib/front-end/assets/logo.svelte";
	import { isClientSmallScreen } from "$routes/+layout.svelte";

	import Youtube from '$lib/components/ui/youtube-embed';

	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let isSmallScreen = $derived(isClientSmallScreen());


	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";	
	import Autoplay, { type AutoplayType } from "embla-carousel-autoplay";
	import Fade from "embla-carousel-fade";
	import ClassNames from "embla-carousel-class-names";
	import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import { type CarouselAPI } from "$lib/components/ui/carousel/context.js";
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";


	import type { PageProps } from './$types';
	import {
		Play,
		Info,
	} from "@lucide/svelte/icons";
	import type { IconProps } from "@lucide/svelte";

	import { type Snippet, type Component } from 'svelte';
	import { page } from "$app/state";
	import { type SnippetContent, type ButtonContent } from "./+page";

    import { RenderIcon } from '$lib/components/ui/simple-icons/simple-icons.svelte';
	
	import Hero from './_assets/components/hero.svelte';
	import TopPicks from './_assets/components/toppick.svelte';


	let { data }: PageProps = $props();


	let carouapi = $state<CarouselAPI>();
	let autoplay: AutoplayType | undefined = $state(undefined);

	onMount(() => {
		const currentpos = window.pageYOffset;
		if (autoplay && autoplay.isPlaying() && currentpos > 20) {
			autoplay.stop();
		}
		else if (!autoplay || !autoplay.isPlaying() && currentpos < 20) {
			autoplay?.play();
		}
		// On scroll past 20px from the top, stop autoplay
		window.addEventListener('scroll', () => {
			const currentpos = window.pageYOffset;
			if (autoplay && autoplay.isPlaying() && currentpos > 20) {
				autoplay.stop();
			}
			else if (!autoplay || !autoplay.isPlaying() && currentpos < 20) {
				autoplay?.play();
			}
		})
	})

</script>

<svelte:head>
	<title>Home - Cody Nhan Pham</title>
</svelte:head>


<main class={cn("relative w-full flex flex-col items-center justify-start gap-4 text-center p-0 pb-1 rounded-md overflow-clip")}>
	<div data-home-hero-wrapper class={cn("relative w-full h-screen min-h-[960px] rounded-md overflow-hidden isolate will-change-transform")}>
		<div data-home-hero-skeleton class="absolute top-0 left-0 w-full h-full -z-10 bg-accent/50 animation-pulse"></div>
		<Carousel.Root
			setApi={(emblaApi) => { carouapi = emblaApi; autoplay = emblaApi?.plugins()?.autoplay; }}
			opts={{
				loop: true,
				duration:25,
				breakpoints: {
					'(width >= 48rem)': {
						duration: 20,
					},
					'(width >= 64rem)': {
						duration: 16,
					},
					'(width >= 80rem)': {
						duration: 13,
					},
					'(width >= 96rem)': {
						duration: 10,
					},
					'(width >= 120rem)': {
						duration: 8,
					},
					'(width >= 160rem)': {
						duration: 4,
					},
					'(width >= 180rem)': {
						duration: 2,
					},
					'(width >= 210rem)': {
						duration: 1,
					},
				}
			}}
			plugins={[
				Fade(),
				Autoplay({
					delay: 15000,
					stopOnInteraction: false,
					stopOnMouseEnter: true,
				}),
			]}
			class={cn("absolute top-0 left-0 w-full h-full [&>[data-slot='carousel-content']]:h-full")}
		>
			<Carousel.Content class={cn("h-full")}>
				{#each data.hero as item, index}
					<Hero {item} {index} />
				{/each}
			</Carousel.Content>

			<Carousel.Previous variant="ghost" class={cn("z-10 w-22 top-3/12 left-0 rounded-sm !border-none !bg-none !bg-transparent opacity-20 dark:opacity-40 focus-visible:opacity-95 hover:opacity-95 hover:cursor-pointer", (isSmallScreen ? "top-3/11 opacity-5 dark:opacity-5 hover:opacity-15 h-[50%] w-10" : "h-32 max-h-full"))} 
				onmouseenter={() => { autoplay?.stop() }}
				onmouseleave={() => { autoplay?.play(); autoplay?.reset(); }}
			/>

			<Carousel.Next variant="ghost" class={cn("z-10 w-22 top-3/12 right-0 rounded-sm !border-none !bg-none !bg-transparent opacity-20 dark:opacity-40 focus-visible:opacity-95 hover:opacity-95 hover:cursor-pointer", (isSmallScreen ? "top-3/11 opacity-5 dark:opacity-5 hover:opacity-15 h-[50%] w-10" : "h-32 max-h-full"))} 
				onmouseenter={() => { autoplay?.stop() }}
				onmouseleave={() => { autoplay?.play(); autoplay?.reset(); }}
			/>
		</Carousel.Root>

		

	</div>


	<!-- The content starts around 55% after the hero -->
	<div class={cn("-mt-[calc(max(100vh,960px)*0.45)] bg-transparent z-10 h-max min-h-120 w-full px-0 py-4 space-y-10 isolate")}>
		<section>
			<h1 class="text-left text-xl px-6 md:px-12 lg:text-2xl font-semibold mb-4">
				Top Picks
			</h1>
			<div class="flex justify-center items-center mx-0">
				<Carousel.Root
					plugins={[
						WheelGesturesPlugin(),
						ClassNames({
							inView: "!opacity-100",
						}),
					]}
					opts={{
						loop: true,
						skipSnaps: true,
						inViewThreshold: 0.25,
						dragFree: false,
						align: "center",
						breakpoints: {
							'(width >= 40rem)': {
								dragFree: true,
								inViewThreshold: 0.40,
							},
							'(width >= 110rem)': {
								align: "center",
							}
						}
					}}
					class="relative isolate w-full mx-0 [&>[data-slot='carousel-content']]:mask-x-from-88% sm:[&>[data-slot='carousel-content']]:mask-x-from-85% md:[&>[data-slot='carousel-content']]:mask-x-from-85% min-[110rem]:[&>[data-slot='carousel-content']]:mask-x-from-85% [&>[data-slot='carousel-content']]:mask-x-to-105% md:[&>[data-slot='carousel-content']]:mask-x-to-102%"
				>
					<Carousel.Content class="-ml-0.5 sm:-ml-1 h-max">
						{#each data.topPicks as item, index}
							<TopPicks {item} {index} />
						{/each}
					</Carousel.Content>
					<Carousel.Previous class="z-100 opacity-20 sm:opacity-40 hover:opacity-85 !bg-transparent border-0 ml-13.5 sm:ml-15" />
					<Carousel.Next class="z-100 opacity-20 sm:opacity-40 hover:opacity-85 !bg-transparent border-0 mr-13.5 sm:mr-15" />
				</Carousel.Root>

			</div>
		</section>

		<section>
			<h1 class="text-left text-xl px-6 md:px-12 lg:text-2xl font-semibold mb-4">
				For You
			</h1>
			<div class="grid gap-x-3 gap-y-5 grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] md:grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] mx-2 sm:mx-8">
				{#each Array(10) as _, i}
					<div class="flex flex-col items-center justify-center gap-2">	
						<div class="bg-muted/50 aspect-video rounded-xl flex-1 w-full animate-pulse"></div>
						<div class="w-full space-y-1">
							<Skeleton class="w-full h-5" />
							<Skeleton class="w-3/4 h-5" />
						</div>
						<Skeleton class="w-1/3 h-4 self-start" />
					</div>
				{/each}
			</div>

		</section>
	</div>





</main>