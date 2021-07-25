import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { getStoredTabState, sendTabMessage, updateTabState } from "../common";

const Header = styled.header`
    display: flex;
`;

const Title = styled.h1`
    margin: 0;
    padding: 0.25em 0.5em;
    font-size: 1.25em;
`;

const Selector = styled.select`
`;

const QueryBox = styled.input`
    flex-grow: 1;
`;

interface Props {
    site: SiteConfig
};

const SearchHeader: FC<Props> = ({site}) => {
    const [searchType, setSearchType] = useState('');
    const [query, setQuery] = useState('');
    useEffect(() => {
        (async () => {
            const storedState = await getStoredTabState() as any;
            const searchType = storedState?.searchType ?? site.searchTypes[0].key;
            const query = storedState?.query ?? '';
            setSearchType(searchType);
            setQuery(query);
            updateTabState({searchType, query});
        })();
    }, []);
    return <Header>
        <Title>{site.title}</Title>
        <Selector
            onChange={e => {
                const searchType = e.target.value;
                setSearchType(searchType);
                updateTabState({searchType});
            }}
        >
            {site.searchTypes.map(type => {
                return <option value={type.key} selected={searchType === type.key}>{type.label}</option>
            })}
        </Selector>
        <QueryBox
            value={query}
            onChange={e => {
                const query = e.target.value;
                setQuery(query)
                updateTabState({query});
            }}
            onKeyDown={e => {
                if (e.keyCode !== 13) {
                    return;
                }
                updateTabState({tagSummary: null});
                sendTabMessage('SEARCH')
            }}
        />
    </Header>
};

export default SearchHeader;
