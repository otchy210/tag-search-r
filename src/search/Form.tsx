import React, { FC } from "react";
import { sendTabMessage } from "../common";

const Form: FC = () => {
    return <form><button onClick={() => {
        sendTabMessage('SEARCH', {query: 'Query'}).then(response => {
            console.log('finally search pane got the response from the content script', response)
        });
    }}>Send message</button></form>;
}

export default Form;
