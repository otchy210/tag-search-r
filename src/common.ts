const format = (msg: string): string => {
    return `TSR: ${msg}`;
};

export const error = (msg: string): void => {
    console.error(format(msg));
};

export const log = (msg: string): void => {
    console.log(format(msg));
};

export const sendMessage = (action: string, payload?: any) => {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(chrome.runtime.id, {action, payload}, {}, resolve);
    });
};

export const sendTabMessage = (action: string, payload?: any) => {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(chrome.runtime.id, {action, sendTab: true, payload}, {}, resolve);
    });
};
