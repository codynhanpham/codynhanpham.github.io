import { type SearchResultsData, type FuseSearchData, type SearchResultOptions, SRD2FSD, FSD2SRD, type SearchResultsItem } from './search-results.svelte';

import Fuse from 'fuse.js';
import type { FuseResult } from 'fuse.js';

export const searchStatus = $state({
    isSearching: false,
});


// ---- LOCAL ---- //
import { sitePages } from './siteInfo/site-pages';
import { siteActions } from './siteInfo/site-actions';

const siteNavOptions = {
    shouldSort: true,
    includeScore: true,
    useExtendedSearch: true,
    threshold: 0.4,
    minMatchCharLength: 2,
    ignoreLocation: false,
    keys: [{ name: 'heading', weight: 1.1 } , 'title', { name: 'description', weight: 0.2 }, { name: 'keywords', weight: 0.4 }]
};
const siteActionOptions = {
    shouldSort: true,
    includeScore: true,
    useExtendedSearch: true,
    threshold: 0.35,
    minMatchCharLength: 2,
    ignoreLocation: true,
    keys: [{ name: 'heading', weight: 1.5 } , 'title', { name: 'description', weight: 0.2 }, { name: 'keywords', weight: 0.3 }]
};

const sitePagesFuse = new Fuse(SRD2FSD(sitePages), siteNavOptions);
const siteActionsFuse = new Fuse(SRD2FSD(siteActions), siteActionOptions);

export async function search(query: string, n_results: number[] = [6,10]): Promise<{ 
    results: SearchResultsData;
    total_matches: number;
} | undefined> {
    searchStatus.isSearching = true;
    query = query.trim();
    if (query.length === 0) {
        return undefined;
    }

    let fsdresults: FuseResult<FuseSearchData>[] = [];

    
    let sitePageResults: FuseResult<FuseSearchData>[] = sitePagesFuse.search(query);
    let siteActionResults: FuseResult<FuseSearchData>[] = siteActionsFuse.search(query);


    // Rescalculate the score for each item so that higher is better (1-score)
    sitePageResults.forEach((fuseresult: FuseResult<FuseSearchData>) => {
        if (fuseresult.score) {
            fuseresult.score = 1 - fuseresult.score;
        }
    });
    siteActionResults.forEach((fuseresult: FuseResult<FuseSearchData>) => {
        if (fuseresult.score) {
            fuseresult.score = 1 - fuseresult.score;
        }
    });
    fsdresults = fsdresults.concat(siteActionResults as any, sitePageResults as any);

    // Sort results by score, descending
    fsdresults.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    // Calc the sum of the scores: if > 0.85 * length of fsdresults, then returns n_results[1], else returns n_results[0]
    let sum = 0;
    fsdresults.forEach((fuseresult: FuseResult<FuseSearchData>) => {
        sum += fuseresult.score || 0;
    });
    if (sum > 0.85 * fsdresults.length) {
        fsdresults = fsdresults.slice(0, n_results[1]);
    }
    else {
        fsdresults = fsdresults.slice(0, n_results[0]);
    }
    let total_results = fsdresults.length;

    // Extract items and flatten them to FuseSearchData
    let items: FuseSearchData = [];
    fsdresults.forEach((fuseresult: FuseResult<FuseSearchData>) => {
        let thisItems = fuseresult.item as FuseSearchData & { score?: number };
        thisItems.score = fuseresult.score;
        items = items.concat(thisItems);
    });

    const results: SearchResultsData = FSD2SRD(items);

    searchStatus.isSearching = false;

    return {
        results,
        total_matches: total_results
    };
}
