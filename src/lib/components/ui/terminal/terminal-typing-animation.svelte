<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { onDestroy } from 'svelte';
	import { useAnimation } from './terminal.svelte.js';
	import type { TerminalAnimationProps } from './types';
	import { typewriter } from '$lib/actions/typewriter.svelte';

	let { children, delay = 0, class: className }: TerminalAnimationProps = $props();

	let playAnimation = $state(false);
	let animationSpeed = $state(1);
	let resetKey = $state(0);

	const play = (speed: number) => {
		playAnimation = true;
		animationSpeed = speed;
	};

	const reset = () => {
		playAnimation = false;
		resetKey++;
	};

	// svelte-ignore state_referenced_locally
	const animation = useAnimation({ delay, play });
	animation.setResetCallback(reset);
	
	const scrollCallback = animation.rootState.getScrollCallback();

	onDestroy(() => animation.dispose());
</script>

{#key resetKey}
	{#if playAnimation}
		<span
			class={cn('block', className)}
			in:typewriter={{
				speed: animationSpeed * 2,
				onComplete: () => animation.onComplete?.(),
				onTick: scrollCallback
			}}
		>
			{@render children?.()}
		</span>
	{/if}
{/key}
