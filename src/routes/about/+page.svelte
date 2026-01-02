<script lang="ts">
	import { cn } from '$lib/utils';

	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import timezone from 'dayjs/plugin/timezone';
	dayjs.extend(utc);
	dayjs.extend(timezone);
	import { PUBLIC_TIMEZONE_REGION } from '$env/static/public';

    import { RenderIcon } from '$lib/components/ui/simple-icons/simple-icons.svelte';
	
	import { socialLinks } from '$content/about/social-links';
	import type { SearchResultsItem } from '$src/lib/components/blocks/globalsearch/search-results.svelte';
	import Logo from '$lib/front-end/assets/logo.svelte';
	
	import Button from '$src/lib/components/ui/button/button.svelte';


    import {
		Clock,
		MapPin,
        Navigation,
    } from '@lucide/svelte/icons';
	import { onMount } from 'svelte';


	const items : SearchResultsItem[] = socialLinks.flatMap(link => link.items);
	items.sort((a, b) => a.title.localeCompare(b.title));
	const toBeRemovedByHref = [
		'https://oviedolab.org/',
	];
	for (const href of toBeRemovedByHref) {
		const index = items.findIndex(item => item.href === href);
		if (index !== -1) {
			items.splice(index, 1);
		}
	}

	function truncateText(text: string, maxLength: number): string {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength - 1) + '…';
	}

	const timezoneRegion = PUBLIC_TIMEZONE_REGION || 'America/Chicago';
	function getCurrentTimeInTimezone(region: string): string {
		try {
			let time = dayjs().tz(region).format('HH:mm:ss');
			const offset = dayjs().tz(region).format('Z');
			return `${time} (UTC ${offset})`;
		} catch (e) {
			return dayjs().utc().format('HH:mm:ss') + ' (UTC)';
		}
	}
	// Get current time in that timezone, if fails, fallback to UTC
	let currentTime: string = $state(getCurrentTimeInTimezone(timezoneRegion));
	
	onMount(() => {
		const interval = setInterval(() => {
			currentTime = getCurrentTimeInTimezone(timezoneRegion);
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>About - Cody Nhan Pham</title>
</svelte:head>

<main class={cn("relative w-full flex flex-col items-center justify-start gap-4 text-center p-0 rounded-md overflow-clip")}>
	<div class="h-full">
		<section class="p-4 lg:p-16 lg:pt-12 mt-2 mx-auto w-full max-w-[128ch] flex flex-col lg:flex-row items-center justify-start lg:items-start lg:justify-center gap-4 lg:gap-12 2xl:gap-24">
			<div class="">
				<div>
					<Logo class="mt-2 mx-auto size-22 min-[200]:size-29 min-[380px]:size-32 lg:size-36" />
					<h1 class="md:min-w-max text-2xl min-[380px]:text-3xl font-bold mt-2">Cody Nhan Pham</h1>
					<p class="md:min-w-max mx-auto mt-1 text-sm min-[380px]:text-base text-muted-foreground">@codynhanpham</p>
					<div class="w-max max-w-full mt-4 lg:mt-6 mx-auto lg:mx-0 flex flex-col items-start justify-center gap-3 text-sm">
						<div class="flex items-center justify-center gap-2">
							<MapPin class="size-4 min-[380px]:size-4.5" />
							<span>St. Louis, Missouri</span>
						</div>
						<div class="flex items-center justify-center gap-2">
							<Clock class="size-4 min-[380px]:size-4.5" />
							<span>{currentTime}</span>
						</div>
					</div>
				</div>
			</div>
	
			<div class="px-2 min-[380px]:px-6 sm:px-8 md:px-10 lg:px-0 w-full text-left [&>p]:mt-2 [&>p]:w-full">
				<blockquote class="border-l-4 border-accent pl-4 py-1.5 italic text-base text-primary/90 mb-4">
					Combining technology and biological sciences to drive research innovation, efficiency, and discovery.
				</blockquote>
				<p>
					<strong>Microbiology & Biotechnology graduate and a self-taught software developer.</strong> I specialize in developing full-stack GUI and TUI applications tailored for <strong>bioinformatics</strong>, <strong>big data analysis</strong>, and <strong>network management</strong>. My passion lies in creating tools that <strong>streamline complex workflows</strong> and enhance data visualization and interpretation in scientific research. At the same time, I am deeply familiar with <strong>wet lab</strong> techniques and protocols, bridging the gap between computational and experimental biology.
				</p>
				<p>
					I'm currently working as a <strong>Neuroscience Research Technician</strong> at <a href="https://oviedolab.org/" target="_blank" rel="noopener" class="link-underline text-accent-foreground font-bold">Oviedo Lab</a> @ <a href="https://washu.edu/" target="_blank" rel="noopener" class="link-underline text-accent-foreground font-bold">WashU</a>, where I handle both computational and experimental tasks to support cutting-edge research in auditory neuroscience. In the lab, I mostly program in MATLAB, Rust, and Python while also assisting with animal care, surgical procedures, behavioral experiments, and two-photon calcium imaging.
				</p>
			</div>
		</section>
	
		<section class="mt-4">
			<h2 class="text-2xl font-semibold mt-12 lg:mt-4" id="links">Connect with Me</h2>
			<div class="mt-4 lg:mt-5 mb-10 mx-auto px-3 sm:px-6 md:px-10 py-4 w-full h-full max-w-3xl lg:max-w-4xl grid gap-0 min-[300px]:gap-1 min-[360px]:gap-3 min-[380px]:gap-4 lg:gap-6 grid-cols-2 min-[248px]:grid-cols-3 min-[300px]:grid-cols-4 md:grid-cols-5 lg:grid-cols-5">
				{#each items as item}
					{#if item.href}
						<Button
							variant="link"
							href={item.href}
							aria-label={item.title}
							onclick={item.onClick}
							class="w-max h-full px-2! mx-auto flex flex-col items-center justify-center hover:text-foreground active:text-foreground focus-visible:text-foreground"
							title={item.title}
						>
							{#if item.icon}
								{#if typeof item.icon === 'string'}
									{@render RenderIcon?.({name: item.icon, style: item.style?.icon, className: "size-8! min-[380px]:size-10! text-current", fill: "currentColor"})}
								{:else}
									<item.icon class="size-8! min-[380px]:size-10! text-current" />
								{/if}
							{:else}
								<Navigation class="size-8! min-[380px]:size-10! text-current" />
							{/if}
							<div class="flex max-w-full flex-col">
								<span class="w-max text-xs min-[380px]:text-sm text-foreground ignorespanclip" style={item.style?.title}>{item.shortTitle ? truncateText(item.shortTitle, 12) : truncateText(item.title, 12)}</span>
							</div>
						</Button>
					{/if}
				{/each}
			</div>
		</section>
	</div>
</main>