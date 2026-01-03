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
    <meta name="description" content="The comprehensive résumé of Cody Nhan Pham, detailing professional experience, skills, and accomplishments in the field of biological science, software development, and beyond.">
</svelte:head>

<main class={cn("relative w-full h-full flex flex-col items-center justify-center gap-4 text-center p-0 rounded-md overflow-clip")}>
	<Logo class="size-20" animate={"spin-fast"} />
</main>