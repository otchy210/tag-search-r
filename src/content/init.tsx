import React from "react";
import ReactDom from 'react-dom';
import { log } from "../common";
import Pane from "./Pane";

export const init = (site: SiteConfig): void => {
    log(`Initializing ${site.title}`);
    const tsrRoot = document.createElement('span');
    tsrRoot.style.position = 'fixed';
    tsrRoot.style.left = '0';
    tsrRoot.style.top = '0';
    tsrRoot.style.zIndex = '9999';
    document.body.appendChild(tsrRoot);
    ReactDom.render(<Pane site={site} />, tsrRoot);

    chrome.runtime.onMessage.addListener((request, _, callback) => {
        const {action, payload} = request;
        switch(action) {
            case 'SEARCH':
                const {searchType, query} = payload;
                const type = site.searchTypes.filter(t => t.key === searchType)[0];
                const url = type.url
                    .replace('{query}', encodeURIComponent(query))
                    .replace('{page}', '1');
                location.href = url;
                callback();
                break;
        }
        return true; // keep message port opened until callback called
    });
};
