<script lang="ts" module>

    export {
        html,
        codynhanphamHero,
    }
</script>

<script lang="ts">
    import { Html } from "$lib/components/ui/html";


</script>



{#snippet codynhanphamHero(data: { heading: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" } = { heading: "h2" })}
    <svelte:element this={data.heading} class="mb-2 lg:mb-4 text-[2.75rem] md:text-5xl lg:text-6xl text-foreground/80 antialiased lg:subpixel-antialiased font-normal text-center md:text-left text-shadow-md cherish-regular font-stretch-expanded">
        Cody<wbr>Nhan<wbr>Pham
    </svelte:element>
{/snippet}


{#snippet html(data: { content: string })}
    <Html html={data.content} />
{/snippet}