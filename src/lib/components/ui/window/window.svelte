<script lang="ts" module>
	import type { WithChildren } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';

	export type WindowPropsWithoutHTML = WithChildren & {
		contentClass?: string;
		scrollContainer?: HTMLElement | null;
	};

	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

	export type WindowProps = HTMLAttributes<HTMLDivElement> & WindowPropsWithoutHTML;
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let { children, class: className, contentClass, scrollContainer = $bindable(null) }: WindowProps = $props();
</script>

<div class={cn('border-border bg-background min-h-110 w-full h-full rounded-lg border flex flex-col items-stretch', className)}>
	<div class="border-b border-inherit p-4 w-full h-fit shrink-0">
		<div class="flex items-center gap-2">
			<div class="size-2 rounded-full bg-[#ef4444]"></div>
			<div class="size-2 rounded-full bg-[#eab308]"></div>
			<div class="size-2 rounded-full bg-[#22c55e]"></div>
		</div>
	</div>
	<ScrollArea class={cn('flex-1 min-h-0 h-full w-full mb-2', contentClass)} bind:viewportRef={scrollContainer}>
		<div class="p-4 py-3 ">
			{@render children?.()}
		</div>
	</ScrollArea>
</div>
