interface SearchConfig {
    title: string;
    url: string;
}

interface SiteConfig {
    key: string;
    title: string;
    urlMatcher: RegExp;
    searches: SearchConfig[];
}
