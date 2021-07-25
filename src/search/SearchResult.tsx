import React, { FC, useEffect, useState } from "react";
import { getStoredTabState } from "../common";

const SearchResult: FC = () => {
    const [searchState, setSearchState] = useState('');
    const [searchProgress, setSearchProgress] = useState('');
    useEffect(() => {
        const updateState = async () => {
            const storedState = await getStoredTabState() as any;
            const storedSearchState = storedState?.searchState ?? '';
            const storedSearchProgress = storedState?.searchProgress ?? '';
            setSearchState(storedSearchState);
            setSearchProgress(storedSearchProgress);
        };
        updateState();

        const pingListener = (request: any) => {
            const {action} = request;
            switch(action) {
                case 'PING_TAB_STATE_STORED':
                    updateState();
                    break;
            }
        };
        chrome.runtime.onMessage.addListener(pingListener);
        return () => {
            chrome.runtime.onMessage.removeListener(pingListener);
        }
    }, []);
    return <div>
        SearchState: {searchState} ({searchProgress})
    </div>
};

export default SearchResult;
