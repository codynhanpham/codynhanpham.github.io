<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { page } from '$app/state';
    import { cn } from '$lib/utils';

    import * as Kbd from "$lib/components/ui/kbd/index.js";

    import {
        CircleAlert,
        FlaskConicalOff,
    } from '@lucide/svelte/icons';

</script>


<svelte:head>
	<title>HTTP { page.status } - {(page.error?.message) ? page.error.message : 'Error Occurred'} - Cody Nhan Pham</title>
	<meta name="description" content="Something went wrong" />
</svelte:head>


<main class={cn("w-full flex flex-col items-center justify-start gap-4 text-center p-0 pb-1 rounded-md overflow-clip")}>
    <div class="max-w-prose h-full w-full flex flex-col items-center justify-center gap-6 p-4">
        <div class="w-full h-max flex flex-row items-center justify-center gap-4">
            <div class="w-fit h-fit flex flex-row items-center justify-center gap-2">
                <p class="font-bold text-foreground align-middle leading-none"><i class="text-3xl">Oops!</i></p>
            </div>
            <FlaskConicalOff class="size-8" />
        </div>
    
        <Alert.Root variant="destructive" class="w-fit h-fit max-w-full">
            <CircleAlert class="!size-5" />
            <Alert.Title>
                <h1 class="w-fit">HTTP { page.status }</h1>
            </Alert.Title>
            <Alert.Description class="mr-1 text-sm text-left">
                <svelte:boundary>
                    {#if page.status === 404}
                        <p>
                            The page you are looking for could not be found. Try again using the search bar <Kbd.Root class="text-base">/</Kbd.Root>, or go back to <strong><i><a href="/" class="link-underline">homepage</a></i></strong>.
                        </p>
                    {:else if page.error?.message}
                        <p>
                            {page.error.message}
                        </p>
                    {:else}
                        <p>
                        An unexpected error has occurred. Please try again later.
                        </p>
                    {/if}
                </svelte:boundary>
            </Alert.Description>
        </Alert.Root>
    </div>
</main>