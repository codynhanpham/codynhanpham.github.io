import {
    House,
    Lightbulb,
    Briefcase,
    CircleUserRound,
} from '@lucide/svelte/icons';

import type { Icon as IconType } from '@lucide/svelte';

export type NavMenuItem = {
	name: string;
	href: string;
	icon: typeof IconType;
    onClick?: () => void;
	children?: NavMenuItem[];
};

export const NavMenuData: NavMenuItem[] = [
    {
        name: 'Home',
        href: '/',
        icon: House,
    },
    {
        name: 'Projects',
        href: '/projects',
        icon: Lightbulb,
    },
    {
        name: 'Professional',
        href: '/works',
        icon: Briefcase,
    },
    {
        name: 'About',
        href: '/about',
        icon: CircleUserRound,
    },
];