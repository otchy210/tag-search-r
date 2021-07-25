import React from "react";
import ReactDom from 'react-dom';
import { getSiteConfig } from "../site-config";
import SearchPage from "./SearchPage";

export const main = () => {
    const url = new URL(location.href);
    const siteKey = url.searchParams.get('siteKey') ?? '';
    const site = getSiteConfig(siteKey);
    const root = document.createElement('div');
    document.body.appendChild(root);
    ReactDom.render(<SearchPage site={site} />, root);
};
