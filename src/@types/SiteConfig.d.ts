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
    findResultList: (body: HTMLElement) => HTMLElement | null;
    findResultItems: (list: HTMLElement) => HTMLElement[];
    appendResultItems: (list: HTMLElement, items: HTMLElement[]) => void;
}
