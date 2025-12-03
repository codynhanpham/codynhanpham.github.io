<script lang="ts">
	import { cn } from '$lib/utils';
	import { isClientSmallScreen } from "$routes/+layout.svelte";
	let isSmallScreen = $derived(isClientSmallScreen());

	import Logo from "$lib/front-end/assets/logo.svelte";

	import { Button } from "$lib/components/ui/button";
	import { onMount } from 'svelte';


</script>


<svelte:head>
	<title>Projects - Cody Nhan Pham</title>
</svelte:head>


<main class={cn("w-full flex flex-col items-center justify-start gap-4 text-center p-0 pb-1 rounded-md overflow-clip")}>
	
</main>