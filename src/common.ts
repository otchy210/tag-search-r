import { MessageAction, TabMessageAction } from "./@types/Action";
import { JsonSerializable } from "./@types/JsonSerializable";

export const sendMessage = (action: MessageAction, payload?: JsonSerializable): Promise<JsonSerializable> => {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(chrome.runtime.id, {action, payload}, {}, resolve);
    });
};

export const sendTabMessage = (action: TabMessageAction, payload?: JsonSerializable): Promise<JsonSerializable> => {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(chrome.runtime.id, {action, sendTab: true, payload}, {}, resolve);
    });
};

export const storeTabState = (state: JsonSerializable): Promise<JsonSerializable> => {
    return sendMessage('STORE_TAB_STATE', {state});
};

export const getStoredTabState = (): Promise<JsonSerializable> => {
    return sendMessage('GET_STORED_TAB_STATE');
};

export const updateTabState = async (stateDiff: JsonSerializable): Promise<JsonSerializable> => {
    const storedTabState = await getStoredTabState() as object;
    const newState = {...storedTabState, ...stateDiff as object};
    return storeTabState(newState);
};

export const cacheItemTagMap = async (siteKey: string, itemKey: string, tagMap: TagMap) => {
    return sendMessage('CACHE_ITEM_TAG_MAP', {siteKey, itemKey, tagMap});
};

export const getCachedItemTagMap = (siteKey: string, itemKey: string): Promise<JsonSerializable> => {
    return sendMessage('GET_CACHED_ITEM_TAG_MAP', {siteKey, itemKey});
};

export const cacheFilterTexts = async (siteKey: string, itemKey: string, filterTexts: FilterTexts) => {
    return sendMessage('CACHE_FILTER_TEXTS', {siteKey, itemKey, filterTexts});
}

export const getCachedFilterTexts = async (siteKey: string, itemKey: string): Promise<JsonSerializable> => {
    return sendMessage('GET_CACHED_FILTER_TEXTS', {siteKey, itemKey});
};

export const sortTagsByCount = (tagCount: TagCount): [string, number][] => {
    return Object.entries(tagCount).sort((left, right) => {
        const diff = right[1] - left[1];
        if (diff !== 0) {
            return diff;
        }
        return left[0].localeCompare(right[0]);
    });
};

export const sortTagsByLabel = (tagCount: TagCount): [string, number][] => {
    return Object.entries(tagCount).sort((left, right) => {
        return left[0].localeCompare(right[0]);
    });
};
