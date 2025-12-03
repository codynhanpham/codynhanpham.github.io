<script lang="ts">
    let {
        html,
    }: {
        html: string;
    } = $props();
</script>

<svelte:boundary>
    {@html html}
</svelte:boundary>