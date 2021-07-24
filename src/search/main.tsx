import React from "react";
import ReactDom from 'react-dom';
import Form from "./Form";

export const main = () => {
    const url = new URL(location.href);
    const tabId = parseInt(url.searchParams.get('tabId') ?? '0');
    const root = document.createElement('div');
    document.body.appendChild(root);
    ReactDom.render(<Form tabId={tabId} />, root);
};