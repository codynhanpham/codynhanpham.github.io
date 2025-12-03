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
	<title>Highlights - Cody Nhan Pham</title>
</svelte:head>

<main class={cn("relative w-full flex flex-col items-center justify-start gap-4 text-center p-0 rounded-md overflow-clip")}>
	<h1 class="sr-only">Professional Skills</h1>

	<div class="h-full w-full my-2 lg:my-4 space-y-2 lg:space-y-4">


    </div>
</main>