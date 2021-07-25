import React from "react";
import ReactDom from 'react-dom';
import { getStoredTabState, updateTabState } from "../common";
import Pane from "./Pane";

type MessageListenerCallback = (response?: any) => void;

interface SearchContext {
    site: SiteConfig;
    searchType: string;
    query: string;
}

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
        const url = getSearchUrl(context, page);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}`);
        }
        const html = await response.text();
        const subBody = domParser.parseFromString(html, 'text/html').body;
        const subList = site.findResultList(subBody);
        if (subList === null) {
            continue;
        }
        const subItems = site.findResultItems(subList);
        Array.prototype.push.apply(allItems, subItems);
        Array.prototype.push.apply(additionalItems, subItems);
    }
    site.appendResultItems(list, additionalItems);
    await updateTabState({searchState: 'done'});
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
