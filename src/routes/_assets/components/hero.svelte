<script lang="ts">
    import { cn } from '$lib/utils';
    import { Button } from "$lib/components/ui/button/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { RenderIcon } from '$lib/components/ui/simple-icons/simple-icons.svelte';
    import type { IconProps } from "@lucide/svelte";

	import * as Carousel from "$lib/components/ui/carousel/index.js";

	import type { Component } from 'svelte';

    import type { PostPreviewData, ButtonContent, SnippetContent } from '../../+page';

    let {
        item,
        index,
    }: {
        item: PostPreviewData;
        index: number;
    } = $props();



    function isExternalLink(url: string) {
		if (!url.startsWith("http")) {
			return false;
		}
		const thisOrigin = new URL(window.location.href).origin;
		const targetOrigin = new URL(url).origin;
		return thisOrigin !== targetOrigin;
	}

</script>


<Carousel.Item class={cn("bg-background relative flex h-full items-center justify-center")}>
    {#if item.image}
        {#if ("src" in item.image)}
            <enhanced:img src={item.image.src} alt={item.image.alt} fetchpriority={(index == 0) ? "high":"auto"} loading={(index == 0) ? "eager":"lazy"}
                class={cn(
                    "absolute select-none top-0 left-0 w-full h-full object-cover brightness-120 dark:brightness-70",
                    "mask-linear-180 mask-linear-from-9% mask-linear-to-72%",
                    "lg:mask-linear-180 lg:mask-linear-from-15% lg:mask-linear-to-80% lg:mask-radial-[140%_110%] lg:mask-radial-from-35% lg:mask-radial-at-top-right"
                )} 
            />
        {:else}
            <svelte:boundary>
                {@render item.image.snippet(item.image.data)}
            </svelte:boundary>
        {/if}
    {/if}

    <div class="absolute ml-2 top-1/7 -translate-y-1/7 h-3/8 left-1/2 -translate-x-1/2 w-3/4 lg:top-1/7 lg:left-1/5 lg:-translate-x-1/5 lg:-translate-y-1/7 lg:w-1/2 lg:h-2/5 flex flex-col items-end justify-end">
        <div class="w-fit max-w-full h-fit flex flex-col gap-2 p-5 backdrop-blur-[2px] mask-t-from-89% mask-b-from-89% mask-l-from-98% mask-r-from-98% rounded-lg pointer-events-none select-none">
            {#if typeof item.title === 'string'}
                <h2 class="mb-1 lg:mb-1.5 text-xl md:text-2xl lg:text-3xl 2xl:text-4xl text-foreground/80 antialiased lg:subpixel-antialiased font-normal text-center md:text-left text-shadow-md">
                    {item.title}
                </h2>
            {:else}
                <svelte:boundary>
                    {@render item.title.snippet(item.title.data)}
                </svelte:boundary>
            {/if}

            {#if item.tags}
                <div class="flex flex-row justify-start items-center mb-1 lg:mb-1.5 gap-1 mx-auto md:mx-0 w-fit max-w-full overflow-hidden">
                    {#each item.tags as tag}
                        <Badge variant="outline" class={cn("bg-muted/20 dark:bg-muted/10 backdrop-blur-lg text-foreground/60 text-xs mx-0 !p-0.5 !px-1 pointer-events-auto rounded-sm font-normal text-nowrap whitespace-nowrap", tag.class, (tag.onclick ? "cursor-pointer" : ""))} href={tag.href} onclick={tag.onclick} target={tag.href && isExternalLink(tag.href) ? "_blank" : ""}>
                            {tag.text}
                        </Badge>
                    {/each}
                </div>
            {/if}

            {#if typeof item.description === 'string'}
                <p class="mb-2 text-foreground/90 text-xs font-normal text-center md:text-left 2xl:text-sm drop-shadow-accent-2xl line-clamp-5">
                    {item.description}
                </p>
            {:else if item.description}
                <svelte:boundary>
                    {@render item.description.snippet(item.description.data)}
                </svelte:boundary>
            {/if}
        </div>
        <div class="ml-5 self-center md:self-start w-fit h-fit flex justify-center items-center gap-2">
            {#if item.primaryButton && typeof(item.primaryButton) === 'object'}
                {@const btnContent = item.primaryButton as ButtonContent}
                <Button class="group !px-4 !py-2.5 w-fit h-fit flex gap-2 select-none opacity-80 hover:opacity-95" href={btnContent.href} onclick={btnContent.onclick} target={btnContent.href && isExternalLink(btnContent.href) ? "_blank" : ""} title={btnContent.alt}>
                    {#if btnContent.icon}
                        {#if typeof btnContent.icon.icon === 'string'}
                            {@const iconName = btnContent.icon.icon}
                            {@render RenderIcon?.({name: iconName, style: btnContent.icon.props?.style, className: cn(btnContent.icon.props?.class), fill: "currentColor"})}
                        {:else}
                            {@const IconComponent = btnContent.icon.icon as Component<IconProps, {}, "">}
                            {@const iconProps = {
                                class: cn("size-5", btnContent.icon.props?.class),
                                ...(btnContent.icon.props || {})
                            }}
                            <IconComponent {...iconProps} />
                        {/if}
                    {/if}

                    {#if btnContent.text}
                        <span class="font-semibold">
                            {btnContent.text}
                        </span>
                    {:else if btnContent.alt}
                        <span class="sr-only">
                            {btnContent.alt}
                        </span>
                    {/if}
                </Button>
            {:else if item.primaryButton}
                {@const snippetContent = item.primaryButton as SnippetContent}
                <svelte:boundary>
                    {@render snippetContent.snippet(snippetContent.data)}
                </svelte:boundary>
            {/if}

            {#if item.secondaryButton && typeof(item.secondaryButton) === 'object'}
                {@const btnContent = item.secondaryButton as ButtonContent}
                <Button variant="outline" class="!p-2.5 bg-secondary/40 w-fit h-fit select-none opacity-80 hover:opacity-95" href={btnContent.href} onclick={btnContent.onclick} target={btnContent.href && isExternalLink(btnContent.href) ? "_blank" : ""} title={btnContent.alt}>
                    {#if btnContent.icon}
                        {#if typeof btnContent.icon.icon === 'string'}
                            {@const iconName = btnContent.icon.icon}
                            {@render RenderIcon?.({name: iconName, style: btnContent.icon.props?.style, className: cn(btnContent.icon.props?.class), fill: "currentColor"})}
                        {:else}
                            {@const IconComponent = btnContent.icon.icon as Component<IconProps, {}, "">}
                            {@const iconProps = {
                                class: cn("size-5", btnContent.icon.props?.class),
                                ...(btnContent.icon.props || {})
                            }}
                            <IconComponent {...iconProps} />
                        {/if}
                    {/if}

                    {#if btnContent.text}
                        <span class="font-semibold">
                            {btnContent.text}
                        </span>
                    {:else if btnContent.alt}
                        <span class="sr-only">
                            {btnContent.alt}
                        </span>
                    {/if}
                </Button>
            {:else if item.secondaryButton}
                {@const snippetContent = item.secondaryButton as SnippetContent}
                <svelte:boundary>
                    {@render snippetContent.snippet(snippetContent.data)}
                </svelte:boundary>
            {/if}
        </div>
    </div>
</Carousel.Item>