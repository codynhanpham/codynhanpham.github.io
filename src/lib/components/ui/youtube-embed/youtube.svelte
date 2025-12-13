<script lang="ts" module>
    export type YoutubeEmbedProps = {
        videoId: string;
        showTitle?: boolean;
        showAuthor?: boolean;
        class?: string;
        playerClass?: string;
        playerVars?: any;
        // The youtube iframe player Object
        player?: any | null;
        // The slotted iframe element
        ref?: HTMLIFrameElement | undefined;
    }

    export type YoutubePlayerVars = {
        autoplay?: 0 | 1; // 0 == false, 1 == true
        cc_lang_pref?: string; // ISO 639-1 two-letter language code
        cc_load_policy?: 0 | 1 | undefined; // 0 == false, 1 == true
        color?: "red" | "white";
        controls?: 0 | 1; // show player control; 0 == false, 1 == true
        disablekb?: 0 | 1; // 0 == false, 1 == true
        enablejsapi?: 0 | 1; // 0 == false, 1 == true
        end?: number; // seconds from start of video
        fs?: 0 | 1; // allow fullscreen; 0 == false, 1 == true
        hl?: string; // player interface language; ISO 639-1 two-letter language code
        iv_load_policy?: 1 | 3; // 1 == show annotations by default, 3 == do not show annotations by default
        list?: string; // list of comma-separated video IDs
        listType?: "playlist" | "user_uploads"; // list type
        loop?: 0 | 1; // 0 == false, 1 == true
        playlist?: string; // comma-separated list of video IDs to add to the player's playlist
        playsinline?: 0 | 1; // for iOS; 0 == fullscreen, 1 == inline
        rel?: 0 | 1;
        start?: number; // seconds from start of video
        widget_referrer?: string; // URL where the player is embedded
    }
    export const defaultPlayerVars: YoutubePlayerVars = {
        autoplay: 0,
    }

    export type OembedMetadata = {
        title: string;
        author_name: string;
        author_url: string;
        type: "video" | "playlist";
        height: number;
        width: number;
        version: string;
        provider_name: string;
        provider_url: string;
        thumbnail_height: number;
        thumbnail_width: number;
        thumbnail_url: string;
        html: string;
        author_thumbnail_url?: string;
    }

</script>

