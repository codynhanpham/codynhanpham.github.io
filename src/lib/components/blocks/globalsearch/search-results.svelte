<script lang="ts" module>
    import type { Icon as IconType } from '@lucide/svelte';
    import { type validSimpleIconNames, RenderIcon } from '$lib/components/ui/simple-icons/simple-icons.svelte';
    
    export type SearchResultsItem = {
        title: string;
        description?: string;
        keywords?: string[];
        icon?: typeof IconType | validSimpleIconNames; // The icon that renders to the left of the item
        secondaryIcon?: typeof IconType | validSimpleIconNames; // The icon that renders to the full right of the item
        disabled?: boolean;
        href?: string; // If href is set, the item will be rendered as a link to take advantage of the browser prefetching
        onClick?: (...args: any[]) => void;

        keepStateAfterSelected?: boolean; // Whether to keep the state of the search box after the item is selected

        score?: number; // The match score by Fuse.js, inverted (higher is better)
        showScore?: boolean; // Whether to show the score badge
        style?: {
            title?: string;
            description?: string;
            icon?: string;
            secondaryIcon?: string;
        };
    }

    export type SearchResultsData = {
        heading?: string;
        items: SearchResultsItem[];
    }[];

    export type SearchResultOptions = {
    }

    export type FuseSearchData = (SearchResultsItem & { heading?: string })[];

    export function SRD2FSD(SRD: SearchResultsData): FuseSearchData {
        let FSD: FuseSearchData = [];
        SRD.forEach((group) => {
            group.items.forEach((item) => {
                FSD.push({
                    ...item,
                    heading: group.heading
                });
            });
        })
        return FSD;
    }
    export function FSD2SRD(FSD: FuseSearchData): SearchResultsData {
        let SRD: SearchResultsData = [];
        FSD.forEach((item) => {
            if (!SRD.find((group) => group.heading === item.heading)) {
                SRD.push({
                    heading: item.heading,
                    items: []
                });
            }
            SRD.find((group) => group.heading === item.heading)?.items.push(item);
        });
        return SRD;
    }


    let defaultData: SearchResultsData = [];
    let defaultOptions: SearchResultOptions = {
    };

    function hashD(obj: any) {
        const sortedKeys = Object.keys(obj).sort();
        const sortedObj: any = {};
        for (const key of sortedKeys) {
            sortedObj[key] = obj[key];
        }
        const objString = JSON.stringify(sortedObj);
        const hexHash = sha256.create();
        hexHash.update(objString).hex();
        return hexHash.toString();
    }

    export { renderResults };

</script>


<script lang="ts">
	import * as Command from '$lib/components/ui/command';
    import { Badge } from '$lib/components/ui/badge';

    import { sha256 } from 'js-sha256';
    
    

    import {
        Navigation, 

    } from '@lucide/svelte/icons';

    import { setGlobalSearchData, blurGlobalSearchInput, getActiveItemValue } from './globalsearch.svelte';

</script>

