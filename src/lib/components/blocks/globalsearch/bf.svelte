<script lang="ts">
	// ---- SHADCN-UI ---- //
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	// ---- LUCIDE-SVELTE ---- //
    import {
		ChevronRight,
        Clipboard,
        ClipboardCheck,
	} from '@lucide/svelte/icons';

	// ---- LOCAL ---- //
    import { bf_execute } from 'lib-wasm';

	let {
        value = $bindable(''),
        hasResults = $bindable(false)
    }: {
        value?: string;
        hasResults?: boolean;
    } = $props();

    let resultCopiedStatus: boolean = $state(false);
	
    const bf_charsset = '><+-.,[]';

    type BFOutput = {
        raw: number[];
        lossy_string: string;
    };

    let result: Promise<BFOutput | null> = $derived.by(async () => {
        if (!value) {
            return null;
        }

        // If none of the Brainfuck characters are present, OR
        // If no "." character is present (must have at least one output operation),
        // Return null
        if (!value.includes('.') || !bf_charsset.split('').some(char => value.includes(char))) {
            return null;
        }

        try {
            // Create a timeout promise
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Execution timeout')), 3000);
            });

            // Race between execution and timeout
            const result = await Promise.race([
                bf_execute(value, null),
                timeoutPromise
            ]);

            if (!result.success) {
                console.error(result.error);
                return null;
            }
            const output = result.output as BFOutput;

            // Remove '\ufffd' from the output string with actual � so most browsers can show it correctly
            output.lossy_string = output.lossy_string.replace(/\ufffd/g, '�');

            // Though, if the output is all just the replacement character, the user might have chicken typed
            if (output.lossy_string.split('').every(char => char === '\ufffd' || char === '\u0000' || char === '�')) {
                return null;
            }

            return output;
        } catch (error) {
            if (error instanceof Error && error.message === 'Execution timeout') {
                console.warn('Brainf*ck execution timed out after 3 seconds');
            } else {
                console.error('Brainf*ck execution error:', error);
            }
            return null;
        }
    });

    $effect(() => {
        if (result) {
            result.then(res => {
                hasResults = !!res;
            });
        } else {
            hasResults = false;
        }
    });
</script>

{#await result}
    <!--  -->
{:then result}
    {#if result}
        <Command.Group heading="Brainf*ck">
            <!-- Copy result to clipboard -->
            <Command.Item
                data-rr-calculator-item
                value="Copy Output"
                aria-label="Copy Output"
                class="flex items-center justify-start font-medium font-mono"
                onclick={() => {
                    if (!result) {
                        return;
                    }
                    navigator.clipboard.writeText(result.lossy_string.toString());
                    resultCopiedStatus = true;
                    setTimeout(() => {
                        resultCopiedStatus = false;
                    }, 3000);
                }}
            >
                <ChevronRight class="ml-1 size-4" />
                <div class="flex-1 text-left flex flex-col items-start justify-center">
                    {#if result.lossy_string.trim().length}
                        <span class="ignorespanclip">{result.lossy_string.toString()}</span>
                    {/if}
                    <span class="my-1 text-xs text-[0.6rem] text-muted-foreground">[{result.raw.join(", ")}]</span>
                </div>
                {#if !resultCopiedStatus}
                    <Badge
                        variant="outline"
                        class="pointer-events-none ml-auto whitespace-nowrap text-nowrap text-xs font-normal font-sans"
                        >Copy Result<Clipboard class="ml-2 size-3" /></Badge
                    >
                {:else}
                    <Badge
                        variant="outline"
                        class="pointer-events-none ml-auto whitespace-nowrap text-nowrap text-xs font-normal font-sans"
                        >Copied!<ClipboardCheck class="ml-2 size-3 text-emerald-800 dark:text-emerald-100" /></Badge
                    >
                {/if}
            </Command.Item>
        </Command.Group>
        <Separator />
    {/if}
{/await}