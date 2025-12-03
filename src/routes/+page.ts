import type { PageLoad } from './$types';
import type { Snippet, Component } from 'svelte';
import { Html } from '$lib/components/ui/html';

import {
    codynhanphamHero,
} from './_assets/snippets/hero.svelte';

import {
    Download,
    ExternalLink,
    Info,
    Link2,
    Play,
} from '@lucide/svelte/icons';
import type { Home, IconProps } from '@lucide/svelte';

import { type validSimpleIconNames } from '$lib/components/ui/simple-icons/simple-icons.svelte';


import type { Picture } from 'vite-imagetools';
import Plane from './_assets/media/20221225_071643.jpg?enhanced';
import Merfish from './_assets/media/merfish_p18_03.webp?enhanced';
import BadApple from './_assets/media/badapple.png?enhanced';
import TwentyAA from './_assets/media/20aa.png?enhanced';
import AOBGeo from './_assets/media/aob-geo.png?enhanced';
import Clock from './_assets/media/clock.png?enhanced';
import Reid2025 from './_assets/media/41467_2025_58891_Fig1.webp?enhanced';
import BookScanner from './_assets/media/book-isbn-scanner-demo.png?enhanced';
import GridClicker from './_assets/media/grid-clicker-demo.png?enhanced';
import EWIUTS from './_assets/media/everywordiusedtosing-cover.jpg?enhanced';





export type PostPreviewTag = {
    text: string;
    class?: string;
    href?: string;
    onclick?: () => void;
}

export type SnippetContent = {
    snippet: Snippet | Snippet<[Record<string, any>?]>;
    data?: Record<string, any>;
}

export type ContentfulString = string | SnippetContent;

export type ButtonContent = {
    text?: string; // main display text
    alt?: string; // if text is not provided, alt is recommended for screen readers
    icon?: {
        icon: Component<IconProps, {}, ""> | validSimpleIconNames; // icon to display to the left of the text
        props?: IconProps;
    }
    class?: string;
    href?: string;
    onclick?: () => void;
}

export type PostPreviewData = {
    title: ContentfulString;
    titleAlt?: string;
    description?: ContentfulString;
    image?:{
        src: string | Picture;
        alt: string;
        class?: string;
    } | {
        snippet: Snippet | Snippet<[Record<string, any>?]>;
        data?: Record<string, any>;
    };
    tags?: PostPreviewTag[];
    class?: string;
    href?: string; // Only for small post previews; typically, this is the same href as the primaryButton
    primaryButton?: ButtonContent | SnippetContent;
    secondaryButton?: ButtonContent | SnippetContent;
}

export type HomeHeroData = PostPreviewData & {
};

export type TopPicksData = PostPreviewData & {
};

export type ForYouData = PostPreviewData & {
};



// ----------------- Data ----------------- //



const hero: HomeHeroData[] = [
    {
        title: {
            snippet: codynhanphamHero,
            data: {
                heading: "h2",
            },
        },
        description: "Determined to see beyond what an old SuperCub could take him, Cody hopped on a plane to America, the other side of the world. Away from Vietnam by his lonesome, he studied Biology and somehow also picked up a passion for programming while engineering out of whatever got in his way. The one thing that bothers him? There's just no place for Cubs in this land of pickup trucks...",
        image: {
            src: Plane,
            alt: "Sunrise from a window seat on a plane taking off",
        },
        tags: [
            { text: "2001 Original", class: "font-semibold" },
            { text: "Slice of Life" },
            { text: "Adventure" },
        ],
        href: "/works/resume",
        primaryButton: {
            text: "Resume",
            alt: "Resume",
            icon: {
                icon: Play,
                props : {
                    class: "size-5 text-[2.75rem] md:text-5xl lg:text-6xl -translate-x-0.5 duration-200 group-hover:translate-x-0.5",
                    strokeWidth:"2.25"
                },
            },
            href: "/works/resume",
        },
        secondaryButton: {
            alt: "About",
            icon: {
                icon: Info,
                props : {
                    class: "size-5",
                },
            },
            href: "/about",
        }
    },

    {
        title: "Functional Effects with Spatial Transcriptomics",
        description: "Every bright pixel, nay, subpixel, in the picture is an mRNA molecule on a brain tissue section at a snapshot in time. With MERFISH, we can capture the distribution of active genes in the tissue with sub-cellular resolution, opening up new avenues for understanding the orchestration of transcriptions and cellular functions across space.",
        image: {
            src: Merfish,
            alt: "A monochrome image of a MERFISH run on a mouse brain tissue section",
        },
        tags: [
            { text: "Journal" },
            { text: "Preprint" },
            { text: "Neuroscience" },
        ],
        href: "https://www.biorxiv.org/content/10.1101/2025.06.11.659209v1.full",
        primaryButton: {
            text: "Read Article",
            alt: "Read Article",
            icon: {
                icon: ExternalLink,
                props : {
                    class: "size-5",
                },
            },
            href: "https://www.biorxiv.org/content/10.1101/2025.06.11.659209v1.full",
        },
        secondaryButton: {
            alt: "Additional Information",
            icon: {
                icon: Info,
                props : {
                    class: "size-5",
                },
            },
            href: "https://www.google.com/search?q=what+is+merfish+spatial+transcriptomics",
        }
    },

    {
        title: "Bad Apple, but it's MATLAB",
        description: "Actually, any simple and contrasty video will work just fine! It started out as a meme project for a hidden Easter egg but then somehow evolved into a pretty decent edge-detection + realtime data visualization tool. And what's more? I think MATLAB is not as bad as everyone makes it out to be... Probably...?",
        image: {
            src: BadApple,
            alt: "Line art of one frame from the Bad Apple video showcasing the software",
        },
        tags: [
            { text: "Music Video" },
            { text: "MATLAB" },
            { text: "Computational Tools" },
        ],
        href: "https://youtu.be/pQj3HNsaUds",
        primaryButton: {
            text: "Watch Video",
            alt: "Watch Video",
            icon: {
                icon: Play,
                props : {
                    class: "size-5",
                },
            },
            href: "https://youtu.be/pQj3HNsaUds",
        },
        secondaryButton: {
            alt: "GitHub",
            icon: {
                icon: 'github',
                props : {
                    class: "size-5",
                },
            },
            href: "https://github.com/codynhanpham/BadApple/tree/main/MATLAB",
        }
    },
]



