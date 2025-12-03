export type ScrollYPos = {
    // Key is the path of the page, value is the scroll position
    [key: string]: number;
};
export const scrollY: ScrollYPos = $state({})


export type NavLog = {
    log: string[] | undefined; // linear log, most recent last
    
    // split route and get everything before the 2nd slash, that is the main nav Key (e.g. /projects/another -> /projects)
    // "/" is NOT considered a main nav
    // the route is the value belong to the key (/projects/another), to keep track the last sub-route for each main nav
    lastMainNav: {
        [key: string]: string | undefined;
    },
    
    // frequency count for each unique route
    routeFreq: {
        [key: string]: number;
    }
}

export const navLog: NavLog = $state({
    log: [],
    lastMainNav: {},
    routeFreq: {},
});

export function logNav(route: string, savePersistently: boolean = true) {
    if (route === undefined) {
        return;
    }

    // Update the routeFreq
    if (navLog.routeFreq[route] === undefined) {
        navLog.routeFreq[route] = 1;
    }
    else {
        navLog.routeFreq[route]++;
    }

    const splitRoute = route.split('/');
    const mainNav = splitRoute.slice(0, 2).join('/');
    if (mainNav === undefined || mainNav === '/') {
        return;
    }
    
    // Update the lastMainNav
    if (navLog.lastMainNav[mainNav] === undefined) {
        navLog.lastMainNav[mainNav] = route;
    }
    else if (route !== navLog.lastMainNav[mainNav]) {
        // If the route is different from the last one, add it to the log
        if (navLog.log === undefined) {
            navLog.log = [route];
        }
        else {
            // Only keep the last 420 routes
            navLog.log = navLog.log.slice(0, 420);
            navLog.log.push(route);
        }

        // Update the lastMainNav
        navLog.lastMainNav[mainNav] = route;
    }

    if (savePersistently) {
        saveNavLog();
    }
}

export function loadNavLog() {
    if (typeof localStorage === 'undefined') {
        return;
    }
    const navLogString = localStorage.getItem('navLog');
    if (navLogString === null) {
        return;
    }
    const fromStorage = JSON.parse(navLogString);
    navLog.log = fromStorage.log || [];
    navLog.lastMainNav = fromStorage.lastMainNav || {};
    navLog.routeFreq = fromStorage.routeFreq || {};
}
export function saveNavLog() {
    if (typeof localStorage === 'undefined') {
        return;
    }
    localStorage.setItem('navLog', JSON.stringify(navLog));
}