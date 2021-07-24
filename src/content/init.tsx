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
    ReactDom.render(<Pane />, tsrRoot);
};
