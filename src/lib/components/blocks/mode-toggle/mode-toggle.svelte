<script lang="ts" module>
    export type ModeToggleProps = {
        isNavOpen: boolean;
    };
</script>

<script lang="ts">
    import {
		Moon,
		Sun,
		MonitorCog,
	} from '@lucide/svelte/icons';

	import { resetMode, setMode, mode, systemPrefersMode } from "mode-watcher";

    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Select from "$lib/components/ui/select";

    import { cn } from "$lib/utils";
	import { tick } from 'svelte';

    let {
        isNavOpen,
    }: ModeToggleProps = $props();
    const setBodyColor = async () => {
        await tick();
        let sidebarColor = getComputedStyle(document.documentElement).getPropertyValue('--sidebar');
        let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', sidebarColor);

        // Just in case something weird still loading, check the theme again after a second
        await new Promise(resolve => setTimeout(resolve, 1000));
        sidebarColor = getComputedStyle(document.documentElement).getPropertyValue('--sidebar');
        backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', sidebarColor);
    };
</script>

<div>
    {#if isNavOpen}
        <Select.Root type="single" value={$mode ?? 'system'}>
            <Select.Trigger class="flex items-between justify-start gap-4 w-full px-2 py-2">
                <div class="flex items-center justify-start gap-3 w-full">
                    {#if $mode === 'dark'}
                        <Moon class="size-4 mx-0.5" />
                    {:else}
                        <Sun class="size-4 mx-0.5" />
                    {/if}
                    <span class="!block text-sm text-muted-foreground">
                        {$mode === 'dark' ? 'Dark' : $mode === 'light' ? 'Light' : 'System'}
                    </span>
                </div>
                <span class="sr-only">Toggle theme</span>
            </Select.Trigger>
            <Select.Content class="text-sm text-muted-foreground p-0 m-0 z-[99999]">
                <Select.Item
                    value="light"
                    class="flex items-center justify-start gap-3 w-full px-1.5 py-2"
                    onclick={() => {
                        setMode('light');
                    }}
                >
                    <Sun class="size-4 hover:text-current" />
                    <span class="!block">Light</span>
                </Select.Item>
                <Select.Item
                    value="dark"
                    class="flex items-center justify-start gap-3 w-full px-1.5 py-2"
                    onclick={() => {
                        setMode('dark');
                    }}
                >
                    <Moon class="size-4 hover:text-current" />
                    <span class="!block">Dark</span>
                </Select.Item>
                <Select.Item
                    disabled={$mode === $systemPrefersMode}
                    value="system"
                    class="flex items-center justify-start gap-3 w-full px-1.5 py-2"
                    onclick={() => {
                        resetMode();
                    }}
                >
                    <MonitorCog class="size-4 hover:text-current" />
                    <span class="!block">System</span>
                </Select.Item>
            </Select.Content>
        </Select.Root>
    {:else}
        <DropdownMenu.Root>
            <DropdownMenu.Trigger
                class={cn(buttonVariants({ variant: "outline", size: "icon" }), "text-muted-foreground hover:text-foreground")}
            >
                <Sun
                    class="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                    class="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
                <DropdownMenu.Item onclick={() => {setMode("light"); setBodyColor();}}>Light</DropdownMenu.Item
                >
                <DropdownMenu.Item onclick={() => {setMode("dark"); setBodyColor();}}>Dark</DropdownMenu.Item>
                <DropdownMenu.Item onclick={() => {resetMode(); setBodyColor();}}>System</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    {/if}
</div>