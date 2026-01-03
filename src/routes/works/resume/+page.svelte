<script lang="ts">
	import { cn } from '$lib/utils';
	import { isClientSmallScreen } from "$routes/+layout.svelte";

	import Resume from '$content/works/resume/resume.svx';
</script>

<svelte:head>
	<title>Resume - Cody Nhan Pham</title>
	<meta name="description" content="The comprehensive résumé of Cody Nhan Pham, detailing professional experience, skills, and accomplishments in the field of biological science, software development, and beyond.">
</svelte:head>

<main class={cn("relative w-full h-full flex flex-col items-center justify-start gap-4 text-center p-0 rounded-md overflow-clip")}>
	<div class="h-full w-full my-2 lg:my-4 space-y-2 lg:space-y-4">
		<Resume />
    </div>
</main>