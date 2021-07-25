import { MessageAction } from "../@types/Action";
import { JsonSerializable } from "../@types/JsonSerializable";

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
};
const getStoredTabState = async (callback: MessageCallback) => {
    const tabId = await getTabId();
    callback(storedTabState[tabId] ?? {});
};

const handleRegularMessage = (action: MessageAction, payload: JsonSerializable, callback: MessageCallback) => {
    // console.log('handleRegularMessage', {action, payload});
    switch(action) {
        case 'STORE_TAB_STATE':
            const {state} = payload as any;
            storeTabState(state);
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
