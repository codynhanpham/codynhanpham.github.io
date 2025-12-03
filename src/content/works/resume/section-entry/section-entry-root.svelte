<script lang="ts">
    let { children } = $props();
</script>

<section data-slot="section-entry">
    {@render children?.()}
</section>