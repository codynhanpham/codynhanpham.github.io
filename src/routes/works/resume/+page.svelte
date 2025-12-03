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

	import Resume from '$content/works/resume/resume.svx';
</script>

<svelte:head>
	<title>Resume - Cody Nhan Pham</title>
</svelte:head>

<main class={cn("relative w-full flex flex-col items-center justify-start gap-4 text-center p-0 rounded-md overflow-clip")}>
	<div class="h-full w-full my-2 lg:my-4 space-y-2 lg:space-y-4">
		<Resume />
    </div>
</main>