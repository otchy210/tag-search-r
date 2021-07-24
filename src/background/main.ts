export const main = () => {
    // handle messages
    chrome.runtime.onMessage.addListener((message, _, callback) => {
        const {action, tabId} = message;
        switch (action) {
            case 'GET_TAB_ID':
                chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                    const [tab] = tabs;
                    callback(tab?.id);
                });
                break;
            case 'SEARCH':
                chrome.tabs.sendMessage(tabId, message, {}, response => {
                    callback(response);
                });
                break;
        }
        return true;
    });
};
