import React from "react";
import ReactDom from 'react-dom';
import { cacheItemTagMap, getCachedItemTagMap, getStoredTabState, updateTabState } from "../common";
import Pane from "./Pane";

type MessageListenerCallback = (response?: any) => void;

const domParser = new DOMParser();

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
    const url = type.url
        .replace('{query}', encodeURIComponent(query))
        .replace('{page}', String(page));
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
    await updateTabState({searchState: '', searchProgress: '', tagSummary});
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
        }
        return true; // keep message port opened until callback called
    });

    keepSearchingIfNeeded(site);
};
