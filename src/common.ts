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
