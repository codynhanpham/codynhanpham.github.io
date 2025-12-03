<script lang="ts">
    import { cn } from '$lib/utils';
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    import Logo from '$lib/front-end/assets/logo.svelte';

    onMount(() => {
        goto("/works/resume", { replaceState: true });
    });
</script>

<svelte:head>
	<title>Resume - Cody Nhan Pham</title>
</svelte:head>

<main class={cn("relative w-full flex flex-col items-center justify-center gap-4 text-center p-0 rounded-md overflow-clip")}>
	<Logo class="size-20" animate={"spin-fast"} />
</main>