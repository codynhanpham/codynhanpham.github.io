export function twActiveBreakpoint(): 'SSR' | 'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
	// Get current tailwind media query breakpoints
	
    type twScreensize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

    const breakpoints:
    { [key in twScreensize]: string }
    = {
        sm: '40rem',
        md: '48rem',
        lg: '64rem',
        xl: '80rem',
        '2xl': '96rem'
    }

    if (typeof window === 'undefined') {
        return 'SSR';
    }
    
    const width = window.innerWidth;

    for (const [key, value] of Object.entries(breakpoints)) {
        if (px2rem(width) >= parseInt(value)) {
            return key as twScreensize;
        }
    }

    return 'default';

}


export function isSmallScreen() {
    const smallscreenValues = ['default']; // or ['default', 'sm']
    return smallscreenValues.includes(twActiveBreakpoint());
}

export function px2percentage(pixel: number) {
    if (typeof window === 'undefined') {
        return 0;
    }
    return pixel / window.innerWidth * 100;
}

export function rem2px(rem: number) {
    if (typeof window === 'undefined') {
        return 0;
    }
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return rem * rootFontSize;
}

export function px2rem(pixel: number) {
    if (typeof window === 'undefined') {
        return 0;
    }
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return pixel / rootFontSize;
}

export function rem2percentage(rem: number) {
    const px = rem2px(rem);
    return px2percentage(px);
}

export function getComputedStyleWidthPixel(element: HTMLElement | null, defaultSize: number = 0) {
    if (typeof window === 'undefined' || !element) {
        return defaultSize;
    }
    const width = parseFloat(getComputedStyle(element).width);
    return width || defaultSize;
}