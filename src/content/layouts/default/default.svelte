<script lang="ts">
    import './default.css';

	import { cn } from '$lib/utils';
    import type { PostMetadata } from '$content/types/postMetadata';
	import type { Snippet } from 'svelte';

    type ContentProps = PostMetadata & {
        children?: Snippet;
    }
    
    let props: ContentProps = $props();

</script>

<svelte:head>
    <title>{props.title} - Cody Nhan Pham</title>
    <meta name="description" content={props.description} />
    <meta name="keywords" content={props.tags?.join(', ')} />
    <meta name="author" content={props.author ?? 'Cody Nhan Pham'} />
</svelte:head>

<article class="">
    <div data-slot="markdown-content" class="h-full w-auto mx-4 md:mx-8">
        {@render props.children?.()}
    </div>
</article>