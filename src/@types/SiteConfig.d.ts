interface SearchType {
    key: string;
    label: string;
    url: string;
    urlWithoutPage?: string;
    usePageIndex?: boolean;
}

interface TagType {
    key: string;
    label: string;
}

type TagMap = {[tagTypeKey: string]: string[]};

type TagCount = {[tag: string]: number};

type TagSummary = {[tagTypeKey: string]: TagCount};

interface SiteConfig {
    key: string;
    title: string;
    urlMatcher: RegExp;
    searchTypes: SearchType[];
    maxPage: number;
    itemUrl: string;
    tagTypes: TagType[];
    findResultList: (body: HTMLElement) => HTMLElement | null;
    findResultItems: (list: HTMLElement) => HTMLElement[];
    appendResultItems: (list: HTMLElement, items: HTMLElement[]) => void;
    getItemKey: (item: HTMLElement) => string;
    getTags: (tagType: TagType, body: HTMLElement) => string[];
    sortTags: (tagType: TagType, tagCount: TagCount) => [string, number][];
}