<script>
    import { cn } from '$lib/utils';

    import { onMount } from 'svelte';
	import { on } from 'svelte/events';
    import { v4 as uuidv4 } from 'uuid';

	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

    import {
        ListVideo,
		LoaderCircle,
        Play,
    } from "@lucide/svelte/icons";

    import { Skeleton } from "$lib/components/ui/skeleton/index.js";

    let {
        videoId,
        showTitle = false,
        showAuthor = false,
        playerVars = { ...defaultPlayerVars },
        class: className = "",
        playerClass = "",
        player = $bindable(null),
        ref = $bindable(undefined),
    }: YoutubeEmbedProps = $props();

    // Keep a stable DOM id; avoid capturing `videoId` into a top-level constant.
    const iframeId = uuidv4();

    // Actually, video id is 11 chars for now, but use 12 to be safe since playlist id will absolutely be longer than 12
    let isVideo = $derived(videoId.length <= 12);
    let f_playerVars = $derived.by(() => {
        const next = { ...playerVars } as any;

        if (videoId.length > 12) {
            next.listType = "playlist";
            next.list = videoId;
            next.videoId = "";
        }

        return next;
    });
    let uiPlayerButton: HTMLButtonElement | null = null;
    let playerReady = $state(false);
    let playerInteracted = $state(false);
    let duration: number | null = $state(null); // either in seconds if isVideo, or length (video count) of the playlist
    let thumbnail: string | undefined | Promise<string | undefined> = $state(undefined);
    let metadata: OembedMetadata = $state({
        title: "",
        author_name: "",
        author_url: "",
        type: "video",
        height: 0,
        width: 0,
        version: "",
        provider_name: "",
        provider_url: "",
        thumbnail_height: 0,
        thumbnail_width: 0,
        thumbnail_url: "",
        html: "",
        author_thumbnail_url: "",
    });
    let playerButtonIsFocused = $state(false);
    let playerState: number = $state(-1);

    let lastplayerreadycheck = 0;


    function load() {
        // check if there actually exists winwow.YT, if not, wait a bit and try again
        // @ts-ignore
        if (!window.YT || !window.YT.Player) {
            setTimeout(load, 250);
            return;
        }

        if (player !== null) {
            return; // already loaded
        }

        // @ts-ignore
        player = new YT.Player(iframeId, {
            height: '100%',
            width: '100%',
            videoId: isVideo ? videoId : "",
            playerVars: f_playerVars,
            
            // @ts-ignore
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event: any) {
        playerReady = true;
        event.target.setVolume(50);
        ref = event.target.g;
        // force tabindex = -1 so that the iframe itself do not get focus
        ref?.setAttribute("tabindex", "-1");
        if (isVideo) {
            duration = event.target.getDuration();
        }
        else {
            duration = event.target.getPlaylist().length;
        }
    }

    function onPlayerStateChange(event: any) {
        // @ts-ignore
        if (event.data !== -1 || event.data !== YT.PlayerState.CUED) {
            playerInteracted = true;
        }
        playerState = event.data;
    }

    function togglePlayPause() {
        if (!playerReady || !player) {
            try {
                load();
            } catch (e) {
                console.warn(e);
            }
        }
        const state = player.getPlayerState();
        // @ts-ignore
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        }
        // @ts-ignore
        else if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.CUED) {
            player.playVideo();
        }
        else if (state === -1) {
            if (document && document.activeElement === uiPlayerButton) {
                uiPlayerButton?.blur();
            }
            setTimeout(() => {
                togglePlayPause();
            }, 200);
        }
    }

    function formatDuration(duration: number) {
        // format as hh:mm:ss, at least mm:ss, if hour > 0, hh:mm:ss
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }


    function recheckPlayerReady() {
        if (Date.now() - lastplayerreadycheck < 200) {
            return;
        }

        // Just in case the player is not loaded for some reason and the user is hovering over the player (probably with the intention of playing the video)
        if (!playerReady || !player) {
            lastplayerreadycheck = Date.now();
            if (document && document.activeElement !== uiPlayerButton) {
                uiPlayerButton?.focus();
            }
            try {
                load();
                uiPlayerButton?.classList.remove("cursor-wait");
                uiPlayerButton?.classList.add("cursor-pointer");
            } catch (e) {
                console.warn(e);
            }
        }
    }


    async function fetchVideoMetadataOembed(videoId: string, isVideo: boolean): Promise<OembedMetadata> {
        const url = `https://www.youtube.com/oembed?format=json&url=${isVideo ? `https://youtube.com/watch?v=${videoId}` : `https://youtube.com/playlist?list=${videoId}`}`;
        return fetch(url).then((res) => res.json()).then((data) => {
            return data as OembedMetadata;
        });
    }

    onMount(() => {
        // more specific selector with the data-yt-id attribute
        uiPlayerButton = document.querySelector(`[data-yt-id="${videoId}"] button[data-yt-player-interaction-wrapper]`) as HTMLButtonElement;
        // uiPlayerButton = document.querySelector('button[data-yt-player-interaction-wrapper]') as HTMLButtonElement;

        if (isVideo) {
            thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
        }
        
        (async () => {
            metadata = await fetchVideoMetadataOembed(videoId, isVideo);
            thumbnail = metadata?.thumbnail_url;
            if (metadata && metadata.author_url.startsWith("/")) {
                metadata.author_url = "https://www.youtube.com" + metadata.author_url;
            }
        })();

        
        // @ts-ignore
        if (window.YT) {
            try {
                lastplayerreadycheck = Date.now();
                load();
            } catch (e) {
                console.warn(e);
            }
        } else {        
            // @ts-ignore
            window.onYouTubeIframeAPIReady = load;
        }


        setTimeout(() => {
            // @ts-ignore
            if (window.YT && !playerReady || !player) {
                try {
                    load();
                } catch (e) {
                    console.warn(e);
                }
            }
        }, 5000);
    });

    $effect(() => {
        if (playerReady && playerInteracted && ref) {
            // Set the position of the iframe back to 100%
            ref.style.top = "0px";
            ref.style.left = "0px";
            ref.style.width = "100%";
            ref.style.height = "100%";
            ref.style.opacity = "1";
            ref.style.cursor = "auto";
        }
    });
</script>

<svelte:head>
    <link rel="preconnect" href="https://www.youtube.com">
    <link rel="preconnect" href="https://yt3.ggpht.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link rel="preconnect" href="https://www.gstatic.com">
    <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<div class={className}
    data-yt-id={videoId}
