import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { getStoredTabState } from "../common";
import SearchTags from "./SearchTags";

const SearchInProgress = styled.div`
    margin: 0;
    padding: 0.25em 0.5em;
    font-size: 1.25em;
`;

interface Props {
    site: SiteConfig
}

const SearchResult: FC<Props> = ({site}) => {
    const [searchState, setSearchState] = useState<string>('');
    const [searchProgress, setSearchProgress] = useState<string>('');
    const [tagSummary, setTagSummary] = useState<TagSummary | null>(null);
    useEffect(() => {
        const updateState = async () => {
            const storedState = await getStoredTabState() as any;
            const storedSearchState = storedState?.searchState ?? '';
            const storedSearchProgress = storedState?.searchProgress ?? '';
            const storedTagSummary = storedState?.tagSummary ?? null;
            setSearchState(storedSearchState);
            setSearchProgress(storedSearchProgress);
            setTagSummary(storedTagSummary);
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
    return <>
        {searchState === 'searching' ?
            <SearchInProgress>{searchState} ({searchProgress})</SearchInProgress>
        : null}
        {tagSummary && <SearchTags site={site} tagSummary={tagSummary} />}
    </>
};

export default SearchResult;
