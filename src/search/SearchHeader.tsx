import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { getStoredTabState } from "../common";

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
    const [query, setQuery] = useState('');
    useEffect(() => {
        (async () => {
            const storedState = await getStoredTabState() as any;
        })();
    }, []);
    return <Header>
        <Title>{site.title}</Title>
        <Selector>
            {site.searches.map(search => {
                return <option>{search.title}</option>
            })}
        </Selector>
        <QueryBox onChange={e => setQuery(e.target.value)}/>
    </Header>
};

export default SearchHeader;