>
    <div class={cn("w-full flex focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] focus-within:ring-offset-3 focus-within:ring-offset-background/50 overflow-hidden", playerClass)}>
        <button
            data-yt-player-interaction-wrapper
            class={cn("w-full h-full aspect-video overflow-hidden bg-accent", (playerReady ? "cursor-pointer" : "cursor-wait"), "relative")}  tabindex="0" onclick={() => togglePlayPause()}
            onmouseenter={() => recheckPlayerReady()}
            ontouchmove={() => recheckPlayerReady()}
            onmouseleave={() => { (player && playerReady && document.activeElement === uiPlayerButton) ? uiPlayerButton?.blur() : null }}
            onfocus={() => { playerButtonIsFocused = true; recheckPlayerReady(); }}
            onblur={() => playerButtonIsFocused = false}
        >
            <div data-yt-iframe-wrapper class={cn("relative w-full h-full", (playerReady ? "":"animate-pulse"))}>
                <!-- on some browsers (chrome!!!) the iframe is not interactive when opacity is 0... so using a really small value here to make it work -->
                <div id={iframeId} class={cn((playerInteracted ? "absolute w-full h-full top-0 left-0" : "absolute w-[300%] h-[300%] -top-full -left-full opacity-[0.001]"))}></div>
            </div>
        
            <div 
                class={cn(
                    "absolute top-0 left-0 w-full h-full object-cover",
                    (playerReady ? "cursor-pointer pointer-events-none" : "cursor-wait"),
                    (playerInteracted ? "hidden" : "bg-accent")
                )}
                title={playerReady ? "" : "YouTube player loading..."}
            
            >
                {#if !isVideo}
                    {#await thumbnail}
                        <div class="w-full h-full flex items-center justify-center">
                            <LoaderCircle class="size-10 animate-spin" />
                        </div>
                    {:then thumbnail}
                        <img src={thumbnail} alt="YouTube thumbnail" class="w-full h-full object-cover" />
                    {/await}
                {:else}
                        <img src={thumbnail as string | undefined} alt="YouTube thumbnail" class="w-full h-full object-cover" />
                {/if}
            </div>
            {#if duration !== null && isVideo}
                <div in:fade={{ duration: 150, easing: cubicOut, delay: 50 }} class={cn("absolute bottom-2.5 right-2.5 w-fit h-fit px-2 py-1 rounded-sm pointer-events-none text-stone-50", (playerInteracted ? "hidden" : "bg-stone-950/85 backdrop-blur-xs"))}>
                    <span class="text-sm text-stone-50/90">{formatDuration(duration)}</span>
                </div>
            {:else if duration !== null && !isVideo}
                <div in:fade={{ duration: 150, easing: cubicOut, delay: 50 }} class={cn("absolute bottom-2.5 right-2.5 flex w-fit h-fit justify-center items-center gap-1 px-2 py-1 rounded-sm pointer-events-none text-stone-50", (playerInteracted ? "hidden" : "bg-stone-950/80 backdrop-blur-xs"))}>
                    <ListVideo class="w-4 h-4 text-stone-50/90" />
                    <span class="text-sm text-stone-50/90">{duration} {duration === 1 ? "video" : "videos"}</span>
                </div>
            {/if}
            
            <!-- Show a small tag to indicate player is playable -->
            {#if playerButtonIsFocused && (playerState === -1 || playerState === 5)}
                <div
                    in:fade={{ duration: 150, easing: cubicOut, delay: 50 }}
                    data-yt-player-status-indicator class="absolute top-4 left-4 w-fit h-min flex justify-center items-center gap-1 px-2 py-1 rounded-sm pointer-events-none text-xs text-stone-50 bg-stone-950/80 backdrop-blur-xs">
                    {#if !player || !playerReady}
                        <LoaderCircle class="w-4 h-4 text-stone-50/90 animate-spin" />
                        <span class="text-xs text-stone-50/90">Loading YouTube player...</span>
                    {:else}
                        <Play class="w-4 h-4 text-stone-50/90" />
                        <span class="text-xs text-stone-50/90">Play Video</span>
                    {/if}
                </div>
            {/if}
        </button>
    </div>


    {#if showTitle && metadata.title !== ""}
        <p class="mt-2 mx-2 text-current text-base font-medium" title={metadata.title}>{metadata.title}</p>
    {:else if showTitle}
        <Skeleton class="mx-auto mt-2 h-5.5 w-2/3 text-base font-semibold animate-pulse" />
    {/if}
    {#if showAuthor && metadata.author_name !== ""}
        <a href={metadata.author_url} target="_blank" class="mx-2 w-max h-fit text-accent-foreground/80 text-xs hover:underline">{metadata.author_name}</a>
    {:else if showAuthor}
        <Skeleton class="mx-auto mt-1.5 h-4 w-1/2 text-xs animate-pulse" />
    {/if}
    
</div>


<!-- Example usage -->
<!-- <Youtube showTitle={true} showAuthor={true} videoId="pQj3HNsaUds" class={cn("w-full max-w-prose h-min rounded-md")} playerClass={cn("rounded-md", (isSmallScreen ? "" : "ring ring-border"))} /> -->
