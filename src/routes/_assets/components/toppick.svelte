<script lang="ts">
    import { cn } from '$lib/utils';
    import { Button } from "$lib/components/ui/button/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { RenderIcon } from '$lib/components/ui/simple-icons/simple-icons.svelte';
    import type { IconProps } from "@lucide/svelte";

	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import * as Card from "$lib/components/ui/card/index.js";

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


<Carousel.Item class="pl-1 sm:pl-2.5 basis-4/5 sm:basis-3/5 sm:-translate-x-1/8 2xl:basis-4/15 2xl:-translate-x-0 max-w-74 md:max-w-68 lg:max-w-74 2xl:max-w-86 opacity-35 sm:opacity-50 transition-opacity duration-500 ease-out">
    <div class="h-full p-0">
        <Card.Root class="flex flex-col items-center justify-start h-full w-full bg-background/20 p-0 border-none shadow-none gap-2">
            <Card.Content
                class="group relative flex shrink w-full items-center justify-center p-0 rounded-lg overflow-hidden opacity-85 aspect-2/3 pointer-events-auto select-none"
            >
                {#if item.image}
                    {#if ("src" in item.image)}
                        <a href={item.href} class="pointer-event-auto sm:pointer-events-none h-full w-full" aria-label={item.titleAlt || item.image.alt} tabindex="-1" target="_blank">
                            <enhanced:img src={item.image.src} alt={item.image.alt}
                                class={cn(
                                    "w-full h-full object-cover dark:brightness-90",
                                )} 
                            />
                        </a>
                    {:else}
                        <a href={item.href} class="pointer-event-auto sm:pointer-events-none h-full w-full" aria-label={item.titleAlt} tabindex="-1" target="_blank">
                            <svelte:boundary>
                                {@render item.image.snippet(item.image.data)}
                            </svelte:boundary>
                        </a>
                    {/if}
                {/if}

                <div class="absolute top-0 left-0 p-4 w-full h-full hidden sm:flex opacity-0 flex-col items-center justify-start bg-background/65 backdrop-blur-2xl sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 duration-200 ease-in-out overflow-y-auto select-none">
                    {#if typeof item.description === 'string'}
                        <p class="w-full mb-2 text-foreground/90 text-xs font-normal text-center md:text-left 2xl:text-sm drop-shadow-accent-2xl">
                            {item.description}
                        </p>
                    {:else if item.description}
                        <svelte:boundary>
                            {@render item.description.snippet(item.description.data)}
                        </svelte:boundary>
                    {/if}

                    {#if item.tags}
                        <div class="flex flex-row flex-wrap justify-center items-center mt-1 mb-6 lg:mb-8 gap-1 mx-auto md:mx-0 w-fit max-w-full">
                            {#each item.tags as tag}
                                <Badge variant="outline" class={cn("!bg-muted/20 !dark:bg-muted/15 text-foreground/60 text-xs mx-0 !p-0.5 !px-1 pointer-events-auto rounded-sm font-normal text-nowrap whitespace-nowrap", tag.class, (tag.onclick ? "cursor-pointer" : ""))} href={tag.href} onclick={tag.onclick} target={tag.href && isExternalLink(tag.href) ? "_blank" : ""}>
                                    {tag.text}
                                </Badge>
                            {/each}
                        </div>
                    {/if}

                    <div class="mt-auto w-full h-fit flex items-center justify-center gap-2 z-50">

                        {#if typeof item.primaryButton === 'object'}
                            {@const btnContent = item.primaryButton as ButtonContent}
                            <Button class="group !px-3 !py-2 w-fit h-fit flex gap-2 select-none bg-primary/90 opacity-80 hover:opacity-100 focus-visible:!ring-primary-foreground/80 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent" href={btnContent.href} onclick={btnContent.onclick} target={btnContent.href && isExternalLink(btnContent.href) ? "_blank" : ""} title={btnContent.alt}>
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
                                    <span class={cn("font-semibold", btnContent.class)}>
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

                        {#if typeof item.secondaryButton === 'object'}
                            {@const btnContent = item.secondaryButton as ButtonContent}
                            <Button variant="outline" class="!p-2 bg-secondary/40 w-fit h-fit select-none opacity-80 hover:opacity-100 focus-visible:!ring-foreground/80" href={btnContent.href} onclick={btnContent.onclick} target={btnContent.href && isExternalLink(btnContent.href) ? "_blank" : ""} title={btnContent.alt}>
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
                                    <span class={cn("font-semibold", btnContent.class)}>
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
            </Card.Content>

            <Card.Header class="flex h-auto grow w-full flex-col items-center sm:items-start justify-start px-3">
                {#if typeof item.title === 'string'}
                    <a href={item.href} target="_blank" title={item.titleAlt || item.title} class="w-full">
                        <span class="text-base text-foreground font-semibold text-center sm:text-left ignorespanclip line-clamp-2">
                            {item.title}
                        </span>
                    </a>
                {:else}
                    <svelte:boundary>
                            <a href={item.href} target="_blank">
                            {@render item.title.snippet(item.title.data)}
                        </a>
                    </svelte:boundary>
                {/if}
            </Card.Header>
        </Card.Root>
    </div>
</Carousel.Item>