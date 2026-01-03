<script lang="ts">
	import { Window } from '$lib/components/ui/window';
	import { cn } from '$lib/utils.js';
	import { Button } from "$lib/components/ui/button/index.js";
	import { TerminalSession, useTerminalRoot } from './terminal.svelte.js';
	import { onMount } from 'svelte';
	import type { TerminalRootProps } from './types.js';

	import {
		RotateCcw,
	} from '@lucide/svelte/icons';

	let {
		delay = 0,
		speed = 1,
		onComplete = () => {},
		children,
		class: className,
		session = $bindable()
	}: TerminalRootProps = $props();

	let scrollContainer: HTMLElement | null = $state(null);

	const scrollToBottom = () => {
		if (scrollContainer) {
			scrollContainer.scrollTop = scrollContainer.scrollHeight;
		}
	};

	// svelte-ignore state_referenced_locally
	const terminal = useTerminalRoot({ 
		delay, 
		speed, 
		onComplete: () => {
			scrollToBottom();
			onComplete?.();
		},
		onAnimationStep: scrollToBottom
	});
	session = terminal;

	onMount(() => {
		// we play here so that we don't play before it is visible (on the server)
		terminal.play();

		return () => {
			terminal.dispose();
		};
	});
</script>

<Window class={cn('relative font-mono text-sm font-light', className)} bind:scrollContainer>
	<!-- Replay -->
	<Button variant="ghost" class="absolute top-[calc(var(--spacing)*-8-1px)] right-2 opacity-70 hover:opacity-100 active:opacity-100 focus-visible:opacity-100 z-1 size-6 p-2" title="Replay animation" onclick={() => {
			session?.replay();
		}}>
		<RotateCcw class="size-4" />
	</Button>

	{@render children?.()}
</Window>
