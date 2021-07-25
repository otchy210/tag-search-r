import { MessageAction } from "../@types/Action";
import { JsonSerializable } from "../@types/JsonSerializable";

const DEBUG = false;

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
    DEBUG && console.log('handleTabMessage', {tabId, message});
};

const storedTabState: {[key: number]: JsonSerializable} = {};
const storeTabState = async (state: JsonSerializable) => {
    const tabId = await getTabId();
    storedTabState[tabId] = state;
    chrome.tabs.sendMessage(tabId, {action: 'PING_TAB_STATE_STORED'});
    DEBUG && console.log('storeTabState', {tabId, state});
};
const getStoredTabState = async (callback: MessageCallback) => {
    const tabId = await getTabId();
    const state = storedTabState[tabId] ?? {};
    callback(state);
    DEBUG && console.log('getStoredTabState', {tabId, state});
};

const handleRegularMessage = (action: MessageAction, payload: JsonSerializable, callback: MessageCallback) => {
    DEBUG && console.log('handleRegularMessage', {action, payload});
    switch(action) {
        case 'STORE_TAB_STATE':
            const {state} = payload as any;
            storeTabState(state);
            callback({});
            break;
        case 'GET_STORED_TAB_STATE':
            getStoredTabState(callback);
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