const topPicks: TopPicksData[] = [
    {
        title: "20 Amino Acids Quiz",
        description: "So bored of mindlessly memorizing the 20 amino acids for his biochemistry class, Cody took it upon himself to create a quiz site that makes this process more enjoyable as there was no existing solution for such a seemingly simple app. This is his first programming project ever, with the most clunky, ugly, and insensible code now proudly open sourced and frozen in time for himself and us all to have a good laugh at. Just how much had he improved since this first project?",
        image: {
            src: TwentyAA,
            alt: "A screenshot of the 20 Amino Acids Quiz website",
        },
        tags: [
            { text: "Vanilla Web App" },
            { text: "HTML5" },
            { text: "JavaScript" },
            { text: "CSS" },
        ],
        href: "https://codynhanpham.com/20aa/",
        primaryButton: {
            text: "Start Quiz",
            alt: "Start Quiz",
            icon: {
                icon: ExternalLink,
                props : {
                    class: "size-5",
                },
            },
            href: "https://codynhanpham.com/20aa/",
        },
        secondaryButton: {
            alt: "GitHub",
            icon: {
                icon: 'github',
                props : {
                    class: "size-5",
                },
            },
            href: "https://github.com/codynhanpham/20aa",
        }
    },
    {
        title: "Ascendance of a Bookworm Geography Quiz",
        description: "Ascendance of a Bookworm, a Japanese light novel series that got Cody back into reading after a long time, paints a beautifully detailed fantasy world with the most intricate yet logical plot possible. This is a fan-made quiz site published the day after the English translation of the main series ended, aiming to help longtime fans and newreaders alike to memorize the geography of the fantastical world of AOB. It's a bit sad that no one else has created similar projects, but in the spirit of Myne from AOB,\"I'll just have to make them myself!\"",
        image: {
            src: AOBGeo,
            alt: "A screenshot of the Ascendance of a Bookworm Geography Quiz website",
        },
        tags: [
            { text: "Vanilla Web App" },
            { text: "HTML5" },
            { text: "JavaScript" },
            { text: "CSS" },
        ],
        href: "https://codynhanpham.com/aob-geo/",
        primaryButton: {
            text: "Start Quiz",
            class: "hover:yurgenschmidt-manuscript",
            alt: "Start Quiz",
            icon: {
                icon: ExternalLink,
                props : {
                    class: "size-5",
                },
            },
            href: "https://codynhanpham.com/aob-geo/",
        },
        secondaryButton: {
            alt: "GitHub",
            icon: {
                icon: 'github',
                props : {
                    class: "size-5",
                },
            },
            href: "https://github.com/codynhanpham/aob-geo",
        }
    },
    {
        title: "Book ISBN Scanner",
        description: "A web-based application that lets you scan the ISBN book barcode and get the book information from the openlibrary.org. A list of popular review sites and online bookstores are also listed for the user to choose from.",
        image: {
            src: BookScanner,
            alt: "A demo of the Book ISBN Scanner web app",
        },
        tags: [
            { text: "Vanilla Web App" },
            { text: "HTML5" },
            { text: "JavaScript" },
            { text: "CSS" },
        ],
        href: "https://codynhanpham.com/book-isbn-scanner/",
        primaryButton: {
            text: "Start Scanning",
            alt: "Try out the Book ISBN Scanner web app",
            icon: {
                icon: ExternalLink,
                props : {
                    class: "size-5",
                },
            },
            href: "https://codynhanpham.com/book-isbn-scanner/",
        },
        secondaryButton: {
            alt: "GitHub",
            icon: {
                icon: 'github',
                props : {
                    class: "size-5",
                },
            },
            href: "https://github.com/codynhanpham/book-isbn-scanner",
        }
    },
    {
        title: "Asynchronous development of the mouse auditory cortex is driven by hemispheric identity and sex",
        description: "Lateralized auditory processing is essential for specialized functions such as speech processing, typically dominated by the Left Auditory Cortex (ACx) in humans. Hemispheric specializations also occur in the adult mouse ACx, but their developmental origins are unclear. Our study finds that the Left and Right ACx in mice reach developmental milestones at different ages. Thalamocortical responses and maturation of synaptic dynamics develop earlier in the Right ACx than the Left. We show that this timing offset predicts hemisphere-dependent differences in sensory-driven plasticity. Juvenile tone exposure at specific times results in imbalanced adult tone frequency representations in the Right and Left ACx. Additionally, sex influences the timing of plasticity; female Right ACx plasticity occurs before male Right ACx, and female Left ACx aligns with male Right ACx plasticity. Our findings demonstrate that sex and hemispheric identity drive asynchronous development and contribute to functional differences in sensory cortices.",
        image: {
            src: Reid2025,
            alt: "A clock showing a random time in the past",
        },
        tags: [
            { text: "Ashlan P. Reid" },
            { text: "Demetrios Neophytou" },
            { text: "Robert Levy" },
            { text: "Cody Nhan Pham" },
            { text: "Hysell V. Oviedo" },
        ],
        href: "https://www.nature.com/articles/s41467-025-58891-3",
        primaryButton: {
            text: "Read Article",
            alt: "Read Article",
            icon: {
                icon: ExternalLink,
                props : {
                    class: "size-5",
                },
            },
            href: "https://www.nature.com/articles/s41467-025-58891-3",
        },
        secondaryButton: {
            alt: "Lab Website",
            icon: {
                icon: Link2,
                props : {
                    class: "size-5",
                },
            },
            href: "https://oviedolab.org/publications/#asynchronous-development-of-the-mouse-auditory-cortex-is-driven-by-hemispheric-identity-and-sex",
        }
    },
    {
        title: "Grid Clicker",
        description: "Eh... Well... You know... Sometimes you just want to have a nice way to click neatly in a perfect grid pattern. This is the program, built with Tauri and Svelte, that helps you do just that. Overlay over any other program, draw a grid over it, and automatically click neatly on that grid. Works for Windows only.",
        image: {
            src: GridClicker,
            alt: "A demo of the Grid Clicker desktop app",
        },
        tags: [
            { text: "Tauri" },
            { text: "Rust" },
            { text: "Svelte" },
            { text: "TypeScript" },
            { text: "TailwindCSS" },
            { text: "Bun" },
        ],
        href: "https://github.com/codynhanpham/grid_clicker",
        primaryButton: {
            text: "Source Code",
            alt: "Check out the project on GitHub",
            icon: {
                icon: 'github',
                props : {
                    class: "size-5",
                },
            },
            href: "https://github.com/codynhanpham/grid_clicker",
        },
        secondaryButton: {
            alt: "Releases / Downloads",
            icon: {
                icon: Download,
                props : {
                    class: "size-5",
                },
            },
            href: "https://github.com/codynhanpham/grid_clicker/releases/latest",
        }
    },
    {
        title: "umm... it's just a clock",
        description: "What time is it?",
        image: {
            src: Clock,
            alt: "A clock showing a random time in the past",
        },
        tags: [
            { text: "Vanilla Web App" },
            { text: "HTML5" },
            { text: "JavaScript" },
            { text: "CSS" },
        ],
        href: "https://codynhanpham.com/clock/",
        primaryButton: {
            text: "Timed",
            alt: "Check your current time",
            icon: {
                icon: ExternalLink,
                props : {
                    class: "size-5",
                },
            },
            href: "https://codynhanpham.com/clock/",
        },
        secondaryButton: {
            alt: "GitHub",
            icon: {
                icon: 'github',
                props : {
                    class: "size-5",
                },
            },
            href: "https://github.com/codynhanpham/clock",
        }
    },
    {
        title: " every word i used to sing - @comfibeats - (very scuffed) piano cover by me ♪~ ",
        description: "waiting for a sign... ♪",
        image: {
            src: EWIUTS,
            alt: "Cover art for every word i used to sing piano cover (original by @comfibeats)",
        },
        tags: [
            { text: "Piano" },
            { text: "comfi beats" },
        ],
        href: "https://www.youtube.com/watch?v=NEd3BcZi0Lk",
        primaryButton: {
            text: "Watch Video",
            alt: "Watch the piano cover video on YouTube",
            icon: {
                icon: 'youtube',
                props : {
                    class: "size-5",
                },
            },
            href: "https://www.youtube.com/watch?v=NEd3BcZi0Lk",
        },
    },
]


const forYou: ForYouData[] = topPicks as ForYouData[];



// ----------------- Load ----------------- //


export const load: PageLoad = ({ params }) => {
	return {
        hero,
        topPicks,
        forYou,
	};
};


