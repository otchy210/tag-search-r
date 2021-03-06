import { MessageAction } from "../@types/Action";
import { JsonSerializable } from "../@types/JsonSerializable";

const DEBUG = true;

type MessageCallback = (response: JsonSerializable) => void;

const getTabId = (): Promise<number> => {
    return new Promise(resolve => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const [tab] = tabs;
            resolve(tab?.id ?? 0);
        });
    });
};

const handleTabMessage = async (message: any, callback: MessageCallback) => {
    const tabId = await getTabId();
    chrome.tabs.sendMessage(tabId, message, {}, response => {
        callback(response);
    });
};

const storedTabState: {[key: number]: JsonSerializable} = {};
const storeTabState = async (state: JsonSerializable) => {
    const tabId = await getTabId();
    storedTabState[tabId] = state;
    chrome.tabs.sendMessage(tabId, {action: 'PING_TAB_STATE_STORED'});
};
const getStoredTabState = async (callback: MessageCallback) => {
    const tabId = await getTabId();
    const state = storedTabState[tabId] ?? {};
    callback(state);
};

const setStorage = (key: string, value: JsonSerializable) => {
    localStorage.setItem(key, JSON.stringify(value));
}
const getStorage = (key: string): JsonSerializable | null => {
    const stringValue = localStorage.getItem(key);
    if (stringValue === null) {
        return null;
    }
    return JSON.parse(stringValue);
}
const getCacheKey = (siteKey: string, cacheType: string, itemKey: string): string => {
    return `${siteKey}::${cacheType}::${itemKey}`;
}

const cacheItemTagMap = async (siteKey: string, itemKey: string, tagMap: TagMap) => {
    const cacheKey = getCacheKey(siteKey, 'tm', itemKey);
    setStorage(cacheKey, tagMap);
};
const getCachedItemTagMap = async (siteKey: string, itemKey: string, callback: MessageCallback) => {
    const cacheKey = getCacheKey(siteKey, 'tm', itemKey);
    const tagMap = getStorage(cacheKey);
    callback(tagMap);
};

const cacheFilterTexts = async (siteKey: string, itemKey: string, filterTexts: FilterTexts) => {
    const cacheKey = getCacheKey(siteKey, 'ft', itemKey);
    setStorage(cacheKey, filterTexts);
};
const getCachedFilterTexts = async (siteKey: string, itemKey: string, callback: MessageCallback) => {
    const cacheKey = getCacheKey(siteKey, 'ft', itemKey);
    const filterTexts = getStorage(cacheKey);
    callback(filterTexts);
};

const handleRegularMessage = (action: MessageAction, payload: any, callback: MessageCallback) => {
    DEBUG && console.log('handleRegularMessage', {action, payload});
    switch(action) {
        case 'STORE_TAB_STATE':
            storeTabState(payload.state);
            callback({});
            break;
        case 'GET_STORED_TAB_STATE':
            getStoredTabState(callback);
            break;
        case 'CACHE_ITEM_TAG_MAP':
            cacheItemTagMap(payload.siteKey, payload.itemKey, payload.tagMap);
            callback({});
            break;
        case 'GET_CACHED_ITEM_TAG_MAP':
            getCachedItemTagMap(payload.siteKey, payload.itemKey, callback);
            break;
        case 'CACHE_FILTER_TEXTS':
            cacheFilterTexts(payload.siteKey, payload.itemKey, payload.filterTexts);
            callback({});
            break;
        case 'GET_CACHED_FILTER_TEXTS':
            getCachedFilterTexts(payload.siteKey, payload.itemKey, callback);
            break;
    }
};

const handleMessage = (message: any, callback: MessageCallback) => {
    const {sendTab} = message;
    if (sendTab) {
        handleTabMessage(message, callback);
    } else {
        const {action, payload} = message;
        handleRegularMessage(action, payload, callback);
    }
};

export const main = (): void => {
    chrome.runtime.onMessage.addListener((message, _, callback) => {
        handleMessage(message, callback);
        return true; // keep message port opened until callback called
    });
};
