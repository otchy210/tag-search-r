import React, { FC, useEffect, useState } from "react";
import { getStoredTabState } from "../common";

const SearchResult: FC = () => {
    const [searchState, setSeatchState] = useState('');
    useEffect(() => {
        const updateSearchState = async () => {
            const storedState = await getStoredTabState() as any;
            const storedSearchState = storedState?.searchState ?? '';
            setSeatchState(storedSearchState);
        };
        updateSearchState();

        const pingListener = (request: any) => {
            const {action} = request;
            switch(action) {
                case 'PING_TAB_STATE_STORED':
                    updateSearchState();
                    break;
            }
        };
        chrome.runtime.onMessage.addListener(pingListener);
        return () => {
            chrome.runtime.onMessage.removeListener(pingListener);
        }
    }, []);
    return <div>
        SearchState: {searchState}
    </div>
};

export default SearchResult;
