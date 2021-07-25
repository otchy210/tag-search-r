interface SearchConfig {
    title: string;
    url: string;
}

interface SiteConfig {
    title: string;
    urlMatcher: RegExp;
    searches: SearchConfig[];
}
