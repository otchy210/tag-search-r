import React from "react";
import ReactDom from 'react-dom';
import Form from "./Form";

export const main = () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    ReactDom.render(<Form />, root);
};