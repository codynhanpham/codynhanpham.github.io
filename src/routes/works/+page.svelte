<script lang="ts">
	import { cn } from '$lib/utils';
	import { isClientSmallScreen } from "$routes/+layout.svelte";
	let isSmallScreen = $derived(isClientSmallScreen());

	import {
		ChevronRight,
		ChevronUp,
		LoaderCircle,
		Lightbulb,
		RotateCcw,
	} from '@lucide/svelte/icons';

	import { Button } from "$lib/components/ui/button/index.js";
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";
	import * as Terminal from '$lib/components/ui/terminal';
	import { fade, fly } from 'svelte/transition';

	let terminalSession = $state<Terminal.TerminalSession>();

	const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '.');

</script>


<svelte:head>
	<title>Works - Cody Nhan Pham</title>
	<meta name="description" content="Explore the professional works of Cody Nhan Pham, including highlights and résumé. Discover projects, achievements, and career milestones.">
</svelte:head>


<main class={cn("relative w-full h-full flex flex-col items-center justify-start gap-4 text-center p-0 rounded-md overflow-clip")}>
	<h1 class="sr-only">Professional Works</h1>
	<div class="h-full w-full my-2 lg:my-4 space-y-2 lg:space-y-4 flex flex-col">

		
		<section class="h-full w-auto mx-2 lg:mx-4 bg-secondary p-2 sm:pb-4 rounded-md flex flex-col flex-1">
			<Button variant="ghost"
				class="group w-full flex flex-row items-center justify-between gap-4 mb-2 pr-1.5! hover:cursor-pointer"
				href="/works/resume"
			>
				<h2 id="resume" class="scroll-mt-17.5 lg:scroll-mt-19.5 w-fit text-left text-secondary-foreground text-xl my-1 font-semibold underline-offset-4 select-all! link-underline">
					Résumé
				</h2>
				<ChevronRight class="size-5 duration-100 group-hover:translate-x-0.5" />
			</Button>
			
			<div class="relative w-full h-full sm:px-2 flex flex-row items-start justify-center gap-2 flex-1">
				<Terminal.Root class="relative w-full h-140 flex-1 grow rounded-xl bg-background/70 text-left ignorespanclip" delay={100} speed={1.5}>
					<Terminal.Loading delay={250} duration={1500}>
						{#snippet loadingMessage()}
							Bootstrapping live environment...
						{/snippet}
						{#snippet completeMessage()}
							<span>CodyNhanPham (v{currentDate})</span>
							<div class="h-2"></div>
							<span class="text-muted-foreground hyphens-auto">Type <code class="inline-block pb-0.5 px-2 bg-accent rounded-sm">/resume</code> for the comprehensive résumé, or <code class="inline-block pb-0.5 px-2 bg-accent rounded-sm">/about</code> for additional information.</span>
							<br><br>
						{/snippet}
					</Terminal.Loading>

					<Terminal.TypingAnimation delay={1_800}>
						&gt; import * as cnp from '@codynhanpham/cli'
					</Terminal.TypingAnimation>
					<Terminal.Loading delay={3_400} duration={800}>
						{#snippet loadingMessage()}
							Fetching resources...
						{/snippet}
						{#snippet completeMessage()}
							<span class="text-green-700 dark:text-green-500">✔ Module <span class="text-blue-700 dark:text-blue-500 font-bold">cnp</span> imported <span class="italic text-amber-700 dark:text-amber-500">(108.50 kB)</span></span>
							<br><br>
						{/snippet}
					</Terminal.Loading>

					<Terminal.TypingAnimation delay={4_500}>
						&gt; cnp.is(&lbrace; verbosity: 2, format: 'html' &rbrace;)
					</Terminal.TypingAnimation>
					<Terminal.AnimatedSpan delay={6_150}>
						<div class="text-foreground/75">
							<p class="mt-1">
								Cody Nhan Pham is...
							</p>
							<p class="ml-[2ch] md:ml-[4ch]">
								- Full-time neuroscience research technician at <a href="https://oviedolab.org/" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-500">Oviedo Lab</a><br>
								- Microbio & Biotech graduate<br>
								- Fullstack software developer<br>
							</p>
						</div>
					</Terminal.AnimatedSpan>
					<Terminal.AnimatedSpan delay={6_160}>
						<div class="text-foreground/75">
							<p class="mt-1">
								He is proficient in...
							</p>
							<p class="ml-[2ch] md:ml-[4ch]">
								- English and Vietnamese<br>
								- MATLAB, TypeScript, Python, Rust, R<br>
								- Animal care & husbandry, spatial transcriptomics, 2-photon calcium imaging, electrophysiology<br>
							</p>
						</div>
					</Terminal.AnimatedSpan>
					<Terminal.AnimatedSpan delay={6_170}>
						<div class="text-foreground/75">
							<p class="mt-1">
								And greatly enjoys...
							</p>
							<p class="ml-[2ch] md:ml-[4ch]">
								- Anime and manga 🗾📖<br>
								- Play and learn musical instruments 🎹🎸🪈<br>
								- Make toy engineering projects <a href="/projects" class="brightness-90 animate-pulse hover:brightness-105 hover:animate-none active:brightness-105 active:animate-none focus-visible:brightness-105 focus-visible:animate-none">💡</a><br>
							</p>
						</div>
					</Terminal.AnimatedSpan>

					<Terminal.AnimatedSpan delay={6_180}>
						<br>
					</Terminal.AnimatedSpan>
					<Terminal.AnimatedSpan delay={6_250} class="cursor-not-allowed">
						<span>&gt; </span> <span class="animate-caret-blink text-foreground/80"> │</span>
					</Terminal.AnimatedSpan>
					<Terminal.AnimatedSpan delay={6_400} class="hidden lg:block">
						<span>&nbsp; </span> <span class="text-muted-foreground text-sm" in:fade={{ delay: 100, duration: 100 }}>Quick actions: </span>
						<div in:fly={{ delay: 300, duration: 150, x: -10 }} class="inline-flex flex-row items-center gap-0">
							<Button variant="secondary" class="h-fit w-fit px-2.5! py-0.5! m-0 text-sm" href="/works/resume">View Résumé</Button>
						</div>
						<div in:fly={{ delay: 500, duration: 150, x: -10 }} class="inline-flex flex-row items-center gap-0">
							<Button variant="secondary" class="h-fit w-fit px-2.5! py-0.5! m-0 text-sm" href="/about">About Cody</Button>
						</div>
						<div in:fly={{ delay: 700, duration: 150, x: -10 }} class="inline-flex flex-row items-center gap-0">
							<Button variant="secondary" class="h-fit w-fit px-2.5! py-0.5! m-0 text-sm" href="/about/#links">Social Media</Button>
						</div>
					</Terminal.AnimatedSpan>
				</Terminal.Root>
			</div>
		</section>


		<section class="h-max w-auto mx-2 lg:mx-4 bg-secondary p-2 sm:pb-4 rounded-md flex flex-col">
			<Button variant="ghost"
				class="group w-full flex flex-row items-center justify-between gap-4 mb-2 pr-1.5! hover:cursor-pointer"
				href="/works/highlights"
			>
				<h2 id="highlights" class="scroll-mt-17.5 lg:scroll-mt-19.5 w-fit text-left text-secondary-foreground text-xl my-1 font-semibold underline-offset-4 select-all! link-underline">
					Highlights
				</h2>
				<ChevronRight class="size-5 duration-100 group-hover:translate-x-0.5" />
			</Button>
			
			<div class="relative w-full sm:px-2 flex flex-row items-center justify-start gap-2 isolate overflow-hidden">
				{#each Array(10) as _, i}
					<div class="flex flex-col items-center justify-center gap-2">
						<div class="bg-background/50 w-50 md:w-54 lg:w-58 2xl:w-64 aspect-2/3 rounded-xl flex-1 animate-pulse">
						</div>
					</div>
				{/each}

				<!-- Pad the start and end of the list to ensure even lr-padding for overflowing content -->
				<div class="absolute top-0 left-0 sm:w-1 h-full z-10 bg-accent pointer-events-none"></div>
				<div class="absolute top-0 right-0 sm:w-1 h-full z-10 bg-accent pointer-events-none"></div>
			</div>
		</section>

	</div>
</main>