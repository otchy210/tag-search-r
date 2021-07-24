import React, { FC } from "react";
import { sendMessage, sendTabMessage } from "../common";

interface Props {
    tabId: number
};

const Form: FC<Props> = ({tabId}) => {
    return <form><button onClick={() => {
        sendTabMessage('SEARCH', tabId, {query: 'Query'}).then(response => {
            console.log('finally search pane got the response from the content script', response)
        });
    }}>Send message</button></form>;
}

export default Form;
