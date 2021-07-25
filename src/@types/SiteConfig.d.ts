interface SearchType {
    key: string;
    title: string;
    url: string;
}

interface SiteConfig {
    key: string;
    title: string;
    urlMatcher: RegExp;
    searchTypes: SearchType[];
    maxPage: number;
}
