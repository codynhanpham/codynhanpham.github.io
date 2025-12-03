<script lang="ts">
	import { cn } from '$lib/utils';
	import { isClientSmallScreen } from "$routes/+layout.svelte";
	let isSmallScreen = $derived(isClientSmallScreen());

	import {
		ChevronRight,
		ChevronUp,
		LoaderCircle,
	} from '@lucide/svelte/icons';

	import { Button } from "$lib/components/ui/button/index.js";
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";

</script>


<svelte:head>
	<title>Works - Cody Nhan Pham</title>
</svelte:head>


<main class={cn("relative w-full flex flex-col items-center justify-start gap-4 text-center p-0 rounded-md overflow-clip")}>
	<h1 class="sr-only">Professional Works</h1>
	<div class="h-full w-full my-2 lg:my-4 space-y-2 lg:space-y-4">
		<section class="h-max w-auto mx-2 lg:mx-4 bg-secondary p-2 pb-4 rounded-md flex flex-col">
			<Button variant="ghost"
				class="group w-full flex flex-row items-center justify-between gap-4 mb-2 !pr-1.5 hover:cursor-pointer"
				href="/works/highlights"
			>
				<h2 id="highlights" class="scroll-mt-17.5 lg:scroll-mt-19.5 w-fit text-left text-secondary-foreground text-xl my-1 font-semibold underline-offset-4 !select-all link-underline">
					Highlights
				</h2>
				<ChevronRight class="size-5 duration-100 group-hover:translate-x-0.5" />
			</Button>
			
			<div class="relative w-full px-2 flex flex-row items-center justify-start gap-2 isolate overflow-hidden">
				{#each Array(10) as _, i}
					<div class="flex flex-col items-center justify-center gap-2">
						<div class="bg-background/50 w-50 md:w-54 lg:w-58 2xl:w-64 aspect-2/3 rounded-xl flex-1 animate-pulse">
						</div>
					</div>
				{/each}

				<!-- Pad the start and end of the list to ensure even lr-padding for overflowing content -->
				<div class="absolute top-0 left-0 w-1 h-full z-10 bg-accent pointer-events-none"></div>
				<div class="absolute top-0 right-0 w-1 h-full z-10 bg-accent pointer-events-none"></div>
			</div>
		</section>

		<section class="h-max w-auto mx-2 lg:mx-4 bg-secondary p-2 pb-4 rounded-md flex flex-col">
			<Button variant="ghost"
				class="group w-full flex flex-row items-center justify-between gap-4 mb-2 !pr-1.5 hover:cursor-pointer"
				href="/works/resume"
			>
				<h2 id="resume" class="scroll-mt-17.5 lg:scroll-mt-19.5 w-fit text-left text-secondary-foreground text-xl my-1 font-semibold underline-offset-4 !select-all link-underline">
					Résumé
				</h2>
				<ChevronRight class="size-5 duration-100 group-hover:translate-x-0.5" />
			</Button>
			
			<div class="relative w-full h-full min-h-140 px-2 flex flex-row items-center justify-start gap-2">
				<div class="w-full h-full min-h-140 flex-1 grow rounded-xl bg-background/50"></div>
				<LoaderCircle class="absolute top-1/2 left-1/2 -translate-1/2 size-10 animate-spin opacity-50" />
			</div>
		</section>
	</div>
</main>