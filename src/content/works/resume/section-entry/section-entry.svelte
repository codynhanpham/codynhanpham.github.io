<script lang="ts">
    let {
        children
    } = $props();

</script>

<div data-slot="section-entry-data">
    {@render children?.()}
</div>