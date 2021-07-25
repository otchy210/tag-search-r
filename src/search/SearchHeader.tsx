import React, { FC } from "react";
import styled from "styled-components";

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
    return <Header>
        <Title>{site.title}</Title>
        <Selector>
            {site.searches.map(search => {
                return <option>{search.title}</option>
            })}
        </Selector>
        <QueryBox />
    </Header>
};

export default SearchHeader;
