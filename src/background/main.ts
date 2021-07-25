const getTabId = (): Promise<number> => {
    return new Promise(resolve => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const [tab] = tabs;
            resolve(tab?.id ?? 0);
        });
    });
};

const handleMessage = async (message: any, callback: (response: any) => void) => {
    const {action, sendTab} = message;
    if (sendTab) {
        const tabId = await getTabId();
        chrome.tabs.sendMessage(tabId, message, {}, response => {
            callback(response);
        });
        return;
    }
};

export const main = (): void => {
    chrome.runtime.onMessage.addListener((message, _, callback) => {
        handleMessage(message, callback);
        return true; // keep message port opened until callback called
    });
};