{#snippet renderResults(data: SearchResultsData | undefined = defaultData, total_matches: number | undefined = 0, options: SearchResultOptions = defaultOptions)}
    {#if data?.length}
        {@const remaining_results = (total_matches || data.length) - data.length}
        {#each data as group, i}
            <Command.Group heading={group.heading}>
                {#each group.items as item}
                    {@const itemNoScore = (({ score, ...o }) => o)(item)}
                    {@const itemValue = hashD(itemNoScore)}
                    {#if item.href}
                        <Command.LinkItem
                            value={itemValue}
                            disabled={item.disabled}
                            href={item.href}
                            onclick={item.onClick}
                            class="flex flex-row items-center justify-start font-medium gap-3 px-3 border border-transparent [&[data-selected]]:border-border"
                            aria-label={item.title}
                            onSelect={() => {
                                if (item.keepStateAfterSelected === true) {
                                    return;
                                }
                                setGlobalSearchData({
                                    value: '',
                                    searchResults: undefined,
                                });
                                blurGlobalSearchInput();
                            }}
                        >
                            {#if item.icon}
                                {#if typeof item.icon === 'string'}
                                    {@render RenderIcon?.({name: item.icon, style: item.style?.icon, className: "size-4 text-current", fill: "currentColor"})}
                                {:else}
                                    <item.icon class="size-4 text-current" />
                                {/if}
                            {:else}
                                <Navigation class="size-4 text-current" />
                            {/if}
                            <div class="flex max-w-full flex-col">
                                <span class="text-sm text-foreground ignorespanclip" style={item.style?.title}>{item.title}</span>
                                <span class="pointer-events-none text-xs text-muted-foreground ignorespanclip" style={item.style?.description}>
                                    {item.description}
                                </span>
                            </div>
                            <div class="flex ml-auto w-fit h-auto gap-1.5">
                                {#if (item.showScore && item.score) && (getActiveItemValue() !== itemValue || !item.secondaryIcon)}
                                    <Badge variant="outline" class="text-muted-foreground text-xs ml-auto pointer-events-none font-normal text-nowrap whitespace-nowrap">
                                        {item.score.toFixed(2)}
                                    </Badge>
                                {/if}
                                {#if (item.secondaryIcon && (!item.showScore) || (item.showScore && getActiveItemValue() === itemValue))}
                                    {#if typeof item.secondaryIcon === 'string'}
                                        {@render RenderIcon?.({name: item.secondaryIcon, style: item.style?.secondaryIcon, className: "size-3 text-muted-foreground", fill: "var(--muted-foreground)"})}
                                    {:else}
                                        <item.secondaryIcon class="size-3 text-muted-foreground" />
                                    {/if}
                                {/if}
                            </div>
                        </Command.LinkItem>
                    {:else}
                        <Command.Item
                            value={itemValue}
                            disabled={item.disabled}
                            onclick={item.onClick}
                            class="flex flex-row items-center justify-start font-medium gap-3 px-3 border border-transparent [&[data-selected]]:border-border"
                            aria-label={item.title}
                            onSelect={() => {
                                if (item.keepStateAfterSelected === true) {
                                    return;
                                }
                                setGlobalSearchData({
                                    value: '',
                                    searchResults: undefined,
                                });
                                blurGlobalSearchInput();
                            }}
                        >
                            {#if item.icon}
                                {#if typeof item.icon === 'string'}
                                    {@render RenderIcon?.({name: item.icon, style: item.style?.icon, className: "size-4 text-current", fill: "currentColor"})}
                                {:else}
                                    <item.icon class="size-4 text-current" />
                                {/if}
                            {:else}
                                <Navigation class="size-4 text-current" />
                            {/if}
                            <div class="flex max-w-full flex-col">
                                <span class="text-sm text-foreground ignorespanclip" style={item.style?.title}>{item.title}</span>
                                <span class="pointer-events-none text-xs text-muted-foreground ignorespanclip" style={item.style?.description}>
                                    {item.description}
                                </span>
                            </div>
                            <div class="flex ml-auto w-fit h-auto gap-1.5">
                                {#if item.showScore && item.score && (getActiveItemValue() !== itemValue && !item.secondaryIcon)}
                                    <Badge variant="outline" class="text-muted-foreground text-xs ml-auto pointer-events-none font-normal text-nowrap whitespace-nowrap">
                                        {item.score.toFixed(2)}
                                    </Badge>
                                {/if}
                                {#if item.secondaryIcon && getActiveItemValue() === itemValue}
                                    {#if typeof item.secondaryIcon === 'string'}
                                        {@render RenderIcon?.({name: item.secondaryIcon, style: item.style?.secondaryIcon, className: "size-3 text-muted-foreground", fill: "var(--muted-foreground)"})}
                                    {:else}
                                        <item.secondaryIcon class="size-3 text-muted-foreground" />
                                    {/if}
                                {/if}
                            </div>
                        </Command.Item>
                    {/if}
                {/each}
            </Command.Group>
            {#if i < data.length - 1}
                <Command.Separator forceMount class="!mx-0 bg-border h-px w-full" />
            {/if}
        {/each}
        {#if remaining_results > 0}
            <Command.Separator forceMount class="!mx-0 bg-border h-px w-full" />
            <Command.Group 
                heading={undefined} 
                class="bg-accent/50"
                style="
                --hashcolor: var(--border);
                --hashcolor: color-mix(in oklab, var(--border) 75%, transparent);
                background-image: linear-gradient(-45deg, transparent calc(50% - 0.5px), var(--hashcolor) calc(50% - 0.5px), var(--hashcolor) calc(50% + 0.5px), transparent calc(50% + 0.5px)); background-size: 1rem 1rem;
                ">
                <Command.Item
                    value={hashD(data)}
                    disabled={true}
                >
                    <div class="flex w-full py-1 items-center justify-center">
                        <span class="text-sm text-muted-foreground">+ {remaining_results} more {remaining_results === 1 ? 'match' : 'matches'}</span>
                    </div>
                </Command.Item>
            </Command.Group>
        {/if}
    {/if}
{/snippet}