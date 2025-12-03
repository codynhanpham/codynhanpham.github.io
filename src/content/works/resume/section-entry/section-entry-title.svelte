<script lang="ts">
    let {
        children
    } = $props();

</script>

<div data-slot="section-entry-title">
    {@render children?.()}
</div>