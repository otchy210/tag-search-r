import React from "react";
import ReactDom from 'react-dom';
import { log } from "../common";

export const init = (site: SiteConfig): void => {
    log(`Initializing ${site.title}`);
    const tsrRoot = document.createElement('span');
    document.body.appendChild(tsrRoot);
    const text = <div>TESTTEST</div>;
    ReactDom.render(text, tsrRoot);
};
