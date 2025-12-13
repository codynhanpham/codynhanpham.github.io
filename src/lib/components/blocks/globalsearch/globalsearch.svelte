<script lang="ts" module>
    import type { Snippet } from 'svelte';
    import type { SearchResultsData } from './search-results.svelte';

    export type GlobalSearchProps = {
        value: string;
        cmdlist?: HTMLElement;
        cmdinput?: HTMLElement;
    };
    
    export type GlobalSearchDataT = {
        value?: string;
        activeItemValue?: string; // The value of the active item (hover, highlighted with keyboard, etc.)
        cmdlist?: HTMLElement | null;
        cmdinput?: HTMLElement | null;
        cmdinputFocused?: boolean;

        emptyResultsMessage?: string;
        searchResults?: SearchResultsData;
        total_matches?: number;
    }

    export let GlobalSearchData: GlobalSearchDataT = $state({
        value: '',
        cmdlist: undefined,
        cmdinput: undefined,
        cmdinputFocused: false,

        emptyResultsMessage: "No results found",
        searchResults: [],
        total_matches: 0,
    });

    export function setGlobalSearchData(data: GlobalSearchDataT) {
        for (const key in data) {
            // @ts-ignore
            GlobalSearchData[key] = data[key];
        }
    }

    export function blurGlobalSearchInput() {
        GlobalSearchData.cmdinput?.blur();
        GlobalSearchData.cmdinputFocused = false;
    }
    
    let searchboxActive: boolean = $state(false);
    export function isSearchboxActive(): boolean {
        return searchboxActive;
    }
    export function getActiveItemValue(): string | undefined {
        return GlobalSearchData.activeItemValue;
    }
</script>

<script lang="ts">
	import Logo from "$lib/front-end/assets/logo.svelte";

	import { LayoutUtils } from '$lib';
	import { cn } from '$lib/utils';

    import { renderResults } from './search-results.svelte';
    import { search, searchStatus } from './search.svelte';

    import { Button } from "$lib/components/ui/button";
	import * as Command from "$lib/components/ui/command";

	import {
		CommandIcon,
		ListX,
	} from '@lucide/svelte/icons';

    import BF from './bf.svelte';

	import { onMount, tick } from 'svelte';

    let commandBoxRoot: HTMLElement;
    let commandQuickInputActionButton: HTMLElement;

    let force_cmdlist_shown = $state(false);

    let {
        emptyResultsMessage = "No results found",
    }: GlobalSearchDataT = $props();

    let miscSearchResultsState: boolean[] = $state([false]);
    let hasMiscResults = $derived.by(() => {
        return miscSearchResultsState.some((state) => state);
    });

    $effect(() => {
        GlobalSearchData.emptyResultsMessage = emptyResultsMessage;
    });

    let isSearching = $state(false);
    let pointerIsTouching = $state(false);

    function handleQuickInputActionClick(event: MouseEvent | KeyboardEvent) {
        event.preventDefault();
        event.stopPropagation();
        
        if (GlobalSearchData.value) {
            GlobalSearchData.cmdinput?.focus();
            GlobalSearchData.cmdinputFocused = true;
            GlobalSearchData.value = '';
            GlobalSearchData.searchResults = [];
            GlobalSearchData.total_matches = 0;
            GlobalSearchData.activeItemValue = undefined;
        }
    }


    onMount(() => {
		commandBoxRoot = document.querySelector('div#globalsearchbox div[data-command-root]') as HTMLElement;
        commandQuickInputActionButton = document.getElementById('command-quick-input-action') as HTMLElement;

        GlobalSearchData.cmdlist = document.getElementById('global-searchbox-cmd-list');
        GlobalSearchData.cmdinput = document.getElementById('global-searchbox-input');


        // --- Handle Search Box Focus by Navigation Interaction --- //
        document.addEventListener('scroll', () => {
            
        });
        
        document.addEventListener('touchstart', (event: TouchEvent) => {
            pointerIsTouching = true;
        });
        document.addEventListener('touchend', (event: TouchEvent) => {
            pointerIsTouching = false;
            
        });
        
        document.addEventListener('touchmove', (event: TouchEvent) => {
            GlobalSearchData.cmdinput?.blur();
            GlobalSearchData.cmdinputFocused = false;
            if (commandBoxRoot && (!commandBoxRoot.contains(event.target as Node) || commandQuickInputActionButton.contains(event.target as Node))) {
                force_cmdlist_shown = false;
            } else {
                force_cmdlist_shown = true;
            }
        });

        document.addEventListener('mousedown', (event: MouseEvent) => {
            if (commandBoxRoot && (commandBoxRoot.contains(event.target as Node))) {
                if (isSearchboxActive() && commandQuickInputActionButton.contains(event.target as Node) && !GlobalSearchData.value) {   
                    GlobalSearchData.cmdinput?.blur();
                    GlobalSearchData.cmdinputFocused = false;
                } else {
                    event.preventDefault();
                    event.stopPropagation();
                    GlobalSearchData.cmdinput?.focus();
                    GlobalSearchData.cmdinputFocused = true;
                }
            } else {
                GlobalSearchData.cmdinput?.blur();
                GlobalSearchData.cmdinputFocused = false;
            }
            force_cmdlist_shown = false;
        });
        document.addEventListener('click', (event: MouseEvent) => {
            if (commandBoxRoot && (!commandBoxRoot.contains(event.target as Node) || commandQuickInputActionButton.contains(event.target as Node))) {
                GlobalSearchData.cmdinput?.blur();
                GlobalSearchData.cmdinputFocused = false;
                force_cmdlist_shown = false;
            }
        });


        // --- Handle Search Box Focus by Keyboard Events --- //
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === '/' || ((event.ctrlKey || event.metaKey) && event.key === 'k')) {
                if (GlobalSearchData.cmdinputFocused) {
                    return;
                }
                event.preventDefault();
                GlobalSearchData.cmdinput?.focus();
                GlobalSearchData.cmdinputFocused = true;
            }
            else if (event.key === 'Escape') {
                GlobalSearchData.cmdinput?.blur();
                GlobalSearchData.cmdinputFocused = false;
                force_cmdlist_shown = false;
            }

        });
    });


    $effect(() => {
        if (GlobalSearchData.cmdinputFocused || force_cmdlist_shown) {
            searchboxActive = true;

            if (GlobalSearchData.searchResults?.length || (GlobalSearchData.value?.length || 0) >= 5 || hasMiscResults) {
                if (typeof document !== 'undefined') {
                    if (pointerIsTouching) {
                        document.body.style.overflow = 'hidden';
                    }
                }
            }
        } else {
            searchboxActive = false;

            if (typeof document !== 'undefined') {
                document.body.style.overflow = '';
            }
        }
    });

