import React from "react";
import ReactDom from 'react-dom';
import { cacheItemTagMap, getCachedItemTagMap, getStoredTabState, updateTabState } from "../common";
import Pane from "./Pane";

type MessageListenerCallback = (response?: any) => void;

const domParser = new DOMParser();

interface FilterState {
    fullTagSummary: TagSummary;
    selectedTags: SelectedTags;
}
const filterState: FilterState = {
    fullTagSummary: {},
    selectedTags: []
};

const getSearchContextFromStoredState = (site: SiteConfig, storedState: any): SearchContext => {
    const {searchType, query} = storedState;
    return {
        site,
        searchType,
        query
    };
};

const getSearchContext = async (site: SiteConfig): Promise<SearchContext> => {
    const storedState = await getStoredTabState();
    return getSearchContextFromStoredState(site, storedState);
};

const getSearchUrl = (context: SearchContext, page: number = 1) => {
    const {site, searchType, query} = context;
    const type = site.searchTypes.filter(t => t.key === searchType)[0];
    const baseUrl = page === 1 ? type.urlWithoutPage ?? type.url : type.url;
    const url = baseUrl
        .replace('{query}', encodeURIComponent(query))
        .replace('{page}', String(page - (type.usePageIndex ? 1 : 0)));
    return url;
};

const search = async (site: SiteConfig, callback: MessageListenerCallback) => {
    const context = await getSearchContext(site);
    callback();
    location.href = getSearchUrl(context);
    updateTabState({searchState: 'init'});
};

const fetchBody = async (url: string): Promise<HTMLElement> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
    }
    const html = await response.text();
    const dom = domParser.parseFromString(html, 'text/html');
    return dom.body;
}

const keepSearchingIfNeeded = async (site: SiteConfig) => {
    const storedState = await getStoredTabState() as any;
    const searchState = storedState?.searchState ?? '';
    if (searchState !== 'init') {
        return;
    }
    await updateTabState({searchState: 'searching'});

    const list = site.findResultList(document.body);
    if (list === null) {
        throw new Error(`Search result list not found`);
    }
    const allItems = site.findResultItems(list);
    const additionalItems: HTMLElement[] = [];
    const context = getSearchContextFromStoredState(site, storedState);
    for (let page = 2; page <= site.maxPage; page++) {
        await updateTabState({searchProgress: `page: ${page}/${site.maxPage}`});
        const url = getSearchUrl(context, page);
        const pageBody = await fetchBody(url);
        const pageList = site.findResultList(pageBody);
        if (pageList === null) {
            continue;
        }
        const pageItems = site.findResultItems(pageList);
        Array.prototype.push.apply(allItems, pageItems);
        Array.prototype.push.apply(additionalItems, pageItems);
    }
    site.appendResultItems(list, additionalItems);
    const itemKeys = allItems.map(site.getItemKey);
    const tagSummary: TagSummary = {};
    site.tagTypes.map(tagType => tagType.key).forEach(tagKey => tagSummary[tagKey] = {});
    const handleTagMap = (tagMap: TagMap) => {
        site.tagTypes.map(tagType => tagType.key).forEach(tagKey => {
            const tags = tagMap[tagKey] ?? [];
            tags.forEach(tag => {
                const count = tagSummary[tagKey][tag] ?? 0;
                tagSummary[tagKey][tag] = count + 1;
            });
        });
    };
    for (let i = 0; i < itemKeys.length; i++) {
        await updateTabState({searchProgress: `item: ${i+1}/${itemKeys.length}`});
        const itemKey = itemKeys[i];
        const cachedItemTagMap = await getCachedItemTagMap(site.key, itemKey) as TagMap;
        if (cachedItemTagMap) {
            handleTagMap(cachedItemTagMap);
            continue;
        }
        const url = site.itemUrl.replace('{itemKey}', itemKey);
        const itemBody = await fetchBody(url);
        const tagMap: TagMap = {};
        site.tagTypes.forEach(tagType => {
            const tags = site.getTags(tagType, itemBody);
            tagMap[tagType.key] = tags;
        });
        await cacheItemTagMap(site.key, itemKey, tagMap);
        handleTagMap(tagMap);
    }
    filterState.fullTagSummary = tagSummary;
    await updateTabState({searchState: '', searchProgress: '', tagSummary});
};

const isItemSelected = (selectedTags: SelectedTags, tagMap: TagMap): boolean => {
    for (const selectedTag of selectedTags) {
        const [tagKey, tag] = selectedTag.split('::');
        if (!tagMap[tagKey].includes(tag)) {
            return false;
        }
    }
    return true;
};

const filterItems = async (site: SiteConfig) => {
    const storedState = await getStoredTabState() as any;
    const selectedTags = storedState?.selectedTags ?? [];
    if (filterState.selectedTags.length === selectedTags.length) {
        return;
    }
    filterState.selectedTags = selectedTags;
    const list = site.findResultList(document.body);
    if (list === null) {
        throw new Error(`List not found`);
    }
    const items = site.findResultItems(list);
    const shownItems = [];
    const hiddenItems = [];
    if (selectedTags.length === 0) {
        items.forEach(item => {
            shownItems.push(item);
        });
    } else {
        for (const item of items) {
            const itemKey = site.getItemKey(item);
            const tagMap = await getCachedItemTagMap(site.key, itemKey) as TagMap;
            if (isItemSelected(selectedTags, tagMap)) {
                shownItems.push(item);
            } else {
                hiddenItems.push(item);
            }
        }
    }
    for (const item of shownItems) {
        item.style.display = '';
    }
    for (const item of hiddenItems) {
        item.style.display = 'none'
    }
};

export const init = (site: SiteConfig): void => {
    const tsrRoot = document.createElement('span');
    tsrRoot.style.position = 'fixed';
    tsrRoot.style.left = '0';
    tsrRoot.style.top = '0';
    tsrRoot.style.zIndex = '9999';
    document.body.appendChild(tsrRoot);
    ReactDom.render(<Pane site={site} />, tsrRoot);

    chrome.runtime.onMessage.addListener((request, _, callback: MessageListenerCallback) => {
        const {action} = request;
        switch(action) {
            case 'SEARCH':
                search(site, callback);
                break;
            case 'PING_TAB_STATE_STORED':
                filterItems(site);
                break;
        }
        return true; // keep message port opened until callback called
    });

    keepSearchingIfNeeded(site);
};
