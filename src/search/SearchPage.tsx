import React from "react";
import { FC } from "react";
import styled from "styled-components";
import SearchHeader from "./SearchHeader";

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

interface Props {
    site: SiteConfig
}

const SearchPage: FC<Props> = ({site}) => {
    return <Container>
        <SearchHeader site={site} />
    </Container>
}

export default SearchPage;