</script>

<div id="globalsearchbox" class="_commandrootoverride"
>
    <Command.Root
        loop
        shouldFilter={false}
        class={cn(
            "relative w-full !h-fit border bg-sidebar/70",
            (((GlobalSearchData.searchResults?.length || (GlobalSearchData.value?.length || 0) >= 5 || hasMiscResults) && searchboxActive) ? 'inputwrapper_active' : 'inputwrapper_inactive')
            )}
        onfocus={() => {
            GlobalSearchData.cmdinput?.focus();
            GlobalSearchData.cmdinputFocused = true;
        }}
        onValueChange={(value) => {
            GlobalSearchData.activeItemValue = value;
        }}
        
    >
        <Command.Input
            id="global-searchbox-input"
            bind:value={GlobalSearchData.value}
            class="pr-12 h-9"
            aria-expanded="false"
            aria-label="Search..."
            aria-controls="global-searchbox-cmd-list"
            placeholder={LayoutUtils.isSmallScreen() ? "Search anything" : "Type a command or search..."}
            {@attach (input) => {
                input.addEventListener('focus', () => {
                    GlobalSearchData.cmdinputFocused = true;
                });
                input.addEventListener('blur', (event) => {
                    GlobalSearchData.cmdinputFocused = false;
                });
            }}

            oninput={async() => {
                if (GlobalSearchData.value) {
                    isSearching = true;
                    // Allow UI to update by deferring the search
                    await new Promise(resolve => setTimeout(resolve, 10));
                    await tick();
                    // Then perform search
                    search(GlobalSearchData.value).then((r) => {
                        GlobalSearchData.searchResults = r?.results;
                        GlobalSearchData.total_matches = r?.total_matches;
                        isSearching = false;
                    });
                } else {
                    isSearching = false;
                    GlobalSearchData.activeItemValue = undefined;
                    GlobalSearchData.searchResults = [];
                    GlobalSearchData.total_matches = 0;
                }
            }}
        />
        
        <!-- Note that the height of the command box is fixed at h-9 -->
        <Button
            id="command-quick-input-action"
            variant="secondary"
            class={cn(
                "absolute cursor-pointer h-6 w-fit rounded-sm right-0 mx-2 !px-3 !py-2 border border-transparent hover:border-border",
                (GlobalSearchData.value ? "text-red-950 dark:text-red-50 bg-destructive/5 border-destructive/20 hover:border-destructive/20 hover:bg-destructive/10" : "")
            )}
            style={`top: calc(0px + (var(--spacing) * 3)/2);`}
            aria-label="Quick Input Action"
            onclick={(event: MouseEvent) => {
                if (!GlobalSearchData.value && !GlobalSearchData.cmdinputFocused) {
                    GlobalSearchData.cmdinput?.focus();
                    GlobalSearchData.cmdinputFocused = true;
                    return;
                }
                handleQuickInputActionClick(event);
            }}
            onfocus={() => {
                if (GlobalSearchData.value) {
                    force_cmdlist_shown = true;
                } else {
                    force_cmdlist_shown = false;
                }
            }}
            onkeypress={(event: KeyboardEvent) => {
                if (event.key === ' ') {
                    GlobalSearchData.cmdinput?.focus();
                    GlobalSearchData.cmdinputFocused = true;
                    handleQuickInputActionClick(event);
                }
            }}
        >
            {#if !GlobalSearchData.cmdinputFocused}
                {#if GlobalSearchData.value}
                    <ListX class="size-4 select-none" />
                {:else}
                    <CommandIcon class="pointer-events-none size-4 select-none" />
                    <span class="pointer-events-none select-none text-xs">K</span>
                {/if}
            {:else if GlobalSearchData.value}
                <ListX class="pointer-events-none size-4 select-none" />
            {:else}
                <span class="select-none text-xs font-semibold">Esc</span>
            {/if}
        </Button>


        <Command.List
            id="global-searchbox-cmd-list"
            class={cn(
                "top-0 left-0 max-w-full h-fit max-h-72 bg-sidebar/60 backdrop-blur-sm m-0 px-0",
                "overscroll-contain",
                ((!GlobalSearchData.cmdinputFocused && !force_cmdlist_shown) ? 'hidden' : '')
            )}
        >
            {#if ((GlobalSearchData.value?.length || 0) >= 5)}
                <Command.Empty
                >
                    {#if searchStatus.isSearching || isSearching}
                        Searching...
                    {:else}
                        {GlobalSearchData.emptyResultsMessage}
                    {/if}
                </Command.Empty>
            {/if}


            <!-- Misc Action -->
            <!-- Remember to add default state [false] to `miscSearchResultsState` before adding more actions -->
            <BF bind:value={GlobalSearchData.value} bind:hasResults={miscSearchResultsState[0]} />
            


            <!-- Search results from siteInfo -->
            <svelte:boundary>
                {#key GlobalSearchData.searchResults}
                    {@render renderResults?.(GlobalSearchData.searchResults, GlobalSearchData.total_matches)}
                {/key}
            </svelte:boundary>
        </Command.List>
    </Command.Root>
</div>

<style lang="postcss">
    ._commandrootoverride :global(.inputwrapper_inactive) {
        :global(& [data-slot="command-input-wrapper"]) {
            @apply border-transparent;
        }
    }
    
    ._commandrootoverride :global(.inputwrapper_active) {
        :global(& [data-slot="command-input-wrapper"]) {
            --border: color-mix(in oklab, var(--primary) 35%, transparent);
            /* @apply border-primary-foreground; */
            /* border-bottom: 1.4px dashed var(--border); */
            border-bottom: 0px;

            background-image: none, none, none,  repeating-linear-gradient(48deg, var(--border), var(--border) 4.15px, transparent 5px, transparent 8.32px, var(--border) 9px);
            background-size: 1.5px 100%, 100% 1.5px, 1.5px 100% , 100% 1.5px; 
            background-position: 0 0, 0 0, 100% 0, 0 100%;
            background-repeat: no-repeat; 
        }
    }
</style>