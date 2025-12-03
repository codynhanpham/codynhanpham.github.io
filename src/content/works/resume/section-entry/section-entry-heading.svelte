<script lang="ts">
    import type { Snippet } from 'svelte';
    
    let {
        fromYYYYMM,
        toYYYYMM,
        footnote,
        children
    }: {
        fromYYYYMM?: string | "present";
        toYYYYMM?: string | "present";
        footnote?: string;
        children?: Snippet;
    } = $props();

    function mm2month(mm: string, long: boolean = false): string | undefined {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return long ? months[parseInt(mm) - 1] : months[parseInt(mm) - 1].slice(0, 3);
    }

    /**
     * Formats a YYYYMM date string into fullMonth Year (January 2025)
    */
    function yyyymm2long(yyyymm: string) {
        if (yyyymm === "present") {
            return "Present";
        }
        const yyyy = yyyymm.slice(0, 4);
        const mm = yyyymm.slice(4, 6);
        if (mm === "") {
            return `${yyyy}`;
        }
        return `${mm2month(mm, true)} ${yyyy}`;
    }
    /**
     * Formats a YYYYMM date string into abbrMonth Year (Jan 2025)
    */
    function yyyymm2abbr(yyyymm: string) {
        if (yyyymm === "present") {
            return "Present";
        }
        const yyyy = yyyymm.slice(0, 4);
        const mm = yyyymm.slice(4, 6);
        if (mm === "") {
            return `${yyyy}`;
        }
        return `${mm2month(mm, false)} ${yyyy}`;
    }
</script>

<div data-slot="section-entry-heading" class="flex flex-row items-center justify-between gap-2 w-full">
    <div class="">
        {@render children?.()}
        {#if footnote}
            <p data-slot="section-entry-heading-footnote" class="mt-1 text-xs sm:text-sm md:text-[0.9375rem] italic text-muted-foreground">
                {footnote}
            </p>
        {/if}
    </div>

    {#if fromYYYYMM && toYYYYMM}
        <div class="min-w-fit">
            <div class="hidden md:block text-base">
            {yyyymm2long(fromYYYYMM)} – {yyyymm2long(toYYYYMM)}
            </div>
            <div class="hidden min-[33rem]:block md:hidden text-sm">
                {yyyymm2abbr(fromYYYYMM)} – {yyyymm2abbr(toYYYYMM)}
            </div>
            <div class="min-[calc(33rem)]:hidden text-sm">
                {yyyymm2abbr(fromYYYYMM)} <br>– {yyyymm2abbr(toYYYYMM)}
            </div>
        </div>
    {/if}
</div>