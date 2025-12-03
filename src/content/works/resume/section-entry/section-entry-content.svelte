<script lang="ts">
    let { children } = $props();

</script>

<div data-slot="section-entry-content">
    {@render children?.()}
</div>